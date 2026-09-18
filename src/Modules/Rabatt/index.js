// The main file for the Nadiia module, which exports all the campaign functions.
import {
  calculateDiscount,
  loadCampaignsForCart,
} from "./CampaignService.js";

export default class DiscountCampaignsModule {
  static descriptor = {
    name: "DiscountCampaigns",
    methodsAndInputs: [
      {
        method: "run",
        input: ["cartItems", "discountCode", "formattedSubtotal", "cartTotal"],
        output: ["originalTotal", "discountedTotalPrice", "discount"],
      },
      //implement the history
    ],
  };

  async run(value = {}, now = new Date()) {
    const input = Array.isArray(value) ? { cartItems: value } : (value ?? {});
    const { cartItems = [], campaignCode = "", formattedSubtotal = 0, cartTotal } = input;

    // If the caller passes something else as the second argument, use today's date
    const today =
      now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        originalTotal: 0,
        discountedTotalPrice: 0,
        discount: 0,
      };
    }
    // think about the validation of the cartItems

    const originalTotal = cartTotal; 

    // Threshold campaigns (from cache) and cart campaigns are loaded at the same time
    const [thresholdCampaigns, cartData] = await Promise.all([
      this.getThresholdCampaigns(),ƒ
      loadCampaignsForCart(cartItems, discountCode, today),
    ]);

    const campaigns = [...thresholdCampaigns, ...cartData.campaigns];
    const discount = calculateDiscount(
      campaigns,
      cartItems,
      cartData.code,
      today,
    );

    const result = {
      originalTotal,
      discountedTotalPrice: discount.total,
      savings: Math.round((originalTotal - discount.total) * 100) / 100,
      appliedCampaigns: discount.applied.map(({ campaign, savings }) => ({
        id: campaign.id,
        type: campaign.type,
        campaignCode: campaign.campaignCode || null,
        savings,
      })),
      campaignCode: cartData.code || null,
      message: cartData.error?.message ?? null,
      errorType: cartData.error?.name ?? null,
    };

    return result;
  }
}
