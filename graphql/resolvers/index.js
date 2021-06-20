const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const messagesResolver = require('./messages');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...messagesResolver
};

module.exports = rootResolver;