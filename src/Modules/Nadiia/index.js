// The main file for the Nadiia module, which exports all the campaign functions.

export default class rabattModule {

  static descriptor = {
    name: "RabattModule",
    methodsAndInputs: [
      {
        method: 'productsFromDb',
        input: ['productsFromDB - an array of products from the db'],
        output: 'an array of Product instances with getters for price formatting'
      }
    ]
  };

  makeInstances(productsFromDB) {
    return productsFromDB.map(x => new Product(x));
  }

}