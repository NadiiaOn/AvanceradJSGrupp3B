import { useEffect, useState } from "react";
import "./App.css";
import DisplayProducts from "./components/displayProducts";
import fetchProducts from "./api/fetchProducts";
import Carousel from "./components/carousel";
import Categories from "./utils/categories";
import getProductsByCategory from "./utils/getProductsByCategory";

function App() {
  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const getProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const assignProductsByCategory = () => {
    const productsByCategory = Categories.map((category) => ({
      category: category,
      products: getProductsByCategory(products, category),
    }));

    setProductsByCategory(productsByCategory);
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    assignProductsByCategory();
  }, [products]);

  return (
    <main className="flex justify-center">
      <Carousel
        products={productsByCategory[13]?.products}
        errorMessage={errorMessage}
      />
      {/*<DisplayProducts products={products} errorMessage={errorMessage} /> */}
    </main>
  );
}

export default App;
