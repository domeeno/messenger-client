/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import moment from 'moment';
import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';
import api from '../api/api.instance';

const ENDPOINT = 'http://100.100.100.114:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

const token = localStorage.getItem('authToken');

const joinRoom = (recipientId, chatId) => {
  socket.emit('disconnectMe', { chatId });
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
  api.get(`${ENDPOINT}/chats/${chatId}`, {}).then((response) => response.data)

);

// const getContactList = () => (
//   api.get(`${ENDPOINT}/chats/`, {}).then((response) => {
//     console.log(response.data);
//     return response.data;
//   })
// );

function getUserToBeAdded(userToAdd) {
  const receivedUser = sendAddContactRequest(userToAdd);
  return receivedUser;
}

async function loadMessages(chatId) {
  const newMessageList = await getMessageListFromChat(chatId);
  return newMessageList;
}

// async function loadContacts() {
//   const loadedContactList = await getContactList();
//   return loadedContactList;
// }

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
  const [contactList, setContactList] = useState([{ id: '5fd39bfe1d602517326143ed', username: 'momo' },
    { id: '5fd39c5e58c64b18909f7411', username: 'dianusca' }, { id: '5fd39ca758c64b18909f7412', username: 'holly_molly' }]);
  // MESSAGE HOOKS
  const [messageTextBox, setMessageTextBox] = useState('');
  const [listOfMessages, setListOfMessages] = useState([]);
  // GENERAL HOOKS
  const [chatId, setChatId] = useState();

  async function getInitials() {
    setUsername((await getMe()).username);
  }

  useEffect(() => {
    getInitials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
  //   socket.on('contacts', async () => {
  //     const contacts = Array.from(await loadContacts()).map((contact) => ({
  //       id: contact._id,
  //       user: contact.username,
  //       done: false,
  //     }));
  //     setContactList([...contactList, ...contacts]);
  //   });
  // }, []);

  // SIDEBAR USECALLBACK ONEFFECT
  const onContactInputChange = useCallback((event) => {
    setContactInputBox(String(event.target.value));
  }, []);

  const onContactInputSubmit = useCallback((event) => {
    event.preventDefault();

    const userToAdd = String(event.target.elements.userToAdd.value);

    const receivedUser = getUserToBeAdded(userToAdd);

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

  const switchChat = useCallback(async (event) => {
    setListOfMessages([]);
    joinRoom(event.target.dataset.id, chatId);
    setChatId(chatId);
  }, [chatId]);

  // MESSAGE HOOKS HANDLERS
  const messageHandler = (user, text, time) => {
    setListOfMessages([
      ...listOfMessages,
      {
        id: listOfMessages.length + 1,
        user,
        content: text,
        time: moment(time).format('hh:mm a'),
        done: false,
      },
    ]);
  };

  useEffect(() => {
    const handler = (message) => {
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
    setMessageTextBox(String(event.target.value));
  }, []);

  const Submit = useCallback((event) => {
    event.preventDefault();

    const msg = String(event.target.elements.msg.value);

    // TODO send chatId with message
    const body = { msg, token, chatId };

    socket.emit('chatMessage', body);

    setMessageTextBox('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfMessages, messageTextBox]);

  function fromMe(user) {
    return user === username;
  }

  return (
    <div className="chat-container d-flex">
      {/* SIDE */}
      <div className="chat-sidebar">
        <a href="/profile" className="mt-4 contacts-header">{username}</a>
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
                  <span className={`${fromMe(message.user) ? 'you-display' : 'username-display'}`}>{fromMe(message.user) ? 'You' : message.user}</span>
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
