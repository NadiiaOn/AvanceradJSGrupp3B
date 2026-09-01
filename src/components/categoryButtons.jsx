const categories = [
  { name: "Clothes", subCategories: ["mens-shirts", "tops", "womens-dresses"] },
  { name: "Shoes", subCategories: ["mens-shoes", "womens-shoes"] },
  {
    name: "Accessories",
    subCategories: [
      "sunglasses",
      "womens-bags",
      "womens-jewellery",
      "mens-watches",
      "womens-watches",
    ],
  },
  { name: "Beauty", subCategories: ["beauty", "fragrances", "skin-care"] },
  {
    name: "Home",
    subCategories: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  { name: "Groceries", subCategories: ["groceries"] },
  {
    name: "Electronics",
    subCategories: ["laptops", "smartphones", "tablets", "mobile-accessories"],
  },
  { name: "Vehicles", subCategories: ["motorcycle", "vehicle"] },
  { name: "Sports", subCategories: ["sports-accessories"] },
];

// Uppdatera för att ta emot funktionen som hämtar produkter baserat på sub-categorierna

const CategoryButtons = () => {
  return (
    <section className="flex flex-col mx-auto gap-5 mt-5 max-w-200 text-text">
      <p className="mx-auto text-2xl font-semibold tracking-wide font-heading">
        Our categories
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {categories.map((category, idx) => {
          return (
            <button
              key={idx}
              className="bg-button font-semibold p-2 cursor-pointer transition-all duration-200 hover:bg-gray-200"
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryButtons;
