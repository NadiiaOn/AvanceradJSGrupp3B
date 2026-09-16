import { describe, test, expect } from 'vitest';
import { Parcel } from '../Parcel.js';
import { InvalidParcelError } from '../Errors.js';

describe('Parcel', () => {
    test('beräknar volymen korrekt', () => {
        const parcel = new Parcel(2, 10, 20, 30);
        expect(parcel.volumeCm3()).toBe(6000);
    });

    test('Beräknar volymvikten med divisorn på 5000', () => {
        const parcel = new Parcel(1, 50, 40, 30);
        expect(parcel.volumetricWeightKg()).toBe(12)
    });

    test('Kollar så att chargableWeight tar det högtsa värdet av vikt/volym (förväntat: volym)', () => {
        const lightParcel = new Parcel(1, 50, 40, 30);
        expect(lightParcel.chargeableWeightKg()).toBe(12);
    });

    test('Kollar så att chargableWeight tar det högtsa värdet av vikt/volym (förväntat: vikt)', () => {
        const heavyParcel = new Parcel(13, 50, 40, 30);
        expect(heavyParcel.chargeableWeightKg()).toBe(13);
    });

    test('Kollar så att InvalidParcelError kastas vid negativ vikt.', () => {
        expect(() => new Parcel(-10, 12, 12, 12)).toThrow(InvalidParcelError);
    });

    test('Kollar så att InvalidParcelError kastas vid icke numeriskt värde på vikt.', () => {
        expect(() => new Parcel("ICKE ETT NUMMER", 12, 12, 12)).toThrow(InvalidParcelError);
    });

    test('Kollar så att InvalidParcelError kastas vid icke numeriskt värde på mått.', () => {
        expect(() => new Parcel(10, "ICKE ETT NUMMER", 12, 12)).toThrow(InvalidParcelError);
    });
});