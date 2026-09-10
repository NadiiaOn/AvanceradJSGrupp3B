import { ValidationError } from "./errors.js";

// Regeln: x% rabatt på alla varor i kampanjen.
export class PercentageDiscount {
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
    let discountedTotalPrice = 0;
    for (const cartItem of cartItems) {
      const discountedPrice =
        cartItem.price * (1 - this.discountPercentage / 100);
      discountedTotalPrice =
        discountedTotalPrice + discountedPrice * item.quantity;
    }
    return discountedTotalPrice;
  }
}

// Regeln: handla för över ett visst belopp och få x% rabatt på hela köpet.
export class ThresholdDiscount {
  constructor(totalPrice) {
    this.threshold = Number(product.threshold);

    if (isNaN(this.threshold) || this.threshold < 0) {
      throw new ValidationError(
        `Kampanjen har ett ogiltigt tröskelvärde: ${this.threshold}. Det måste vara ett positivt tal.`,
      );
    }
  }

  calculateDiscountedPrice(totalPrice) {
    if (total >= this.threshold) {
      return total * (1 - this.discountValue / 100);
    } else {
      return `Kampangen ger ingen rabatt på den här varukorgen. Den gäller endast för varor som ingår i kampanjen. Your total is ${total}`;
    }
  }
}
//create ThresholdCampaigns.db

// Regeln: handla x antal varor och betala endast för y antal varor.
export class BuyXPayForYDiscount {
  constructor(data) {
    this.buyX = Number(data.buyX);
    this.payForY = Number(data.payForY);

    if (
      isNaN(this.buyX) ||
      isNaN(this.payForY) ||
      this.buyX <= 0 ||
      this.payForY <= 0 ||
      this.buyX <= this.payForY
    ) {
      throw new ValidationError(`Kampanjen har ogiltiga värden för 'buyX' eller 'payForY':
                 buyX=${this.buyX}, payForY=${this.payForY}. 
                 De måste vara positiva tal och buyX måste vara större än payForY.`);
    }
  }
}

export function CampaignIerarchy(product) {
  if (!product || typeof product !== "object") {
    throw new ValidationError(`Ogiltig kampanjdata: ${product}. 
        Det måste vara ett objekt som innehåller information om kampanjen.`);
  }

  if (data.discountType === ThresholdDiscount) {
    if (
      !data.threshold ||
      typeof data.threshold !== "number" ||
      data.threshold < 0
    ) {
      throw new ValidationError(`Kampanjen '${data.discountName}' har ett ogiltigt tröskelvärde: ${data.threshold}. 
            Det måste vara ett positivt tal.`);
    }
    return new ThresholdDiscount(data);
  } else if (data.discountType === BuyXPayForYDiscount) {
    if (
      !data.buyX ||
      !data.payForY ||
      typeof data.buyX !== "number" ||
      typeof data.payForY !== "number" ||
      data.buyX <= 0 ||
      data.payForY <= 0 ||
      data.buyX <= data.payForY
    ) {
      throw new ValidationError(`Kampanjen '${data.discountName}' har ogiltiga värden för 'buyX' eller 'payForY':
                 buyX=${data.buyX}, payForY=${data.payForY}. 
                 De måste vara positiva tal och buyX måste vara större än payForY.`);
    }
    return new BuyXPayForYDiscount(data);
  } else if (data.discountType === PrecentageDiscount) {
    if (
      !data.percent ||
      typeof data.percent !== "number" ||
      data.percent < 0 ||
      data.percent > 100
    ) {
      throw new ValidationError(`Kampanjen '${data.discountName}' har en ogiltig rabattprocent: ${data.percent}. 
            Den måste vara mellan 0 och 100 %.`);
    }
    return new PrecentageDiscount(data);
  } else {
    throw new ValidationError(`Kampanjen '${data.discountName}' har en ogiltig rabatttyp: ${data.discountType}. 
        Den måste vara en av de definierade rabattklasserna.`);
  }
}
