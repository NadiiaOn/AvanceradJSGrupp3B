export default class InventoryNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "InventoryNotFoundError";
  }
}
