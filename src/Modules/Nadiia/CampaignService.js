// This class is responsible for handling all data from the database related to campigns and discounts.

import {
  fetchProducts,
  fetchBuyXPayForYCampaigns,
  fetchThresholdCampaigns,
  fetchPercentageCampaigns,
} from "./api.js";

//loadCampaigns

//campaigns priority
const CAMPAIGN_ORDER = ["THRESHOLD", "BUY_X_PAY_FOR_Y", "PERCENTAGE"];

async function safeFetch(fetcher) {
  try {
    return await fetcher();
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

export async function loadCampaigns() {
  const [threshold, buyXPayForY, percentage] = await Promise.all([
    safeFetch(fetchThresholdCampaigns),
    safeFetch(fetchBuyXPayForYCampaigns),
    safeFetch(fetchPercentageCampaigns),
  ]);

  return [...threshold, ...buyXPayForY, ...percentage];
}

export function getCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function pickCampaign(campaigns, cartItems, now = new Date()) {
  return campaigns
    .filter((campaign) => campaign.isActive(now))
    .sort(
      (a, b) =>
        CAMPAIGN_ORDER.indexOf(String(a.type).toUpperCase()) -
        CAMPAIGN_ORDER.indexOf(String(b.type).toUpperCase()),
    )
    .find((campaign) => campaign.isApplicableToCart(cartItems));
}

export async function getProducts() {
  return safeFetch(fetchProducts);
}
