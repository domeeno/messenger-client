/* eslint-disable no-console */
import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://100.100.100.114:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

const token = localStorage.getItem('token');

const joinRoom = (recipientId, chatId) => {
  socket.emit('disconnectMe', { chatId });
  console.log(chatId);
  socket.emit('joinRoom', { token, to: recipientId });
};

function ChatView() {
  // SIDEBAR HOOKS
  const [contactBox, setContactInputBox] = useState([]);
  const [contactList, setContactList] = useState([{ id: '5fcfc0d9b02b5d27ff6ac14e', username: 'dgaponcic' },
    { id: '5fcfedf5dac6fa0a188ec305', username: 'iulianaturcanu' }, { id: '5fcfee0bdac6fa0a188ec306', username: 'alexcalugari' }]);
  // MESSAGE HOOKS
  const [messageTextBox, setMessageTextBox] = useState('');
  const [listOfMessages, setListOfMessages] = useState([]);
  // GENERAL HOOKS
  const [chatId, setChatId] = useState();
  // TEMPORARY LOGIN PASSWORD STATE
  const [passwordState, setPasswordState] = useState('https://www.iconsdb.com/icons/preview/red/warning-xxl.png');

  // SIDEBAR USECALLBACK ONEFFECT
  const onContactInputChange = useCallback((event) => {
    setContactInputBox(event.target.value);
  }, []);

  const onContactInputSubmit = useCallback((event) => {
    event.preventDefault();

    const userToAdd = event.target.elements.userToAdd.value;

    console.log(`${token} : ${userToAdd}`);
    socket.emit('chatRequest', { token, userToAdd });

    setContactList([
      ...contactList,
      {
        id: contactList.length + 1,
        username: contactBox,
        done: false,
      },
    ]);

    setContactInputBox('');
  }, [contactList, contactBox]);

  const switchChat = useCallback((event) => {
    console.log(event.target.dataset.id);
    setChatId(event.target.dataset.id);
    joinRoom(event.target.dataset.id, chatId);
  }, [chatId]);

  // MESSAGE HOOKS HANDLERS
  const messageHandler = (username, text, time) => {
    console.log('I arrived here');
    setListOfMessages([
      ...listOfMessages,
      {
        id: listOfMessages.length + 1,
        content: text,
        time,
        done: false,
      },
    ]);

    console.log(listOfMessages.length);
  };

  useEffect(() => {
    const handler = (message) => {
      console.log(`message${message.username} ${message.text} ${message.time}`);
      messageHandler(message.username, message.text, message.time);
    };

    socket.on('message', handler);

    return () => {
      socket.off('message', handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfMessages]);

  const onMessageInputChange = useCallback((event) => {
    // console.log(event.target.value);
    setMessageTextBox(event.target.value);

    // Move to login page
    if (event.target.value.length > 6 && event.target.value.length <= 10) {
      setPasswordState('https://www.iconsdb.com/icons/preview/orange/warning-xxl.png');
    } else if (event.target.value.length > 10) {
      setPasswordState('https://www.iconsdb.com/icons/preview/caribbean-blue/ok-xxl.png');
    } else if (event.target.value.length <= 6) {
      setPasswordState('https://www.iconsdb.com/icons/preview/red/warning-xxl.png');
    }
  }, []);

  const Submit = useCallback((event) => {
    event.preventDefault();

    const msg = event.target.elements.msg.value;

    // TODO send chatId with message
    const body = { msg, token };

    socket.emit('chatMessage', body);
    console.log('I was sent by Dom');

    setMessageTextBox('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfMessages, messageTextBox]);

  return (
    <div className="chat-container d-flex">
      {/* SIDE */}
      <div className="chat-sidebar">
        <h3 className="contacts-header">PlaceHolder</h3>
        <div id="add-contacts" className="add-contact-form">
          <form id="chat-form" onSubmit={onContactInputSubmit}>
            <input
              className="contact-input-box"
              onChange={onContactInputChange}
              id="userToAdd"
              type="text"
              placeholder="Search"
              value={contactBox}
              required
              autoComplete="off"
            />
            <button className="add-button" type="button">
              <i className="fas fa-paper-plane" />
              {' '}
              Add
            </button>
          </form>
        </div>
        <div id="contacts-box" className="contacts-list">
          <div className="user-contacts-container">
            {contactList.map((contact) => (
              <div className="flex-column">
                <button
                  type="button"
                  onClick={switchChat}
                  data-id={contact.id}
                  className="contact-button"
                  key={contact.id}
                >
                  {' '}
                  {contact.username}
                  {' '}

                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* CHAT */}
      <div className="chat-box-container d-flex flex-column flex-grow-1">
        <div className="flex-grow-1 overflow-auto">
          <div className="h-100 d-flex flex-column align-items-start justify-content-end px-3">
            { listOfMessages.map((message) => (
              <div className="my-1 d-flex flex-column">
                <div key={message.id}>
                  <span className="time-display">
                    {' '}
                    {message.time}
                    {' '}
                  </span>
                  <span className="username-display">PlaceHolder</span>
                  <span className="separator"> : </span>
                  <span className="message-display">{message.content}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Form onSubmit={Submit}>
          <Form.Group className="m-2">
            <InputGroup className="message-input-container">
              <Form.Control
                className="chat-input-box"
                onChange={onMessageInputChange}
                required
                id="msg"
                placeholder="Enter Message"
                value={messageTextBox}
                autoComplete="off"
              />
              <InputGroup.Append>
                <img className="m-2 password-state" src={passwordState} alt="bad-password" />
              </InputGroup.Append>
              {/* Move to login page */}
              <InputGroup.Append>
                <Button type="submit" className="chat-send-button">Send</Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default ChatView;
