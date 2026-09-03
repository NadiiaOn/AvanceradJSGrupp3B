import { useState } from "react";
import mainCategories from "../utils/mainCategories";
import { CaretDownIcon } from "@phosphor-icons/react";
import { stringFormat } from "../utils/productUtils";
import { useNavigate } from "react-router";

export default function CategoryMenu() {
  const [openCategory, setOpenCategory] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      {mainCategories.map((cat, index) => (
        <div
          key={index}
          role="button"
          className="flex flex-col flex-wrap px-6 py-4 border-b border-gray-300 cursor-pointer hover:bg-card"
          onClick={() => setOpenCategory(openCategory === index ? null : index)}
        >
          <div className="flex items-center justify-between ">
            <p className="text-xl font-body font-medium">{cat.name}</p>
            <CaretDownIcon
              className={`transition-transform duration-300 ${openCategory === index ? "rotate-180" : ""}`}
              size={20}
              weight="thin"
            />
          </div>
          {openCategory === index && (
            <div className="flex flex-col mt-2">
              {cat.subCategories.map((sub, subIndex) => (
                <button
                  className="mt-1 hover:underline"
                  key={subIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sortiment/${cat.routeName}`);
                  }}
                >
                  {stringFormat(sub)}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
