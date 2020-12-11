import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleFill } from 'react-bootstrap-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useAuth } from './auth.context';
import { register } from './auth.service';
import './Auth.css';
import validatePassword, { popover } from './PasswordValidator';

const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const { setAuthToken } = useAuth();

  const passwordIsValid = validatePassword(password);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const registerUser = async (e) => {
    e.preventDefault();
    const user = await register(username, email, password);
    setAuthToken(user.authToken);

    history.push('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <form onSubmit={registerUser} style={{ width: '208px' }}>
          <h2 style={{ color: 'white' }}>Register</h2>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onChange}
            placeholder="Username"
          />
          <input
            required
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
          />
          <OverlayTrigger placement="right" overlay={popover}>
            <input
              required
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
            />
          </OverlayTrigger>
          {passwordIsValid && (
          <div style={{ color: 'green' }}>
            <CheckCircleFill style={{ marginRight: '4px', marginBottom: '4px' }} color="green" />
            Nice password
          </div>
          )}
          <button type="submit" disabled={!passwordIsValid} className="btn btn-primary btn-block">Submit</button>
          <a href="/login">Have an account? Login here</a>
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
