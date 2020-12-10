/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-console */
import React, {
  useState, useEffect, useCallback,
} from 'react';
import { Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';
import api from '../api/api.instance';

const ENDPOINT = 'http://192.168.0.29:8080';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket'] });
const AUTH_BASE_URL = ENDPOINT;

export const getMe = () => (
  api
    .get(`${AUTH_BASE_URL}/users/profile`, {
    })
    .then((response) => response.data)
);

function Profile() {
  const [user, setUser] = useState('');
  const [firstNameField, setFirstName] = useState('');
  const [lastNameField, setLastName] = useState('');
  const [bioField, setBio] = useState('');

  async function getInitials() {
    setUser(await getMe());
    console.log(user);
  }

  useEffect(() => {
    getInitials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFirstNameInputChange = useCallback((event) => {
    setFirstName(event.target.value);
  }, []);

  const onLastNameInputChange = useCallback((event) => {
    setLastName(event.target.value);
  }, []);

  const onBioInputChange = useCallback((event) => {
    setBio(event.target.value);
  }, []);

  const updateUserRequest = () => {
    user.firstName = firstNameField;
    user.lastName = lastNameField;
    user.bio = bioField;
    console.log(user);
    api
      .put(`${ENDPOINT}/users/`, { user })
      .then((response) => response.data);
  };

  return (
    <div className="profile-container">
      <div>
        <img
          className="profile-image"
          src="https://aeealberta.org/wp-content/uploads/2018/10/profile.png"
          alt="Profile place holder"
        />
        <div id="username">
          <div>
            username:
            {' '}
            {user.username}
          </div>
        </div>
        <div id="email">
          <div>
            email:
            {' '}
            {user.email}
          </div>
        </div>
        <div>
          <div>
            first name:
            {' '}
            {user.firstname}
          </div>
          <input onChange={onFirstNameInputChange}></input>
        </div>
        <div>
          <div>
            last name:
            {' '}
            {user.lastname}
          </div>
          <input onChange={onLastNameInputChange}></input>
        </div>
        <div>
          <div>
            bio:
            {' '}
            {user.bio}
          </div>
          <input onChange={onBioInputChange}></input>
        </div>
        <Button type="submit" className="chat-send-button" onClick={updateUserRequest}>Save</Button>
      </div>
    </div>
  );
}

export default Profile;
