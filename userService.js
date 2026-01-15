
// services/userService.js
import api from './api';

export const userService = {
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  }
};
