import axios from 'axios';

const token = localStorage.getItem('authToken') || null;

export const api = axios.create({
  baseURL: 'http://localhost/',
  headers: {
    Authorization: `Bearer ${token}`
  },
});