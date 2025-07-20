/**
 * OrderService - Handles order creation, validation, and management
 */
class OrderService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.orders = new Map(); // Store orders with better data structure
  }

  /**
   * Create a new order with validation and enrichment
   * @param {Object} orderData - Raw order data
   * @returns {Object} Enriched order object
   */
  createOrder(orderData) {
    // Validate order data
    if (!orderData.orderId || !orderData.email || !orderData.item) {
      throw new Error("Missing required order fields: orderId, email, item");
    }

    // Check for duplicate order ID
    if (this.orders.has(orderData.orderId)) {
      throw new Error(`Order ${orderData.orderId} already exists`);
    }

    // Add timestamp and status
    const enrichedOrder = {
      ...orderData,
      timestamp: new Date().toISOString(),
      status: "created",
    };

    // Store the order
    this.orders.set(orderData.orderId, enrichedOrder);

    console.log(`[OrderService] Order created:`, enrichedOrder);
    this.eventBus.emit("order:created", enrichedOrder);

    return enrichedOrder;
  }

  /**
   * Get a specific order by ID
   * @param {string} orderId - Order ID to retrieve
   * @returns {Object|undefined} Order object or undefined if not found
   */
  getOrder(orderId) {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders
   * @returns {Object[]} Array of all orders
   */
  getAllOrders() {
    return Array.from(this.orders.values());
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID to update
   * @param {string} status - New status
   */
  updateOrderStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = status;
      order.lastUpdated = new Date().toISOString();
      this.eventBus.emit("order:status_updated", { orderId, status, order });
    }
  }

  /**
   * Get orders by status
   * @param {string} status - Status to filter by
   * @returns {Object[]} Array of orders with matching status
   */
  getOrdersByStatus(status) {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === status
    );
  }
}

module.exports = OrderService;
