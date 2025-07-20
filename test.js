/**
 * Simple test suite for the Order System
 */

const {
  EventBus,
  OrderService,
  EmailService,
  ShippingService,
  InventoryService,
} = require("./index");

function runTests() {
  console.log("🧪 Running Order System Tests...\n");

  let passed = 0;
  let failed = 0;

  function test(description, testFunction) {
    try {
      testFunction();
      console.log(`✅ ${description}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${description}: ${error.message}`);
      failed++;
    }
  }

  // Test EventBus
  test("EventBus can register and emit events", () => {
    const eventBus = new EventBus();
    let called = false;

    eventBus.on("test", () => {
      called = true;
    });
    eventBus.emit("test");

    if (!called) throw new Error("Event listener not called");
  });

  test("EventBus handles errors gracefully", () => {
    const eventBus = new EventBus();

    eventBus.on("error-test", () => {
      throw new Error("Test error");
    });

    // Should not throw
    eventBus.emit("error-test");
  });

  // Test OrderService
  test("OrderService validates required fields", () => {
    const eventBus = new EventBus();
    const orderService = new OrderService(eventBus);

    try {
      orderService.createOrder({ orderId: "123" }); // Missing email and item
      throw new Error("Should have thrown validation error");
    } catch (error) {
      if (!error.message.includes("Missing required")) {
        throw error;
      }
    }
  });

  test("OrderService creates valid orders", () => {
    const eventBus = new EventBus();
    const orderService = new OrderService(eventBus);

    const order = orderService.createOrder({
      orderId: "TEST123",
      email: "test@example.com",
      item: "Test Product",
    });

    if (order.status !== "created") throw new Error("Order status not set");
    if (!order.timestamp) throw new Error("Timestamp not added");
  });

  test("OrderService prevents duplicate orders", () => {
    const eventBus = new EventBus();
    const orderService = new OrderService(eventBus);

    const orderData = {
      orderId: "DUP123",
      email: "test@example.com",
      item: "Test Product",
    };

    orderService.createOrder(orderData);

    try {
      orderService.createOrder(orderData); // Duplicate
      throw new Error("Should have thrown duplicate error");
    } catch (error) {
      if (!error.message.includes("already exists")) {
        throw error;
      }
    }
  });

  // Test InventoryService
  test("InventoryService reserves items correctly", () => {
    const eventBus = new EventBus();
    const inventoryService = new InventoryService(eventBus);

    const initialStock = inventoryService.inventory.get("MacBook Pro").stock;

    inventoryService.checkAndReserveItem({
      orderId: "INV123",
      item: "MacBook Pro",
    });

    const newStock = inventoryService.inventory.get("MacBook Pro").stock;
    if (newStock !== initialStock - 1) {
      throw new Error("Stock not decremented correctly");
    }
  });

  test("InventoryService handles unavailable items", () => {
    const eventBus = new EventBus();
    const inventoryService = new InventoryService(eventBus);

    let eventEmitted = false;
    eventBus.on("order:inventory_unavailable", () => {
      eventEmitted = true;
    });

    inventoryService.checkAndReserveItem({
      orderId: "UNAVAIL123",
      item: "Nonexistent Product",
    });

    if (!eventEmitted) throw new Error("Unavailable event not emitted");
  });

  // Test EmailService
  test("EmailService tracks sent emails", () => {
    const eventBus = new EventBus();
    const emailService = new EmailService(eventBus);

    const initialCount = emailService.sentEmails.length;

    emailService.sendConfirmation({
      orderId: "EMAIL123",
      email: "test@example.com",
      item: "Test Product",
    });

    if (emailService.sentEmails.length !== initialCount + 1) {
      throw new Error("Email not tracked");
    }
  });

  // Integration test
  test("Full order flow works end-to-end", (done) => {
    const eventBus = new EventBus();
    const orderService = new OrderService(eventBus);
    const emailService = new EmailService(eventBus);
    const inventoryService = new InventoryService(eventBus);

    let confirmationSent = false;
    let inventoryReserved = false;

    // Monitor events
    eventBus.on("order:inventory_reserved", () => {
      inventoryReserved = true;
    });

    // Check after short delay
    setTimeout(() => {
      confirmationSent = emailService.sentEmails.length > 0;

      if (!confirmationSent) throw new Error("Confirmation not sent");
      if (!inventoryReserved) throw new Error("Inventory not reserved");
    }, 100);

    // Create order
    orderService.createOrder({
      orderId: "INTEGRATION123",
      email: "integration@example.com",
      item: "MacBook Pro",
    });
  });

  // Summary
  setTimeout(() => {
    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(
      `📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
    );

    if (failed === 0) {
      console.log("\n🎉 All tests passed!");
    } else {
      console.log(`\n⚠️  ${failed} test(s) failed`);
    }
  }, 200);
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
