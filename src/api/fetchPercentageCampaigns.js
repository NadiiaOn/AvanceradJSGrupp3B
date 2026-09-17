const fetchPercentageCampaigns = async () => {
  const response = await fetch("/api/percentageCampaigns");

  if (!response.ok) {
    throw new Error(
      `Kunde inte hämta procentkampanjer (status ${response.status}).`,
    );
  }

  const result = await response.json();

  return result;
};

export default fetchPercentageCampaigns;
