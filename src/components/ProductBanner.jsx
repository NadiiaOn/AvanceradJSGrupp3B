import { useNavigate } from "react-router";

const ProductBanner = ({ banner }) => {
  const navigate = useNavigate();

  return (
    <section className="flex justify-center gap-4 py-10 px-5 mx-auto text-bg">
      {banner.map((item, idx) => {
        return (
          <div key={idx} className="relative group shadow-2xl cursor-pointer">
            <img
              src={item.img}
              className="h-70 md:h-90 w-80 md:w-110 lg:w-140"
              alt={item.name}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/60" />

            {/* Content */}
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
              <p className="text-3xl font-bold mt-10 p-1 border border-dashed w-40 sm:w-50">
                {item.text}
              </p>

              <button
                onClick={() => navigate(`${item.path}`)}
                className="relative top-12 rounded-sm bg-button text-text p-2 font-semibold transition-all duration-300 cursor-pointer group-hover:animate-pulse"
              >
                {item.cta}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ProductBanner;
