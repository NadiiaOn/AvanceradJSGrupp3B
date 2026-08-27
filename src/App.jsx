import { useEffect, useState } from "react";
import "./App.css";
import DisplayProducts from "./components/displayProducts";
import fetchAllProducts from "./api/fetchProducts";

function App() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const getProducts = async () => {
    try {
      const fetchedProducts = await fetchAllProducts();

      setProducts(fetchedProducts);
      console.log(fetchedProducts);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  {
    /* Körs vid start */
  }
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <main>
      Placeholder
      <DisplayProducts products={products} errorMessage={errorMessage} />
    </main>
  );
}

export default App;
