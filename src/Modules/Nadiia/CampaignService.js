// This class is responsible for handling all data from the database related to campigns and discounts.

//It will take db throw the API.

export const fetchPercentageCampaigns = async () => {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Error: Kunde inte hämta kampanjerna från servern!");
  }

  const result = await response.json();

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("Inga kampanjen hittades i databasen.");
  }

  return result[0];
};

