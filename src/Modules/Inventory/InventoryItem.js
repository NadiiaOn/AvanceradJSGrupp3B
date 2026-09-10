export default class InventoryItem {
  constructor(product) {
    this.product = product;
    this.productId = product.id;
    this.productName = product.title;
    this.stock = product.stock;
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

  calculateSalesRate(days = 7) {
    const today = new Date();

    const sales = this.changes.filter((change) => {
      if (change.type !== "SALE") {
        return false;
      }

      const changeDate = new Date(change.timestamp);
      const difInDays = (today - changeDate) / (1000 * 60 * 60 * 24);

      return difInDays <= days;
    });

    let totalSales = 0;

    for (const change of sales) {
      totalSales += change.quantity;
    }

    return totalSales / days;
  }

  calculateReorderBreakPoint() {
    const salesRate = this.calculateSalesRate();

    return Math.ceil(salesRate * 7);
  }

  needsReorder() {
    return this.calculateStock() <= this.calculateReorderBreakPoint();
  }
}
