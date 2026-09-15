import ShippingQuoteModule from "../Modules/shippingCalculator/Index.js";
import CurrencyVatModule from "../Modules/currency-vat/index.js";
import InventoryModule from "../Modules/Inventory/index.js";

export default {
  ShippingQuote: new ShippingQuoteModule(),
  ShippingQuoteDescriptor: ShippingQuoteModule.descriptor,
  CurrencyVatModule: new CurrencyVatModule(),
  CurrencyVatModuleDescriptor: CurrencyVatModule.descriptor,
  InventoryModule: new InventoryModule(),
  InventoryModuleDescriptor: InventoryModule.descriptor,
};
