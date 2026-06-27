import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/ui/ProjectCard';
import ProjectListView from '../../components/ui/ProjectListView';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import { HiPlus, HiFilter, HiViewGrid, HiViewList } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Projects() {
  const { user } = useAuth();
  const {
    projects,
    pagination,
    loading,
    fetchProjects,
    createProject,
  } = useProjects();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('projectView') || 'card');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadProjects = useCallback(() => {
    const params = { page, limit };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    fetchProjects(params);
  }, [page, limit, search, statusFilter, fetchProjects]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  useEffect(() => { setPage(1); }, [search, statusFilter, limit]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('projectView', mode);
  };

  const onCreateProject = async (data) => {
    setCreating(true);
    try {
      await createProject(data);
      setShowCreateModal(false);
      reset();
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
            Projects
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
          className="flex-1"
        />
        <div className="relative">
          <HiFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 pl-12 pr-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-sm text-[#0F172A] dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center border border-border dark:border-dark-border rounded-xl overflow-hidden">
          <button
            onClick={() => handleViewModeChange('card')}
            className={`p-3 transition-colors ${viewMode === 'card' ? 'bg-[#38BDF8] text-white' : 'text-[#64748B] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Card view"
          >
            <HiViewGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-[#38BDF8] text-white' : 'text-[#64748B] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="List view"
          >
            <HiViewList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="h-4 skeleton w-3/4 mb-3" />
              <div className="h-3 skeleton w-full mb-2" />
              <div className="h-3 skeleton w-1/2 mb-4" />
              <div className="flex gap-4">
                <div className="h-3 skeleton w-20" />
                <div className="h-3 skeleton w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon="inbox"
          title={search || statusFilter ? 'No matching projects' : 'No projects yet'}
          description={
            search || statusFilter
              ? 'Try adjusting your search or filters'
              : 'Create your first project and start managing work efficiently.'
          }
          action={
            !search && !statusFilter ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create First Project
              </button>
            ) : null
          }
        />
      ) : (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <ProjectListView projects={projects} />
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setPage}
            limit={limit}
            onLimitChange={setLimit}
          />
        </>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); reset(); }}
        title="Create New Project"
        size="md"
      >
        <form onSubmit={handleSubmit(onCreateProject)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="input-field"
              placeholder="Project name"
            />
            {errors.title && (
              <p className="text-xs text-danger mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              {...register('description', { required: 'Description is required' })}
              className="input-field !h-auto py-3 resize-none"
              placeholder="Describe your project"
            />
            {errors.description && (
              <p className="text-xs text-danger mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-white mb-1.5">
              Deadline <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              {...register('deadline', { required: 'Deadline is required' })}
              className="input-field"
            />
            {errors.deadline && (
              <p className="text-xs text-danger mt-1">{errors.deadline.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={creating}
            className="btn-primary w-full"
          >
            {creating ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
