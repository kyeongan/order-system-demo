/**
 * InventoryService - Manages product inventory and reservations
 */
class InventoryService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.inventory = new Map([
      ["MacBook Pro", { stock: 10, price: 2399.99, category: "laptops" }],
      ["iPhone 15", { stock: 25, price: 999.99, category: "phones" }],
      ["iPad Air", { stock: 15, price: 599.99, category: "tablets" }],
      ["AirPods Pro", { stock: 50, price: 249.99, category: "accessories" }],
      ["Apple Watch", { stock: 30, price: 399.99, category: "wearables" }],
    ]);

    this.reservations = new Map();
    this.lowStockThreshold = 5;

    // Bind methods
    this.checkAndReserveItem = this.checkAndReserveItem.bind(this);
    this.handleDelivery = this.handleDelivery.bind(this);

    // Register event listeners
    this.eventBus.on("order:created", this.checkAndReserveItem);
    this.eventBus.on("order:delivered", this.handleDelivery);
  }

  /**
   * Check inventory and reserve item for order
   * @param {Object} orderData - Order information
   */
  checkAndReserveItem(orderData) {
    const item = this.inventory.get(orderData.item);

    if (!item) {
      console.log(`[InventoryService] Item not found: ${orderData.item}`);
      this.eventBus.emit("order:inventory_unavailable", orderData);
      return;
    }

    if (item.stock <= 0) {
      console.log(`[InventoryService] Out of stock: ${orderData.item}`);
      this.eventBus.emit("order:out_of_stock", orderData);
      return;
    }

    // Reserve the item
    item.stock -= 1;
    this.reservations.set(orderData.orderId, {
      item: orderData.item,
      quantity: 1,
      price: item.price,
      reservedAt: new Date().toISOString(),
      status: "reserved",
    });

    console.log(
      `[InventoryService] Item reserved: ${orderData.item}, Stock remaining: ${item.stock}`
    );

    // Check for low stock
    if (item.stock <= this.lowStockThreshold) {
      this.eventBus.emit("inventory:low_stock", {
        item: orderData.item,
        currentStock: item.stock,
        threshold: this.lowStockThreshold,
      });
    }

    this.eventBus.emit("order:inventory_reserved", orderData);
  }

  /**
   * Handle order delivery - finalize reservation
   * @param {Object} shipmentData - Shipment information
   */
  handleDelivery(shipmentData) {
    const reservation = this.reservations.get(shipmentData.orderId);
    if (reservation) {
      reservation.status = "fulfilled";
      reservation.fulfilledAt = new Date().toISOString();
      console.log(
        `[InventoryService] Reservation fulfilled for order: ${shipmentData.orderId}`
      );
    }
  }

  /**
   * Add stock for an item
   * @param {string} itemName - Item name
   * @param {number} quantity - Quantity to add
   */
  addStock(itemName, quantity) {
    const item = this.inventory.get(itemName);
    if (item) {
      item.stock += quantity;
      console.log(
        `[InventoryService] Stock added: ${itemName} +${quantity}, Total: ${item.stock}`
      );
      this.eventBus.emit("inventory:stock_added", {
        item: itemName,
        added: quantity,
        total: item.stock,
      });
    }
  }

  /**
   * Add new product to inventory
   * @param {string} itemName - Item name
   * @param {Object} itemData - Item data (stock, price, category)
   */
  addProduct(itemName, itemData) {
    this.inventory.set(itemName, {
      stock: itemData.stock || 0,
      price: itemData.price || 0,
      category: itemData.category || "general",
    });
    console.log(`[InventoryService] New product added: ${itemName}`);
    this.eventBus.emit("inventory:product_added", {
      item: itemName,
      ...itemData,
    });
  }

  /**
   * Get current inventory
   * @returns {Object[]} Array of inventory items
   */
  getInventory() {
    return Array.from(this.inventory.entries()).map(([item, data]) => ({
      item,
      ...data,
    }));
  }

  /**
   * Get low stock items
   * @returns {Object[]} Array of low stock items
   */
  getLowStockItems() {
    return this.getInventory().filter(
      (item) => item.stock <= this.lowStockThreshold
    );
  }

  /**
   * Get inventory by category
   * @param {string} category - Category to filter by
   * @returns {Object[]} Array of items in category
   */
  getInventoryByCategory(category) {
    return this.getInventory().filter((item) => item.category === category);
  }

  /**
   * Get all reservations
   * @returns {Object[]} Array of all reservations
   */
  getReservations() {
    return Array.from(this.reservations.values());
  }

  /**
   * Get reservations by status
   * @param {string} status - Status to filter by
   * @returns {Object[]} Array of reservations with matching status
   */
  getReservationsByStatus(status) {
    return Array.from(this.reservations.values()).filter(
      (reservation) => reservation.status === status
    );
  }

  /**
   * Check if item is available
   * @param {string} itemName - Item name
   * @param {number} quantity - Desired quantity (default: 1)
   * @returns {boolean} True if available
   */
  isAvailable(itemName, quantity = 1) {
    const item = this.inventory.get(itemName);
    return item && item.stock >= quantity;
  }
}

module.exports = InventoryService;
