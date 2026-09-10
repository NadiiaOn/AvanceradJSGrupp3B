import { useEffect, useState } from "react";
import { fetchSpecificProduct } from "../api/fetchProducts";

const HistoryCard = ({ changes }) => {
  const [product, setProduct] = useState(null);

  const date = new Date(changes.timestamp);

  const productId = Number(changes.productId);

  const getProductInfo = async () => {
    setProduct(await fetchSpecificProduct({ productId }));
  };

  useEffect(() => {
    getProductInfo();
  }, []);

  if (!product) {
    return <p>Produkten hittades ej!</p>;
  }

  console.log("Specific Product: ", product);

  return (
    <div className="relative flex gap-2 p-2 bg-card">
      <span className="absolute italic font-semibold text-xs">
        #{product.id}
      </span>
      <img
        src={product.thumbnail}
        alt={`Product of: ${product.title}`}
        className="ml-4 h-15"
      />
      <div className="text-sm">
        <p>
          Type: <b>{changes.type}</b>
        </p>
        <p>
          Quantity: <i>{changes.quantity}</i>x
        </p>
        <p>Date: {date.toLocaleString("sv-SE")}</p>
      </div>
    </div>
  );
};

export default HistoryCard;
