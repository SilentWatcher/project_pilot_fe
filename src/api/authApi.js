import axios from './axios';

export const loginApi = (data) => axios.post('/api/auth/login', data);
export const registerApi = (data) => axios.post('/api/auth/register', data);
export const getMeApi = () => axios.get('/api/auth/me');
export const updateProfileApi = (data) => axios.put('/api/auth/profile', data);
