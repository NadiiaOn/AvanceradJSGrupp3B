// The main file for the Nadiia module, which exports all the campaign functions.
import { campaignFactory } from "./DiscountCampaigns.js";

const CART_KEY = "cart";

export function getCart() {
  let cartItems = [];
  try {
    cartItems = JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    cartItems = [];
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { cartItems, totalPrice };
}

export async function getDiscountedTotal() {
  const res = await fetch("/api/products");
  const { cartItems, totalPrice } = getCart();
  if (!res.ok) return totalPrice;

  const campaign = CampaignIerarchy(await res.json());

  return campaign.calculateDiscountedPriceForCart(cartItems, totalPrice);
}

export default class DiscountCampaignsModule {
  
  static descriptor = {
    name: "DiscountCampaigns",
    methodsAndInputs: [
      {
        method: "calculateDiscountedPriceForCart",
        input: ["cartItems, totalPrice"],
        output: "discountedTotalPrice, totalPrice",
      },
    ],
  };

  //ToDo: create correct instance
  makeInstances(productsFromDB) {
    return productsFromDB.map((x) => new Product(x));
  }
}
