const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
  _id: ID!
  event: Event!
  user: User!
  createdAt: String!
  updatedAt: String!
}

type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type Message {
  _id: ID!
  recipient: User!
  body: String!
  date: String!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
  messagesSent: [Message!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input MessageInput {
  recipient: String!
  date: String!
  body: String!
}

input UserInput {
  email: String!
  password: String!
}


type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData
    users: [User!]!
    messages(userId: ID!): [Message!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    sendMessage(messageInput: MessageInput): Message!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);