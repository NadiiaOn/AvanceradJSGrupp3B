import { useEffect, useState } from "react";
import InventoryModule from "../Modules/Inventory";
import InventoryProductView from "../components/inventoryProductView";
import InventoryUserInput from "../components/inventoryUserInput";
import InventoryHistory from "../components/inventoryHistory";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [toggleInventoryView, setToggleInventoryView] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inventoryHistory, setInventoryHistory] = useState([]);

  const loadInventory = async () => {
    const module = new InventoryModule();

    const result = await module.run({
      method: "getInventoryReport",
    });

    setInventory(result);

    const history = result.flatMap((item) => item.changes);

    setInventoryHistory(history);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const displayedInventory = toggleInventoryView
    ? inventory.filter((item) => item.stock <= item.reorderBreakPoint)
    : inventory;

  const handleInventoryChange = async (type) => {
    if (!selectedProduct) {
      return;
    }

    if (Number(quantity) <= 0) {
      return;
    }

    const module = new InventoryModule();

    await module.run({
      method: "registerInventoryChange",
      productId: Number(selectedProduct.productId),
      type,
      quantity: Number(quantity),
    });

    await loadInventory();

    setQuantity(1);
  };

  return (
    <div className="flex flex-col justify-center items-center min-w-full min-h-full text-text">
      <h1 className="text-2xl py-10 font-bold">
        Inventory View <i> - (ADMIN)</i>
      </h1>

      {/* Top section wrapper */}
      <div className="flex flex-row gap-8">
        {/* Top left side - product view */}
        <InventoryProductView
          displayedInventory={displayedInventory}
          toggleInventoryView={toggleInventoryView}
          setSelectedProduct={setSelectedProduct}
        />

        {/* Top right side - userinput area */}
        <InventoryUserInput
          toggleInventoryView={toggleInventoryView}
          setToggleInventoryView={setToggleInventoryView}
          selectedProduct={selectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          handleInventoryChange={handleInventoryChange}
        />
      </div>

      {/* History */}
      <div className="flex flex-col justify-center items-center py-10">
        <h2 className="text-2xl mb-3 font-bold underline">Inventory History</h2>
        <InventoryHistory history={inventoryHistory} />
      </div>
    </div>
  );
}
