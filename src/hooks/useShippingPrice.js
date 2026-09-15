import { useEffect, useState } from "react";
import Module from "../Modules/moduleMaker";
import { useCurrency } from "../context/CurrencyContext";

export default function useShippingPrice(shippingPrice) {
  const { currency } = useCurrency();
  const [formattedShipping, setFormattedShipping] = useState("");

  useEffect(() => {
    async function shippingHandler() {
      if (shippingPrice === null || shippingPrice === undefined) {
        setFormattedShipping("");
        return;
      }

      const values = {
        price: shippingPrice,
        category: "",
        targetCurrency: currency,
      };

      const raw = await Module.CurrencyVatModule.getRawPrice(values, {});
      const formatted = Module.CurrencyVatModule.formatAmount(raw, currency);
      setFormattedShipping(formatted);
    }

    shippingHandler();
  }, [shippingPrice, currency]);

  return formattedShipping;
}
