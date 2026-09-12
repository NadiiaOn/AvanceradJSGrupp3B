// This class is responsible for handling all data from the database related to campigns and discounts.

import {
  fetchProducts,
  fetchBuyXPayForYCampaigns,
  fetchThresholdCampaigns,
  fetchPercentageCampaigns
} from "./api.js";

let productsInBuyXPayForYCampaigns = [];

try {
 productsInBuyXPayForYCampaigns = await fetchBuyXPayForYCampaigns();
} catch (err) {
  console.error(err.message);
}

let thresholdCampaigns = [];

try {
  thresholdCampaigns = await fetchThresholdCampaigns();
} catch (err) {
  console.error(err.message);
}


let products = [];

try {
  products = await fetchProducts();
} catch (err) {
  console.error(err.message);
}

let percentageCampaigns = [];

try {
  percentageCampaigns = await fetchPercentageCampaigns();
} catch (err) {
  console.error(err.message);
}

export default{
  productsInBuyXPayForYCampaigns,
  thresholdCampaigns,
  percentageCampaigns,
  products
};