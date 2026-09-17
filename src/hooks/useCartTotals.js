import { useEffect, useState } from "react";
import Module from "../Modules/ModuleMaker";
import { useCurrency } from "../context/CurrencyContext";

export function useCartTotal(
  cartItems,
  totalPrice,
  shippingPrice,
  savings,
  appliedCampaigns,
) {
  const { currency } = useCurrency();

  const [formattedPrices, setFormattedPrices] = useState({});
  const [rowTotals, setRowTotals] = useState({});
  const [taxTotal, setTaxTotal] = useState(0);
  const [rawSubtotal, setRawSubtotal] = useState(0);
  const [convertedTotal, setConvertedTotal] = useState(0);
  const [convertedSavings, setConvertedSavings] = useState(0);
  const [convertedProductDiscounts, setConvertedProductDiscounts] = useState(
    {},
  );

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

        prices[item.id] = await Module.CurrencyVatModule.run(singleValues);

        rowTotalPrices[item.id] = await Module.CurrencyVatModule.run(rowValues);

        rawTax[item.id] =
          await Module.CurrencyVatModule.getTaxRawAmount(rawTaxTotal);
      }

      const sumTax = Object.values(rawTax).reduce((sum, val) => sum + val, 0);

      setFormattedPrices(prices);
      setRowTotals(rowTotalPrices);
      setTaxTotal(sumTax);
    }

    calculateAll();
  }, [cartItems, currency, totalPrice]);

  useEffect(() => {
    async function calculateSubtotal() {
      const values = {
        price: totalPrice,
        targetCurrency: currency,
      };

      const converted = await Module.CurrencyVatModule.getRawPrice(values);

      setRawSubtotal(converted);
    }

    calculateSubtotal();
  }, [totalPrice, currency]);

  useEffect(() => {
    async function calculateTotal() {
      let convertedShipping = 0;

      if (shippingPrice !== null && shippingPrice !== undefined) {
        const shippingValues = {
          price: shippingPrice,
          targetCurrency: currency,
        };

        convertedShipping =
          await Module.CurrencyVatModule.getRawPrice(shippingValues);
      }

      setConvertedTotal(
        rawSubtotal + taxTotal + convertedShipping - convertedSavings,
      );
    }

    calculateTotal();
  }, [rawSubtotal, taxTotal, shippingPrice, currency]);

  useEffect(() => {
    async function calculateSavings() {
      if (savings === null || savings === undefined) {
        setConvertedSavings(0);
        return;
      }

      const values = {
        price: savings,
        targetCurrency: currency,
      };

      const converted = await Module.CurrencyVatModule.getRawPrice(values);

      setConvertedSavings(converted);
    }

    calculateSavings();
  }, [currency, savings]);

  useEffect(() => {
    async function calculateProductDiscounts() {
      if (!appliedCampaigns || appliedCampaigns.length === 0) {
        setConvertedProductDiscounts({});
        return;
      }

      const convertedDiscounts = {};

      for (const campaign of appliedCampaigns) {
        const values = {
          price: campaign.savings,
          targetCurrency: currency,
        };

        convertedDiscounts[campaign.id] =
          await Module.CurrencyVatModule.getRawPrice(values);
      }

      setConvertedProductDiscounts(convertedDiscounts);
    }

    calculateProductDiscounts();
  }, [appliedCampaigns, currency]);

  return {
    formattedPrices,
    rowTotals,
    taxTotal,
    rawSubtotal,
    currency,
    convertedTotal,
    convertedSavings,
    convertedProductDiscounts,
  };
}
