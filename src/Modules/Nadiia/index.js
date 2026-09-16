// The main file for the Nadiia module, which exports all the campaign functions.
import { campaignFactory } from "./DiscountCampaigns.js";
import {
  getCartTotal,
  loadCampaigns,
  pickCampaign,
} from "./CampaignService.js";

export default class DiscountCampaignsModule {
  static descriptor = {
    name: "DiscountCampaigns",
    methodsAndInputs: [
      {
        method: "calculateDiscountedPriceForCart",
        input: ["cartItems"],
        output: "discountedTotalPrice",
      },
    ],
  };

  // Turns raw campaign records from the database into
  // the matching campaign class instances
  makeInstances(campaignsFromDB) {
    console.log("CampaignsFromDb: ", campaignsFromDB);
    return campaignsFromDB
      .map((raw) => {
        try {
          return campaignFactory(raw);
        } catch (err) {
          console.error(err.message);
          return null;
        }
      })
      .filter((campaign) => campaign !== null);
  }

  //Public entry point used by the rest of the application
  async calculateDiscountedPriceForCart(cartItems, now = new Date()) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;

    const totalPrice = getCartTotal(cartItems);

    console.log("Total Price: ", totalPrice);

    const rawCampaigns = await loadCampaigns();
    const campaigns = this.makeInstances(rawCampaigns);
    const campaign = pickCampaign(campaigns, cartItems, now);

    if (!campaign) return Math.round(totalPrice * 100) / 100;

    return campaign.calculateDiscountedPriceForCart(cartItems);
  }
}
