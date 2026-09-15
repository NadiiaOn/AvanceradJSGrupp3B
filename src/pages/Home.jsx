import Carousel from "../components/carousel";
import CategoryButtons from "../components/categoryButtons";
import ProductBanner from "../components/ProductBanner";
import { useOutletContext } from "react-router";
import useProductPrice from "../hooks/useProductPrice";
import { useMemo } from "react";

const Home = () => {
  const { errorMessage, productsByCategory, banners } = useOutletContext();
  const allProducts = useMemo(
    () => productsByCategory.flatMap((cat) => cat.products || []),
    [productsByCategory],
  );
  const formattedPrices = useProductPrice(allProducts);

  return (
    <main className="flex flex-col justify-center w-full font-body">
      <CategoryButtons />

      <ProductBanner banner={banners.slice(0, 2)} />

      <Carousel
        title={"Smart Phones"}
        products={productsByCategory[13]?.products}
        errorMessage={errorMessage}
        formattedPrices={formattedPrices}
      />
      <Carousel
        products={productsByCategory[7]?.products}
        errorMessage={errorMessage}
        formattedPrices={formattedPrices}
      />

      <ProductBanner banner={banners.slice(2, 4)} />

      <Carousel
        products={productsByCategory[19]?.products}
        errorMessage={errorMessage}
        formattedPrices={formattedPrices}
      />
    </main>
  );
};

export default Home;
