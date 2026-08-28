import { useEffect, useRef, useState } from "react";
import ProductCard from "./productCard";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

const MAX_PRODUCTS = 8;
const GAP = 0.5;

const Carousel = ({ products, errorMessage }) => {
  const [startIdx, setStartIdx] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [cardWidth, setCardWidth] = useState(15);

  const viewportRef = useRef(null);

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }

    const updateCarousel = () => {
      if (!viewportRef.current) {
        return;
      }

      const viewportWidth = viewportRef.current.clientWidth;

      let visible;

      if (viewportWidth >= 1000) {
        visible = 4;
      } else if (viewportWidth >= 750) {
        visible = 3;
      } else if (viewportWidth >= 500) {
        visible = 2;
      } else {
        visible = 1;
      }

      const gap = 8;
      const newCardWidth = (viewportWidth - gap * (visible - 1)) / visible;

      setItemsVisible(visible);
      setCardWidth(newCardWidth / 16);
    };

    updateCarousel();

    const observer = new ResizeObserver(updateCarousel);

    observer.observe(viewportRef.current);

    return () => observer.disconnect();
  }, [errorMessage, products]);

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-2 mx-auto py-10 px-10 text-lg">
        <span className="text-red-500 font-bold">{errorMessage}</span>

        <span className="text-text">
          <b>Komponent:</b> <i>Carousel-komponenten</i>
        </span>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const limitedProducts = products.slice(0, MAX_PRODUCTS);

  const goPrev = startIdx > 0;

  const goNext = startIdx + itemsVisible < limitedProducts.length;

  const handlePrev = () => {
    if (goPrev) {
      setStartIdx((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
    if (goNext) {
      setStartIdx((prev) => prev + 1);
    }
  };

  return (
    <section className="flex items-center gap-4 w-full max-w-7xl mx-auto py-10 px-5 sm:px-10">
      {/* Left button */}
      <div className="w-14 shrink-0 flex justify-center">
        {goPrev && (
          <button
            onClick={handlePrev}
            className="p-4 rounded-full bg-text text-bg cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <CaretLeftIcon />
          </button>
        )}
      </div>

      {/* Product-view */}
      <div ref={viewportRef} className="flex-1 min-w-0 overflow-hidden">
        <div
          className="flex gap-2 transition-transform duration-500"
          style={{
            transform: `translateX(-${startIdx * (cardWidth + GAP)}rem)`,
          }}
        >
          {limitedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              width={cardWidth}
              height={13}
            />
          ))}
        </div>
      </div>

      {/* Right button */}
      <div className="w-14 shrink-0 flex justify-center">
        {goNext && (
          <button
            onClick={handleNext}
            className="p-4 rounded-full bg-text text-bg cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <CaretRightIcon />
          </button>
        )}
      </div>
    </section>
  );
};

export default Carousel;
