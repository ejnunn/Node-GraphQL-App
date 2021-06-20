const Message = require('../../models/message');
const User = require('../../models/user');

const { transformMessage } = require('./merge');

module.exports = {
    messages: async () => {
        try {
            const messages = await Message.find();
            return messages.map(message => {
                return transformMessage(message);
            });
        } catch (err) {
            throw err;
        }
    },
    sendMessage: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const message = new Message({
            sender: req.userId,
            recipient: args.messageInput.recipient,
            date: new Date(args.messageInput.date),
            body: args.messageInput.body
        });
        let sentMessage;
        try {
            const result = await message.save();
            sentMessage = transform(result);
            const sender = await User.findById(req.userId);
            const sender = await User.findById(req.userId);

            if (!sender) {
                throw new Error('Sending user not found.');
            }
            if (!recipient) {
                throw new Error('Recipient user not found.');
            }
            sender.messagesSent.push(message);
            recipient.messagesReceived.push(message);
            await creator.save();

            return sentMessage;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    //   createEvent: async (args, req) => {
    //     if (!req.isAuth) {
    //       throw new Error('Unauthenticated!');
    //     }
    //     const event = new Event({
    //       title: args.eventInput.title,
    //       description: args.eventInput.description,
    //       price: +args.eventInput.price,
    //       date: new Date(args.eventInput.date),
    //       creator: req.userId
    //     });
    //     let createdEvent;
    //     try {
    //       const result = await event.save();
    //       createdEvent = transformEvent(result);
    //       const creator = await User.findById(req.userId);

    //       if (!creator) {
    //         throw new Error('User not found.');
    //       }
    //       creator.createdEvents.push(event);
    //       await creator.save();

    //       return createdEvent;
    //     } catch (err) {
    //       console.log(err);
    //       throw err;
    //     }
    //   }
};