const SelectedInventoryCard = ({ product, width, height }) => {
  if (!product) {
    return (
      <div
        style={{ width: `${width}rem`, minWidth: `${width}rem` }}
        className="flex flex-col items-center justify-center p-4 bg-bg rounded-lg"
      >
        <div
          style={{ height: `${height}rem` }}
          className="flex items-center justify-center w-full"
        >
          <span className="text-text opacity-30 text-5xl"> ? </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-sm opacity-50 text-center">
            No product selected
          </p>
          <p className="text-xs opacity-40 text-center mt-1">
            Select a product from the inventory
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{ width: `${width}rem`, minWidth: `${width}rem` }}
      className="relative flex flex-col p-2 bg-bg rounded-lg"
    >
      <span className="absolute text-text">#{product.id}</span>
      <img
        style={{ height: `${height}rem` }}
        className="flex justify-center object-contain"
        src={product.thumbnail}
        alt={product.title}
      />
      <div className="flex flex-col justify-center">
        <p className="font-bold ml-3 text-sm text-text pt-3 w-auto">
          {product.title}
        </p>
        <div className="flex justify-between">
          <span className="flex justify-start ml-3 pt-1 text-sm text-text italic">
            ${product.price}
          </span>
          <span> Stock: {product.stock} </span>
        </div>
      </div>
    </div>
  );
};
export default SelectedInventoryCard;
