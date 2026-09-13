// The main file for the Nadiia module, which exports all the campaign functions.
import { campaignFactory } from "./DiscountCampaigns.js";
import { getDiscountedTotal} from "./CampaignService.js";

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
  async calculateDiscountedPriceForCart(cartItems) {
    return getDiscountedTotal(cartItems);
  }
}
