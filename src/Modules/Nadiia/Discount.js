export default class Discount {
  // data = ett objekt som innehåller information om kampanjen, t.ex. vilka produkter som ingår och vilken rabatt som gäller.

  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.discountPercentage = data.discountPercentage;
    this.rating = data.rating;
    this.stock = data.stock;
    this.type = data.type;
    this.code = data.code;
    this.name = data.name;
    this.tartDate = data.startDate;
    this.endDate = data.endDate;
    this.tags = data.tags;
    this.brand = data.brand;
    this.availabilityStatus = data.availabilityStatus;
    this.images = data.images;
    this.thumbnail = data.thumbnail;
  }

  calculateDiscountedPrice() {}

  describe() {
    return this.name;
  }
}

// Regeln: x% rabatt på alla varor i kampanjen.
export class PercentageDiscount extends Discount {
  constructor(data) {
    super(data);
    this.discountPercentage = Number(data.discountPercentage);

    if (
      isNaN(this.discountPercentage) ||
      this.discountPercentage < 0 ||
      this.discountPercentage > 100
    ) {
      throw new ValidationError(
        `Kampanjen '${this.name}' har en ogiltig rabattprocent: ${this.percentageDiscount}. Den måste vara mellan 0 och 100 %.`,
      );
    }
  }

  calculateDiscountedPrice(originalPrice) {
    if (typeof originalPrice !== "number" || originalPrice < 0) {
      throw new ValidationError(
        `Kampanjen '${this.discountName}' har ett ogiltigt originalpris: ${originalPrice}. Det måste vara ett positivt tal.`,
      );
    }

    const discountedPrice = originalPrice * (1 - this.percent / 100);
    return discountedPrice;
  }

  describe() {
    return `${this.discountName} - ${this.percent}% rabatt.`;
  }
}

// Regeln: handla för över ett visst belopp och få x% rabatt på hela köpet.
export class ThresholdDiscount extends Discount {
  constructor(data) {
    super(data);
    this.threshold = Number(data.threshold);

    if (isNaN(this.threshold) || this.threshold < 0) {
      throw new ValidationError(
        `Kampanjen '${this.product.name}' har ett ogiltigt tröskelvärde: ${this.threshold}. Det måste vara ett positivt tal.`,
      );
    }
  }

  // Think abour how to take cartItems with all our rules for our modules.
  calculateDiscountedPrice(cartItems) {
    let total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (total >= this.threshold) {
      return total * (1 - this.discountValue / 100);
    } else {
      return `Kampangen ger ingen rabatt på den här varukorgen. Den gäller endast för varor som ingår i kampanjen. Your total is ${total}`;
    }
  }

  describe() {
    return `${this.discountName} - ${this.discountValue}% rabatt vid köp`;
  }

}

// Regeln: handla x antal varor och betala endast för y antal varor.
export class BuyXPayForYDiscount extends Discount {
  constructor(data) {
    super(data);
    this.buyX = Number(data.buyX);
    this.payForY = Number(data.payForY);
    this.category = data.category || null;

    if (
      isNaN(this.buyX) ||
      isNaN(this.payForY) ||
      this.buyX <= 0 ||
      this.payForY <= 0 ||
      this.buyX <= this.payForY
    ) {
      throw new ValidationError(`Kampanjen '${this.discountName}' har ogiltiga värden för 'buyX' eller 'payForY':
                 buyX=${this.buyX}, payForY=${this.payForY}. 
                 De måste vara positiva tal och buyX måste vara större än payForY.`);
    }
  }

  calculateDiscountedPrice(cartItems) {}
}

export function CampaignIerarchy(data) {
  if (!data || typeof data !== "object") {
    throw new ValidationError(`Ogiltig kampanjdata: ${data}. 
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
