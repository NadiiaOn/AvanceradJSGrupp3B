import { useEffect, useState } from "react";
import "./App.css";
import DisplayProducts from "./components/displayProducts";
import fetchProducts from "./api/fetchProducts";
import Carousel from "./components/carousel";
import Categories from "./utils/categories";
import getProductsByCategory from "./utils/getProductsByCategory";
import CategoryButtons from "./components/categoryButtons";

// Kan behöva skapa en "Ad banner" för att fylla ut plats och skapa mellanrum från våra framtida "Carousels" som renderar produkter?

function App() {
  // Alla produkter.
  const [products, setProducts] = useState([]);
  // Produkter per 1 kategori
  const [productsByCategory, setProductsByCategory] = useState([]);
  // Produkter för subkategorier (plural).
  const [productsBySubCategories] = useState([]);
  // Fel meddelande som renderas.
  const [errorMessage, setErrorMessage] = useState(null);

  // Hämtar alla produkter.
  const getProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Hämtar produkter för en kategori (För komponenten: Carousel).
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
    <main className="flex flex-col justify-center w-full border font-body">
      <CategoryButtons />
      <Carousel
        products={productsByCategory[13]?.products}
        errorMessage={errorMessage}
      />
      {/* Kan raderas senare då denna renderar ut alla 193 produkter. */}
      {/*<DisplayProducts products={products} errorMessage={errorMessage} /> */}
    </main>
  );
}

export default App;
