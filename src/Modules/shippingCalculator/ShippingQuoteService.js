import { Carrier } from "./Carrier.js";
import {
  CarrierFetchError,
  NoCarriersAvailableError,
  UnsupportedDestinationError,
} from "./Errors.js";

// Cache för att inte behöva anropa api/carriers en gång för varje carrier
// 1 anrop är cachat (sparat) i 60 sekunder.
const DEFAULT_CACHE_TTL_MS = 60_000;

/**
 *  "Frågar" varje transportör om en offert, och sorterar resultatet på pris.
 *
 *    carrierCache: undviker att slå /api/carriers vid varje enskild
 *    offertförfrågan (transportörslistan ändras sällan under en session).
 *    quoteHistory: en logg över gjorda offertförfrågningar, användbar
 *    t.ex. för felsökning.
 */
export class ShippingQuoteService {
  #carrierCache = null;
  #quoteHistory = [];
  #cacheTtlMs;

  constructor({ cacheTtlMs = DEFAULT_CACHE_TTL_MS } = {}) {
    this.#cacheTtlMs = cacheTtlMs;
  }

  get quoteHistory() {
    return [...this.#quoteHistory];
  }

  #isCacheValid() {
    if (!this.#carrierCache) return false;
    return Date.now() - this.#carrierCache.fetchedAt < this.#cacheTtlMs;
  }

  /**
   * 
   * @param {*} fetchImpl fetch funktion att använda för anropet 
   *                      (global fetch i produktion, en mockad funktion i tester).
   * @param {*} apiUrl URL där datan ska hämtas
   * @returns en array med Carrier(s).
   */
  async #fetchCarriers(fetchImpl, apiUrl) {
    if (this.#isCacheValid()) {
      return this.#carrierCache.carriers;
    }

    let response;
    try {
      response = await fetchImpl(apiUrl);
    } catch (err) {
      throw new CarrierFetchError(`Kunde inte nå ${apiUrl}: ${err.message}`, {
        cause: err,
      });
    }

    if (!response.ok) {
      throw new CarrierFetchError(
        `Transportör-API svarade med status ${response.status} ${response.statusText}.`,
        { status: response.status },
      );
    }

    const rawList = await response.json();
    const carriers = rawList.map((rawCarrier) =>
      Carrier.fromApiData(rawCarrier),
    );
    this.#carrierCache = { carriers, fetchedAt: Date.now() };
    return carriers;
  }

  /**
   * @param {Parcel} parcel
   * @param {{country: string, postalCode?: string}} destination
   * @param {{fetchImpl?: Function, apiUrl?: string, carrierIds?: string[]|null}} options
   * @returns {Promise<{quotes: object[], skipped: object[]}>}
   */
  async getQuotes(
    parcel,
    destination,
    { fetchImpl = fetch, apiUrl = "/api/carriers", carrierIds = null } = {},
  ) {
    const carriers = await this.#fetchCarriers(fetchImpl, apiUrl);
    const relevantCarriers = carrierIds
      ? carriers.filter((c) => carrierIds.includes(c.id))
      : carriers;

    const quotes = [];
    const skipped = [];

    for (let i = 0; i < relevantCarriers.length; i++) {
      const carrier = relevantCarriers[i];
      try {
        quotes.push(carrier.calculateQuote(parcel, destination));
      } catch (err) {
        if (err instanceof UnsupportedDestinationError) {
          // En transportör som inte täcker destinationen ska inte stoppa hela förfrågan
          // Läggs till i skipped och fortsätter
          skipped.push({ carrierId: carrier.id, reason: err.message });
          continue;
        }
        throw err;
      }
    }

    if (quotes.length === 0) {
      throw new NoCarriersAvailableError(
        "Ingen transportör kunde lämna en offert för denna destination/paket.",
        { skipped },
      );
    }

    quotes.sort((a, b) => a.priceUsd - b.priceUsd);

    this.#quoteHistory.push({
      timestamp: new Date().toISOString(),
      parcel: {
        weightKg: parcel.weightKg,
        chargeableWeightKg: parcel.chargeableWeightKg(),
      },
      destination,
      resultCount: quotes.length,
      cheapest: quotes[0],
    });

    return { quotes, skipped };
  }
}
