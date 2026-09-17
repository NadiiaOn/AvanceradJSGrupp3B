export default async function fetchBuyXPayForYCampaigns(productIds = []) {

  let response;
  try {
    response = await fetch(`
      http: //localhost:3000/buyXPayForYCampaigns?${productIds
        .map((id) => `id = ${encodeURIComponent(id)}`)}`)
      .join("&")
  } catch {
    throw new Error ("Nätverkfel: kunde inte köp X betala för Y-kampanjer.")
  }

  if (!response.ok) {
    throw new Error(
      `Kunde inte hämpa köp X betala för Y-kampanjer (status ${response.status})`
    );
  }
  return response.json();
}
