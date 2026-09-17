export default async function fetchPercentageCampaigns(
  campaignCode,
  productIds = [],
  limit = null,
) {
  let response;
  try {
    response = await fetch(
      `http://localhost:3000/percentageCampaigns?${[
        `campaignsCod=${encodeURIComponent(campaignCode)}`,
        ...productIds.map((id) => `id=${encodeURIComponent(id)}`),
        ...(limit ? [`_limit=${limit}`] : []),
      ].join("&")}`,
    );
  } catch {
    throw new Error(
      "Nätverksfel: kunde inte hämta procentkampanjer. Försök igen senare.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `Kunde inte hämta procentkampanjer (status ${response.status}).`,
    );
  }

  return response.json();
}
