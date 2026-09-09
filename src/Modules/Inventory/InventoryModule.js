import InventoryService from "./InventoryService";

export default class InventoryModule {
  static descriptor = {
    name: "Inventory",
    methodsAndInputs: [
      {
        method: "getInventoryReport",
        input: [],
        output: "A report about inventory balance",
      },
      {
        method: "registerInventoryChange",
        input: ["productId", "type", "quantity"],
        output: "The registered inventory change",
      },
    ],
  };

  constructor() {
    this.inventoryService = new InventoryService();
    this.history = [];
  }

  validateValues(values) {
    if (!values) {
      throw new Error("Values are required.");
    }

    if (!values.method) {
      throw new Error("A method is required.");
    }

    if (values.method === "getInventoryReport") {
      return;
    }

    if (values.method === "registerInventoryChange") {
      if (!Number.isInteger(values.productId) || values.productId <= 0) {
        throw new Error("productId must be a positive integer.");
      }

      if (!values.type) {
        throw new Error("Inventory change type is required.");
      }

      if (
        !["ORDER", "SALE", "ADJUSTMENTINCREASE", "ADJUSTMENTDECREASE"].includes(
          values.type,
        )
      ) {
        throw new Error(
          "Invalid inventory change type. Use ORDER, SALE, ADJUSTMENTINCREASE or ADJUSTMENTDECREASE.",
        );
      }

      if (!Number.isFinite(values.quantity)) {
        throw new Error("Quantity must be a finite number.");
      }

      if (values.quantity <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }

      return;
    }

    throw new Error(`Unknown inventory method: ${values.method}`);
  }

  async run(values, context) {
    this.validateValues(values);

    if (values.method === "getInventoryReport") {
      const report = await this.inventoryService.getInventoryReport();

      this.history.push({
        method: "getInventoryReport",
        timestamp: new Date(),
      });

      return report;
    }

    if (values.method === "registerInventoryChange") {
      const change = await this.inventoryService.registerInventoryChange(
        values.productId,
        values.type,
        values.quantity,
      );

      this.history.push({
        method: "registerInventoryChange",
        timestamp: new Date(),
      });

      return change;
    }
  }
}
