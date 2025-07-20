# Order System - Event-Driven Architecture Demo

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](./test.js)

> A production-ready demonstration of event-driven microservices architecture using Node.js. Built to showcase enterprise-level design patterns, clean code practices, and comprehensive testing.

## 🎯 **What This Demonstrates**

This project showcases my ability to:

- ✅ Design **event-driven architectures**
- ✅ Implement **microservices patterns**
- ✅ Write **clean, maintainable code**
- ✅ Create **comprehensive test suites**
- ✅ Document **professional-grade projects**
- ✅ Handle **async operations** and **error management**

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   OrderService  │    │  EmailService   │    │ ShippingService │
│                 │    │                 │    │                 │
│ • Create orders │    │ • Send emails   │    │ • Process ship  │
│ • Validate data │    │ • Track history │    │ • Generate nums │
│ • Store orders  │    │ • Multi types   │    │ • Track status  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │              ┌───────────────┐              │
          └──────────────▶│   EventBus    │◀─────────────┘
                         │               │
          ┌──────────────▶│ • on()        │◀─────────────┐
          │              │ • emit()      │              │
          │              │ • off()       │              │
┌─────────┴───────┐      │ • Error safe  │      ┌───────┴─────────┐
│ InventoryService│      └───────────────┘      │   Your Custom   │
│                 │                             │    Services     │
│ • Track stock   │                             │                 │
│ • Reservations  │                             │ • Analytics     │
│ • Low stock     │                             │ • Logging       │
└─────────────────┘                             │ • Monitoring    │
                                                └─────────────────┘
```

## 🚀 **Quick Demo**

```bash
# Clone and run
git clone https://github.com/yourusername/order-system-demo.git
cd order-system-demo
npm install
npm start

# Run tests
npm test
```

**Expected Output:**

```
🛒 Creating first order...
[OrderService] Order created: { orderId: 'ORD123', ... }
[EmailService] Confirmation sent: { to: 'user@example.com', ... }
[InventoryService] Item reserved: MacBook Pro, Stock remaining: 9
[ShippingService] Order shipped: { trackingNumber: 'TRK...', ... }
✅ Demo completed successfully!
```

## 🎯 **Key Features & Patterns**

### **Event-Driven Architecture**

- Loose coupling between services
- Asynchronous communication
- Scalable and maintainable design

### **Error Resilience**

- Graceful error handling in event listeners
- Service isolation (one failure doesn't crash system)
- Comprehensive input validation

### **Production Patterns**

- Dependency injection
- Modular service design
- Comprehensive logging and monitoring

### **Testing Strategy**

- Unit tests for individual services
- Integration tests for service communication
- 100% test pass rate with clear assertions

## 📊 **Technical Highlights**

| Feature             | Implementation                                     |
| ------------------- | -------------------------------------------------- |
| **Architecture**    | Event-driven microservices                         |
| **Communication**   | Custom EventBus with error handling                |
| **Data Management** | In-memory Maps with structured data                |
| **Async Patterns**  | Promises, setTimeout for realistic delays          |
| **Error Handling**  | Try-catch blocks, validation, graceful degradation |
| **Testing**         | Custom test framework with comprehensive coverage  |
| **Documentation**   | JSDoc comments, README, usage examples             |

## 🔧 **Code Quality Features**

- **Modular Design**: Each service in its own file
- **Dependency Injection**: Services receive dependencies, not global state
- **Event Naming**: Consistent `resource:action` naming convention
- **Error Boundaries**: Errors in one service don't crash others
- **Memory Management**: Efficient use of Maps and cleanup methods
- **Documentation**: Comprehensive JSDoc and inline comments

## 📈 **Real-World Applications**

This pattern scales to production systems:

- **E-commerce Platforms**: Order processing workflows
- **Financial Systems**: Transaction processing and notifications
- **IoT Applications**: Device event handling and automation
- **Content Management**: Publishing workflows and notifications
- **Gaming**: Player actions and game state management

## 🛠️ **Technologies Used**

- **Node.js**: Runtime environment
- **JavaScript ES6+**: Modern language features
- **Event-Driven Patterns**: Observer pattern implementation
- **Async/Await**: Promise-based async handling
- **Custom Testing**: Lightweight test framework
- **Modular Architecture**: CommonJS modules

## 💡 **What I Learned Building This**

- How to design loosely coupled systems
- Event-driven architecture best practices
- JavaScript context binding (`this` in callbacks)
- Async programming patterns and timing
- Error handling in distributed systems
- Testing strategies for event-driven code
- Documentation practices for complex systems

## 🎯 **Potential Enhancements**

- [ ] Add Redis/RabbitMQ for production event bus
- [ ] Implement REST API layer
- [ ] Add database persistence (MongoDB/PostgreSQL)
- [ ] Create Docker containerization
- [ ] Add monitoring and metrics
- [ ] Implement authentication/authorization
- [ ] Add rate limiting and circuit breakers

## 📞 **Contact**

Built by [Karl Kwon] - [karl.kwon.phd@gmail.com]

- 💼 [LinkedIn](https://linkedin.com/in/karlkwonphd)
- 🐙 [GitHub](https://github.com/kyeongan/order-system-demo)

---

_This project demonstrates enterprise-level software architecture patterns and is designed to showcase technical depth and code quality for potential employers._
