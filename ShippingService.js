/**
 * ShippingService - Handles order shipping and tracking
 */
class ShippingService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.shipments = new Map();

    // Bind methods to preserve 'this' context
    this.processShipping = this.processShipping.bind(this);

    // Register event listeners
    this.eventBus.on("order:created", this.processShipping);
  }

  /**
   * Process shipping for an order
   * @param {Object} orderData - Order information
   */
  processShipping(orderData) {
    // Simulate shipping processing delay
    setTimeout(() => {
      const shipmentData = {
        orderId: orderData.orderId,
        address: orderData.address,
        item: orderData.item,
        trackingNumber: this.generateTrackingNumber(),
        status: "shipped",
        shippedAt: new Date().toISOString(),
        estimatedDelivery: this.calculateDeliveryDate(),
      };

      this.shipments.set(orderData.orderId, shipmentData);
      console.log(`[ShippingService] Order shipped:`, shipmentData);

      // Emit shipping event for other services
      this.eventBus.emit("order:shipped", { ...orderData, ...shipmentData });

      // Simulate delivery after some time
      this.scheduleDelivery(orderData.orderId, shipmentData.estimatedDelivery);
    }, 1000); // 1 second delay to simulate processing
  }

  /**
   * Generate a unique tracking number
   * @returns {string} Tracking number
   */
  generateTrackingNumber() {
    const prefix = "TRK";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Calculate estimated delivery date
   * @returns {string} ISO date string for estimated delivery
   */
  calculateDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
    return deliveryDate.toISOString();
  }

  /**
   * Schedule delivery simulation
   * @param {string} orderId - Order ID
   * @param {string} deliveryDate - Delivery date
   */
  scheduleDelivery(orderId, deliveryDate) {
    // Simulate delivery in 5 seconds for demo purposes
    setTimeout(() => {
      const shipment = this.shipments.get(orderId);
      if (shipment) {
        shipment.status = "delivered";
        shipment.deliveredAt = new Date().toISOString();
        console.log(`[ShippingService] Order delivered:`, shipment);
        this.eventBus.emit("order:delivered", shipment);
      }
    }, 5000);
  }

  /**
   * Get shipment information by order ID
   * @param {string} orderId - Order ID
   * @returns {Object|undefined} Shipment data or undefined
   */
  getShipment(orderId) {
    return this.shipments.get(orderId);
  }

  /**
   * Get all shipments
   * @returns {Object[]} Array of all shipments
   */
  getAllShipments() {
    return Array.from(this.shipments.values());
  }

  /**
   * Track shipment by tracking number
   * @param {string} trackingNumber - Tracking number
   * @returns {Object|undefined} Shipment data or undefined
   */
  trackShipment(trackingNumber) {
    return Array.from(this.shipments.values()).find(
      (shipment) => shipment.trackingNumber === trackingNumber
    );
  }

  /**
   * Get shipments by status
   * @param {string} status - Status to filter by
   * @returns {Object[]} Array of shipments with matching status
   */
  getShipmentsByStatus(status) {
    return Array.from(this.shipments.values()).filter(
      (shipment) => shipment.status === status
    );
  }
}

module.exports = ShippingService;
