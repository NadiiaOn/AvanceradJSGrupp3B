export default class InventoryChange {
  constructor(productId, type, quantity, timestamp = new Date()) {
    this.productId = productId;
    this.type = type;
    this.quantity = quantity;
    this.timestamp = timestamp;
  }
}
