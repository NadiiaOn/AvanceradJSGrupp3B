import { ValidationError } from "./errors.js";

export class CampaignModule {
  constructor({ id, type, priority = 0, startDate, endDate } = {}) {
    this.id = id;
    this.type = type;
    this.priority = priority;
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
  }

  isActive(now = new Date()) {
    if (this.startDate && now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;
    return true;
  }

  isApplicableToCart() {
    throw new Error("isApplicableToCart måste implementeras.");
  }

  calculateDiscountedPriceForCart() {
    throw new Error("calculateDiscountedPriceForCart måste implementeras.");
  }
}

// Regeln: x% rabatt på alla varor i kampanjen.

export class PercentageDiscount extends CampaignModule {
  constructor(data) {
    super(data);
    this.discountPercentage = Number(data.discountPercentage);

    if (
      isNaN(this.discountPercentage) ||
      this.discountPercentage < 0 ||
      this.discountPercentage > 100
    ) {
      throw new ValidationError(
        `Kampanjen har en ogiltig rabattprocent: ${data.discountPercentage}. Den måste vara mellan 0 och 100 %.`,
      );
    }

    this.productIds = new Set(
      (data.products ?? []).map((p) =>
        String(typeof p === "object" ? p.id : p),
      ),
    );
  }
  appliesTo(cartItem) {
    return this.productIds.has(String(cartItem.id));
  }

  isApplicableToCart(cartItems) {
    return cartItems.some((cartItem) => this.appliesTo(cartItem));
  }

  calculateDiscountedPriceForCart(cartItems) {
    let discountedTotalPrice = 0;

    for (const cartItem of cartItems) {
      const unitPrice = this.appliesTo(cartItem)
        ? cartItem.price * (1 - this.discountPercentage / 100)
        : cartItem.price;

      discountedTotalPrice += unitPrice * cartItem.quantity;
    }
    return Math.round(discountedTotalPrice * 100) / 100;
  }
}

// Regeln: handla för över ett visst belopp och få x% rabatt på hela köpet.
export class ThresholdDiscount extends CampaignModule {
  constructor(data) {
    super(data);
    this.threshold = Number(data.threshold);
    this.discountValue = Number(data.discountValue);

    if (isNaN(this.threshold) || this.threshold < 0) {
      throw new ValidationError(
        `Kampanjen har ett ogiltigt tröskelvärde: ${data.threshold}. Det måste vara ett positivt tal.`,
      );
    }
    if (
      isNaN(this.discountValue) ||
      this.discountValue < 0 ||
      this.discountValue > 100
    ) {
      throw new ValidationError(
        `Kampanjen har en ogiltig rabattprocent: ${data.discountValue}. Den måste vara mellan 0 och 100 %.`,
      );
    }
  }

  isApplicableToCart(cartItems) {
    const totalPrice = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
      0,
    );

    return totalPrice >= this.threshold;
  }

  calculateDiscountedPriceForCart(cartItems) {
    const totalPrice = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
      0,
    );

    if (totalPrice < this.threshold) {
      return Math.round(totalPrice * 100) / 100;
    }

    const discountedTotalPrice = totalPrice * (1 - this.discountValue / 100);

    return Math.round(discountedTotalPrice * 100) / 100;
  }
}

// Regeln: handla x antal varor och betala endast för y antal varor.
export class BuyXPayForYDiscount extends CampaignModule {
  constructor(data) {
    super(data);
    this.buyX = Number(data.buyX);
    this.payForY = Number(data.payForY);

    if (
      !Number.isInteger(this.buyX) ||
      !Number.isInteger(this.payForY) ||
      this.buyX <= 0 ||
      this.payForY <= 0 ||
      this.buyX <= this.payForY
    ) {
      throw new ValidationError(
        `Kampanjen har ogiltiga värden för 'buyX' eller 'payForY':` +
          `buyX=${data.buyX}, payForY=${data.payForY}.` +
          `De måste vara positiva tal och buyX måste vara större än payForY.`,
      );
    }

    this.productIds = new Set(
      (data.products ?? []).map((p) =>
        String(typeof p === "object" ? p.id : p),
      ),
    );
  }

  appliesTo(cartItem) {
    return this.productIds.has(String(cartItem.id));
  }

  isApplicableToCart(cartItems) {
    let eligibleCount = 0;

    for (const cartItem of cartItems) {
      if (this.appliesTo(cartItem)) {
        eligibleCount += Number(cartItem.quantity);
      }
    }
    return eligibleCount >= this.buyX;
  }

  calculateDiscountedPriceForCart(cartItems) {
    const campaignPrices = [];
    let discountedTotalPrice = 0;

    for (const cartItem of cartItems) {
      const price = Number(cartItem.price);
      const quantity = Number(cartItem.quantity);

      if (!Number.isFinite(price) || price < 0) {
        throw new ValidationError(`Ogiltig pris: ${cartItem.price}`);
      }

      if (!Number.isInteger(quantity) || quantity < 0) {
        throw new ValidationError(`Ogiltig antal: ${cartItem.quantity}`);
      }

      if (this.appliesTo(cartItem)) {
        for (let i = 0; i < quantity; i++) {
          campaignPrices.push(price);
        }
      } else {
        discountedTotalPrice += price * quantity;
      }
    }
    campaignPrices.sort((a, b) => a - b);

    const freeCount =
      Math.floor(campaignPrices.length / this.buyX) *
      (this.buyX - this.payForY);

    for (let i = freeCount; i < campaignPrices.length; i++) {
      discountedTotalPrice += campaignPrices[i];
    }
    return Math.round(discountedTotalPrice * 100) / 100;
  }
}

export function campaignFactory(data) {
  if (!data || typeof data !== "object") {
    throw new ValidationError(`Ogiltig kampanjdata: ${data}. 
        Det måste vara ett objekt som innehåller information om kampanjen.`);
  }
  switch (String(data.type).toUpperCase()) {
    case "THRESHOLD":
      return new ThresholdDiscount(data);
    case "BUY_X_PAY_FOR_Y":
      return new BuyXPayForYDiscount(data);
    case "PERCENTAGE":
      return new PercentageDiscount(data);
    default:
      throw new ValidationError(`Okänd kampanjtyp: ${data.type}.`);
  }
}
