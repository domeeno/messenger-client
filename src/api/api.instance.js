import axios from 'axios';

const token = localStorage.getItem('authToken') || null;

export default axios.create({
  baseURL: 'http://127.0.0.1:80',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
