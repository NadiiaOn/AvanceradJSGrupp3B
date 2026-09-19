// This file is responsible for handling all data from the database related to campaigns and discounts.

import fetchBuyXPayForYCampaigns from "../../api/fetchBuyXPayForYCampaigns.js";
import fetchThresholdCampaigns from "../../api/fetchThresholdCampaigns.js";
import fetchPercentageCampaigns from "../../api/fetchPercentageCampaigns.js";
import {
  ApiError,
  CampaignIsNotActiveError,
  ModuleError,
  UnknownCampaignError,
  ValidationError,
} from "./errors.js";
import {
  ALLOWED_COMBINATIONS,
  CampaignType,
  MIN_BUY_X,
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

//Finds active PERCENTAGE campaigns for the entered discountCode and the total
async function findPercentageCampaigns(discountCode, now) {
  const campaignsForCart = makeInstances(
    await fetchPercentageCampaigns(),
  ).filter(
    (campaign) =>
      campaign.type === CampaignType.PERCENTAGE &&
      campaign.matchesCode(discountCode),
  );

  const activeCampaigns = campaignsForCart.filter((campaign) =>
    campaign.isActive(now),
  );
  if (activeCampaigns.length > 0) {
    return activeCampaigns;
  }

  //The discountCode covers these products, but the campaign is not active today
  if (campaignsForCart.length > 0) {
    const upcoming = campaignsForCart
      .filter((campaign) => campaign.startDate && campaign.startDate > now)
      .sort((a, b) => a.startDate - b.startDate);

    const ended = campaignsForCart
      .filter((campaign) => campaign.endDate && campaign.endDate < now)
      .sort((a, b) => b.endDate - a.endDate);

    const shown = upcoming[0] ?? ended[0] ?? campaignsForCart[0];

    throw new CampaignIsNotActiveError(
      discountCode,
      now,
      shown.startDate,
      shown.endDate,
    );
  }

  if (campaignsForCart.length === 0) {
    throw new UnknownCampaignError(discountCode);
  }
}

//Loads as little as possible for this cart.
export async function loadCampaignsForCart(
  cartItems,
  discountCode,
  rawSubtotalNumber,
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
      discountCode: "",
      error: null,
    };
  }

  let codeError = null;
  const foundCampaigns = [];
  let usedCode = "";

  //PERCENTAGE needs a discountCode
  if (code) {
    try {
      const percentageCampaigns = await findPercentageCampaigns(code, now);
      foundCampaigns.push(...percentageCampaigns);
      usedCode = code;
    } catch (err) {
      if (!(err instanceof ModuleError)) throw err;
      codeError = err;
    }
  }

  //BUY_X_PAY_FOR_Y only if the cart has enough items(at least 3)
  const totalQuantity = cartItemsWithQuantity.reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0,
  );
  if (totalQuantity >= MIN_BUY_X) {
    const buyXPayForYCampaigns = makeInstances(
      await safeFetch(() => fetchBuyXPayForYCampaigns()),
    );
    foundCampaigns.push(...buyXPayForYCampaigns);
  }

  return {
    campaigns: foundCampaigns,
    discountCode: usedCode,
    error: codeError,
  };
}

//Checks the cart and returns copies where price and quantity are real numbers
export function prepareCartItems(cartItems) {
  return cartItems.map((cartItem) => {
    if (cartItem?.id === undefined || cartItem?.id === null) {
      throw new ValidationError("Varan saknar id.", "id");
    }

    const price = Number(cartItem.price);
    const quantity = Number(cartItem.quantity);

    if (!Number.isFinite(price) || price < 0) {
      throw new ValidationError(`Ogiltigt pris: ${cartItem.price}`, "price");
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new ValidationError(
        `Ogiltigt antal: ${cartItem.quantity}`,
        "quantity",
      );
    }

    return {
      ...cartItem,
      price,
      quantity,
    };
  });
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

  for (const [campaign, campaignCartItems] of cartItemsByCampaign) {
    const originalPrice = campaignCartItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const discountedPrice =
      campaign.calculateDiscountedPriceForCart(campaignCartItems);
    subtotal += discountedPrice;

    const savings = Math.round((originalPrice - discountedPrice) * 100) / 100;
    if (savings > 0) applied.push({ campaign, savings });
  }
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    applied,
  };
}

//Campaigns rules:
//1.PERCENTAGE has the highest priority.
//3.PERCENTAGE and BUY_X_PAY_FOR_Y can be combined.
//2.BUY_X_PAY_FOR_Y is applied on the prices after the PERCENTAGE discount.
//4.PERCENTAGE and THRESHOLD are never combined.
//5.BUY_X_PAY_FOR_Y can be combined with THRESHOLD.
//6.THRESHOLD is checked last, on the total after the product discounts.
// If no product campaign was applied, THRESHOLD can be applied alone.

export function calculateDiscount(
  campaigns,
  cartItems,
  discountCode,
  now = new Date(),
) {
  //Only active campaigns that match the discountCode (campaigns without a discountCode always match).
  //A higher priority is checked first.
  const usable = campaigns
    .filter((c) => c.isActive(now) && c.matchesCode(discountCode))
    .sort((a, b) => b.priority - a.priority);

  const percentageCampaigns = usable.filter(
    (c) =>
      c.type === CampaignType.PERCENTAGE && c.isApplicableToCart(discountCode),
  );

  const buyXPayForYCampaigns = usable.filter(
    (c) =>
      c.type === CampaignType.BUY_X_PAY_FOR_Y &&
      c.isApplicableToCart(cartItems),
  );

  const thresholdCampaigns = usable.filter(
    (c) => c.type === CampaignType.THRESHOLD,
  );

  let total;
  const applied = [];

  let itemsForProductCampaigns = cartItems;

  if (percentageCampaigns.length > 0) {
    const campaign = percentageCampaigns[0];

    const rawTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const discountedTotal =
      Math.round(rawTotal * (1 - campaign.discountPercentage / 100) * 100) /
      100;
    const savings = Math.round((rawTotal - discountedTotal) * 100) / 100;

    if (savings > 0) applied.push({ campaign, savings });

    itemsForProductCampaigns = cartItems.map((item) => ({
      ...item,
      price:
        Math.round(item.price * (1 - campaign.discountPercentage / 100) * 100) /
        100,
    }));
  }

  const step = applyProductCampaigns(
    buyXPayForYCampaigns,
    itemsForProductCampaigns,
  );

  total = step.subtotal;
  applied.push(...step.applied);

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
