import { XIcon } from "@phosphor-icons/react";

export default function NavMenu({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`flex flex-col w-1/3 h-screen bg-bg transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex justify-between px-4 py-6 border-b bg-card ">
          <p className="text-2xl font-heading font-bold">Hej!</p>
          <button className="text-l font-body underline cursor-pointer">
            Log In
          </button>
        </div>
        <a className="px-4 py-4 border-b cursor-pointer hover:bg-card">
          <p className="text-xl font-body">Kläder</p>
        </a>
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
