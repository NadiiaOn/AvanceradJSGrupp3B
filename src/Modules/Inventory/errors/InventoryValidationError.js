export default class InventoryValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "InventoryValidationError";
  }
}
