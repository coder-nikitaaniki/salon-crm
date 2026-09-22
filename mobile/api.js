import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  // Using stable serveo https tunnel
  baseURL: 'https://29a85a8c49027ae0-60-254-45-216.serveousercontent.com/api',
});

export default api;
