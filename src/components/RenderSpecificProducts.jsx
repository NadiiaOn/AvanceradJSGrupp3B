import ProductCard from "./productCard";

const cardWidth = 18;

const RenderSpecificProducts = ({ key, subCategory, products }) => {
  const formatCategoryName = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section className="flex flex-col mx-auto max-w-300">
      <h2 className="relative left-1 text-3xl font-bold tracking-wide mt-10 mb-2 font-heading">
        {formatCategoryName(subCategory)}
      </h2>

      <div key={key} className="flex justify-start">
        <div className="flex gap-4 flex-wrap">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              width={cardWidth}
              height={19}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RenderSpecificProducts;
