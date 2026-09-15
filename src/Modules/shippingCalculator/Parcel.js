import { InvalidParcelError } from './Errors.js';

export class Parcel {
    #weightKg;
    #lengthCm;
    #widthCm;
    #heightCm;

    constructor( weightKg, lengthCm, widthCm, heightCm ) {
        const values = { weightKg, lengthCm, widthCm, heightCm };

        for (const [name, value] of Object.entries(values)) {
            if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
                throw new InvalidParcelError (
                    `Ogiltligt värde för "${name}": måste vara ett positivt tal, fick ${JSON.stringify(value)}.`,
                    { field: name, value }
                );
            }
        }

        this.#weightKg = weightKg;
        this.#lengthCm = lengthCm;
        this.#widthCm = widthCm;
        this.#heightCm = heightCm;
    }

    get weightKg() { return this.#weightKg; }
    get lengthCm() { return this.#lengthCm; }
    get widthCm() { return this.#widthCm; }
    get heightCm() { return this.#heightCm; }

    volumeCm3() {
        return this.#lengthCm * this.#widthCm * this.#heightCm;
    }

    volumetricWeightKg(divisor = 5000) {
        return this.volumeCm3() / divisor;
    }

    chargeableWeightKg(divisor = 5000) {
        return Math.max(this.#weightKg, this.volumetricWeightKg(divisor));
    }
}
