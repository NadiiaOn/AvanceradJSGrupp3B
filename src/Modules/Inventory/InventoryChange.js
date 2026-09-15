export default class InventoryChange {
  constructor(productId, type, quantity, timestamp = new Date(), id = null) {
    this.id = id;
    this.productId = productId;
    this.type = type;
    this.quantity = quantity;
    this.timestamp = timestamp;
  }
}
