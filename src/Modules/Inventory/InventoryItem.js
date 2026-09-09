export default class InventoryItem {
  constructor(product, reorderBreakPoint) {
    this.product = product;
    this.productId = product.id;
    this.productName = product.title;
    this.stock = product.stock;
    this.reorderBreakPoint = reorderBreakPoint;
    this.changes = [];
  }

  addChange(change) {
    this.changes.push(change);
  }

  calculateStock() {
    return this.stock;
  }

  calculateSales() {
    let totalSales = 0;

    for (const change of this.changes) {
      if (change.type === "SALE") {
        totalSales += change.quantity;
      }
    }

    return totalSales;
  }

  calculateReorderBreakPoint() {
    return this.reorderBreakPoint;
  }

  needsReorder() {
    return this.calculateStock() < this.calculateReorderBreakPoint();
  }
}
