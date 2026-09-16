import { Parcel } from "./Parcel.js";
import { ShippingQuoteService } from "./ShippingQuoteService.js";
import { descriptor } from "./Descriptor.js";
import { InvalidDestinationError, ShippingModuleError } from "./Errors.js";

/**
 * Modulkontraktets ingångspunkt
 */
export default class ShippingQuoteModule {
  static descriptor = descriptor;

  #service;

  constructor() {
    this.#service = new ShippingQuoteService();
  }

  /** Historik över gjorda offertförfrågningar under modulens livstid. */
  get quoteHistory() {
    return this.#service.quoteHistory;
  }

  /**
   * @param {object} values
   * @param {{fetch?: Function, apiBaseUrl?: string}} [context]
   */
  async run(values, context = {}) {
    const parcel = this.#buildParcel(values);
    const destination = this.#buildDestination(values);

    const fetchImpl = context.fetch ?? fetch;
    const apiUrl = context.apiBaseUrl ?? "/api/carriers";

    try {
      const { quotes, skipped } = await this.#service.getQuotes(
        parcel,
        destination,
        {
          fetchImpl,
          apiUrl,
          carrierIds: values?.carrierIds?.length ? values.carrierIds : null,
        },
      );

      return {
        quotes,
        skippedCarriers: skipped,
        cheapest: quotes[0],
        chargeableWeightKg: parcel.chargeableWeightKg(),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      if (err instanceof ShippingModuleError) throw err;
      // Oväntade fel (buggar, nätverksfel som inte redan slagits in) görs
      // om till modulens egen felklass
      throw new ShippingModuleError(
        `Oväntat fel vid hämtning av fraktofferter: ${err.message}`,
        {
          code: "UNEXPECTED_ERROR",
          cause: err,
        },
      );
    }
  }

  #buildParcel(values) {
    const { weightKg, lengthCm, widthCm, heightCm } = values ?? {};
    return new Parcel(
      Number(weightKg),
      Number(lengthCm),
      Number(widthCm),
      Number(heightCm),
    );
  }

  #buildDestination(values) {
    if (!values?.destinationCountry) {
      throw new InvalidDestinationError("Mottagarland måste anges.", {
        values,
      });
    }
    return {
      country: values.destinationCountry,
    };
  }
}
