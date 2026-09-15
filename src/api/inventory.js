const getInventoryHistory = async () => {
  const response = await fetch("/api/inventoryHistory");

  if (!response.ok) {
    throw new Error("Couldn't get inventory history from DB!");
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
    throw new Error("Couldn't save to inventory history in DB!");
  }

  return await response.json();
};

export { getInventoryHistory, createInventoryChange };
