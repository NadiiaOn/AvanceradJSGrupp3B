import { describe, it, expect, vi } from "vitest";
import InventoryService from "../InventoryService";
import InventoryItem from "../InventoryItem";
import InventoryChange from "../InventoryChange";
import {
  createInventoryChange,
  getInventoryHistory,
} from "../../../api/inventory";
import fetchProducts from "../../../api/fetchProducts";
import { updateProductStock } from "../../../api/products";
import InventoryNotFoundError from "../errors/InventoryNotFoundError";
import InventoryOperationError from "../errors/InventoryOperationError";
import InventoryValidationError from "../errors/InventoryValidationError";

let product = {
  id: "1",
  title: "Essence Mascara Lash Princess",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  stock: 14,
  tags: ["beauty", "mascara"],
  brand: "Essence",
  sku: "BEA-ESS-ESS-001",
  weight: 4,
  dimensions: {
    width: 15.14,
    height: 13.08,
    depth: 22.99,
  },
  warrantyInformation: "1 week warranty",
  shippingInformation: "Ships in 3-5 business days",
  availabilityStatus: "In Stock",
  reviews: [
    {
      rating: 3,
      comment: "Would not recommend!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Eleanor Collins",
      reviewerEmail: "eleanor.collins@x.dummyjson.com",
    },
    {
      rating: 4,
      comment: "Very satisfied!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Lucas Gordon",
      reviewerEmail: "lucas.gordon@x.dummyjson.com",
    },
    {
      rating: 5,
      comment: "Highly impressed!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Eleanor Collins",
      reviewerEmail: "eleanor.collins@x.dummyjson.com",
    },
  ],
  returnPolicy: "No return policy",
  minimumOrderQuantity: 48,
  meta: {
    createdAt: "2025-04-30T09:41:02.053Z",
    updatedAt: "2025-04-30T09:41:02.053Z",
    barcode: "5784719087687",
    qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
  },
  images: [
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
  ],
  thumbnail:
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
};

let products = [
  {
    id: "1",
    title: "Essence Mascara Lash Princess",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 10.48,
    rating: 2.56,
    stock: 14,
    tags: ["beauty", "mascara"],
    brand: "Essence",
    sku: "BEA-ESS-ESS-001",
    weight: 4,
    dimensions: {
      width: 15.14,
      height: 13.08,
      depth: 22.99,
    },
    warrantyInformation: "1 week warranty",
    shippingInformation: "Ships in 3-5 business days",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 3,
        comment: "Would not recommend!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Eleanor Collins",
        reviewerEmail: "eleanor.collins@x.dummyjson.com",
      },
      {
        rating: 4,
        comment: "Very satisfied!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Lucas Gordon",
        reviewerEmail: "lucas.gordon@x.dummyjson.com",
      },
      {
        rating: 5,
        comment: "Highly impressed!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Eleanor Collins",
        reviewerEmail: "eleanor.collins@x.dummyjson.com",
      },
    ],
    returnPolicy: "No return policy",
    minimumOrderQuantity: 48,
    meta: {
      createdAt: "2025-04-30T09:41:02.053Z",
      updatedAt: "2025-04-30T09:41:02.053Z",
      barcode: "5784719087687",
      qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
    },
    images: [
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  },
  {
    id: "2",
    title: "Eyeshadow Palette with Mirror",
    description:
      "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
    category: "beauty",
    price: 19.99,
    discountPercentage: 18.19,
    rating: 2.86,
    stock: 1,
    tags: ["beauty", "eyeshadow"],
    brand: "Glamour Beauty",
    sku: "BEA-GLA-EYE-002",
    weight: 9,
    dimensions: {
      width: 9.26,
      height: 22.47,
      depth: 27.67,
    },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Ships in 2 weeks",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Great product!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Savannah Gomez",
        reviewerEmail: "savannah.gomez@x.dummyjson.com",
      },
      {
        rating: 4,
        comment: "Awesome product!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Christian Perez",
        reviewerEmail: "christian.perez@x.dummyjson.com",
      },
      {
        rating: 1,
        comment: "Poor quality!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Nicholas Bailey",
        reviewerEmail: "nicholas.bailey@x.dummyjson.com",
      },
    ],
    returnPolicy: "7 days return policy",
    minimumOrderQuantity: 20,
    meta: {
      createdAt: "2025-04-30T09:41:02.053Z",
      updatedAt: "2025-04-30T09:41:02.053Z",
      barcode: "9170275171413",
      qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
    },
    images: [
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
  },
  {
    id: "3",
    title: "Powder Canister",
    description:
      "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
    category: "beauty",
    price: 14.99,
    discountPercentage: 9.84,
    rating: 4.64,
    stock: 11,
    tags: ["beauty", "face powder"],
    brand: "Velvet Touch",
    sku: "BEA-VEL-POW-003",
    weight: 8,
    dimensions: {
      width: 29.27,
      height: 27.93,
      depth: 20.59,
    },
    warrantyInformation: "3 months warranty",
    shippingInformation: "Ships in 1-2 business days",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 4,
        comment: "Would buy again!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Alexander Jones",
        reviewerEmail: "alexander.jones@x.dummyjson.com",
      },
      {
        rating: 5,
        comment: "Highly impressed!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Elijah Cruz",
        reviewerEmail: "elijah.cruz@x.dummyjson.com",
      },
      {
        rating: 1,
        comment: "Very dissatisfied!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Avery Perez",
        reviewerEmail: "avery.perez@x.dummyjson.com",
      },
    ],
    returnPolicy: "No return policy",
    minimumOrderQuantity: 22,
    meta: {
      createdAt: "2025-04-30T09:41:02.053Z",
      updatedAt: "2025-04-30T09:41:02.053Z",
      barcode: "8418883906837",
      qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
    },
    images: [
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
  },
];

vi.mock("../../../api/inventory", () => ({
  getInventoryHistory: vi.fn(),
  createInventoryChange: vi.fn(),
}));

vi.mock("../../../api/fetchProducts", () => ({
  default: vi.fn(),
}));

vi.mock("../../../api/products", () => ({
  updateProductStock: vi.fn(),
}));

describe("InventoryService", () => {
  it("Creates InventoryItem from product", () => {
    const inventoryService = new InventoryService();

    const result = inventoryService.createInventoryItems([product]);

    expect(result[0]).toBeInstanceOf(InventoryItem);
  });

  it("Creates InventoryItems from products", () => {
    const inventoryService = new InventoryService();

    const result = inventoryService.createInventoryItems(products);

    expect(result.length).toBe(3);
  });

  it("Adds inventory change to matching product", () => {
    const inventoryService = new InventoryService();

    const item = new InventoryItem(product);

    const types = ["ORDER", "SALE", "ADJUSTMENTINCREASE", "ADJUSTMENTDECREASE"];

    const inventoryData = [
      {
        productId: product.id,
        type: types[1],
        quantity: 1,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const changeData = inventoryService.addInventoryChanges(
      [item],
      inventoryData,
    );

    expect(item.changes.length).toBe(1);
  });

  it("Adds multiple inventory changes to matching product", () => {
    const inventoryService = new InventoryService();

    const item = new InventoryItem(product);

    const types = ["ORDER", "SALE", "ADJUSTMENTINCREASE", "ADJUSTMENTDECREASE"];

    const inventoryData1 = [
      {
        productId: product.id,
        type: types[1],
        quantity: 1,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const inventoryData2 = [
      {
        productId: product.id,
        type: types[0],
        quantity: 4,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const inventoryData3 = [
      {
        productId: product.id,
        type: types[3],
        quantity: 2,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const inventoryData4 = [
      {
        productId: product.id,
        type: types[2],
        quantity: 4,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const changeData = inventoryService.addInventoryChanges(
      [item],
      inventoryData1,
    );

    const changeData2 = inventoryService.addInventoryChanges(
      [item],
      inventoryData2,
    );

    const changeData3 = inventoryService.addInventoryChanges(
      [item],
      inventoryData3,
    );

    const changeData4 = inventoryService.addInventoryChanges(
      [item],
      inventoryData4,
    );

    expect(item.changes.length).toBe(4);
  });

  it("Ignores inventory change if product does not exist", () => {
    const inventoryService = new InventoryService();

    const item = new InventoryItem(product);

    const types = ["ORDER", "SALE", "ADJUSTMENTINCREASE", "ADJUSTMENTDECREASE"];

    const inventoryData = [
      {
        productId: 100,
        type: types[1],
        quantity: 1,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const changeData = inventoryService.addInventoryChanges(
      [item],
      inventoryData,
    );

    expect(item.changes.length).toBe(0);
  });

  it("Creates InventoryChange with change data", () => {
    const inventoryService = new InventoryService();

    const item = new InventoryItem(product);

    const types = ["ORDER", "SALE", "ADJUSTMENTINCREASE", "ADJUSTMENTDECREASE"];

    const inventoryData = [
      {
        productId: product.id,
        type: types[1],
        quantity: 1,
        id: crypto.randomUUID(),
        saleInfo: null,
      },
    ];

    const changeData = inventoryService.addInventoryChanges(
      [item],
      inventoryData,
    );

    expect(item.changes[0]).toBeInstanceOf(InventoryChange);
  });

  it("Loads inventory history", async () => {
    const inventoryService = new InventoryService();

    getInventoryHistory.mockResolvedValue([
      {
        productId: "1",
        type: "SALE",
        quantity: 2,
      },
    ]);

    const result = await inventoryService.loadInventoryHistory();

    expect(result).toEqual([
      {
        productId: "1",
        type: "SALE",
        quantity: 2,
      },
    ]);
  });

  it("Loads products", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);

    const result = await inventoryService.loadProducts();

    expect(result).toEqual(products);
  });

  it("Returns inventory report with products and changes", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    getInventoryHistory.mockResolvedValue([
      {
        productId: "1",
        type: "SALE",
        quantity: 2,
      },
    ]);

    const result = await inventoryService.getInventoryReport();

    expect(result[0]).toBeInstanceOf(InventoryItem);
    expect(result[0].changes.length).toBe(1);
  });

  it("Returns inventory items without changes when history is empty", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    getInventoryHistory.mockResolvedValue([]);

    const result = await inventoryService.getInventoryReport();

    expect(result[0]).toBeInstanceOf(InventoryItem);
    expect(result[0].changes.length).toBe(0);
  });

  it("Registers inventory change for existing product", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    createInventoryChange.mockResolvedValue();
    updateProductStock.mockResolvedValue();

    await inventoryService.registerInventoryChange("1", "SALE", 2);

    expect(updateProductStock).toHaveBeenCalledWith("1", 12);
    expect(createInventoryChange).toHaveBeenCalled();
    expect(createInventoryChange.mock.calls[0][0].productId).toBe("1");
    expect(createInventoryChange.mock.calls[0][0].type).toBe("SALE");
    expect(createInventoryChange.mock.calls[0][0].quantity).toBe(2);
  });

  it("Throws InventoryNotFoundError if product does not exist", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);

    await expect(
      inventoryService.registerInventoryChange("100", "ORDER", 3),
    ).rejects.toBeInstanceOf(InventoryNotFoundError);
  });

  it("Increases stock when registering an order", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    createInventoryChange.mockResolvedValue();
    updateProductStock.mockResolvedValue();

    await inventoryService.registerInventoryChange("1", "ORDER", 3);

    expect(updateProductStock).toHaveBeenCalledWith("1", 17);
  });

  it("Decreases stock when registering a sale", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    createInventoryChange.mockResolvedValue();
    updateProductStock.mockResolvedValue();

    await inventoryService.registerInventoryChange("1", "SALE", 2);

    expect(updateProductStock).toHaveBeenCalledWith("1", 12);
  });

  it("Increases stock for an inventory adjustment", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    createInventoryChange.mockResolvedValue();
    updateProductStock.mockResolvedValue();

    await inventoryService.registerInventoryChange(
      "1",
      "ADJUSTMENTINCREASE",
      10,
    );

    expect(updateProductStock).toHaveBeenCalledWith("1", 24);
  });

  it("Decreases stock for an inventory adjustment", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);
    createInventoryChange.mockResolvedValue();
    updateProductStock.mockResolvedValue();

    await inventoryService.registerInventoryChange(
      "1",
      "ADJUSTMENTDECREASE",
      14,
    );

    expect(updateProductStock).toHaveBeenCalledWith("1", 0);
  });

  it("Throws InventoryValidationError if stock becomes negative", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);

    await expect(
      inventoryService.registerInventoryChange("1", "SALE", 15),
    ).rejects.toBeInstanceOf(InventoryValidationError);
  });

  it("Throws InventoryOperationError if inventory operation fails", async () => {
    const inventoryService = new InventoryService();

    fetchProducts.mockResolvedValue(products);

    createInventoryChange.mockRejectedValue(new Error("Something went wrong!"));

    await expect(
      inventoryService.registerInventoryChange("1", "SALE", 2),
    ).rejects.toBeInstanceOf(InventoryOperationError);
  });
});
