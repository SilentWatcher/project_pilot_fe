import { useState, useEffect, useCallback } from 'react';
import { getProjectsApi, getProjectApi, createProjectApi, updateProjectApi, deleteProjectApi } from '../api/projectApi';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getProjectsApi(params);
      setProjects(res.data.data.projects);
      setPagination(res.data.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProject = useCallback(async (id) => {
    const res = await getProjectApi(id);
    return res.data.data;
  }, []);

  const createProject = useCallback(async (data) => {
    const res = await createProjectApi(data);
    toast.success('Project created successfully');
    return res.data.data;
  }, []);

  const updateProject = useCallback(async (id, data) => {
    const res = await updateProjectApi(id, data);
    toast.success('Project updated successfully');
    return res.data.data;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await deleteProjectApi(id);
    toast.success('Project deleted successfully');
  }, []);

  return {
    projects,
    pagination,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };
};
