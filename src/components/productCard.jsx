import { ShoppingCartIcon } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";

const ProductCard = ({ product, width, height }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: `${width}rem`,
        minWidth: `${width}rem`,
      }}
      className="flex flex-col p-2 bg-card transition-all duration-300 hover:scale-105 hover:cursor-pointer"
    >
      <img
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ height: `${height}rem` }}
        className="flex justify-center"
        src={product.thumbnail}
        alt={product.title}
      />

      <div className="flex flex-row justify-between items-center">
        <div onClick={() => navigate(`/product/${product.id}`)}>
          <p className="flex justify-start ml-3 font-bold text-sm text-text hover:underline pt-3 w-auto">
            {product.title}
          </p>
          <p className="flex justify-start ml-3 pt-1 text-sm text-text italic">
            ${product.price}
          </p>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="rounded-sm w-10 h-10 p-2 cursor-pointer border transition-all duration-300 hover:text-gray-400"
        >
          <ShoppingCartIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
