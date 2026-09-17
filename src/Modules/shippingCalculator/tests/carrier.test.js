import {describe, test, expect} from 'vitest';
import { Carrier } from '../Carrier.js';
import { ShippingModuleError } from '../Errors.js';

describe ('Carrier', () => {
    test('Kastar fel om id saknas', () => {
        expect(() => new Carrier({name: 'TEST', pricingStrategy: { calculate: () => 1}}))
            .toThrow(ShippingModuleError);
    });

    test('kastar fel om pricingStrategy saknar en calculate metod.', () => {
        expect(() => new Carrier({id: 'x', name: 'TEST', pricingStrategy: {fel: 'fel'}}))
            .toThrow(ShippingModuleError);
    });

    test('kastar fel vid okänd pricingType', () => {
        expect(() => Carrier.fromApiData({ id: 'x', name: 'Test', pricingType: 'felPrisTyp' }))
            .toThrow(ShippingModuleError);
    });

  test('bygger en fungerande Carrier från giltig viktdata', () => {
    const carrier = Carrier.fromApiData({
      id: 'postnord', name: 'PostNord', pricingType: 'weight', estimatedDays: 3,
      pricingParams: { baseFeeUsd: 5, pricePerKgUsd: 1.2 },
    });
    expect(carrier.id).toBe('postnord');
    expect(carrier.pricingType).toBe('weight');
  });

});