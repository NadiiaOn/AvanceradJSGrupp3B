import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { XIcon } from "@phosphor-icons/react";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    isCartOpen,
    closeCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 flex justify-end z-150">
      <div
        className="fixed inset-0 bg-text/40 z-200"
        onClick={() => closeCart()}
      />

      <div className="z-250">
        <div className="bg-bg text-text font-body w-full sm:w-[500px] h-full overflow-y-auto p-8">
          <button
            onClick={closeCart}
            className="text-sm text-text/60 mb-4 cursor-pointer bg-gray-200 rounded-full p-2"
          >
            <XIcon size={26} weight="thin" />
          </button>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold font-heading mb-4">
                Din varukorg
              </h1>
              <p>Varukorgen är tom.</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-heading mb-6">
                Din varukorg
              </h1>

              <div className="flex flex-col gap-4">
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
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 border border-text/20 rounded cursor-pointer"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 border border-text/20 rounded cursor-pointer"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-cta cursor-pointer"
                      >
                        Ta bort
                      </button>
                    </div>

                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sammanfattning */}
              <div className="mt-8 border-t border-text/10 pt-6">
                <h2 className="text-lg font-bold font-heading mb-4">
                  Sammanfattning
                </h2>

                <div className="flex justify-between text-sm mb-2">
                  <span>Delsumma</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4 text-text/60">
                  <span>Frakt</span>
                  <span>Beräknas i kassan</span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t border-text/10 pt-4 mb-6">
                  <span>Totalt</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="bg-cta text-bg w-full py-3 rounded font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Till kassan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
