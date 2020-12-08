import React, { useState, useCallback, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const ENDPOINT = 'http://100.100.100.114:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

function Message() {
  const location = useLocation();
  const [messageTextBox, setMessageTextBox] = useState('');
  const [listOfMessages, setListOfMessages] = useState([]);

  console.log(location);
  const token = localStorage.getItem('token');
  const room = '5fcd2e8a79c4ed27cc3d318d';

  useEffect(() => {
    socket.emit('joinRoom', { token, room });
  }, [token, room]);

  socket.on('message', (message) => {
    console.log('message', message);
  });

  const onMessageInputChange = useCallback((event) => {
    console.log(event.target.value);
    setMessageTextBox(event.target.value);
  }, []);

  function prettyDate2(time) {
    const date = new Date(parseInt(time, 10));
    const localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, ' ');
  }

  const Submit = useCallback((event) => {
    event.preventDefault();

    const msg = event.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    setListOfMessages([
      ...listOfMessages,
      {
        id: listOfMessages.length + 1,
        content: messageTextBox,
        time: prettyDate2(Date.now()),
        done: false,
      },
    ]);

    setMessageTextBox('');
  }, [listOfMessages, messageTextBox]);

  return (
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
              <Button type="submit" className="chat-send-button">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Message;
