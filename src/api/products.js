export const updateProductStock = async (productId, stock) => {
  const response = await fetch(`/api/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stock,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Kunde inte uppdatera produktens lagerantal! Status: ${response.status} ${errorText}`,
    );
  }

  return await response.json();
};
