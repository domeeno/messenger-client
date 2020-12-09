/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://192.168.0.133:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

const token = localStorage.getItem('token');

const joinRoom = (recipientId, chatId) => {
  socket.emit('disconnectMe', { chatId });
  console.log(chatId);
  socket.emit('joinRoom', { token, to: recipientId });
};

function Sidebar() {
  const [contactBox, setContactInputBox] = useState([]);
  const [contactList, setContactList] = useState([{ id: '5fcfc0d9b02b5d27ff6ac14e', username: 'dgaponcic' },
    { id: '5fcfedf5dac6fa0a188ec305', username: 'iulianaturcanu' }, { id: '5fcfee0bdac6fa0a188ec306', username: 'alexcalugari' }]);
  const [chatId, setChatId] = useState();

  const onContactInputChange = useCallback((event) => {
    // console.log(event.target.value);
    setContactInputBox(event.target.value);
  }, []);

  socket.on('chatId', (newChatId) => {
    console.log(newChatId);
    setChatId(newChatId);
  });

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactList, contactBox]);

  const switchChat = useCallback((event) => {
    console.log(event.target.dataset.id);
    joinRoom(event.target.dataset.id, chatId);
  }, [chatId]);

  return (
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
  );
}

export default Sidebar;
