import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Router.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import CurrencyProvider from "./context/CurrencyContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CurrencyProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </CurrencyProvider>
  </StrictMode>,
);
