import { useState, useCallback } from 'react';
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  updateTaskStatusApi,
} from '../api/taskApi';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (projectId, params = {}) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await getTasksApi(projectId, params);
      setTasks(res.data.data.tasks);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (projectId, data) => {
    const res = await createTaskApi(projectId, data);
    toast.success('Task created successfully');
    return res.data.data;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const res = await updateTaskApi(id, data);
    toast.success('Task updated successfully');
    return res.data.data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await deleteTaskApi(id);
    toast.success('Task deleted successfully');
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const res = await updateTaskStatusApi(id, status);
    return res.data.data;
  }, []);

  return {
    tasks,
    pagination,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateStatus,
  };
};
