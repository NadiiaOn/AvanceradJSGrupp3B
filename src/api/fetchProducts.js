const fetchAllProducts = async () => {
  try {
    let response = await fetch("http://localhost:3000/products");

    if (!response.ok) {
      throw new Error("Error: Kunde inte hämta produkterna från servern!");
    }

    let result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Kunde inte ansluta till servern!");
  }
};

export default fetchAllProducts;
