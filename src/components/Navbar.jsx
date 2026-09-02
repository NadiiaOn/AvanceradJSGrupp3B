import {
  ShoppingCartIcon,
  TagIcon,
  ListIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import NavMenu from "./NavMenu";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar({ products, errorMessage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart } = useCart();

  return (
    <nav className="flex justify-center bg-bg w-full py-4 border-b">
      <NavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        products={products}
        errorMessage={errorMessage}
      />
      <div className="flex justify-between items-center sm:grid sm:grid-cols-3 w-[90%]">
        {/* Logga */}
        <div className="flex items-center gap-1 order-1 sm:order-2 sm:justify-self-center">
          <TagIcon
            weight="bold"
            className="w-6.5 h-6.5 xl:w-8 xl:h-8 text-olive"
          />
          <h1 className="font-semibold font-heading text-3xl xl:text-4xl">
            Fakestore
          </h1>
        </div>
        {/* Hamburgarmeny, sök */}
        <div className="flex items-center gap-4 text-text order-2 sm:contents">
          <div className="flex items-center gap-4 sm:order-1 sm:justify-self-start">
            <div className="flex py-2 px-2 rounded-full cursor-pointer hover:bg-card">
              <button onClick={() => setIsMenuOpen((prev) => !prev)}>
                <ListIcon
                  weight="thin"
                  className="w-6.5 h-6.5 xl:w-8 xl:h-8"
                />
              </button>
            </div>
            <button className="flex items-center px-2 py-2 rounded-full gap-2 cursor-pointer hover:bg-card ">
              <MagnifyingGlassIcon
                weight="thin"
                className="w-6.5 h-6.5 xl:w-8 xl:h-8"
              />
              <p className="hidden sm:block text-text font-body">Search</p>
            </button>
          </div>
          {/* Kundvagn */}
          <div className="flex gap-2 sm:order-3 sm:justify-self-end">
            <button className="hidden cursor-pointer xl:flex xl:items-center xl:gap-1 py-2 px-2 rounded-full hover:bg-card">
              <UserIcon
                weight="thin"
                className="w-6.5 h-6.5 xl:w-8 xl:h-8"
              />
              <p className="text-text font-body">Log In</p>
            </button>
            <div className="flex py-2 px-2 rounded-full cursor-pointer hover:bg-card">
              <button onClick={toggleCart}>
                <ShoppingCartIcon
                  weight="thin"
                  className="w-6.5 h-6.5 xl:w-8 xl:h-8"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
