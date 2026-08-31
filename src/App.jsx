import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import DisplayProducts from "./components/displayProducts";
import fetchProducts from "./api/fetchProducts";

function App() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const getProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Navbar products={products} errorMessage={errorMessage} />
      <main className="flex justify-center">
        <DisplayProducts products={products} errorMessage={errorMessage} />
      </main>
    </>
  );
}

export default App;
