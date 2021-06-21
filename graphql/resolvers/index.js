const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const messagesResolver = require('./messages');
const usersResolver = require('./users');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...messagesResolver,
  ...usersResolver
};

module.exports = rootResolver;