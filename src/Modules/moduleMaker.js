import ShippingQuoteModule from "./shippingCalculator/Index.js";
import CurrencyVatModule from "./currency-vat/index.js";
import InventoryModule from "./Inventory/index.js";
import DiscountCampaignsModule from "./Nadiia/index.js";

export default {
  ShippingQuote: new ShippingQuoteModule(),
  ShippingQuoteDescriptor: ShippingQuoteModule.descriptor,
  CurrencyVatModule: new CurrencyVatModule(),
  CurrencyVatModuleDescriptor: CurrencyVatModule.descriptor,
  InventoryModule: new InventoryModule(),
  InventoryModuleDescriptor: InventoryModule.descriptor,
  DiscountCampaignsModule: new DiscountCampaignsModule(),
  DiscountCampaignsModuleDescriptor: DiscountCampaignsModule.descriptor,
};
