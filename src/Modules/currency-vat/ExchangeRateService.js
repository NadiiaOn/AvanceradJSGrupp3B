export class ExchangeRateService {
  constructor() {
    this.cache = new Map();
  }

  async getRate(valuta) {
    if (!this.isValid(valuta)) {
      try {
        const response = await fetch("/api/currency");

        if (!response.ok) {
          throw new Error("Error: Kunde inte hämta valutorna från servern!");
        }

        const data = await response.json();

        const currencyObject = data.find((val) => val.currency === valuta);
        const rate = currencyObject.rate;
        this.addRate(valuta, rate);
        return rate;
      } catch (error) {
        throw new Error("Kunde inte hämta växelkursen, försök igen senare");
      }
    } else {
      const object = this.cache.get(valuta);
      return object.rate;
    }
  }

  addRate(valuta, rate) {
    const timestamp = Date.now();
    this.cache.set(valuta, { rate, timestamp });
  }

  isValid(valuta) {
    if (this.cache.has(valuta)) {
      const yes = this.cache.get(valuta);
      const time = Date.now() - yes.timestamp;

      if (time > 3 * 60 * 1000) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
