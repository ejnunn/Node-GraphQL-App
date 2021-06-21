const Event = require('../../models/event');
const User = require('../../models/user');
const Message = require('../../models/message');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const messages = async messageIds => {
  try {
    const messages = await Message.find({ _id: { $in: messageIds } });
    return messages.map(message => {
      return transformMessage(message);
    });
  } catch (err) {
    throw err;
  }
};

const transformMessage = message => {
  return {
    ...message._doc,
    _id: message.id,
    sender: user.bind(this, message._doc.sender),
    recipient: user.bind(this, message._doc.recipient),
    date: dateToString(message._doc.date),
    body: message.body
  };
};

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    email: user.email
  };
};


exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformMessage = transformMessage;
exports.transformUser = transformUser;