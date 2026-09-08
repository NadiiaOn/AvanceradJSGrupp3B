export class Money {
  static VALID_CURRENCIES = ["SEK", "USD", "EUR"];
  constructor(price, currency) {
    this.price = price;
    this.currency = currency;
    this.validPrice(price);
    this.validCurrency(currency);
  }

  format() {
    if (this.currency === "SEK") {
      return this.price + "kr";
    } else if (this.currency === "USD") {
      return this.price + "$";
    } else if (this.currency === "EUR") {
      return this.price + "\u20AC";
    } else {
      throw new Error("Okänd valuta, kan inte formatera");
    }
  }

  convertTo(currency, rate) {
    const sum = this.price * rate;
    return new Money(sum, currency);
  }

  validPrice(price) {
    if (typeof price !== "number") {
      throw new Error("Priset måste vara ett tal");
    } else if (price < 0) {
      throw new Error("Priset kan inte vara negativt");
    }
  }

  validCurrency(currency) {
    if (Money.VALID_CURRENCIES.includes(currency)) {
    } else {
      throw new Error("Valutan finns inte som ett val");
    }
  }

  checkCurrency(currency) {
    if (currency !== this.currency) {
      throw new Error(
        `Valutan matchar inte: förväntade ${this.currency}, fick ${currency}`,
      );
    }
  }
}
