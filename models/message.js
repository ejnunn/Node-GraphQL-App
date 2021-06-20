const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Message', messageSchema);