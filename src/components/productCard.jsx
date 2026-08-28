const ProductCard = ({ product, width, height }) => {
  return (
    <div
      style={{
        width: `${width}rem`,
        minWidth: `${width}rem`,
      }}
      className="flex flex-col p-2 bg-card transition-all duration-300 hover:scale-105 hover:cursor-pointer"
    >
      <img
        style={{ height: `${height}rem` }}
        className="flex justify-center"
        src={product.thumbnail}
        alt={product.title}
      />

      <p className="flex justify-start ml-3 font-bold text-sm text-text hover:underline pt-3 w-auto">
        {product.title}
      </p>

      <p className="flex justify-start ml-3 pt-1 text-sm text-text italic">
        {product.price}
      </p>
    </div>
  );
};

export default ProductCard;
