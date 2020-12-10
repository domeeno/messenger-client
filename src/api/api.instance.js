import axios from 'axios';

const token = localStorage.getItem('authToken') || null;

export default axios.create({
  baseURL: 'http://192.168.0.29:8080/',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
