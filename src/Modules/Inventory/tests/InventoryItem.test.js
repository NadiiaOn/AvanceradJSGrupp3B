import { describe, it, expect } from "vitest";

import InventoryItem from "../InventoryItem";
import InventoryChange from "../InventoryChange";

let product = {
  id: "1",
  title: "Essence Mascara Lash Princess",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  stock: 14,
  tags: ["beauty", "mascara"],
  brand: "Essence",
  sku: "BEA-ESS-ESS-001",
  weight: 4,
  dimensions: {
    width: 15.14,
    height: 13.08,
    depth: 22.99,
  },
  warrantyInformation: "1 week warranty",
  shippingInformation: "Ships in 3-5 business days",
  availabilityStatus: "In Stock",
  reviews: [
    {
      rating: 3,
      comment: "Would not recommend!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Eleanor Collins",
      reviewerEmail: "eleanor.collins@x.dummyjson.com",
    },
    {
      rating: 4,
      comment: "Very satisfied!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Lucas Gordon",
      reviewerEmail: "lucas.gordon@x.dummyjson.com",
    },
    {
      rating: 5,
      comment: "Highly impressed!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Eleanor Collins",
      reviewerEmail: "eleanor.collins@x.dummyjson.com",
    },
  ],
  returnPolicy: "No return policy",
  minimumOrderQuantity: 48,
  meta: {
    createdAt: "2025-04-30T09:41:02.053Z",
    updatedAt: "2025-04-30T09:41:02.053Z",
    barcode: "5784719087687",
    qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
  },
  images: [
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
  ],
  thumbnail:
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
};

describe("InventoryItem", () => {
  it("Calculates total sales", () => {
    let item = new InventoryItem(product);

    const sale = new InventoryChange(1, "SALE", 5);
    item.addChange(sale);

    const result = item.calculateSales();

    expect(result).toBe(5);
  });

  it("Calculates only SALE and ignores other methods", () => {
    let item = new InventoryItem(product);

    const sale = new InventoryChange(1, "SALE", 9);
    const order = new InventoryChange(1, "ORDER", 10);
    const sale2 = new InventoryChange(1, "SALE", 4);
    const adjustmentIncrease = new InventoryChange(1, "ADJUSTMENTINCREASE", 2);
    const adjustmentDecrease = new InventoryChange(1, "ADJUSTMENTDECREASE", 5);

    item.addChange(sale);
    item.addChange(order);
    item.addChange(sale2);
    item.addChange(adjustmentIncrease);
    item.addChange(adjustmentDecrease);

    const result = item.calculateSales();

    expect(result).toBe(13);
  });

  it("Calculates the rate of sales for the last 7 days", () => {
    let item = new InventoryItem(product);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    let change1 = new InventoryChange(1, "SALE", 5, twoDaysAgo);
    let change2 = new InventoryChange(1, "SALE", 10, fiveDaysAgo);
    let change3 = new InventoryChange(1, "SALE", 33, tenDaysAgo);

    item.addChange(change1);
    item.addChange(change2);
    item.addChange(change3);

    const result = item.calculateSalesRate(7);

    expect(result).toBeCloseTo(15 / 7);
  });

  it("Calculates the reorder breakpoint for a product", () => {
    let item = new InventoryItem(product);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    let change1 = new InventoryChange(1, "SALE", 5, twoDaysAgo);
    let change2 = new InventoryChange(1, "SALE", 10, fiveDaysAgo);
    let change3 = new InventoryChange(1, "SALE", 33, tenDaysAgo);

    item.addChange(change1);
    item.addChange(change2);
    item.addChange(change3);

    const result = item.calculateReorderBreakPoint();

    expect(result).toBe(15);
  });

  it("Returns 0 when there are no sales", () => {
    let item = new InventoryItem(product);

    const result = item.calculateReorderBreakPoint();

    expect(result).toBe(0);
  });

  it("Returns true if a product needs to be reordered", () => {
    let item = new InventoryItem(product);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    let change1 = new InventoryChange(1, "SALE", 5, twoDaysAgo);
    let change2 = new InventoryChange(1, "SALE", 9, fiveDaysAgo);

    item.addChange(change1);
    item.addChange(change2);

    const result = item.needsReorder();

    expect(result).toBe(true);
  });

  it("Returns false if a product does not need to be reordered", () => {
    let newProduct = {
      id: "1",
      title: "Essence Mascara Lash Princess",
      description:
        "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
      category: "beauty",
      price: 9.99,
      discountPercentage: 10.48,
      rating: 2.56,
      stock: 25,
      tags: ["beauty", "mascara"],
      brand: "Essence",
      sku: "BEA-ESS-ESS-001",
      weight: 4,
      dimensions: {
        width: 15.14,
        height: 13.08,
        depth: 22.99,
      },
      warrantyInformation: "1 week warranty",
      shippingInformation: "Ships in 3-5 business days",
      availabilityStatus: "In Stock",
      reviews: [
        {
          rating: 3,
          comment: "Would not recommend!",
          date: "2025-04-30T09:41:02.053Z",
          reviewerName: "Eleanor Collins",
          reviewerEmail: "eleanor.collins@x.dummyjson.com",
        },
        {
          rating: 4,
          comment: "Very satisfied!",
          date: "2025-04-30T09:41:02.053Z",
          reviewerName: "Lucas Gordon",
          reviewerEmail: "lucas.gordon@x.dummyjson.com",
        },
        {
          rating: 5,
          comment: "Highly impressed!",
          date: "2025-04-30T09:41:02.053Z",
          reviewerName: "Eleanor Collins",
          reviewerEmail: "eleanor.collins@x.dummyjson.com",
        },
      ],
      returnPolicy: "No return policy",
      minimumOrderQuantity: 48,
      meta: {
        createdAt: "2025-04-30T09:41:02.053Z",
        updatedAt: "2025-04-30T09:41:02.053Z",
        barcode: "5784719087687",
        qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
      },
      images: [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
      ],
      thumbnail:
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    };

    let item = new InventoryItem(newProduct);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    let change1 = new InventoryChange(1, "SALE", 5, twoDaysAgo);
    let change2 = new InventoryChange(1, "SALE", 9, fiveDaysAgo);

    item.addChange(change1);
    item.addChange(change2);

    const result = item.needsReorder();
    expect(result).toBe(false);
  });
});
