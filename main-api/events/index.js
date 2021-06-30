
// initialize event emitter 
const EventEmitter = require('events');
const path = require('path');
const responses = require(path.join(__dirname, '../events/response'));
class ExtendedEventEmitter extends EventEmitter { }
const AppEventEmitter = new ExtendedEventEmitter()
for (let event in responses) {
    AppEventEmitter.on(event, responses[event]);
}
module.exports = AppEventEmitter;