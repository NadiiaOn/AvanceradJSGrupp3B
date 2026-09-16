import { useOutletContext, useParams, useSearchParams } from "react-router";
import getProductsBySubCategories from "../utils/getProductsBySubCategories";
import CategoryButtons, { categories } from "../components/categoryButtons";
import RenderSpecificProducts from "../components/RenderSpecificProducts";
import { useEffect } from "react";

const SortimentPage = () => {
  const { category } = useParams();
  const { products } = useOutletContext();

  const [searchParams] = useSearchParams();

  const selectedSubCategory = searchParams.get("subcategory");

  useEffect(() => {
    if (!selectedSubCategory) {
      return;
    }

    const subCatElement = document.getElementById(
      `subcategory-${selectedSubCategory}`,
    );

    if (subCatElement) {
      subCatElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedSubCategory]);

  const selectedCategory = categories.find(
    (item) => item.routeName === category,
  );

  return (
    <div className="flex flex-col justify-center py-10">
      <CategoryButtons />

      {selectedCategory.subCategories.map((subCategory) => {
        const filteredProducts = getProductsBySubCategories(products, [
          subCategory,
        ]);

        return (
          <div
            key={subCategory}
            id={`subcategory-${subCategory}`}
            className="scroll-mt-20"
          >
            <RenderSpecificProducts
              subCategory={subCategory}
              products={filteredProducts}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SortimentPage;
