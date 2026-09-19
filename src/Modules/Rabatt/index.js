// The main file for the Nadiia module, which exports all the campaign functions.
import {
  calculateDiscount,
  loadCampaignsForCart,
  loadThresholdCampaigns,
  prepareCartItems,
} from "./CampaignService.js";
import { ValidationError } from "./errors.js";

export default class DiscountCampaignsModule {
  history = [];

  static descriptor = {
    name: "DiscountCampaigns",
    methodsAndInputs: [
      {
        method: "run",
        input: ["cartItems", "discountCode", "rawSubtotal"],
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
    const { cartItems = [], discountCode = "", rawSubtotal } = input;

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

    const cartTotal =
      Math.round(
        preparedCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) *
          100,
      ) / 100;

    const rawSubtotalNumber = Number(rawSubtotal);

    if (
      rawSubtotal !== undefined &&
      rawSubtotal !== "" &&
      (!Number.isFinite(rawSubtotalNumber) || rawSubtotalNumber < 0)
    ) {
      throw new ValidationError(`Ogiltigt pris`);
    }

    const originalTotal =
      Math.round(
        preparedCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) *
          100,
      ) / 100;

    const [thresholdCampaigns, cartData] = await Promise.all([
      this.getThresholdCampaigns(),
      loadCampaignsForCart(preparedCartItems, discountCode, rawSubtotal, today),
    ]);

    const campaigns = [...thresholdCampaigns, ...cartData.campaigns];
    const discount = calculateDiscount(
      campaigns,
      preparedCartItems,
      cartData.discountCode,
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
      discountCode: cartData.discountCode || null,
      message: cartData.error?.message ?? null,
      errorType: cartData.error?.name ?? null,
    };

    this.history.push({
      time: today,
      discountCode: result.discountCode,
      savings: result.savings,
      campaigns: result.appliedCampaigns.map((c) => c.type),
    });

    if (this.history.length > 20) this.history.shift();

    return result;
  }
  getHistory() {
    return [...this.history];
  }

  cleaHistory() {
    this.history = [];
  }
}
