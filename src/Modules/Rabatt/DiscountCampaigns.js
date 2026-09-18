import { ValidationError } from "./errors.js";

//New order for the campaigns
export const CAMPAIGN_PRIORITY = Object.freeze({
  [CampaignType.BUY_X_PAY_FOR_Y]: 0,
  [CampaignType.PERCENTAGE]: 1,
  [CampaignType.THRESHOLD]: 2,
});

export const ALLOWED_COMBINATIONS = Object.freeze({
  [CampaignType.PERCENTAGE]: [CampaignType.THRESHOLD],
  [CampaignType.BUY_X_PAY_FOR_Y]: [CampaignType.THRESHOLD],
  [CampaignType.THRESHOLD]: [
    CampaignType.PERCENTAGE,
    CampaignType.BUY_X_PAY_FOR_Y,
  ],
});

export class CampaignModule {
  constructor({ id, campaignId, type, startDate, endDate } = {}) {
    this.id = Number(id);
    this.campaignId = Number(campaignId);
    this.type = String(type ?? "")
      .trim()
      .toUpperCase();
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;

    if (
      this.campaignId === undefined ||
      this.campaignId === null ||
      this.campaignId === ""
    ) {
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
    this.discountValue = Number(data.discountValue); // discount in percent
    this.discountCode = String(data.discountCode ?? "").trim().toUpperCase();

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
//think about if I really need It
  requiresCode() {
    return this.discountCode !== "";
  } 

  calculateDiscountedPriceForCart(formattedSubtotal, inputedDiscountCode) {

    matchesCode(inputedDiscountCode)
      if (typeof inputedDiscountCode !== "string") return false;
      return inputedDiscountCode.trim().toUpperCase() === this.discountCode;
    };
      
    if (matchesCode) {
    const discountedTotalPrice = totalPrice * (1 - this.discountValue / 100);

    return Math.round(discountedTotalPrice * 100) / 100;
    }
    //implement the logic with the discount in percent
    return Math.round(discountedTotalPrice * 100) / 100;
  }
}

// Regeln: handla x antal varor och betala endast för y antal varor.
export class BuyXPayForYDiscount extends CampaignModule {
  constructor(data) {
    super(data);
    this.buyX = Number(data.buyX);
    this.payForY = Number(data.payForY);

    const products = data.products ?? [data.id];
    this.productIds = new Set(
      products
        .filter((p) => p !== undefined && p !== null)
        .map((p) => String(typeof p === "object" ? p.id : p)),
    );

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

    if (!this.requiresCode()) {
      throw new ValidationError(
        `Procentkampanjen med id ${this.id} saknar kampanjkod.`,
      );
    }
  }
  appliesTo(cartItem) {
    return this.productIds.has(String(cartItem.id));
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

    if (!this.requiresCode()) {
      throw new ValidationError(
        `Procentkampanjen med id ${this.id} saknar kampanjkod.`,
      );
    }
  }

  isApplicableToCart(formattedSubTotal) {
    return formattedSubTotal >= this.threshold;
  }

  applyToTotal(formattedSubTotal) {
    if (!this.isApplicableToTotal(total)) return Math.round(total * 100) / 100;
    return Math.round(MathMax.max(0, total - this.discountValue) * 100) / 100;
  }

  calculateDiscountedPriceForCart(formattedSubtotal) {
    if (formattedSubtotal < this.threshold) {
      return Math.round(formattedSubtotal * 100) / 100;
    }

    const discountedTotalPrice = totalPrice * (1 - this.discountValue / 100);

    return Math.round(discountedTotalPrice * 100) / 100;
  }

  calculateDiscountedPriceForCart(cartItems) {
    const total = this.getCartTotal(cartItems);
    return this.applyToTotal(total);
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
    case CampaignType.BUY_X_PAY_FOR_Y:
      return new BuyXPayForYDiscount({ ...data, type });
    case CampaignType.PERCENTAGE:
      return new PercentageDiscount({ ...data, type });
    case CampaignType.THRESHOLD:
      return new ThresholdDiscount({ ...data, type });
    default:
      throw new ValidationError(`Okänd kampanjtyp: ${data.type}.`);
  }
}
