import Carousel from "../components/carousel";
import CategoryButtons from "../components/categoryButtons";
import ProductBanner from "../components/ProductBanner";
import { useOutletContext } from "react-router";

const Home = () => {
  const { errorMessage, productsByCategory, banners } = useOutletContext();

  return (
    <main className="flex flex-col justify-center w-full font-body">
      <CategoryButtons />

      <ProductBanner banner={banners.slice(0, 2)} />

      <Carousel
        title={"Smart Phones"}
        products={productsByCategory[13]?.products}
        errorMessage={errorMessage}
      />
      <Carousel
        products={productsByCategory[7]?.products}
        errorMessage={errorMessage}
      />

      <ProductBanner banner={banners.slice(2, 4)} />

      <Carousel
        products={productsByCategory[19]?.products}
        errorMessage={errorMessage}
      />
    </main>
  );
};

export default Home;
