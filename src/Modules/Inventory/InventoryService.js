import {
  getInventoryHistory,
  createInventoryChange,
} from "../../api/inventory";
import { updateProductStock } from "../../api/products";
import fetchProducts from "../../api/fetchProducts";
import InventoryItem from "./InventoryItem";
import InventoryChange from "./InventoryChange";
import InventoryNotFoundError from "./errors/InventoryNotFoundError";
import InventoryValidationError from "./errors/InventoryValidationError";
import InventoryOperationError from "./errors/InventoryOperationError";

export default class InventoryService {
  // Gets inventoryHistory from db.json.
  async loadInventoryHistory() {
    const inventoryHistory = await getInventoryHistory();

    return inventoryHistory;
  }

  // Gets products from db.json.
  async loadProducts() {
    const products = await fetchProducts();

    return products;
  }

  // Creates InventoryItem from the products.
  createInventoryItems(products) {
    return products.map((product) => {
      return new InventoryItem(product);
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
        changeData.id,
      );

      item.addChange(change);
    }

    return items;
  }

  async getInventoryReport() {
    const products = await this.loadProducts();
    const inventoryHistory = await this.loadInventoryHistory();

    const items = this.createInventoryItems(products);

    this.addInventoryChanges(items, inventoryHistory);

    return items;
  }

  async registerInventoryChange(productId, type, quantity) {
    const products = await this.loadProducts();

    const product = products.find(
      (product) => Number(product.id) === Number(productId),
    );

    if (!product) {
      throw new InventoryNotFoundError("Produkten kunde inte hittas.");
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
      throw new InventoryValidationError("Lagret kan inte bli negativt.");
    }

    const change = new InventoryChange(productId, type, quantity, new Date());

    try {
      await createInventoryChange(change);

      return await updateProductStock(productId, newStock);
    } catch (error) {
      throw new InventoryOperationError(
        "Kunde inte registrera lagerändringen.",
      );
    }
  }
}
