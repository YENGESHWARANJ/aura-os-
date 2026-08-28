const EventEmitter = require("events");

class AuraEventBus extends EventEmitter {}

const eventBus = new AuraEventBus();

module.exports = eventBus;
