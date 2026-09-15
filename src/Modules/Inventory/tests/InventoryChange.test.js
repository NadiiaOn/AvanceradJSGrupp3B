import { describe, it, expect } from "vitest";

import InventoryChange from "../InventoryChange";

describe("InventoryChange", () => {
  it("Tests that the constructor saves productId", () => {
    const change = new InventoryChange(1, "SALE", 5);

    expect(change.productId).toBe(1);
  });

  it("Tests that the constructor saves the type", () => {
    const change = new InventoryChange(1, "SALE", 5);

    expect(change.type).toBe("SALE");
  });

  it("Tests that the constructor saves the quantity", () => {
    const change = new InventoryChange(1, "SALE", 5);

    expect(change.quantity).toBe(5);
  });

  it("Creates a timestamp by default", () => {
    const change = new InventoryChange(1, "SALE", 5);

    expect(change.timestamp).toBeInstanceOf(Date);
  });

  it("Tests that id defaults to null", () => {
    const change = new InventoryChange(1, "SALE", 5);

    expect(change.id).toBe(null);
  });
});
