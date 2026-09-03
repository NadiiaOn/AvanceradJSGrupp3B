import ProductCard from "./productCard";

const cardWidth = 18;

const RenderSpecificProducts = ({ subCategory, products }) => {
  const formatCategoryName = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section className="flex flex-col mx-auto max-w-300 px-10">
      <h2 className="relative left-1 flex justify-start text-3xl font-bold tracking-wide mt-10 mb-2 font-heading">
        {formatCategoryName(subCategory)}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} height={19} />
        ))}
      </div>
    </section>
  );
};

export default RenderSpecificProducts;
