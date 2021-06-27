import React, { Component } from 'react';
import Select from 'react-select';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Messages.css';

class MessagesPage extends Component {
    state = {
        creating: false,
        messages: [],
        users: []
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.recipientElRef = React.createRef();
        this.messageBodyElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchMessages(this.context.userId);
    }

    startCreateMessageHandler = () => {
        this.setState({ creating: true });
    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const recipient = this.recipientElRef.current.state;
        const date = new Date().toISOString();
        const messageBody = this.messageBodyElRef.current.value;
        if (recipient.length === 0 || messageBody.trim().length === 0) {
            return;
        }

        const token = this.context.token;
        const userId = this.context.userId; // only render messages sent TO this user

        const message = { recipient, date, messageBody };

        const requestBody = {
            query: `
                mutation SendMessage($recipient: String!, $date: String!, $body: String!) {
                    sendMessage(messageInput: {recipient: $recipient, date: $date, body: $body}) {
                    _id
                    recipient {
                        _id
                        email
                    }
                    date
                    body
                    }
                }
            `,
            variables: {
                reciptient: message.recipient.value.value,
                date: message.date,
                body: message.messageBody
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                this.fetchMessages(userId);
            })
            .catch(err => {
                console.log(err);
            });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false });
    };

    fetchMessages(userId) {
        const requestBody = {
            query: `
                query FetchMessages($id: ID!) {
                    messages(userId: $id) {
                    _id
                    sender {
                        _id
                        email
                    }
                    recipient {
                        _id
                        email
                    }
                    date
                    body
                    }
                }
            `,
            variables: {
                id: userId
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const messages = resData.data.messages;
                this.setState({ messages: messages });
            })
            .catch(err => {
                console.log(err);
            });
    }

    fetchUsers() {
        const requestBody = {
            query: `
                query {
                    users {
                        _id
                        email
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const users = resData.data.users;
                this.setState({ users: users });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const messageList = this.state.messages.map(message => {
            return (
                <li key={message._id} className="messages__list-item">
                    <ul className="messages__list-item-header">
                        <li>
                            From: {message.sender.email}
                        </li>
                        <li>
                            To: {message.recipient.email}
                        </li>
                        <li>
                            Date: {message.date}
                        </li>
                    </ul>
                    <ul className="messages__list-item-body">
                        <li>
                            {message.body}
                        </li>
                    </ul>
                </li>
            );
        });

        if (this.state.users.length === 0) {
            this.fetchUsers();
        }
        const userList = this.state.users;
        let recipientSelectList = [];
        userList.forEach(function (element) {
            recipientSelectList.push({ label: element.email, value: element._id })
        });

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && (
                    <Modal
                        title="Post Message"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText='Post'
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="receiver">Recipient</label>
                                <Select options={recipientSelectList} ref={this.recipientElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="message-body">Message Body</label>
                                <textarea
                                    id="message-body"
                                    rows="4"
                                    ref={this.messageBodyElRef}
                                />
                            </div>
                        </form>
                    </Modal>
                )}
                {this.context.token && (
                    <div className="messages-control">
                        <p>Talk with other users!</p>
                        <button className="btn" onClick={this.startCreateMessageHandler}>
                            Post Message
                        </button>
                    </div>
                )}
                <ul className="messages__list">{messageList}</ul>
            </React.Fragment>
        );
    }
}

export default MessagesPage;