import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './auth.context';
import { login } from './auth.service';
import './Auth.css';

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAuthToken } = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();
    const user = await login(null, email, password);
    setAuthToken(user.authToken);

    history.push('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <form onSubmit={loginUser}>
          <h2 style={{ color: 'white' }}>Login</h2>
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

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
