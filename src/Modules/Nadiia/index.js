// The main file for the Nadiia module, which exports all the campaign functions.

// implement db in input in it I will use it
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
