const getInventory = async () => {
  const response = await fetch("/api/inventory");

  if (!response.ok) {
    throw new Error("Couldn't get inventory from DB!");
  }

  return await response.json();
};

const createInventoryChange = async (change) => {
  console.log("POST CALLED: ", change);
  console.trace();

  const response = await fetch("/api/inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(change),
  });

  if (!response.ok) {
    throw new Error("Couldn't save to inventory in DB!");
  }

  return await response.json();
};

export { getInventory, createInventoryChange };
