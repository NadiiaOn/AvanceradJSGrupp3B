import { createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/Product.jsx";
import Checkout from "./pages/Checkout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductPage />,
      },
      {
        path:"checkout",
        element: <Checkout />,
      }
    ],
  },
]);

export default router;
