/**
 * EmailService - Handles email notifications for orders
 */
class EmailService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.sentEmails = [];

    // Bind methods to preserve 'this' context
    this.sendConfirmation = this.sendConfirmation.bind(this);
    this.sendShippingNotification = this.sendShippingNotification.bind(this);
    this.sendStatusUpdate = this.sendStatusUpdate.bind(this);

    // Register event listeners
    this.eventBus.on("order:created", this.sendConfirmation);
    this.eventBus.on("order:shipped", this.sendShippingNotification);
    this.eventBus.on("order:status_updated", this.sendStatusUpdate);
  }

  /**
   * Send order confirmation email
   * @param {Object} orderData - Order information
   */
  sendConfirmation(orderData) {
    const emailData = {
      type: "confirmation",
      to: orderData.email,
      subject: `Order Confirmation - ${orderData.orderId}`,
      body: `Thank you for your order of ${orderData.item}. We'll process it shortly.`,
      timestamp: new Date().toISOString(),
      orderId: orderData.orderId,
    };

    this.sentEmails.push(emailData);
    console.log(`[EmailService] Confirmation sent:`, emailData);
  }

  /**
   * Send shipping notification email
   * @param {Object} orderData - Order and shipping information
   */
  sendShippingNotification(orderData) {
    const emailData = {
      type: "shipping",
      to: orderData.email,
      subject: `Your order ${orderData.orderId} has shipped!`,
      body: `Your ${orderData.item} is on its way to ${orderData.address}. Tracking: ${orderData.trackingNumber}`,
      timestamp: new Date().toISOString(),
      orderId: orderData.orderId,
      trackingNumber: orderData.trackingNumber,
    };

    this.sentEmails.push(emailData);
    console.log(`[EmailService] Shipping notification sent:`, emailData);
  }

  /**
   * Send status update email
   * @param {Object} data - Status update information
   */
  sendStatusUpdate(data) {
    if (data.status === "cancelled" || data.status === "delivered") {
      const emailData = {
        type: "status_update",
        to: data.order.email,
        subject: `Order ${data.orderId} ${data.status}`,
        body: `Your order status has been updated to: ${data.status}`,
        timestamp: new Date().toISOString(),
        orderId: data.orderId,
        status: data.status,
      };

      this.sentEmails.push(emailData);
      console.log(`[EmailService] Status update sent:`, emailData);
    }
  }

  /**
   * Get email history
   * @returns {Object[]} Array of sent emails
   */
  getEmailHistory() {
    return this.sentEmails;
  }

  /**
   * Get emails by type
   * @param {string} type - Email type to filter by
   * @returns {Object[]} Array of emails of specified type
   */
  getEmailsByType(type) {
    return this.sentEmails.filter((email) => email.type === type);
  }

  /**
   * Get emails for a specific order
   * @param {string} orderId - Order ID to filter by
   * @returns {Object[]} Array of emails for the order
   */
  getEmailsForOrder(orderId) {
    return this.sentEmails.filter((email) => email.orderId === orderId);
  }
}

module.exports = EmailService;
