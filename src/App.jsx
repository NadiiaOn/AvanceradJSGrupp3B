import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import fetchProducts from "./api/fetchProducts";
import Categories from "./utils/categories";
import getProductsByCategory from "./utils/getProductsByCategory";
import Banners from "./utils/banners";
import { Outlet } from "react-router";

function App() {
  // Alla produkter.
  const [products, setProducts] = useState([]);
  // Produkter per 1 kategori.
  const [productsByCategory, setProductsByCategory] = useState([]);
  // Produkter för subkategorier.
  const [productsBySubCategories] = useState([]);
  // Fel meddelande som renderas.
  const [errorMessage, setErrorMessage] = useState(null);

  // Ad banners / för utfyllnad av innehållet.
  const banners = Banners;

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
    <>
      <div>
        <header>
          <Navbar products={products} errorMessage={errorMessage} />
        </header>

        <div>
          <Outlet
            context={{ products, errorMessage, productsByCategory, banners }}
          />
        </div>
      </div>

      <footer>
        <p>Placeholder footer</p>
      </footer>
    </>
  );
}

export default App;
