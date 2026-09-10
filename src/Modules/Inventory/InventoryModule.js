import InventoryValidationError from "./errors/InventoryValidationError";
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
      throw new InventoryValidationError("Värden är obligatoriska.");
    }

    if (!values.method) {
      throw new InventoryValidationError("En metod krävs.");
    }

    if (values.method === "getInventoryReport") {
      return;
    }

    if (values.method === "registerInventoryChange") {
      if (!Number.isInteger(values.productId) || values.productId <= 0) {
        throw new InventoryValidationError(
          "Produkt-ID måste vara ett positivt tal.",
        );
      }

      if (!values.type) {
        throw new InventoryValidationError("en typ av lagerändring krävs!");
      }

      if (
        !["ORDER", "SALE", "ADJUSTMENTINCREASE", "ADJUSTMENTDECREASE"].includes(
          values.type,
        )
      ) {
        throw new InventoryValidationError(
          "Ogiltig lagerändringstyp. Använd: ORDER, SALE, ADJUSTMENTINCREASE eller ADJUSTMENTDECREASE.",
        );
      }

      if (!Number.isFinite(values.quantity)) {
        throw new InventoryValidationError(
          "Kvantiteten måste vara ett ändligt tal!",
        );
      }

      if (values.quantity <= 0) {
        throw new InventoryValidationError(
          "Kvantiteten måste vara större än 0.",
        );
      }

      return;
    }

    throw new InventoryValidationError(
      `Okänd 'inventory' metod: ${values.method}`,
    );
  }

  async run(values) {
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
