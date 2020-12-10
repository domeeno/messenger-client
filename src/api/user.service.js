import api from './api.instance';

const AUTH_BASE_URL = 'users';

export const changePassword = (oldPassword, newPassword) => (
  api
    .post(`${AUTH_BASE_URL}/change-password`, {
      oldPassword,
      newPassword,
    })
    .then((response) => response.data)
);

export default changePassword;
