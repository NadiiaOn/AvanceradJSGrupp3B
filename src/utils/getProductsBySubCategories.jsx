const getProductsBySubCategories = (products, subCategories) => {
  return products.filter((product) => subCategories.includes(product.category));
};

export default getProductsBySubCategories;

/* Exempel på hur detta kan användas i andra komponenter.
getProductsBySubCategories(products, [
  "mens-shirts",
  "tops",
  "womens-dresses",
]);
*/
