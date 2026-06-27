import axios from './axios';

export const createProjectApi = (data) => axios.post('/api/projects', data);
export const getProjectsApi = (params) => axios.get('/api/projects', { params });
export const getProjectApi = (id) => axios.get(`/api/projects/${id}`);
export const updateProjectApi = (id, data) => axios.put(`/api/projects/${id}`, data);
export const deleteProjectApi = (id) => axios.delete(`/api/projects/${id}`);
