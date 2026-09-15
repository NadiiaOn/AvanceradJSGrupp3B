const InventoryCard = ({ product, width, height, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: `${width}rem`,
        minWidth: `${width}rem`,
      }}
      className="relative flex flex-col p-2 bg-bg rounded-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer"
    >
      <span className="absolute text-text">#{product.id}</span>
      <img
        style={{ height: `${height}rem` }}
        className="flex justify-center"
        src={product.thumbnail}
        alt={product.title}
      />

      <div className="flex flex-col justify-center">
        <p className="font-bold ml-3 text-sm text-text hover:underline pt-3 w-auto">
          {product.title}
        </p>

        <div className="flex justify-between">
          <span className="flex justify-start ml-3 pt-1 text-sm text-text italic">
            ${product.price}
          </span>
          <span className="italic">
            Stock: <b className="text-red-500">{product.stock}</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
