const getProductsByCategory = (products, category) => {
  return products.filter((product) => product.category === category);
};

export default getProductsByCategory;
