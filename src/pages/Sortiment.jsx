import { useOutletContext, useParams } from "react-router";
import getProductsBySubCategories from "../utils/getProductsBySubCategories";
import CategoryButtons, { categories } from "../components/categoryButtons";
import RenderSpecificProducts from "../components/RenderSpecificProducts";

const SortimentPage = () => {
  const { category } = useParams();
  const { products } = useOutletContext();

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
          <div key={subCategory}>
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
