import { ExchangeRateService } from "./exchangeRateService";
import { Money } from "./money";
import { Vat } from "./Vat";

export default class CurrencyVatModule {
  constructor() {
    this.exchangeRateService = new ExchangeRateService();
    this.vat = new Vat();
  }

  static descriptor = {
    name: "CurrencyVat",
    methodsAndInputs: [
      {
        method: "run",
        input: [
          "price - produktens grundpris i USD",
          "category - produktens varukategori",
          "targetCurrency - vald visningsvaluta (SEK, EUR eller USD)",
        ],
        output: "ett formaterat pris inklusive moms i vald valuta",
      },

      {
        method: "getFormattedTax",
        input: [
          "price - produktens grundpris i USD",
          "category - produktens varukategori",
          "targetCurrency - vald visningsvaluta (SEK, EUR eller USD)",
        ],
        output: "formaterad moms i vald valuta",
      },
    ],
  };

  async run(values) {
    const money = new Money(values.price, "USD");
    const sum = this.vat.addTax(money, values.category);
    const rate = await this.exchangeRateService.getRate(values.targetCurrency);
    const newMoney = sum.convertTo(values.targetCurrency, rate);
    const final = newMoney.format();
    return final;
  }

  async getRawPrice(values) {
    const money = new Money(values.price, "USD");
    const rate = await this.exchangeRateService.getRate(values.targetCurrency);
    const newMoney = money.convertTo(values.targetCurrency, rate);
    return newMoney.price;
  }

  async getFormattedTax(values) {
    const money = new Money(values.price, "USD");
    const taxAmount = this.vat.getTaxAmount(money, values.category);
    const rate = await this.exchangeRateService.getRate(values.targetCurrency);
    const newMoney = taxAmount.convertTo(values.targetCurrency, rate);
    const final = newMoney.format();
    return final;
  }

  async getTaxRawAmount(values) {
    const money = new Money(values.price, "USD");
    const taxAmount = this.vat.getTaxAmount(money, values.category);
    const rate = await this.exchangeRateService.getRate(values.targetCurrency);
    const newMoney = taxAmount.convertTo(values.targetCurrency, rate);
    return newMoney.price;
  }

  formatAmount(amount, currencyCode) {
    return new Money(amount, currencyCode).format();
  }
}
