/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-console */
import React, {
  useState, useEffect, useCallback,
} from 'react';
import { Button } from 'react-bootstrap';
import api from '../api/api.instance';

const ENDPOINT = 'http://192.168.0.133:8080';
const AUTH_BASE_URL = ENDPOINT;

export const getMe = () => (
  api
    .get(`${AUTH_BASE_URL}/users/profile`, {
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
);

function Profile() {
  const [user, setUser] = useState({});
  const [firstNameField, setFirstName] = useState('');
  const [lastNameField, setLastName] = useState('');
  const [bioField, setBio] = useState('');

  useEffect(() => {
    getMe().then((response) => {
      console.log(response);
      return setUser(response.user);
    });
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
      <div>{user.username}</div>
      <div className="p-4 details-container">
        <img
          className="profile-image"
          src="https://aeealberta.org/wp-content/uploads/2018/10/profile.png"
          alt="Profile place holder"
        />
        <div id="username">
          <h4>
            username:
            {' '}
            {user.username}
          </h4>
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
            {user.firstName}
          </div>
          <input onChange={onFirstNameInputChange} defaultValue={user.firstName} className="contact-input-box"></input>
        </div>
        <div>
          <div>
            last name:
            {' '}
            {user.lastName}
          </div>
          <input onChange={onLastNameInputChange} defaultValue={user.lastName} className="contact-input-box"></input>
        </div>
        <div>
          <div>
            bio:
            {' '}
            {user.bio}
          </div>
          <input onChange={onBioInputChange} defaultValue={user.bio} className="contact-input-box"></input>
        </div>
        <Button type="submit" className="chat-send-button" onClick={updateUserRequest}>Save</Button>
      </div>
    </div>
  );
}

export default Profile;
