import { describe, test, expect } from 'vitest';
import { Parcel } from '../Parcel.js';
import { WeightBasedPricing, VolumetricPricing, ZoneBasedPricing } from '../PricingStrategies.js';
import { UnsupportedDestinationError } from '../Errors.js';

describe('WeightBasedPricing', () => {
  test('räknar baseFee + pris * faktisk vikt', () => {
    const strategy = new WeightBasedPricing({ baseFeeUsd: 49, pricePerKgUsd: 10 });
    const parcel = new Parcel(3, 10, 10, 10);
    expect(strategy.calculate(parcel)).toBe(79);
  });
});

describe('VolumetricPricing', () => {
  test('använder debiterbar vikt (volymvikt när den är störst)', () => {
    const strategy = new VolumetricPricing({ baseFeeUsd: 0, pricePerKgUsd: 10, volumetricDivisor: 5000 });
    const parcel = new Parcel(1, 50, 40, 30);
    expect(strategy.calculate(parcel)).toBe(120);
  });
});

describe('ZoneBasedPricing', () => {
  test('hittar rätt zon via land', () => {
    const strategy = new ZoneBasedPricing({
      zonePrices: { nordics: { baseFeeUsd: 20, pricePerKgUsd: 5 } },
      countryToZone: { SE: 'nordics' },
    });
    const parcel = new Parcel(2, 10, 10, 10);
    expect(strategy.calculate(parcel, { country: 'SE' })).toBe(30);
  });

  test('kastar UnsupportedDestinationError för okänt land', () => {
    const strategy = new ZoneBasedPricing({ zonePrices: {}, countryToZone: {} });
    const parcel = new Parcel(2, 10, 10, 10);
    expect(() => strategy.calculate(parcel, { country: 'US' })).toThrow(UnsupportedDestinationError);
  });
});