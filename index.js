/**
 * Main OrderSystem Demo
 * Demonstrates event-driven order processing system
 */

// Import all services
const EventBus = require("./EventBus");
const OrderService = require("./OrderService");
const EmailService = require("./EmailService");
const ShippingService = require("./ShippingService");
const InventoryService = require("./InventoryService");

/**
 * Initialize the order system
 */
function initializeOrderSystem() {
  // Create event bus - the central communication hub
  const eventBus = new EventBus();

  // Create service instances, injecting eventBus dependency
  const orderService = new OrderService(eventBus);
  const emailService = new EmailService(eventBus);
  const shippingService = new ShippingService(eventBus);
  const inventoryService = new InventoryService(eventBus);

  return {
    eventBus,
    orderService,
    emailService,
    shippingService,
    inventoryService,
  };
}

/**
 * Run the demo
 */
function runDemo() {
  console.log("=== Order System Demo ===\n");

  const {
    eventBus,
    orderService,
    emailService,
    shippingService,
    inventoryService,
  } = initializeOrderSystem();

  // Register additional event listeners for demo
  eventBus.on("inventory:low_stock", (data) => {
    console.log(
      `[ALERT] Low stock warning: ${data.item} (${data.currentStock} remaining)`
    );
  });

  eventBus.on("order:delivered", (shipmentData) => {
    orderService.updateOrderStatus(shipmentData.orderId, "delivered");
  });

  try {
    // Create first order
    console.log("🛒 Creating first order...");
    const order1 = orderService.createOrder({
      orderId: "ORD123",
      email: "user@example.com",
      item: "MacBook Pro",
      address: "123 Apple St, Cupertino, CA",
    });

    // Create second order after a delay
    setTimeout(() => {
      console.log("\n🛒 Creating second order...");
      const order2 = orderService.createOrder({
        orderId: "ORD124",
        email: "jane@example.com",
        item: "iPhone 15",
        address: "456 Oak St, San Francisco, CA",
      });
    }, 2000);

    // Create third order to test low stock
    setTimeout(() => {
      console.log("\n🛒 Creating multiple orders to test inventory...");
      for (let i = 1; i <= 3; i++) {
        orderService.createOrder({
          orderId: `ORD12${4 + i}`,
          email: `customer${i}@example.com`,
          item: "iPad Air",
          address: `${100 + i} Main St, Tech City, CA`,
        });
      }
    }, 4000);

    // Show system state after all processing
    setTimeout(() => {
      console.log("\n" + "=".repeat(50));
      console.log("📊 FINAL SYSTEM STATE");
      console.log("=".repeat(50));

      console.log("\n📋 Orders:");
      orderService.getAllOrders().forEach((order) => {
        console.log(`  - ${order.orderId}: ${order.item} (${order.status})`);
      });

      console.log("\n📦 Inventory:");
      inventoryService.getInventory().forEach((item) => {
        console.log(`  - ${item.item}: ${item.stock} units @ $${item.price}`);
      });

      console.log("\n📧 Email Summary:");
      const emailStats = emailService
        .getEmailHistory()
        .reduce((stats, email) => {
          stats[email.type] = (stats[email.type] || 0) + 1;
          return stats;
        }, {});
      Object.entries(emailStats).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count} emails sent`);
      });

      console.log("\n🚚 Shipping Summary:");
      const shippingStats = shippingService
        .getAllShipments()
        .reduce((stats, shipment) => {
          stats[shipment.status] = (stats[shipment.status] || 0) + 1;
          return stats;
        }, {});
      Object.entries(shippingStats).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count} shipments`);
      });

      console.log("\n🎯 Active Events:", eventBus.getEvents().join(", "));

      console.log("\n✅ Demo completed successfully!");
    }, 8000);
  } catch (error) {
    console.error("❌ Error in demo:", error.message);
  }
}

// Export for testing or run demo if called directly
if (require.main === module) {
  runDemo();
} else {
  module.exports = {
    initializeOrderSystem,
    runDemo,
    EventBus,
    OrderService,
    EmailService,
    ShippingService,
    InventoryService,
  };
}
