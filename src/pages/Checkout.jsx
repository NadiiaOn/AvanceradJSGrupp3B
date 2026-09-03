import { useCart } from "../context/CartContext";
import { Link } from "react-router";

export default function Checkout() {
  const { cartItems, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center p-8 text-text">
        <h1 className="text-2xl font-bold font-heading mb-4">Kassan</h1>
        <p className="font-body">Din varukorg är tom.</p>
        <Link to="/" className="mt-4 underline font-body">
          Fortsätt handla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-text font-body">
      <h1 className="text-2xl font-bold font-heading mb-6">Kassan</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Vänster kolumn, produkter med bilder */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-text/10 pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-text/60">
                    Antal: {item.quantity}
                  </p>
                  <p className="text-sm text-text/60">
                    ${item.price.toFixed(2)} / st
                  </p>
                </div>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Höger kolumn, kompakt sammanfattning utan bilder typ som ett kvitto*/}
        <div className="w-full lg:w-80 bg-card rounded-lg p-6 sticky top-8">
          <h2 className="text-lg font-bold font-heading mb-4">Sammanfattning</h2>

          <div className="flex flex-col gap-2 mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-text/70"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm mb-2 border-t border-text/10 pt-4">
            <span>Delsumma</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-text/60">
            <span>Frakt</span>
            <span>FRAKTMODULEN</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t border-text/10 pt-4 mb-6">
            <span>Totalt</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button className="bg-cta text-bg w-full py-3 rounded font-semibold hover:opacity-90 transition-opacity">
            Bekräfta köp
          </button>
        </div>
      </div>
    </div>
  );
}