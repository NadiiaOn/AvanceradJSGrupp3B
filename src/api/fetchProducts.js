const fetchProducts = async () => {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Error: Kunde inte hämta produkterna från servern!");
  }

  const result = await response.json();

  console.log("result: ", result);
  return result[0];
};

export default fetchProducts;
