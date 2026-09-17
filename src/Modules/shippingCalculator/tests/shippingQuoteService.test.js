import { describe, test, expect } from 'vitest';
import { ShippingQuoteService } from '../ShippingQuoteService.js';
import { Parcel } from '../Parcel.js';
import { NoCarriersAvailableError, CarrierFetchError } from '../Errors.js';

const sampleCarriers = [
  { id: 'postnord', name: 'PostNord', pricingType: 'weight', estimatedDays: 3,
    pricingParams: { baseFeeUsd: 5, pricePerKgUsd: 1.2 } },
  { id: 'dhl', name: 'DHL', pricingType: 'volumetric', estimatedDays: 2,
    pricingParams: { baseFeeUsd: 3, pricePerKgUsd: 1.8, volumetricDivisor: 5000 } },
  { id: 'budbee', name: 'Budbee', pricingType: 'zone', estimatedDays: 1,
    pricingParams: {
      zonePrices: { nordics: { baseFeeUsd: 4, pricePerKgUsd: 1 } },
      countryToZone: { SE: 'nordics' },
    } },
];

function fakeFetch(carriers = sampleCarriers, { ok = true, status = 200 } = {}) {
  return async () => ({
    ok, status, statusText: ok ? 'OK' : 'Error',
    json: async () => carriers,
  });
}

describe('ShippingQuoteService', () => {
  test('getQuotes returns a list sorted by price', async () => {
    const service = new ShippingQuoteService();
    const parcel = new Parcel(3, 20, 20, 20);
    const { quotes } = await service.getQuotes(parcel, { country: 'SE' }, { fetchImpl: fakeFetch() });

    expect(quotes.length).toBe(3);
    for (let i = 1; i < quotes.length; i++) {
      expect(quotes[i].priceUsd).toBeGreaterThanOrEqual(quotes[i - 1].priceUsd);
    }
  });

  test('carrier cache is reused within TTL (fetch is called only once)', async () => {
    let callCount = 0;
    const fetchImpl = async () => {
      callCount++;
      return { ok: true, status: 200, statusText: 'OK', json: async () => sampleCarriers };
    };
    const service = new ShippingQuoteService({ cacheTtlMs: 60_000 });
    const parcel = new Parcel(1, 10, 10, 10);

    await service.getQuotes(parcel, { country: 'SE' }, { fetchImpl });
    await service.getQuotes(parcel, { country: 'SE' }, { fetchImpl });

    expect(callCount).toBe(1);
  });

  test('quoteHistory grows with every successful quote request', async () => {
    const service = new ShippingQuoteService();
    const parcel = new Parcel(1, 10, 10, 10);
    const parcel2 = new Parcel(12, 11, 11, 11);

    await service.getQuotes(parcel, { country: 'SE' }, { fetchImpl: fakeFetch() });
    await service.getQuotes(parcel2, { country: 'SE' }, { fetchImpl: fakeFetch() });

    expect(service.quoteHistory.length).toBe(2);
  });

  test('throws CarrierFetchError on a non-ok response', async () => {
    const service = new ShippingQuoteService();
    const parcel = new Parcel(1, 10, 10, 10);

    await expect(
      service.getQuotes(parcel, { country: 'SE' }, {
        fetchImpl: fakeFetch([], { ok: false, status: 500 }),
      })
    ).rejects.toThrow(CarrierFetchError);
  });

  test('throws NoCarriersAvailableError if no carrier covers the destination', async () => {
    const zoneOnly = [sampleCarriers[2]];
    const service = new ShippingQuoteService();
    const parcel = new Parcel(1, 10, 10, 10);

    await expect(
      service.getQuotes(parcel, { country: 'US' }, { fetchImpl: fakeFetch(zoneOnly) })
    ).rejects.toThrow(NoCarriersAvailableError);
  });
});