import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './auth.context';
import { register } from './auth.service';
import './Auth.css';

const Register = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const { setAuthToken } = useAuth();

  const registerUser = async (e) => {
    e.preventDefault();
    const user = await register(username, email, password);
    setAuthToken(user.authToken);

    history.push('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <form onSubmit={registerUser}>
          <h2 style={{ color: 'white' }}>Register</h2>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            required
            type="email"
            name="password"
            id="password"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            required
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" className="btn btn-primary btn-block">Submit</button>
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Register;
