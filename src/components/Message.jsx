/* eslint-disable no-console */
import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://192.168.0.133:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });

const token = localStorage.getItem('token');
// const to = '5fcfc0d9b02b5d27ff6ac14e';

function Message() {
  const [messageTextBox, setMessageTextBox] = useState('');
  const [listOfMessages, setListOfMessages] = useState([]);
  const [chatId, setChatId] = useState();

  // Move to login page
  const [passwordState, setPasswordState] = useState('https://www.iconsdb.com/icons/preview/red/warning-xxl.png');

  socket.on('chatId', (newChatId) => {
    console.log(newChatId);
    setChatId(newChatId);
  });

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

    const body = { msg, token, chatId };

    socket.emit('chatMessage', body);
    console.log('I was sent by Dom');

    setMessageTextBox('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  );
}

export default Message;
