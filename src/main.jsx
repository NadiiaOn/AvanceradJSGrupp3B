import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./router.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import CurrencyProvider from "./context/CurrencyContext.jsx";
import { InventoryProvider } from "./context/InventoryContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CurrencyProvider>
      <CartProvider>
        <InventoryProvider>
          <RouterProvider router={router} />
        </InventoryProvider>
      </CartProvider>
    </CurrencyProvider>
</StrictMode>,
);



