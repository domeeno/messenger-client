import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { CheckCircleFill, EyeFill } from 'react-bootstrap-icons';
import validatePassword, { popover } from './PasswordValidator';
import { useAuth } from './auth.context';
import { login } from './auth.service';
import './Auth.css';

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    type: '',
  });

  const { oldPassword, newPassword } = formData;

  const { setAuthToken } = useAuth();

  const passwordIsValid = validatePassword(newPassword);

  const eye = <EyeFill icon={EyeFill} />;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const changePassword = async (e) => {
    e.preventDefault();
    const user = await login(null, newPassword, oldPassword);
    setAuthToken(user.authToken);

    history.push('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="form-container">
          <form onSubmit={changePassword}>
            <h2 style={{ color: 'white' }}>Change password</h2>
            <input
              required
              type="password"
              name="oldPassword"
              id="oldPassword"
              value={oldPassword}
              onChange={onChange}
              placeholder="Old Password"
            />
            <OverlayTrigger placement="right" overlay={popover}>
              <input
                required
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={onChange}
                placeholder="New Password"
              />
              <i>{eye}</i>
            </OverlayTrigger>
            {passwordIsValid && (
            <div style={{ color: 'green' }}>
              <CheckCircleFill style={{ marginRight: '4px', marginBottom: '4px' }} color="green" />
              Nice password
            </div>
            )}
            <button type="submit" disabled={!passwordIsValid} className="btn btn-primary btn-block">Change Password</button>
          </form>
        </div>
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
