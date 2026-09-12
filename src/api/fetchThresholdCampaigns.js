const fetchThresholdCampaigns = async () => {
  const response = await fetch("/api/thresholdCampaigns");

  if (!response.ok) {
    throw new Error("Error: Kunde inte hämta informationen från servern!");
  }

  const result = await response.json();

  return result;
};

export default fetchThresholdCampaigns;
