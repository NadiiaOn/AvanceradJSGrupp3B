import { getInventory, createInventoryChange } from "../../api/inventory";
import { updateProductStock } from "../../api/products";
import fetchProducts from "../../api/fetchProducts";
import InventoryItem from "./InventoryItem";
import InventoryChange from "./InventoryChange";

export default class InventoryService {
  // Gets inventory from db.json.
  async loadInventory() {
    const inventory = await getInventory();

    return inventory;
  }

  // Gets products from db.json.
  async loadProducts() {
    const products = await fetchProducts();

    return products;
  }

  // Creates InventoryItem from the products.
  createInventoryItems(products) {
    return products.map((product) => {
      return new InventoryItem(product, 10);
    });
  }

  addInventoryChanges(items, inventory) {
    for (const changeData of inventory) {
      const item = items.find(
        (item) => Number(item.productId) === Number(changeData.productId),
      );

      if (!item) {
        continue;
      }

      const change = new InventoryChange(
        changeData.productId,
        changeData.type,
        changeData.quantity,
        changeData.timestamp,
      );

      item.addChange(change);
    }

    return items;
  }

  async getInventoryReport() {
    const products = await this.loadProducts();
    const inventory = await this.loadInventory();

    const items = this.createInventoryItems(products);

    this.addInventoryChanges(items, inventory);

    return items;
  }

  async registerInventoryChange(productId, type, quantity) {
    const products = await this.loadProducts();

    const product = products.find(
      (product) => Number(product.id) === Number(productId),
    );

    if (!product) {
      throw new Error("Produkten kunde inte hittas.");
    }

    let newStock = product.stock;

    if (type === "ORDER") {
      newStock += quantity;
    } else if (type === "SALE") {
      newStock -= quantity;
    } else if (type === "ADJUSTMENTINCREASE") {
      newStock += quantity;
    } else if (type === "ADJUSTMENTDECREASE") {
      newStock -= quantity;
    }

    if (newStock < 0) {
      throw new Error("Lagret kan inte bli negativt.");
    }

    const change = new InventoryChange(productId, type, quantity, new Date());

    await createInventoryChange(change);

    return await updateProductStock(productId, newStock);
  }
}
