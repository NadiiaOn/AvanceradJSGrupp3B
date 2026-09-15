const fetchProducts = async () => {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Kunde inte hämta produkterna från servern!");
  }

  const result = await response.json();

  return result;
};

const fetchSpecificProduct = async ({ productId }) => {
  const response = await fetch(`/api/products/${productId}`);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta produkten med ID: ${productId}`);
  }

  const result = await response.json();

  return result;
};

export default fetchProducts;
export { fetchSpecificProduct };
