/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import moment from 'moment';
import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';
import api from '../api/api.instance';

const ENDPOINT = 'http://192.168.0.133:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

const token = localStorage.getItem('authToken');

const joinRoom = (recipientId, chatId) => {
  socket.emit('disconnectMe', { chatId });
  console.log(chatId);
  socket.emit('joinRoom', { token, to: recipientId });
};

const getMe = () => (
  api
    .get(`${ENDPOINT}/users/username`, {
    })
    .then((response) => response.data)
);

const sendAddContactRequest = (usernameToAdd) => {
  api
    .get(`${ENDPOINT}/users/${usernameToAdd}`, {
    })
    .then((response) => response.data);
};

const getMessageListFromChat = (chatId) => (
  api.get(`${ENDPOINT}/chats/${chatId}`, {}).then((response) => {
    console.log(response.data);
    return response.data;
  })
);

function getUserToBeAdded(userToAdd) {
  const receivedUser = sendAddContactRequest(userToAdd);
  console.log(`I actually do stuff${userToAdd}`);
  return receivedUser;
}

async function loadMessages(chatId) {
  const newMessageList = await getMessageListFromChat(chatId);
  return newMessageList;
}

function prettifyTime(time) {
  // eslint-disable-next-line radix
  const date = new Date(parseInt(time));
  const localeSpecificTime = date.toLocaleTimeString();
  return localeSpecificTime.replace(/:\d+ /, ' ');
}

function ChatView() {
  // SIDEBAR HOOKS
  const [contactBox, setContactInputBox] = useState([]);
  const [username, setUsername] = useState();
  const [messageToBeloaded, setMessageToBeLoaded] = useState([]);
  const [contactList, setContactList] = useState([{ id: '5fd260f82c653e5154407f54', username: 'vasile_bigdaddy_tronciu' }, { id: '5fd261612c653e5154407f55', username: 'alex' },
    { id: '5fd15f131051df48e6c68f6f', username: 'dgaponcic' }]);
  // MESSAGE HOOKS
  const [messageTextBox, setMessageTextBox] = useState('');
  const [listOfMessages, setListOfMessages] = useState([]);
  // GENERAL HOOKS
  const [chatId, setChatId] = useState();
  const [didMount, setDidMount] = useState(false);

  async function getInitials() {
    setUsername((await getMe()).username);
  }

  useEffect(() => {
    getInitials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', { token, to: contactList[0].id });
  }, [contactList, chatId]);

  useEffect(() => {
    setDidMount(true);
    console.log('hey Alex :)');
    socket.on('chatId', async (newChatId) => {
      setChatId(newChatId);
      const messages = Array.from(await loadMessages(newChatId)).map((message) => ({
        id: message._id,
        user: message.from.username,
        content: message.content,
        time: moment(message.timeSent).format('hh:mm a'),
        done: false,
      }));
      setListOfMessages([...listOfMessages, ...messages]);
    });
  }, []);

  // useEffect(() => {

  //   // }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [messageToBeloaded]);

  // SIDEBAR USECALLBACK ONEFFECT
  const onContactInputChange = useCallback((event) => {
    setContactInputBox(event.target.value);
  }, []);

  const onContactInputSubmit = useCallback((event) => {
    event.preventDefault();

    const userToAdd = event.target.elements.userToAdd.value;

    const receivedUser = getUserToBeAdded(userToAdd);

    console.log(`Ohoooo${receivedUser.username}`);

    setContactList([
      ...contactList,
      {
        id: receivedUser.id,
        username: receivedUser.username,
        done: false,
      },
    ]);

    setContactInputBox('');
  }, [contactList]);

  const switchChat = useCallback((event) => {
    console.log(event.target.dataset.id);
    setListOfMessages([]);
    joinRoom(event.target.dataset.id, chatId);
    const loadedMessages = loadMessages(chatId);
  }, [chatId]);

  // MESSAGE HOOKS HANDLERS
  const messageHandler = (user, text, time) => {
    setListOfMessages([
      ...listOfMessages,
      {
        id: listOfMessages.length + 1,
        username: user,
        content: text,
        time: prettifyTime(time),
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
  }, []);

  const Submit = useCallback((event) => {
    event.preventDefault();

    const msg = event.target.elements.msg.value;

    // TODO send chatId with message
    const body = { msg, token, chatId };

    socket.emit('chatMessage', body);
    console.log(`I was sent by Dom${chatId}`);

    setMessageTextBox('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfMessages, messageTextBox]);

  return (
    <div className="chat-container d-flex">
      {/* SIDE */}
      <div className="chat-sidebar">
        <a href="/profile" className="contacts-header">{username}</a>
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
            <button className="add-button" type="submit">
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
                  <span className="username-display">{message.user}</span>
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
