import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router";
import { useCartTotal } from "../hooks/useCartTotals.js";
import { buildParcelValues } from "../utils/shippingHelper.js";
import ShippingOptions from "../components/ShippingOptions.jsx";
import useShippingPrice from "../hooks/useShippingPrice.js";
import Module from "../Modules/ModuleMaker.js";

// Enkel e-post validering.
// Dvs något@något.något
// Måste innehålla @ och minst en punkt, i rätt ordning
// Där "något" ej får vara @ eller blankspace.
// Efter "." minst 2 st tecken.
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
}

//Validering av user input for discountCode
function isValidDiscountCode(discountCode) {
  const enteredCode = String(discountCode ?? "")
    .trim()
    .toUpperCase();
  return /^[A-ZÅÄÖ]{3}\d{4}$/.test(enteredCode);
}

export default function Checkout() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const [shippingResult, setShippingResult] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  const [selectedCarrierId, setSelectedCarrierId] = useState(null);

  const [discountResult, setDiscountResult] = useState(null);
  const [discountSavings, setDiscountSavings] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [codeFeedback, setCodeFeedback] = useState(null);

  // Den fullständiga offerten som matchar användarens val (eller null om
  // inget beräknat/valt än).
  const selectedQuote = shippingResult?.quotes.find(
    (q) => q.carrierId === selectedCarrierId,
  );

  const rawShipping = selectedQuote?.priceUsd ?? null;

  const {
    formattedPrices,
    rowTotals,
    taxTotal,
    rawSubtotal,
    currency,
    convertedTotal,
    convertedSavings,
    convertedProductDiscounts,
  } = useCartTotal(
    cartItems,
    totalPrice,
    rawShipping,
    discountSavings,
    discountResult?.appliedCampaigns,
  );

  const emailIsValid = isValidEmail(email);

  const formattedTax = Module.CurrencyVatModule.formatAmount(
    taxTotal,
    currency,
  );

  const formattedSubtotal = Module.CurrencyVatModule.formatAmount(
    rawSubtotal,
    currency,
  );

  const formattedTotalPrice = Module.CurrencyVatModule.formatAmount(
    convertedTotal,
    currency,
  );

  const [destinationCountry, setDestinationCountry] = useState("");

  const countryOptions = Module.ShippingQuoteDescriptor.fields.find(
    (field) => field.name === "destinationCountry",
  ).options;

  const formattedShippingPrice = useShippingPrice(
    selectedQuote?.priceUsd ?? null,
  );

  const totaltMedRabatt = totalPrice - discountSavings + taxTotal;

  const formattedTotaltMedRabatt = Module.CurrencyVatModule.formatAmount(
    totaltMedRabatt,
    currency,
  );
  //const totaltMedRabatt = Math.round((totalPrice - (discountSavings ?? 0)) * 100) / 100;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value);
    setCodeFeedback(null);
  };

  const handleCalculateShipping = async () => {
    if (!destinationCountry) return;

    setShippingLoading(true);
    setShippingError(null);

    try {
      const values = {
        ...buildParcelValues(cartItems),
        destinationCountry,
      };
      const result = await Module.ShippingQuote.run(values);
      setShippingResult(result);
      setSelectedCarrierId(result.cheapest.carrierId); // förvalt: billigast
    } catch (err) {
      setShippingError(err.message);
      setShippingResult(null);
      setSelectedCarrierId(null);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!emailIsValid) return;
    // TODO: skicka order, spara i databas uppdatera saldo osv...
    console.log("Order skickad med e-post:", email);
  };

  const handleCampaign = async () => {
    const enteredCode = discountCode.trim();

    if (enteredCode && !isValidDiscountCode(enteredCode)) {
      setCodeFeedback({
        type: "error",
        text: "Ogiltigt format. Exempel: AUG2026",
      });
      return;
    }

    const result = await Module.DiscountCampaignsModule.run({
      cartItems,
      discountCode,
    });

    console.log("Kod:", enteredCode || "(tom)", {
      errorType: result.errorType,
      message: result.message,
      savings: result.savings,
      campaigns: result.appliedCampaigns,
    });

    setDiscountResult(result);
    setDiscountSavings(Number(result.savings));

    if (!enteredCode) {
      setCodeFeedback(null);
    } else if (result.errorType) {
      setCodeFeedback({ type: "error", text: result.message });
    } else {
      setCodeFeedback({
        type: "ok",
        text: "Rabattkoden är tillagd.",
      });
    }
  };

  const formattedSavings = Module.CurrencyVatModule.formatAmount(
    convertedSavings,
    currency,
  );

  useEffect(() => {
    handleCampaign();
  }, [cartItems]);

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
          {cartItems.map((item) => {
            const productDiscount = discountResult?.appliedCampaigns.find(
              (campaign) => campaign.id === String(item.id),
            );

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-text/10 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-text/60">
                      {formattedPrices[item.id]} / st
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 border border-text/20 rounded cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
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
                        className="ml-2 text-xs text-cta cursor-pointer"
                      >
                        Ta bort
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{rowTotals[item.id]}</p>
                  {productDiscount && (
                    <p className="font-semibold text-red-400">
                      {Module.CurrencyVatModule.formatAmount(
                        convertedProductDiscounts[item.id] ?? 0,
                        currency,
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Höger kolumn, kompakt sammanfattning utan bilder typ som ett kvitto*/}
        <div className="w-full lg:w-80 bg-card rounded-lg p-6 sticky top-30">
          <h2 className="text-lg font-bold font-heading mb-4">
            Sammanfattning
          </h2>

          <div className="flex flex-col gap-2 mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-text/70"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{rowTotals[item.id]}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm mb-2 border-t border-text/10 pt-4">
            <span>Delsumma</span>
            <span>{formattedSubtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-4 text-text/60">
            <span>Moms</span>
            <span>{formattedTax}</span>
          </div>

          <div className="flex justify-between text-sm mb-2 border-t border-text/10 pt-4">
            <span className="text-olive bold"> Rabatt: </span>
            <span className="text-olive bold">{formattedSavings}</span>
          </div>

          <div className="flex justify-between text-sm mb-4 text-text/60">
            <span>Frakt</span>
            <span>
              {selectedQuote
                ? `${formattedShippingPrice} (${selectedQuote.carrierName})`
                : "Ej beräknad"}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t border-text/10 pt-4 mb-6">
            <span>Totalt</span>
            <span>{formattedTotalPrice}</span>
          </div>

          <div className="flex justify-between items-center font-bold text-lg border-t border-text/10 pt-4 mb-6">
            <span>
              Totalt <br /> med rabatt{" "}
            </span>
            <span>{formattedTotaltMedRabatt}</span>
          </div>

          {/* MAIL */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-1 text-text/70">
              E-postadress
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setTouched(true)}
              placeholder="namn@exempel.se"
              className={`w-full p-2 rounded border bg-bg text-text outline-none ${
                touched && !emailIsValid ? "border-red-500" : "border-text/20"
              }`}
            />
            {touched && !emailIsValid ? (
              <p className="text-red-500 text-xs mt-1">
                Ange en giltig e-postadress (namn@mail.se).
              </p>
            ) : null}
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label
              htmlFor="discount"
              className="block text-sm mb-1 text-text/70"
            >
              Rabatt kod
            </label>
            <input
              id="discount"
              type="text"
              value={discountCode}
              onChange={handleDiscountChange}
              placeholder="AUG2026"
              className={`w-full p-2 rounded border bg-bg text-text outline-none ${codeFeedback?.type === "error" ? "border-black text-red-400" : "border-black text-olive"}`}
            />
            {codeFeedback && (
              <p
                className={`text-xs mt-1 ${codeFeedback.type === "error" ? "text-red-400" : "text-olive"}`}
              >
                {codeFeedback.text}{" "}
              </p>
            )}

            <button
              onClick={handleCampaign}
              className="w-full mt-2 py-2 rounded border border-black bg-bg text-olive cursor-pointer hover:bg-text/5"
            >
              Bekräfta rabatten
            </button>
          </div>

          <ShippingOptions
            countryOptions={countryOptions}
            destinationCountry={destinationCountry}
            setDestinationCountry={setDestinationCountry}
            onCalculate={handleCalculateShipping}
            loading={shippingLoading}
            error={shippingError}
            quotes={shippingResult?.quotes}
            selectedCarrierId={selectedCarrierId}
            onSelectCarrier={setSelectedCarrierId}
            currency={currency}
          />

          <button
            onClick={handleSubmit}
            disabled={!emailIsValid}
            className={`w-full py-3 rounded font-semibold transition-opacity ${
              emailIsValid
                ? "bg-cta text-bg hover:opacity-90 cursor-pointer"
                : "bg-cta/40 text-bg/70 cursor-not-allowed"
            }`}
          >
            Bekräfta köp
          </button>
        </div>
      </div>
    </div>
  );
}
