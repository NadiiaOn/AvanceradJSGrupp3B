import ShippingQuoteModule from "./shippingCalculator/index.js";

export default {
  ShippingQuote: new ShippingQuoteModule(),
  ShippingQuoteDescriptor: ShippingQuoteModule.descriptor,

};