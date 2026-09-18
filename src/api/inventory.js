const getInventoryHistory = async () => {
  const response = await fetch("/api/inventoryHistory");

  if (!response.ok) {
    throw new Error("Kunde inte hämta lagerhistorik från databasen!");
  }

  return await response.json();
};

const createInventoryChange = async (change) => {
  const response = await fetch("/api/inventoryHistory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(change),
  });

  if (!response.ok) {
    throw new Error(
      "Det gick inte att spara till lagerhistoriken i databasen!",
    );
  }

  return await response.json();
};

export { getInventoryHistory, createInventoryChange };
