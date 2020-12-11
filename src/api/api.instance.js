import axios from 'axios';

const token = localStorage.getItem('authToken') || null;

export default axios.create({
  baseURL: 'http://7fcf522f3a08.ngrok.io',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
