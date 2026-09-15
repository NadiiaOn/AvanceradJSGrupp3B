import { Money } from "./money";

export class Vat {
  static VAT_RATES = {
    Books: 0.06,
    Groceries: 0.12,
    Standard: 0.25,
  };

  addTax(money, category) {
    money.checkCurrency("USD");
    const taxRate = this.getRateForCategory(category);
    const sum = money.price + money.price * taxRate;
    return new Money(sum, "USD");
  }

  getRateForCategory(category) {
    const rate = Vat.VAT_RATES[category] ?? Vat.VAT_RATES["Standard"];
    return rate;
  }

  getTaxAmount(money, category) {
    money.checkCurrency("USD");
    const taxRate = this.getRateForCategory(category);
    const taxAmount = money.price * taxRate;
    return new Money(taxAmount, "USD");
  }
}
