import { describe, it, expect, vi } from "vitest";
import InventoryModule from "../InventoryModule";
import InventoryService from "../InventoryService";
import InventoryValidationError from "../errors/InventoryValidationError";

describe("InventoryModule", () => {
  it("Creates an InventoryModule instance", () => {
    const module = new InventoryModule();

    expect(module).toBeInstanceOf(InventoryModule);
  });

  it("Creates an InventoryService instance", () => {
    const module = new InventoryModule();

    const service = module.inventoryService;

    expect(service).toBeInstanceOf(InventoryService);
  });

  it("Initializes an empty history", () => {
    const module = new InventoryModule();

    const history = module.history;

    expect(history).toEqual([]);
  });

  it("Has a module descriptor", () => {
    const descriptor = InventoryModule.descriptor;

    expect(descriptor).toBeDefined();
  });

  it("Descriptor contains getInventoryReport", () => {
    const methods = InventoryModule.descriptor.methodsAndInputs;

    const result = methods.some(
      (method) => method.method === "getInventoryReport",
    );

    expect(result).toBe(true);
  });

  it("Descriptor contains registerInventoryChange", () => {
    const methods = InventoryModule.descriptor.methodsAndInputs;

    const result = methods.some(
      (method) => method.method === "registerInventoryChange",
    );

    expect(result).toBe(true);
  });

  it("Returns module history", () => {
    const module = new InventoryModule();

    const history = module.getModuleHistory();

    expect(history).toEqual(module.history);
  });

  it("Throws an error if values are missing", async () => {
    const module = new InventoryModule();

    await expect(module.run()).rejects.toThrow(InventoryValidationError);
  });

  it("Throws an error if method is missing", async () => {
    const module = new InventoryModule();

    await expect(module.run({})).rejects.toThrow(InventoryValidationError);
  });

  it("Accepts getInventoryReport without additional values", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({ method: "getInventoryReport" });
    }).not.toThrow();
  });

  it("Throws an error if productId is invalid", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({
        method: "registerInventoryChange",
        productId: 3,
      });
    }).toThrow(InventoryValidationError);
  });

  it("Throws an error if inventory change type is missing", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({
        method: "registerInventoryChange",
        productId: 1,
        type: null,
      });
    }).toThrow(InventoryValidationError);
  });

  it("Throws an error if inventory change type is invalid", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({
        method: "registerInventoryChange",
        productId: 1,
        type: "AUCTION",
      });
    }).toThrow(InventoryValidationError);
  });

  it("Throws an error if quantity is not a finite number", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({
        method: "registerInventoryChange",
        productId: 1,
        type: "SALE",
        quantity: Infinity,
      });
    }).toThrow(InventoryValidationError);
  });

  it("Throws an error if quantity is zero or negative", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({
        method: "registerInventoryChange",
        productId: 1,
        type: "SALE",
        quantity: -1,
      });
    }).toThrow(InventoryValidationError);
  });

  it("Throws an error if method is unknown", () => {
    const module = new InventoryModule();

    expect(() => {
      module.validateValues({
        method: "registerInventoryItem",
      });
    }).toThrow(InventoryValidationError);
  });

  it("Runs getInventoryReport", async () => {
    const module = new InventoryModule();

    module.inventoryService.getInventoryReport = vi.fn();

    await module.run({ method: "getInventoryReport" });

    expect(module.inventoryService.getInventoryReport).toHaveBeenCalled();
  });

  it("Runs registerInventoryChange", async () => {
    const module = new InventoryModule();

    module.inventoryService.registerInventoryChange = vi.fn();

    await module.run({
      method: "registerInventoryChange",
      productId: 1,
      type: "SALE",
      quantity: 3,
    });

    expect(module.inventoryService.registerInventoryChange).toHaveBeenCalled();
  });

  it("Passes values to registerInventoryChange", async () => {
    const module = new InventoryModule();

    module.inventoryService.registerInventoryChange = vi.fn();

    await module.run({
      method: "registerInventoryChange",
      productId: 1,
      type: "SALE",
      quantity: 3,
    });

    expect(
      module.inventoryService.registerInventoryChange,
    ).toHaveBeenCalledWith(1, "SALE", 3, undefined);
  });
});
