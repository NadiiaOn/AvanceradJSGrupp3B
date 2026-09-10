import InventoryCard from "./inventoryCard";

const InventoryProductView = ({
  displayedInventory,
  toggleInventoryView,
  setSelectedProduct,
}) => {
  return (
    <div className="w-180 bg-card rounded-sm shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-text/10">
        <div>
          <h2 className="text-lg font-semibold">
            {toggleInventoryView ? "Reorder Products" : "All Products"}
          </h2>
          <p className="text-sm opacity-60">
            {displayedInventory.length} products
          </p>
        </div>
        <div className="px-3 py-1 text-sm rounded-full bg-button">
          {toggleInventoryView ? "Low stock" : "Inventory"}
        </div>
      </div>
      {/* Product area */}
      <div className="h-134 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-4">
          {displayedInventory.map((item) => (
            <InventoryCard
              key={item.productId}
              product={item.product}
              width={13}
              height={10}
              onClick={() => setSelectedProduct(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryProductView;
