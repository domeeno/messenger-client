import axios from 'axios';

const token = localStorage.getItem('authToken') || null;

export default axios.create({
  baseURL: 'http://100.100.100.114:8080',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
