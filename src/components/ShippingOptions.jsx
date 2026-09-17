import { useEffect, useState } from "react";
import Module from "../Modules/ModuleMaker";

const PRICING_TYPE_LABELS = {
  weight: "Weight based",
  volumetric: "Volume based",
  zone: "Zone based",
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
  currency,
}) {
  const [formattedQuotes, setFormattedQuotes] = useState([]);

  useEffect(() => {
    async function formatQuotes() {
      if (!quotes) {
        setFormattedQuotes([]);
        return;
      }

      const formatted = await Promise.all(
        quotes.map(async (quote) => {
          const raw = await Module.CurrencyVatModule.getRawPrice(
            {
              price: quote.priceUsd,
              targetCurrency: currency,
            },
            {},
          );

          return {
            ...quote,
            formattedPrice: Module.CurrencyVatModule.formatAmount(
              raw,
              currency,
            ),
          };
        }),
      );

      setFormattedQuotes(formatted);
    }

    formatQuotes();
  }, [quotes, currency]);

  return (
    <div className="mb-4">
      <select
        value={destinationCountry}
        onChange={(e) => setDestinationCountry(e.target.value)}
        className="w-full p-2 rounded border bg-bg text-text outline-none mb-2"
      >
        <option value="">Select country</option>
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
        {loading ? "Calculating shipping..." : "Calculate Shipping"}
      </button>

      {error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null}

      {quotes ? (
        <div className="flex flex-col gap-2 mt-3">
          {formattedQuotes.map((quote) => (
            <label
              key={quote.carrierId}
              className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2 rounded border border-text/20 cursor-pointer text-sm"
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
                  <span className="flex flex-col text-text/60 text-lg">
                    ·
                    {PRICING_TYPE_LABELS[quote.pricingType] ??
                      quote.pricingType}
                    · {quote.estimatedDays} Days
                  </span>
                </span>
              </span>
              <span className="font-semibold text-base">
                {quote.formattedPrice}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
