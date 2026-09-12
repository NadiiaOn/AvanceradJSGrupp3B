import { ValidationError } from "./errors.js";
import {
  productsInBuyXPayForYCampaigns,
  thresholdCampaigns,
  percentageCampaigns,
  products,
} from "./CampaignService.js";

export class CampaignModule { 
  constructor({ startDate, endDate }) {
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
  }

  isActive(now = new Date()) {
    if (now < this.startDate) return false;
    if (now > this.endDate) return false;
    return true;
  }

  calculateDiscountedPriceForCart() {}
}

let discountedTotalPrice = 0;

// Regeln: x% rabatt på alla varor i kampanjen.

//ToDo: implement isActive method for two campaigns
export class PercentageDiscount extends CampaignModule{
  constructor(data) {
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
  }

  calculateDiscountedPriceForCart(cartItems) {
  
    for (const cartItem of cartItems) {
      const discountedPrice =
        cartItem.price * (1 - this.discountPercentage / 100);
      discountedTotalPrice += discountedPrice * cartItem.quantity;
    }
    return discountedTotalPrice;
  }
}

// Regeln: handla för över ett visst belopp och få x% rabatt på hela köpet.
export class ThresholdDiscount extends CampaignModule{
  constructor(data) {
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

  calculateDiscountedPriceForCart(totalPrice) {
    
    if (totalPrice >= this.threshold) {
      return discountedTotalPrice =
        totalPrice * (1 - this.discountValue / 100);
    }
    return totalPrice;
  }
}

// Regeln: handla x antal varor och betala endast för y antal varor.
export class BuyXPayForYDiscount {
  constructor(data) {
    this.buyX = Number(data.buyX);
    this.payForY = Number(data.payForY);

    if (
      !Number.isInteger(this.buyX) ||
      !Number.isInteger(this.payForY) ||
      this.buyX <= 0 ||
      this.payForY <= 0 ||
      this.buyX <= this.payForY
    ) {
      throw new ValidationError(`Kampanjen har ogiltiga värden för 'buyX' eller 'payForY':`+
      `buyX=${data.buyX}, payForY=${data.payForY}.`+ 
      `De måste vara positiva tal och buyX måste vara större än payForY.`);
    }
  }

  calculateDiscountedPriceForCart(cartItems) {
    const prices = [];
    for (const cartItem of cartItems) {

      const price = Number(cartItem.price);
      const quantity = Number(cartItem.quantity);

      if (!Number.isFinite(price) || price < 0) {
        throw new ValidationError(`Ogiltig pris: ${cartItem.price}`);
      }

      if (!Number.isInteger(quantity) || quantity < 0) {
        throw new ValidationError(`Ogiltig antal: ${cartItem.quantity}`);
      }
      for (let i = 0; i < quantity; i++) {
        prices.push(price);
      }
    }
    prices.sort((a, b) => a - b);

    const freeCount =
      Math.floor(prices.length / this.buyX) * (this.buyX - this.payForY);

    for (let i = freeCount; i < prices.length; i++) {
      discountedTotalPrice += prices[i];
    }
    return Math.round(discountedTotalPrice * 100) / 100;
  }
}

export function campaignFactory(data) {
  if (!data || typeof data !== "object") {
    throw new ValidationError(`Ogiltig kampanjdata: ${data}. 
        Det måste vara ett objekt som innehåller information om kampanjen.`);
  }
  switch (data.type) {
    case "percentage": return new PercentageDiscount(data);
    case "THRESHOLD": return new ThresholdDiscount(data);
    case "BUY_X_PAY_FOR_Y": return new BuyXPayForYDiscount(data);
    default: 
      throw new ValidationError(`Okänd kampanjtyp: §{data.type}.`)
  }
}
