import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useAuth } from './auth.context';
import { register } from './auth.service';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const { setAuthToken } = useAuth();

  const registerUser = (e) => {
    e.preventDefault();
    const user = register(username, email, password);
    setAuthToken(user.authToken);
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

export default withRouter(Register);
