import axios from './axios';

export const createTaskApi = (projectId, data) => axios.post(`/api/projects/${projectId}/tasks`, data);
export const getTasksApi = (projectId, params) => axios.get(`/api/projects/${projectId}/tasks`, { params });
export const getAllTasksApi = (params) => axios.get('/api/tasks', { params });
export const updateTaskApi = (id, data) => axios.put(`/api/tasks/${id}`, data);
export const deleteTaskApi = (id) => axios.delete(`/api/tasks/${id}`);
export const updateTaskStatusApi = (id, status) => axios.patch(`/api/tasks/${id}/status`, { status });
export const exportAllTasksApi = (params) => axios.get('/api/tasks', { params: { ...params, exportAll: true, limit: 10000 } });
