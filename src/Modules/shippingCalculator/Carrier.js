import { WeightBasedPricing, VolumetricPricing, ZoneBasedPricing } from './PricingStrategies.js';
import { ShippingModuleError } from './Errors.js';

const STRATEGY_BUILDERS = {
  weight: (params) => new WeightBasedPricing(params),
  volumetric: (params) => new VolumetricPricing(params),
  zone: (params) => new ZoneBasedPricing(params),
};

/**
 * En transportör: identitet (id/namn/leveranstid) + en injicerad
 * prisstrategi. Carrier vet inte HUR priset räknas ut, bara att
 * this.pricingStrategy.calculate(...) kan anropas.
 */
export class Carrier {
  constructor({ id, name, pricingStrategy, estimatedDays = null, currency = 'USD', pricingType = null }) {
    if (!id || !name) {
      throw new ShippingModuleError('Transportör saknar id eller namn.', {
        code: 'INVALID_CARRIER_CONFIG',
        details: { id, name },
      });
    }
    if (!pricingStrategy || typeof pricingStrategy.calculate !== 'function') {
      throw new ShippingModuleError(`Transportör "${name}" saknar giltig prisstrategi.`, {
        code: 'INVALID_CARRIER_CONFIG',
      });
    }
    this.id = id;
    this.name = name;
    this.pricingStrategy = pricingStrategy;
    this.estimatedDays = estimatedDays;
    this.currency = currency;
    this.pricingType = pricingType;
  }

  /** Bygger en Carrier-instans, hämtad från /api/carriers i "rå" JSON. */
  static fromApiData(rawCarrierData) {
    const build = STRATEGY_BUILDERS[rawCarrierData.pricingType];
    if (!build) {
      throw new ShippingModuleError(
        `Okänd prismodell "${rawCarrierData.pricingType}" för transportör "${rawCarrierData.name}".`,
        { code: 'UNKNOWN_PRICING_TYPE', details: { rawCarrierData } }
      );
    }
    return new Carrier({
      id: rawCarrierData.id,
      name: rawCarrierData.name,
      estimatedDays: rawCarrierData.estimatedDays,
      currency: rawCarrierData.currency,
      pricingType: rawCarrierData.pricingType,
      pricingStrategy: build(rawCarrierData.pricingParams ?? {}),
    });
  }

  /** Räknar ut en offert för ett paket till en destination. */
  calculateQuote(parcel, destination) {
    const price = this.pricingStrategy.calculate(parcel, destination);
    return {
      carrierId: this.id,
      carrierName: this.name,
      priceUsd: Math.round(price * 100) / 100,
      currency: this.currency,
      estimatedDays: this.estimatedDays,
      pricingType: this.pricingType
    };
  }
}