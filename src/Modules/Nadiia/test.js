//Test file for all tests related to the Nadiia module.
import { campaignFactory } from "./DiscountCampaigns.js";

const cart = [
  { id: 1, price: 100, quantity: 2 },
  { id: 2, price: 50, quantity: 1 },
  { id: 3, price: 30, quantity: 3 },
];

function check(label, actual, expected) {
  const ok = Math.abs(actual - expected) < 0.01;
  console.log(`${ok ? "OK " : "FEL"} ${label}: ${actual} (väntat ${expected})`);
}

const percentage = campaignFactory({
  id: "p1",
  type: "PERCENTAGE",
  discountPercentage: 20,
  products: [{ id: 1 }, { id: 2 }],
});

check("percentage", percentage.calculateDiscountedPriceForCart(cart), 290);

const threshold = campaignFactory({
  id: "t1",
  type: "THRESHOLD",
  threshold: 300,
  discountValue: 10,
});
check("threshold", threshold.calculateDiscountedPriceForCart(cart), 306);
check("threshold applicable", threshold.isApplicableToCart(cart), true);

const buyX = campaignFactory({
  id: "b1",
  type: "BUY_X_PAY_FOR_Y",
  buyX: 3,
  payForY: 2,
  products: [{ id: 3 }],
});
check("buyXpayForY", buyX.calculateDiscountedPriceForCart(cart), 310);


/* my result 
productsIds [ '1', '2' ]
id=1 → скидка
id=1 price=100 qty=2 unitPrice=80 суммапосле=160
id=2 → скидка
id=2 price=50 qty=1unitPrice=40 сумма после=200
id=3 → без скидки
id=3 price=30 qty=3unitPrice=30 сумма после=290
OK  percentage: 290(väntat 290)
OK  threshold: 306 (väntat 306)
OK  threshold applicable: true (väntat true)
OK  buyXpayForY: 310 (väntat 310)
*/