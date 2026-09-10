export default class InventoryOperationError extends Error {
  constructor(message) {
    super(message);
    this.name = "InventoryOperationError";
  }
}
