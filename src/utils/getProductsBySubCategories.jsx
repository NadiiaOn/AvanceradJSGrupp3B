const getProductsBySubCategories = (products, subCategories) => {
  return products.filter((product) => subCategories.includes(product.category));
};

export default getProductsBySubCategories;
