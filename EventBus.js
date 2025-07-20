/**
 * EventBus - A simple event emitter for loosely coupled communication
 * between services in an event-driven architecture.
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Register an event listener
   * @param {string} eventName - Name of the event to listen for
   * @param {function} listener - Callback function to execute
   */
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  /**
   * Unregister an event listener
   * @param {string} eventName - Name of the event
   * @param {function} listener - Specific listener to remove
   */
  off(eventName, listener) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (l) => l !== listener
      );
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
    }
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} eventName - Name of the event to emit
   * @param {*} payload - Data to pass to listeners
   */
  emit(eventName, payload) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => {
        try {
          listener(payload);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Get list of active event names for debugging
   * @returns {string[]} Array of event names
   */
  getEvents() {
    return Object.keys(this.events);
  }

  /**
   * Get detailed event information for debugging
   * @returns {Object} Event details with listener counts
   */
  getEventDetails() {
    return Object.entries(this.events).reduce(
      (details, [eventName, listeners]) => {
        details[eventName] = {
          listenerCount: listeners.length,
          listeners: listeners.map((l) => l.name || "anonymous"),
        };
        return details;
      },
      {}
    );
  }
}

module.exports = EventBus;
