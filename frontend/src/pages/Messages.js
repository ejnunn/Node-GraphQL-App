import React, { Component } from 'react';
import Select from 'react-select';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Messages.css';

class MessagesPage extends Component {
  state = {
    creating: false,
    messages: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.receiverElRef = React.createRef();
    this.messageBodyElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchMessages();
  }

  startCreateMessageHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const receiver = this.receiverElRef.current.value;
    const date = new Date().toISOString();
    const messageBody = this.messageBodyElRef.current.value;
    console.log(receiver);
    if (receiver.trim().length === 0 || messageBody.trim().length === 0) {
      return;
    }

    const token = this.context.token;
    const userId = this.context.userId; // only render messages sent TO this user
    
    const message = { receiver, date, messageBody };
    console.log(message);

    const requestBody = {
      query: `
          mutation {
            createMessage(messageInput: {}) {

            }
          }
        `
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
        this.fetchMessages();
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchMessages() {
    const requestBody = {
      query: `
          query {
            messages(userId) {
                _id
                messages {
                    sender {
                        _id
                        email
                    }
                    date
                    messageBody
                }
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
        const messages = resData.data.messages;
        this.setState({ messages: messages });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const messageList = this.state.messages.map(message => {
      return (
        <li key={message._id} className="messages__list-item">
          {message.title}
        </li>
      );
    });

    const userList = ['ejnunn1@msn.com', 'test@test.com'];
    let receiverSelectList = [];
    userList.forEach(function(element) {
        receiverSelectList.push({ label: element, value: element })
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
          >
            <form>
              <div className="form-control">
                <label htmlFor="receiver">Receiver</label>
                <Select options={receiverSelectList} ref={this.receiverElRef } />
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