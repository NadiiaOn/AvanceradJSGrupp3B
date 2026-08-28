import ProductCard from "./productCard";

const DisplayProducts = ({ products, errorMessage }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-auto mx-auto py-10 px-10">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        products.map((product, idx) => {
          return <ProductCard key={idx} product={product} />;
        })
      )}
    </section>
  );
};

export default DisplayProducts;
