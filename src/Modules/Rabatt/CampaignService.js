// This file is responsible for handling all data from the database related to campaigns and discounts.

import fetchBuyXPayForYCampaigns from "../../api/fetchBuyXPayForYCampaigns.js";
import fetchThresholdCampaigns from "../../api/fetchThresholdCampaigns.js";
import fetchPercentageCampaigns from "../../api/fetchPercentageCampaigns.js";
import {
  ApiError,
  CampaignIsNotActiveError,
  CampaignIsNotApplicable,
  ModuleError,
  UnknownCampaignError,
  ValidationError,
} from "./errors.js";
import {
  CAMPAIGN_PRIORITY,
  ALLOWED_COMBINATIONS,
  campaignFactory,
} from "./DiscountCampaigns.js";

//Runs a fetch function. If the API fails, the error is logged and an empty list is returned
async function safeFetch(fetcher) {
  try {
    return await fetcher();
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`${err.name} (${err.statusCode ?? "-"}): ${err.message}`);
      return [];
    }
    throw err;
  }
}

//Turns raw database records into campaign objects.
//A broken record is skipped through flatMap
function makeInstances(campaignsFromDB) {
  return campaignsFromDB.flatMap((raw) => {
    try {
      return [campaignFactory(raw)];
    } catch (err) {
      if (err instanceof ValidationError) {
        console.error(`${err.name} [${err.field ?? "-"}] : ${err.message}`);
        return [];
      }
      throw err;
    }
  });
}

//THRESHOLD campaigns are not tied to products.
export async function loadThresholdCampaigns() {
  return makeInstances(await safeFetch(() => fetchThresholdCampaigns()));
}

//Finds active PERCENTAGE campaigns for the entered code and the products in the cart.
async function findPercentageCampaigns(code, formattedSubtotal, now) {
  const campaignsForCart = makeInstances(
    await fetchPercentageCampaigns(code, productIds),
  ).filter(
    (campaign) =>
      campaign.type === CampaignType.PERCENTAGE && campaign.matchesCode(code),
  );

  const activeCampaigns = campaignsForCart.filter((campaign) =>
    campaign.isActive(now),
  );
  if (activeCampaigns.length > 0) {
    return activeCampaigns;
  }

  //The code covers these products, but the campaign is not active today
  if (campaignsForCart.length > 0) {
    const upcoming = campaignsForCart
      .filter((campaign) => campaign.startDate && campaign.startDate > now)
      .sort((a, b) => a.startDate - b.startDate);

    const ended = campaignsForCart
      .filter((campaign) => campaign.endDate && campaign.endDate < now)
      .sort((a, b) => b.endDate - a.endDate);

    const shown = upcoming[0] ?? ended[0] ?? campaignsForCart[0];

    throw new CampaignIsNotActiveError(
      code,
      now,
      shown.startDate,
      shown.endDate,
    );
  }

  //Only if nothing was found
  const anyWithCode = makeInstances(
    await fetchPercentageCampaigns(code, [], 1),
  ).filter((campaign) => campaign.matchesCode(code));

  if (anyWithCode.length === 0) {
    throw new UnknownCampaignError(code);
  }

  const first = anyWithCode[0];
  if (!first.isActive(now)) {
    throw new CampaignIsNotActiveError(
      code,
      now,
      first.startDate,
      first.endDate,
    );
  }
  //The code exists and is active, but not for the products in this cart
  throw new CampaignIsNotApplicable(code);
}

//Loads as little as possible for this cart.
export async function loadCampaignsForCart(
  cartItems,
  discountCode,
  now = new Date(),
) {
  //Products with quantity 0 can not get a discount, so they are ignored
  const cartItemsWithQuantity = cartItems.filter(
    (cartItem) => cartItem.quantity > 0,
  );

  const productIds = [
    ...new Set(cartItemsWithQuantity.map((cartItem) => String(cartItem.id))),
  ];

  const code = String(discountCode ?? "")
    .trim()
    .toUpperCase();

  if (productIds.length === 0) {
    return {
      campaigns: [],
      code: "",
      error: null,
    };
  }
  let codeError = null;

  //PERCENTAGE Campaign has the highest priority and needs a discountCode
  if (discountCode) {
    try {
      const percentageCampaigns = await findPercentageCampaigns(
        discountCode,
        productIds,
        now,
      );
      return {
        campaigns: percentageCampaigns,
        code,
        error: null,
      };
    } catch (err) {
      if (!(err instanceof ModuleError)) throw err;
      codeError = err;
    }
  }

  //BUY_X_PAY_FOR_Y only if the cart has enough items (at least 2)
  const totalQuantity = cartItemsWithQuantity.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0,
  );
  const MIN_QUANTITY = 2;

  if (totalQuantity < MIN_QUANTITY) {
    return {
      campaigns: [],
      code: "",
      error: codeError,
    };
  }

  const buyXPayForYCampaigns = makeInstances(
    await safeFetch(() => fetchBuyXPayForYCampaigns(productIds)),
  );
  return {
    campaigns: buyXPayForYCampaigns,
    code: "",
    error: codeError,
  };
}

//Applies product campaigns, each product gets the first campaign that covers it
function applyProductCampaigns(productCampaigns, cartItems) {
  const cartItemsByCampaign = new Map();
  let subtotal = 0;

  //Group the products by campaign
  for (const cartItem of cartItems) {
    const campaign = productCampaigns.find((c) => c.appliesTo(cartItem));

    if (campaign) {
      if (!cartItemsByCampaign.has(campaign)) {
        cartItemsByCampaign.set(campaign, []);
      }
      cartItemsByCampaign.get(campaign).push(cartItem);
    } else {
      //Products without a campaign are paid in full
      subtotal += cartItem.price * cartItem.quantity;
    }
  }
  const applied = [];

  //Every campaign calculates the price of its own products
  for (const [campaign, campaignCartItems] of cartItemsByCampaign) {
    const fullPrice = getCartTotal(campaignCartItems);
    const discountedPrice =
      campaign.calculateDiscountedPriceForCart(campaignCartItems);
    subtotal += discountedPrice;

    const savings = Math.round((fullPrice - discountedPrice) * 100) / 100;
    //A campaign that saves nothind is not listed
    if (savings > 0) applied.push({ campaign, savings });
  }
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    applied,
  };
}

//New rules that should to be implemented
//1.BUY_X_PAY_FOR_Y has the highest priority.
//2.PERCENTAGE and BUY_X_PAY_FOR_Y are never combined.
//3.BUY_X_PAY_FOR_Y can be combined with THRESHOLD.
//4.PERCENTAGE can be combined with THRESHOLD.
//5.THRESHOLD is checked last, on the total after the product discount.
//3.PERCENTAGE and BUY_X_PAY_FOR_Y are never combined.
// If no product campaign was applied, THRESHOLD can be applied alone.

//Campaigns rules:
//1.PERCENTAGE has the highest priority.
//2.BUY_X_PAY_FOR_Y is used only if no PERCENTAGE campaign fits.
//3.PERCENTAGE and BUY_X_PAY_FOR_Y are never combined.
//4.PERCENTAGE can be combined with THRESHOLD.
//5.BUY_X_PAY_FOR_Y can be combined with THRESHOLD.
//6.THRESHOLD is checked last, on the total after the product discount.
// If no product campaign was applied, THRESHOLD can be applied alone.

export function calculateDiscount(
  campaigns,
  cartItems,
  discountCode,
  now = new Date(),
) {
  //Only active campaigns that match the code (campaigns without a code always match).
  //A higher priority is checked first.
  const usable = campaigns
    .filter((c) => c.isActive(now) && c.matchesCode(code))
    .sort((a, b) => b.priority - a.priority);

  const percentageCampaigns = usable.filter(
    (c) =>
      c.type === CampaignType.PERCENTAGE && c.isApplicableToCart(cartItems),
  );

  const buyXPayForYCampaigns = usable.filter(
    (c) =>
      c.type === CampaignType.BUY_X_PAY_FOR_Y &&
      c.isApplicableToCart(cartItems),
  );

  const thresholdCampaigns = usable.filter(
    (c) => c.type === CampaignType.THRESHOLD,
  );

  //Step 1: product discount (rules 1-3)
  const productCampaigns =
    percentageCampaigns.length > 0 ? percentageCampaigns : buyXPayForYCampaigns;

  const productStep = applyProductCampaigns(productCampaigns, cartItems);

  let total = productStep.subtotal;
  const applied = [...productStep.applied];

  //Step 2: discount the whole purchase (rules 4-6).
  //Every campaign already applied must allow the combination with THRESHOLD.
  const usedTypes = [...new Set(applied.map((a) => a.campaign.type))];

  const threshold = thresholdCampaigns.find(
    (c) =>
      usedTypes.every((type) => ALLOWED_COMBINATIONS[type]?.includes(c.type)) &&
      c.isApplicableToTotal(total),
  );

  if (threshold) {
    const newTotal = threshold.applyToTotal(total);
    applied.push({
      campaign: threshold,
      savings: Math.round((total - newTotal) * 100) / 100,
    });
    total = newTotal;
  }
  return { total, applied };
}
