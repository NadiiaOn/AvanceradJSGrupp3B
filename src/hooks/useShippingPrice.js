import { useEffect, useState } from "react";
import Module from "../Modules/moduleMaker";
import { useCurrency } from "../context/CurrencyContext";

export default function useShippingPrice(shipping) {
  const { currency } = useCurrency();
  const [formattedShipping, setFormattedShipping] = useState({});

  useEffect(() => {
    async function shippingHandler() {
      const formatted = {};

      for (const ship of shipping) {
        const value = {
          price: ship.price,
          category: "",
          targetCurrency: currency,
        };

        const raw = await Module.CurrencyVatModule.getRawPrice(value, {});

        formatted[ship.carrierId] = Module.CurrencyVatModule.formatAmount(
          raw,
          currency,
        );
      }

      setFormattedShipping(formatted);
    }

    shippingHandler();
  }, [shipping, currency]);

  return formattedShipping;
}
