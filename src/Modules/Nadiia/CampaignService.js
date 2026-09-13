// This class is responsible for handling all data from the database related to campigns and discounts.
import { campaignFactory } from "./DiscountCampaigns.js";

import {
  fetchProducts,
  fetchBuyXPayForYCampaigns,
  fetchThresholdCampaigns,
  fetchPercentageCampaigns,
} from "./api.js";

//loadCampaigns
//the same key as in localStorage
const CART_KEY = "cart";

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

//getCart
export function getCart() {
  let cartItems = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY));
    cartItems = Array.isArray(parsed) ? parsed : [];
  } catch {
    cartItems = [];
  }
  cartItems = cartItems.filter(
    (item) =>
      item &&
      Number.isFinite(Number(item.price)) &&
      Number.isFinite(Number(item.quantity)),
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return { cartItems, totalPrice };
}

export async function getDiscountedTotal(now = new Date()) {
  const { cartItems, totalPrice } = getCart();
  if (cartItems.length === 0) return 0;

  const rawCampaigns = await loadCampaigns();
  const campaigns = rawCampaigns
    .map((raw) => {
      try {
        return campaignFactory(raw);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    })
    .filter((campaign) => campaign !== null)
    .filter((campaign) => campaign.isActive(now))
    .sort(
      (a, b) =>
        CAMPAIGN_ORDER.indexOf(String(a.type).toLocaleUpperCase()) -
        CAMPAIGN_ORDER.indexOf(String(b.type).toLocaleUpperCase()),
    );

  const campaign = campaigns.find((c) => c.isApplicableToCart(cartItems));

  if (!campaign) return Math.round(totalPrice * 100) / 100;

  return campaign.calculateDiscountedPriceForCart(cartItems);
}

export async function getProducts() {
  return safeFetch(fetchProducts);
}
