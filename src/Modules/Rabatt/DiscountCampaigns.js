import { ValidationError } from "./errors.js";

export const CampaignType = Object.freeze({
  THRESHOLD: "THRESHOLD",
  BUY_X_PAY_FOR_Y: "BUY_X_PAY_FOR_Y",
  PERCENTAGE: "PERCENTAGE",
});

export const ALLOWED_COMBINATIONS = Object.freeze({
  [CampaignType.PERCENTAGE]: [CampaignType.THRESHOLD],
  [CampaignType.BUY_X_PAY_FOR_Y]: [CampaignType.THRESHOLD],
  [CampaignType.THRESHOLD]: [
    CampaignType.PERCENTAGE,
    CampaignType.BUY_X_PAY_FOR_Y,
  ],
});

export const MIN_BUY_X = 2;

export class CampaignModule {
  constructor({
    id,
    type,
    priority = 0,
    startDate,
    endDate,
    campaignCode,
  } = {}) {
    this.id = id;
    this.type = String(type ?? "")
      .trim()
      .toUpperCase();
    this.priority = Number(priority) || 0;
    this.campaignCode = String(campaignCode ?? "")
      .trim()
      .toUpperCase();
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;

    if (this.id === undefined || this.id === null || this.id === "") {
      throw new ValidationError(`Kampanjen saknar id`);
    }

    if (this.startDate && Number.isNaN(this.startDate.getTime())) {
      throw new ValidationError(`Ogiltig startdatum.`);
    }

    if (this.endDate && Number.isNaN(this.endDate.getTime())) {
      throw new ValidationError(`Ogiltig enddatum.`);
    }

    // "2026-09-30T00:00:00.000Z" means the whole day 30 September is include

    if (this.endDate && this.endDate.toISOString().endsWith("T00:00:00.000Z")) {
      this.endDate = new Date(this.endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
    }

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      throw new ValidationError(
        `Startdatum kan inte vara senare än slutdatum.`,
      );
    }
  }

  isActive(now = new Date()) {
    if (this.startDate && now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;
    return true;
  }

  requiresCode() {
    return this.campaignCode !== "";
  }

  matchesCode(discountCode) {
    if (!this.requiresCode()) return true;
    return (
      String(discountCode ?? "")
        .trim()
        .toUpperCase() === this.campaignCode
    );
  }

  isApplicableToCart() {
    throw new Error("isApplicableToCart måste implementeras.");
  }

  calculateDiscountedPriceForCart() {
    throw new Error("calculateDiscountedPriceForCart måste implementeras.");
  }
}

export class ProductCampaign extends CampaignModule {
  constructor(data) {
    super(data);
    const products = data.products ?? [data.id];
    this.productIds = new Set(
      products
        .filter((p) => p !== undefined && p !== null)
        .map((p) => String(typeof p === "object" ? p.id : p)),
    );
  }

  appliesTo(cartItem) {
    return this.productIds.has(String(cartItem.id));
  }

  isApplicableToCart(cartItems) {
    return cartItems.some((c) => this.appliesTo(c));
  }
}

// Regeln: handla x antal varor och betala endast för y antal varor.
export class BuyXPayForYDiscount extends ProductCampaign {
  constructor(data) {
    super(data);
    this.buyX = Number(data.buyX);
    this.payForY = Number(data.payForY);

    if (
      !Number.isInteger(this.buyX) ||
      !Number.isInteger(this.payForY) ||
      this.payForY <= 0 ||
      this.buyX <= this.payForY
    ) {
      throw new ValidationError(
        `Kampanjen har ogiltiga värden för 'buyX' eller 'payForY':` +
          `buyX=${data.buyX}, payForY=${data.payForY}.`,
      );
    }
  }

  isApplicableToCart(cartItems) {
    const eligibleItems = cartItems.filter((cartItem) =>
      this.appliesTo(cartItem),
    );

    const eligibleCount = eligibleItems.reduce(
      (sum, cartItem) => sum + cartItem.quantity,
      0,
    );
    return eligibleCount >= this.buyX;
  }

  calculateDiscountedPriceForCart(cartItems) {
    const campaignUnitPrices = [];
    let total = 0;

    for (const cartItem of cartItems) {
      if (this.appliesTo(cartItem)) {
        for (let i = 0; i < cartItem.quantity; i++) {
          campaignUnitPrices.push(cartItem.price);
        }
      } else {
        total += cartItem.price * cartItem.quantity;
      }
    }
    campaignUnitPrices.sort((a, b) => a - b);

    const completeGroups = Math.floor(campaignUnitPrices.length / this.buyX);
    const freeItemsPerGroup = this.buyX - this.payForY;
    const freeItemsCount = completeGroups * freeItemsPerGroup;

    const paidPrices = campaignUnitPrices.slice(freeItemsCount);

    for (const price of paidPrices) {
      total += price;
    }
    return Math.round(total * 100) / 100;
  }
}

// Regeln: x% rabatt på alla varor i kampanjen.
export class PercentageDiscount extends CampaignModule {
  constructor(data) {
    super(data);
    this.campaignCode = String(data.campaignCode).trim().toUpperCase();
    this.discountPercentage = Number(data.discountPercentage);

    if (!this.requiresCode()) {
      throw new ValidationError(
        `Procentkampanjen med id ${this.id} saknar kampanjkod.`,
      );
    }
    if (
      Number.isNaN(this.discountPercentage) ||
      this.discountPercentage < 0 ||
      this.discountPercentage > 100
    ) {
      throw new ValidationError(
        `Kampanjen har en ogiltig rabattprocent: ${data.discountPercentage}. Den måste vara mellan 0 och 100 %.`,
      );
    }
  }

  isApplicableToCart(discountCode) {
    return discountCode === this.campaignCode; //from Checkout
  }

  calculateDiscountedPriceForCart(rawSubtotalNumber) {
    return (
      Math.round(
        rawSubtotalNumber * (1 - this.discountPercentage / 100) * 100,
      ) / 100
    );
  }
}

// Regeln: handla för över ett visst belopp och få x% rabatt på hela köpet.
export class ThresholdDiscount extends CampaignModule {
  constructor(data) {
    super(data);
    this.threshold = Number(data.threshold);
    this.discountValue = Number(data.discountValue);

    if (Number.isNaN(this.threshold) || this.threshold < 0) {
      throw new ValidationError(
        `Kampanjen har ett ogiltigt tröskelvärde: ${data.threshold}. Det måste vara ett positivt tal.`,
      );
    }
    if (
      Number.isNaN(this.discountValue) ||
      this.discountValue < 0 ||
      this.discountValue > this.threshold
    ) {
      throw new ValidationError(
        `Kampanjen har en ogiltig rabattprocent: ${data.discountValue}. `,
      );
    }
  }

  isApplicableToTotal(rawSubtotalNumber) {
    return rawSubtotalNumber >= this.threshold;
  }

  applyToTotal(rawSubtotalNumber) {
    if (!this.isApplicableToTotal(rawSubtotalNumber))
      return Math.round(rawSubtotalNumber * 100) / 100;
    return (
      Math.round(Math.max(0, rawSubtotalNumber - this.discountValue) * 100) /
      100
    );
  }

  isApplicableToCart(rawSubtotalNumber) {
    return rawSubtotalNumber >= this.threshold;
  }

  calculateDiscountedPriceForCart(cartItems, rawSubtotalNumber) {
    const totalPrice = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
      0,
    );

    if (rawSubtotalNumber < this.threshold) {
      return Math.round(totalPrice * 100) / 100;
    }

    const discountedTotalPrice =
      rawSubtotalNumber * (1 - this.discountValue / 100);

    return Math.round(discountedTotalPrice * 100) / 100;
  }
}

//think about kampaign cod

export function campaignFactory(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ValidationError(`Ogiltig kampanjdata. `);
  }

  const type = String(data.type ?? "")
    .trim()
    .toUpperCase();

  switch (type) {
    case CampaignType.THRESHOLD:
      return new ThresholdDiscount({ ...data, type });
    case CampaignType.BUY_X_PAY_FOR_Y:
      return new BuyXPayForYDiscount({ ...data, type });
    case CampaignType.PERCENTAGE:
      return new PercentageDiscount({ ...data, type });
    default:
      throw new ValidationError(`Okänd kampanjtyp: ${data.type}.`);
  }
}
