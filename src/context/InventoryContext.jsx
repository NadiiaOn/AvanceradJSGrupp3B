import { createContext, useEffect, useRef, useState } from "react";
import InventoryModule from "../Modules/Inventory";

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [moduleEventsHistory, setModuleEventsHistory] = useState([]);

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

  const loadModuleEvents = async () => {
    let events = moduleRef.current.getModuleHistory();

    setModuleEventsHistory(events);
  };

  useEffect(() => {
    const load = async () => {
      await loadInventory();
      loadModuleEvents();
    };

    load();
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
