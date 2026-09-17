// The main file for the Nadiia module, which exports all the campaign functions.
import {
  calculateDiscount,
  getCartTotal,
  loadCampaignsForCart,
  loadThresholdCampaigns,
  prepareCartItems,
} from "./CampaignService.js";

export default class DiscountCampaignsModule {
  static descriptor = {
    name: "DiscountCampaigns",
    methodsAndInputs: [
      {
        method: "run",
        input: ["cartItems", "campaignCode"],
        output: "discountResult",
      },
    ],
  };

  get descriptor() {
    return DiscountCampaignsModule.descriptor;
  }

  async getThresholdCampaigns(forceReload = false) {
    if (!this.thresholdCampaigns || forceReload) {
      this.thresholdCampaigns = await loadThresholdCampaigns();
    }
    return this.thresholdCampaigns;
  }

  async run(value = {}, now = new Date()) {
    const input = Array.isArray(value) ? { cartItems: value } : (value ?? {});
    const { cartItems = [], campaignCode = "" } = input;

    // If the caller passes something else as the second argument, use today's date
    const today =
      now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        originalTotal: 0,
        discountedTotalPrice: 0,
        savings: 0,
        appliedCampaigns: [],
        campaignCode: null,
        message: null,
        errorType: null,
      };
    }

    // Throws ValidationError if the cart data is broken
    const preparedCartItems = prepareCartItems(cartItems);
    const originalTotal =
      Math.round(getCartTotal(preparedCartItems) * 100) / 100;

    // Threshold campaigns (from cache) and cart campaigns are loaded at the same time
    const [thresholdCampaigns, cartData] = await Promise.all([
      this.getThresholdCampaigns(),
      loadCampaignsForCart(preparedCartItems, campaignCode, today),
    ]);

    const campaigns = [...thresholdCampaigns, ...cartData.campaigns];
    const discount = calculateDiscount(
      campaigns,
      preparedCartItems,
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

    addToHistory(
      result,
      String(campaignCode ?? "")
        .trim()
        .toUpperCase(),
      today,
    );
    return result;
  }
}
