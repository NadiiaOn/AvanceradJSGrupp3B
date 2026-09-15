import { useEffect, useState } from "react";
import ModuleCaller from "../Modules/ModuleCaller/ModuleCaller";
import { useCurrency } from "../context/CurrencyContext";

export function useCartTotal(cartItems, totalPrice) {
  const { currency } = useCurrency();
  const [formattedPrices, setFormattedPrices] = useState({});
  const [rowTotals, setRowTotals] = useState({});
  const [taxTotal, setTaxTotal] = useState(0);
  const [rawSubtotal, setRawSubtotal] = useState(0);
  const [rawTaxAmounts, setRawTaxAmounts] = useState(0);

  useEffect(() => {
    async function calculateAll() {
      const prices = {};
      const rowTotalPrices = {};
      const rawTax = {};

      for (const item of cartItems) {
        const singleValues = {
          price: item.price,
          category: item.category,
          targetCurrency: currency,
        };
        const rowValues = {
          price: item.price * item.quantity,
          category: item.category,
          targetCurrency: currency,
        };
        const rawTaxTotal = {
          price: item.price * item.quantity,
          category: item.category,
          targetCurrency: currency,
        };

        prices[item.id] = await ModuleCaller.CurrencyVatModule.run(
          singleValues,
          {},
        );
        rowTotalPrices[item.id] = await ModuleCaller.CurrencyVatModule.run(
          rowValues,
          {},
        );
        rawTax[item.id] = await ModuleCaller.CurrencyVatModule.getTaxRawAmount(
          rawTaxTotal,
          {},
        );
      }
      setFormattedPrices(prices);
      setRowTotals(rowTotalPrices);
      setRawTaxAmounts(rawTax);
    }
    calculateAll();
  }, [cartItems, currency, totalPrice]);

  useEffect(() => {
    async function calculateSubtotal() {
      const values = {
        price: totalPrice,
        category: "",
        targetCurrency: currency,
      };
      const converted =
        await ModuleCaller.CurrencyVatModule.getRawPrice(values);
      setRawSubtotal(converted);
    }
    calculateSubtotal();
  }, [totalPrice, currency]);

  useEffect(() => {
    const sumTax = Object.values(rawTaxAmounts).reduce(
      (sum, val) => sum + val,
      0,
    );
    setTaxTotal(sumTax);
  }, [rawTaxAmounts]);

  return { formattedPrices, rowTotals, taxTotal, rawSubtotal, currency };
}
