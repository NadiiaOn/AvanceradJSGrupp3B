import ProductCard from "./productCard";

const DisplayProducts = ({ products, errorMessage }) => {
  return (
    <section className="flex justify-center items-center gap-5 w-350 flex-wrap py-10 px-10">
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
