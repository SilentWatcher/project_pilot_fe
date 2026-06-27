import axios from './axios';

export const getStatsApi = () => axios.get('/api/dashboard/stats');
export const getChartsApi = () => axios.get('/api/dashboard/charts');
