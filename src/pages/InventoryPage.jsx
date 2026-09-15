import { useContext, useEffect, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";
import InventoryProductView from "../components/inventoryProductView";
import InventoryUserInput from "../components/inventoryUserInput";
import InventoryHistory from "../components/inventoryHistory";

export default function InventoryPage() {
  const [toggleInventoryView, setToggleInventoryView] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inventoryHistory, setInventoryHistory] = useState([]);

  const { inventoryItems, loadInventory, registerInventoryChange } =
    useContext(InventoryContext);

  useEffect(() => {
    const load = async () => {
      const result = await loadInventory();

      const history = result.flatMap((item) => item.changes);

      setInventoryHistory(history);
    };

    load();
  }, []);

  const displayedInventory = toggleInventoryView
    ? inventoryItems.filter((item) => item.needsReorder())
    : inventoryItems;

  const handleInventoryChange = async (type) => {
    if (!selectedProduct) {
      return;
    }

    if (Number(quantity) <= 0) {
      return;
    }

    await registerInventoryChange(
      Number(selectedProduct.productId),
      type,
      Number(quantity),
    );

    const result = await loadInventory();

    const history = result.flatMap((item) => item.changes);

    setInventoryHistory(history);

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
