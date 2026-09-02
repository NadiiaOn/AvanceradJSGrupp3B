import { XIcon } from "@phosphor-icons/react";
import CategoryMenu from "./CategoryMenu";
import MenuHeader from "./MenuHeader";

export default function NavMenu({ isOpen, onClose, products, errorMessage }) {
  return (
    <div
      className={`fixed inset-0 z-200 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`flex flex-col w-1/3 h-screen bg-bg overflow-x-hidden transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <MenuHeader />
        {errorMessage ? <p>{errorMessage}</p> : <CategoryMenu />}
      </div>

      <button
        className="absolute flex top-5 right-3 p-4 bg-bg rounded-full hover:bg-card cursor-pointer"
        onClick={onClose}
      >
        <XIcon size={26} weight="thin" />
      </button>
    </div>
  );
}
