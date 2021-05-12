const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('dotenv').config()

const Event = require('./models/event');
const User = require('./models/user');
const { argsToArgsConfig } = require('graphql/type/definition');



const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),

    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc };
                    });
                })
                .catch(err => {
                    throw err;
                });
        },
        createEvent: args => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '609c4c94ab507a1b01aec2ef'
            });
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                    return User.findById('609c4c94ab507a1b01aec2ef')
                    console.log(result);
                    return { ...result._doc };
                }).then(result => {
                    if (!user) {
                        throw new Error("User does not exist.");
                    }
                    user.createdEvents.push(event);
                    return user.save(); 
                })
                .then( result => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: args => {
            return User.findOne({email: args.userInput.email})
                .then(user => {
                    if (user) {
                        throw new Error('User exists already.');
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    return { ...result._doc, password: null, _id:result.id.toString() };
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true,
  }),
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qpjgt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log(`Successfully connected to ${process.env.MONGO_DB}`)
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
        console.log("Did not connect");
        console.log(`${process.env.MONGO_USER}`);
        console.log(`${process.env.MONGO_PASSWORD}`);
        console.log(`${process.env.MONGO_DB}`);
    });
