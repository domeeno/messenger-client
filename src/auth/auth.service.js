import { api } from '../api/api.instance';

const AUTH_BASE_URL = 'auth';

export const register = (username, email, password) => {
  api
    .post(`${AUTH_BASE_URL}/register`, {
      username,
      email,
      password
    })
    .then(response => response.data);
}

export const login = (username, email, password) => {
  api
    .post(`${AUTH_BASE_URL}/login`, {
      username,
      email,
      password
    })
    .then(response => response.data);
}

export const verifyToken = (token) => {
  // TODO: token validation

  return !!token;
}