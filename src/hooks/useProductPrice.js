import { useEffect, useState } from "react";
import Module from "../Modules/ModuleMaker";
import { useCurrency } from "../context/CurrencyContext";

export default function useProductPrice(products) {
  const { currency } = useCurrency();
  const [formattedPrices, setFormattedPrices] = useState({});

  useEffect(() => {
    async function productHandler() {
      const prices = {};

      for (const product of products) {
        const value = {
          price: product.price,
          category: product.category,
          targetCurrency: currency,
        };
        prices[product.id] = await Module.CurrencyVatModule.run(value, {});
      }

      setFormattedPrices(prices);
    }
    productHandler();
  }, [products, currency]);

  return formattedPrices;
}
