import { createContext, useEffect, useRef, useState } from "react";
import InventoryModule from "../Modules/Inventory";

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState([]);

  const moduleRef = useRef(new InventoryModule());

  const loadInventory = async () => {
    const result = await moduleRef.current.run({
      method: "getInventoryReport",
    });

    setInventoryItems(result);

    return result;
  };

  const registerInventoryChange = async (productId, type, quantity) => {
    const result = await moduleRef.current.run({
      method: "registerInventoryChange",
      productId,
      type,
      quantity,
    });

    return result;
  };

  useEffect(() => {
    loadInventory;
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        loadInventory,
        registerInventoryChange,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
