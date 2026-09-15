import { InvalidDestinationError, UnsupportedDestinationError } from "./Errors.js";

/**
 * Varje strategi implementerar samma "protokoll":
 * calculate(parcel, destination) -> pris i USD (number)
 * Carrier äger INTE en av dessa via arv utan den får en instans injicerad. 
 * Det gör att flera olika transportörer kan dela exakt
 * samma prislogik, och nya prismodeller kan läggas till utan att röra Carrier-klassen.
 */

export class WeightBasedPricing {
  constructor({baseFeeUsd, pricePerKgUsd }) {
    this.baseFeeUsd = baseFeeUsd;
    this.pricePerKgUsd = pricePerKgUsd;
  }

  calculate(parcel /* , destination */) {
    return this.baseFeeUsd + parcel.weightKg * this.pricePerKgUsd;
  }
}

export class VolumetricPricing {
  constructor({ baseFeeUsd, pricePerKgUsd, volumetricDivisor = 5000 }) {
    this.baseFeeUsd = baseFeeUsd;
    this.pricePerKgUsd = pricePerKgUsd;
    this.volumetricDivisor = volumetricDivisor;
  }

  calculate(parcel /* , destination */) {
    const chargeableWeightKg = parcel.chargeableWeightKg(this.volumetricDivisor);
    return this.baseFeeUsd + chargeableWeightKg * this.pricePerKgUsd;
  }
}

export class ZoneBasedPricing {
  constructor({ zonePrices, countryToZone }) {
    this.zonePrices = zonePrices;
    this.countryToZone = countryToZone;
  } 

  calculate(parcel, destination) {
    if (!destination || !destination.country) {
      throw new InvalidDestinationError('Destination saknar land.', { destination });
    }
    const zone = this.countryToZone[destination.country];
    if (!zone || !this.zonePrices[zone]) {
      throw new UnsupportedDestinationError(
        `Destinationen "${destination.country}" täcks inte av denna transportör.`,
        { country: destination.country }
      );
    }
    const { baseFeeUsd, pricePerKgUsd } = this.zonePrices[zone];
    return baseFeeUsd + parcel.weightKg * pricePerKgUsd;
  }
}
