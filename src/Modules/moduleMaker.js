import ShippingQuoteModule from "./shippingCalculator/index.js";
import InventoryModule from "./Inventory/InventoryModule.js";

export default {
  ShippingQuote: new ShippingQuoteModule(),
  ShippingQuoteDescriptor: ShippingQuoteModule.descriptor,
  InventoryModule: new InventoryModule(),
  InventoryModuleDescriptor: InventoryModule.descriptor,
};
