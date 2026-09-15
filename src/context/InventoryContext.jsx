import Module from "../Modules/moduleMaker";
import { createContext, useEffect, useRef, useState } from "react";

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [moduleEventsHistory, setModuleEventsHistory] = useState([]);

  const moduleRef = useRef(Module.InventoryModule);

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
