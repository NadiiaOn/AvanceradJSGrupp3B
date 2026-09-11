import { useRef, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";
const currencies = [
  { code: "USD", flagSrc: "/usd.png" },
  { code: "SEK", flagSrc: "/sek.png" },
  { code: "EUR", flagSrc: "/eur.png" },
];

export default function CurrencySelector({ onClose }) {
  const { currency, setCurrency } = useCurrency();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div>
      <ul
        ref={dropdownRef}
        className="absolute top-full right-0 mt-2 border border-gray-300 rounded-lg shadow-lg bg-white divide-y divide-gray-100 min-w-32 overflow-hidden"
      >
        {currencies.map((c) => (
          <li
            key={c.code}
            className="flex items-center gap-2 px-3 py-2 hover:bg-card cursor-pointer"
            onClick={() => {
              setCurrency(c.code);
              onClose();
            }}
          >
            <img
              className="w-5 h-4 rounded-sm object-cover"
              src={c.flagSrc}
              alt=""
            />
            <p>{c.code}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
