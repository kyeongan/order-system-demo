/**
 * Usage Examples for Order System
 *
 * This file demonstrates how to use the Order System in different scenarios
 */

const { initializeOrderSystem } = require("./index");

// Example 1: Basic Order Processing
function basicOrderExample() {
  console.log("=== Basic Order Example ===");

  const { orderService } = initializeOrderSystem();

  try {
    const order = orderService.createOrder({
      orderId: "BASIC001",
      email: "customer@example.com",
      item: "MacBook Pro",
      address: "123 Main St, Anytown, USA",
    });

    console.log("Order created:", order);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 2: Error Handling
function errorHandlingExample() {
  console.log("\n=== Error Handling Example ===");

  const { orderService } = initializeOrderSystem();

  try {
    // This will fail validation
    orderService.createOrder({
      orderId: "ERROR001",
      // Missing required fields
    });
  } catch (error) {
    console.log("Caught expected error:", error.message);
  }
}

// Example 3: Service Integration
function serviceIntegrationExample() {
  console.log("\n=== Service Integration Example ===");

  const { eventBus, orderService, inventoryService, emailService } =
    initializeOrderSystem();

  // Add custom event listener
  eventBus.on("order:created", (orderData) => {
    console.log(`Custom listener: Processing order ${orderData.orderId}`);
  });

  // Create order and let services handle it
  const order = orderService.createOrder({
    orderId: "INTEGRATION001",
    email: "integration@example.com",
    item: "iPhone 15",
    address: "456 Integration Ave, Dev City, CA",
  });

  // Check inventory status
  setTimeout(() => {
    console.log("Current inventory:", inventoryService.getInventory());
    console.log("Email history:", emailService.getEmailHistory());
  }, 100);
}

// Example 4: Custom Service
class LoggingService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.logs = [];

    // Listen to all order events
    this.eventBus.on("order:created", this.logEvent.bind(this));
    this.eventBus.on("order:shipped", this.logEvent.bind(this));
    this.eventBus.on("order:delivered", this.logEvent.bind(this));
  }

  logEvent(data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: data.orderId ? `Order ${data.orderId}` : "System event",
      data: data,
    };

    this.logs.push(logEntry);
    console.log(`[Logger] ${logEntry.event} logged`);
  }

  getLogs() {
    return this.logs;
  }
}

function customServiceExample() {
  console.log("\n=== Custom Service Example ===");

  const { eventBus, orderService } = initializeOrderSystem();

  // Add custom logging service
  const logger = new LoggingService(eventBus);

  // Create an order
  orderService.createOrder({
    orderId: "CUSTOM001",
    email: "custom@example.com",
    item: "Apple Watch",
    address: "789 Custom St, Service City, TX",
  });

  // Check logs after a delay
  setTimeout(() => {
    console.log("Logged events:", logger.getLogs());
  }, 2000);
}

// Run examples if called directly
if (require.main === module) {
  basicOrderExample();
  errorHandlingExample();
  serviceIntegrationExample();
  customServiceExample();
}

module.exports = {
  basicOrderExample,
  errorHandlingExample,
  serviceIntegrationExample,
  customServiceExample,
  LoggingService,
};
