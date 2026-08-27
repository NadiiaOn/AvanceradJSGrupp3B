const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col p-2 bg-card w-50 md:w-70 transition-all duration-300 hover:scale-105 hover:cursor-pointer">
      <img
        className="flex justify-center h-50"
        src={product.image}
        alt={product.title}
      ></img>
      <p className="flex justify-start ml-3 font-bold text-sm text-text hover:underline pt-3 w-auto">
        {product.title.length > 25
          ? product.title.slice(0, 20) + "..."
          : product.title}
      </p>
      <p className="flex justify-start ml-3 pt-1 text-sm text-text italic">
        {product.price.toFixed(2)} SEK
      </p>
    </div>
  );
};

export default ProductCard;
