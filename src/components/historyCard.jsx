import { useEffect, useState } from "react";
import { fetchSpecificProduct } from "../api/fetchProducts";

// Osäker på om jag vill ha kvar colorCode på Type texten..

const HistoryCard = ({ changes, colorCode }) => {
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
      <div>
        <p>
          Type:{" "}
          <b className="text-sm" style={{ color: colorCode }}>
            {changes.type}
          </b>
        </p>
        <p>
          Quantity: <i className="text-sm font-semibold">{changes.quantity}x</i>
        </p>
        <p>
          Date:{" "}
          <span className="text-xs font-semibold">
            {date.toLocaleString("sv-SE")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default HistoryCard;
