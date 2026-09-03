import { HeartIcon } from "@phosphor-icons/react";
import { useOutletContext, useParams } from "react-router";
import Carousel from "../components/carousel";
import CategoryButtons from "../components/categoryButtons";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { products, productsByCategory, errorMessage } = useOutletContext();
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((product) => product.id === Number(id));

  const relatedProducts = products
    .filter((merch) => merch.category === product.category)
    .filter((merch) => merch.id !== product.id);

  if (!product) {
    return <p>Produkten hittades inte</p>;
  }

  return (
    <div className="min-h-screen bg-bg text-text font-body px-2 py-2">
      <div className="bg-olive flex justify-center text-heading text-2xl font-semibold text-white">
        REA
      </div>

      {/* Uppdatera med knapparna */}
      <CategoryButtons />

      {/* Produkt div*/}

      <div className="mt-5">
        <div
          key={product.id}
          className="product-card flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden"
        >
          <div className="product-image w-full md:w-[60%] flex items-center justify-center p-6">
            <img src={product.images?.[0] ?? "/placeholder.png"} />
          </div>
          <div className="product-details w-full md:w-[40%] p-8 flex flex-col gap-3">
            <p className="product-brand text-sm uppercase font-bold mb-10">
              Brand: {product.brand ?? "Information saknas"}
            </p>
            <h3 className="product-name font-heading text-4xl mb-10">
              {product.title ?? "Information saknas"}
            </h3>
            <p className="product-description text-xl opacity-75 mb-10 ">
              {product.description ?? "Information saknas"}
            </p>
            <p className="product-price font-heading text-2xl font-semibold mb-10">
              ${product.price ?? "Information saknas"}
            </p>
            <p className="product-delivery text-sm opacity-75 mb-2">
              Delivery: {product.shippingInformation ?? "Information saknas"}
            </p>
            <p className="product-discount text-xl text-cta font-semibold mb-2">
              Discount: {product.discountPercentage ?? "Information saknas"}%
            </p>
            <p className="product-stock text-sm" hidden>
              Stock: {product.stock ?? "Information saknas"}
            </p>
            <p className="product-availability-status text-sm opacity-75 mb-2">
              Availability: {product.availabilityStatus ?? "Information saknas"}
            </p>
            <div className="flex flex-row items-center gap-2 mb-2">
              <p className="product-rating text-sm w-full md:w-[40%] font-body">
                Rating: {product.rating ?? "Rating saknas"}
              </p>
              <button
                onClick={() => {
                  const reviewsSection =
                    document.getElementById("productReviews");
                  if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="all-reviews gap-2 p-2 rounded-md text-[14px] text-text text-sm w-full md:w-[60%] underline cursor-pointer hover:text-olive"
              >
                {product.reviews?.length ?? 0} reviews
              </button>
            </div>

            <p className="product-return-policy text-sm opacity-75 mb-5">
              Return Policy: {product.returnPolicy ?? "Ingen returpolicy"}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="add-to-cart bg-cta gap-2 p-2 rounded-md text-white text-[20px] cursor-pointer hover:bg-olive"
            >
              Add to cart
            </button>
            <div className="flex flex-row ">
              <button className="buy bg-cta gap-2 p-2 rounded-md text-white text-[20px] w-full md:w-[80%] cursor-pointer hover:bg-olive">
                Buy
              </button>
              <button className="favorites bg-cta gap-2 rounded-md text-white text-[20px] w-full md:w-[15%] ml-10 flex items-center justify-center cursor-pointer hover:bg-olive">
                <HeartIcon weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-lg font-bold text-[28px] mb-4 mt-4 font-heading ">
        Frequently bought together
      </h4>

      <Carousel products={relatedProducts} errorMessage={errorMessage} />

      <div
        id="productReviews"
        className="p-2 rounded-lg font-body sm:text-[20px] text-text"
      >
        <h4 className="text-lg font-bold text-[28px] mb-4 mt-4 font-heading">
          Reviews
        </h4>
        {product.reviews?.map((review, index) => (
          <div
            key={index}
            className="flex flex-col mb-4 p-4 rounded-lg bg-card"
          >
            <p>Reviewer: {review.reviewerName}</p>
            <p className="overflow-wrap break-words">
              Reviewer Email: {review.reviewerEmail ?? "E-post saknas"}
            </p>
            <p>Comment: {review.comment ?? "Ingen kommentar"} </p>
            <p>Rating: {review.rating ?? "Ingen rating"} </p>
            <p>Date: {new Date(review.date).toLocaleDateString("sv-SE")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
