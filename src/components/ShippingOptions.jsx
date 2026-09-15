const PRICING_TYPE_LABELS = {
  weight: "Viktbaserad",
  volumetric: "Volymbaserad",
  zone: "Zonbaserad",
};

export default function ShippingOptions({
  countryOptions,
  destinationCountry,
  setDestinationCountry,
  onCalculate,
  loading,
  error,
  quotes,
  selectedCarrierId,
  onSelectCarrier,
}) {
  return (
    <div className="mb-4">
      <select
        value={destinationCountry}
        onChange={(e) => setDestinationCountry(e.target.value)}
        className="w-full p-2 rounded border bg-bg text-text outline-none mb-2"
      >
        <option value="">Välj land</option>
        {countryOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={onCalculate}
        disabled={!destinationCountry || loading}
        className="w-full py-2 mt-2 rounded border border-text/20 text-sm hover:bg-text/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? "Beräknar frakt..." : "Beräkna frakt"}
      </button>

      {error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null}

      {quotes ? (
        <div className="flex flex-col gap-2 mt-3">
          {quotes.map((quote) => (
            <label
              key={quote.carrierId}
              className="flex items-center justify-between gap-2 p-2 rounded border border-text/20 cursor-pointer text-sm"
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="carrier"
                  checked={selectedCarrierId === quote.carrierId}
                  onChange={() => onSelectCarrier(quote.carrierId)}
                />
                <span>
                  {quote.carrierName}
                    <span className="text-text/60">
                        {" "}· {PRICING_TYPE_LABELS[quote.pricingType] ?? quote.pricingType} · {quote.estimatedDays} dagar
                    </span>
                </span>
              </span>
              <span className="font-semibold">${quote.priceUsd.toFixed(2)}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}