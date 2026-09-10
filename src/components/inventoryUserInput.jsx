import SelectedInventoryCard from "./selectedInventoryCard";

const InventoryUserInput = ({
  toggleInventoryView,
  setToggleInventoryView,
  selectedProduct,
  quantity,
  setQuantity,
  handleInventoryChange,
}) => {
  return (
    <div className="flex flex-col gap-2 items-center bg-card p-4 rounded-sm shadow-md">
      <button
        className="bg-button p-2 rounded-sm text-lg w-45 text-text font-semibold cursor-pointer shadow-2xs transition-all duration-300 hover:text-bg hover:bg-text"
        onClick={() => setToggleInventoryView((prev) => !prev)}
      >
        {toggleInventoryView ? "All Products" : "Reorder Products"}
      </button>
      <div className="h-px w-full bg-text " />
      {/* Selected Product */}
      <div>
        <SelectedInventoryCard
          product={selectedProduct?.product}
          width={13}
          height={10}
        />
      </div>
      {/* Inventory actions */}
      <div className="w-full">
        <h2 className="font-semibold text-lg mb-3">Inventory Actions</h2>
        {/* Quantity */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm opacity-70"> Quantity </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 rounded-sm bg-bg text-text outline-none"
          />
        </div>
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={!selectedProduct}
            onClick={() => handleInventoryChange("ORDER")}
            className="bg-button p-2 rounded-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-text hover:text-bg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Order
          </button>
          <button
            disabled={!selectedProduct}
            onClick={() => handleInventoryChange("SALE")}
            className="bg-button p-2 rounded-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-text hover:text-bg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Sale
          </button>
          <button
            disabled={!selectedProduct}
            onClick={() => handleInventoryChange("ADJUSTMENTINCREASE")}
            className="bg-button p-2 rounded-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-text hover:text-bg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Adjust
          </button>
          <button
            disabled={!selectedProduct}
            onClick={() => handleInventoryChange("ADJUSTMENTDECREASE")}
            className="bg-button p-2 rounded-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-text hover:text-bg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            - Adjust
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryUserInput;
