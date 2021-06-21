const User = require('../../models/user');

const { transformUser } = require('./merge');

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  }
};