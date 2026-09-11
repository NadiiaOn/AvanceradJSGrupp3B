import { createContext, useContext, useState } from "react";

const currencyContext = createContext();

export function useCurrency() {
  const context = useContext(currencyContext);

  if (!context) {
    throw new Error(
      "useCurrency måste användas inom en CurrencyContext-provider",
    );
  }
  return context;
}

export default function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");

  return (
    <currencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </currencyContext.Provider>
  );
}
