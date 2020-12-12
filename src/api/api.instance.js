import axios from 'axios';

const token = localStorage.getItem('authToken') || null;

export default axios.create({
  baseURL: 'http://192.168.0.133:80',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
