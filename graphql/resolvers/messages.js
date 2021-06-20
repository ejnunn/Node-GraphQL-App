const Message = require('../../models/message');
const User = require('../../models/user');

const { transformMessage } = require('./merge');

module.exports = {
    messages: async (args, req) => {
        try {
            console.log(args);
            const user = await User.findOne({ _id: args.userId });
            const messagesSent = await Message.find({ sender: args.userId });
            return messagesSent.map(message => {
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
            sentMessage = transformMessage(result);
            const sender = await User.findById(message.sender);
            const recipient = await User.findById(message.recipient);

            if (!sender) {
                throw new Error('Sending user not found.');
            }
            sender.messagesSent.push(message);
            await sender.save();
            
            if (!recipient) {
                throw new Error('Recipient user not found.');
            }
            recipient.messagesReceived.push(message);
            await recipient.save();

            return sentMessage;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
};