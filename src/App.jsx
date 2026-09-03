import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import fetchProducts from "./api/fetchProducts";
import SubCategories from "./utils/subCategories";
import getProductsByCategory from "./utils/getProductsByCategory";
import Banners from "./utils/banners";
import CartDrawer from "./components/cartDrawer";
import { Outlet } from "react-router";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

function App() {
  // Alla produkter.
  const [products, setProducts] = useState([]);
  // Produkter per 1 kategori.
  const [productsByCategory, setProductsByCategory] = useState([]);
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
    const productsByCategory = SubCategories.map((category) => ({
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
      <div className="flex flex-col justify-between min-h-screen">
        <div>
          <header className="sticky top-0 z-200">
            <Navbar products={products} errorMessage={errorMessage} />
          </header>

          <CartDrawer />

          <div>
            <Outlet
              context={{
                products,
                errorMessage,
                productsByCategory,
                banners,
              }}
            />
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
