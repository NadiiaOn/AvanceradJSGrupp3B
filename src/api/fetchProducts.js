const fetchProducts = async () => {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    throw new Error("Error: Kunde inte hämta produkterna från servern!");
  }

  const result = await response.json();

  return result[0];
};

export default fetchProducts;
