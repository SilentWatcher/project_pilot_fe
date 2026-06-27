import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { getProjectsApi } from '../../api/projectApi';
import { getTasksApi, getAllTasksApi, updateTaskApi, deleteTaskApi, updateTaskStatusApi, createTaskApi, exportAllTasksApi } from '../../api/taskApi';
import TaskCard from '../../components/ui/TaskCard';
import TaskListView from '../../components/ui/TaskListView';
import TaskBoardView from '../../components/ui/TaskBoardView';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { HiFilter, HiPlus, HiViewGrid, HiViewList, HiViewBoards, HiDownload } from 'react-icons/hi';
import { exportTasksToCsv } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('taskView') || 'card');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [selecting, setSelecting] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [exportingAll, setExportingAll] = useState(false);

  const toggleSelect = (id) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (select) => {
    if (select) {
      setSelectedTasks(new Set(tasks.map((t) => t.id)));
    } else {
      setSelectedTasks(new Set());
    }
  };

  const clearSelection = () => {
    setSelecting(false);
    setSelectedTasks(new Set());
  };

  const handleExport = () => {
    const selected = tasks.filter((t) => selectedTasks.has(t.id));
    if (selected.length === 0) { toast.error('No tasks selected'); return; }
    exportTasksToCsv(selected);
    toast.success(`Exported ${selected.length} tasks`);
    clearSelection();
  };

  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (selectedProject) params.projectId = selectedProject;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await exportAllTasksApi(params);
      const allTasks = res.data.data.tasks;
      if (!allTasks || allTasks.length === 0) { toast.error('No tasks to export'); return; }
      exportTasksToCsv(allTasks);
      toast.success(`Exported ${allTasks.length} tasks`);
    } catch {
      toast.error('Failed to export tasks');
    } finally {
      setExportingAll(false);
    }
  };

  const debouncedSearch = useDebounce(search, 300);

  const { register: regCreate, handleSubmit: handleCreate, reset: resetCreate, formState: { errors: errCreate } } = useForm();
  const { register: regEdit, handleSubmit: handleEdit, reset: resetEdit, formState: { errors: errEdit } } = useForm();

  const fetchTasks = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit, search: debouncedSearch || undefined };

      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      if (selectedProject) {
        const res = await getTasksApi(selectedProject, params);
        setTasks(res.data.data.tasks);
        setPagination(res.data.data.pagination);
      } else {
        const res = await getAllTasksApi(params);
        setTasks(res.data.data.tasks);
        setPagination(res.data.data.pagination);
      }
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, priorityFilter, selectedProject]);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjectsApi({ limit: 100 });
      setProjects(res.data.data.projects);
    } catch {
      // ignore
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('taskView', mode);
  };

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, priorityFilter, selectedProject, limit]);
  useEffect(() => { fetchTasks(page); }, [page, debouncedSearch, statusFilter, priorityFilter, selectedProject, limit, fetchTasks]);

  const handleCreateTask = async (data) => {
    if (!data.projectId) { toast.error('Please select a project'); return; }
    setSubmitting(true);
    try {
      await createTaskApi(data.projectId, data);
      toast.success('Task created');
      setShowCreateModal(false);
      resetCreate();
      fetchTasks(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (data) => {
    setSubmitting(true);
    try {
      await updateTaskApi(taskToEdit.id, data);
      toast.success('Task updated');
      setShowEditModal(false);
      setTaskToEdit(null);
      fetchTasks(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskApi(taskToDelete.id);
      toast.success('Task deleted');
      setTaskToDelete(null);
      fetchTasks(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatusApi(id, status);
      fetchTasks(page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openEdit = (task) => {
    setTaskToEdit(task);
    resetEdit({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setShowEditModal(true);
  };

  const viewIcons = [
    { mode: 'card', icon: HiViewGrid, title: 'Card view' },
    { mode: 'list', icon: HiViewList, title: 'List view' },
    { mode: 'board', icon: HiViewBoards, title: 'Board view' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Tasks</h1>
          <p className="text-sm text-[#64748B] mt-1">View and manage tasks across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          {selecting ? (
            <>
              <span className="text-sm text-[#64748B]">{selectedTasks.size} selected</span>
              <button onClick={handleExport} disabled={selectedTasks.size === 0} className="btn-primary inline-flex items-center gap-2">
                <HiDownload className="w-5 h-5" /> Export Selected
              </button>
              <button onClick={clearSelection} className="px-4 h-12 rounded-xl border border-border dark:border-dark-border text-sm font-medium text-[#64748B] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setSelecting(true)} className="px-4 h-12 rounded-xl border border-border dark:border-dark-border text-sm font-medium text-[#0F172A] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                <HiDownload className="w-5 h-5" /> Export
              </button>
              <button onClick={handleExportAll} disabled={exportingAll} className="px-4 h-12 rounded-xl border border-border dark:border-dark-border text-sm font-medium text-[#0F172A] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                {exportingAll ? 'Exporting...' : <><HiDownload className="w-5 h-5" /> Export All</>}
              </button>
              <button onClick={() => { resetCreate({ priority: 'medium' }); setShowCreateModal(true); }} className="btn-primary inline-flex items-center gap-2">
                <HiPlus className="w-5 h-5" /> New Task
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks or projects..." className="flex-1" />
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="h-12 px-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]">
          <option value="">All Projects</option>
          {projects.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-12 px-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-12 px-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]">
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex items-center border border-border dark:border-dark-border rounded-xl overflow-hidden">
          {viewIcons.map(({ mode, icon: Icon, title }) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={`p-3 transition-colors ${viewMode === mode ? 'bg-[#38BDF8] text-white' : 'text-[#64748B] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title={title}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : tasks.length === 0 ? (
        <EmptyState icon="tasks" title={search || statusFilter || priorityFilter ? 'No matching tasks' : 'No tasks found'} description="Try adjusting your filters or create a new task." />
      ) : (
        <>
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={openEdit} onDelete={(t) => setTaskToDelete(t)} onStatusChange={handleStatusChange} selectable={selecting} selected={selectedTasks.has(task.id)} onToggleSelect={toggleSelect} />
              ))}
            </div>
          )}
          {viewMode === 'list' && (
            <TaskListView tasks={tasks} onEdit={openEdit} onDelete={(t) => setTaskToDelete(t)} onStatusChange={handleStatusChange} selectable={selecting} selected={selectedTasks} onToggleSelect={toggleSelect} onSelectAll={selectAll} />
          )}
          {viewMode === 'board' && (
            <TaskBoardView tasks={tasks} onStatusChange={handleStatusChange} onEdit={openEdit} onDelete={(t) => setTaskToDelete(t)} selectable={selecting} selected={selectedTasks} onToggleSelect={toggleSelect} />
          )}
          {viewMode !== 'board' && (
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} limit={limit} onLimitChange={setLimit} />
          )}
        </>
      )}

      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetCreate(); }} title="Create Task">
        <form onSubmit={handleCreate(handleCreateTask)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Project <span className="text-danger">*</span></label>
            <select {...regCreate('projectId', { required: 'Select a project' })} className="input-field">
              <option value="">Select project</option>
              {projects.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
            </select>
            {errCreate.projectId && <p className="text-xs text-danger mt-1">{errCreate.projectId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Title <span className="text-danger">*</span></label>
            <input type="text" {...regCreate('title', { required: 'Title is required' })} className="input-field" placeholder="Task title" />
            {errCreate.title && <p className="text-xs text-danger mt-1">{errCreate.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea rows={2} {...regCreate('description')} className="input-field !h-auto py-3 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Priority</label>
              <select {...regCreate('priority')} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date</label>
              <input type="date" {...regCreate('dueDate')} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Creating...' : 'Create Task'}</button>
        </form>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setTaskToEdit(null); }} title="Edit Task">
        <form onSubmit={handleEdit(handleEditTask)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title <span className="text-danger">*</span></label>
            <input type="text" {...regEdit('title', { required: 'Title is required' })} className="input-field" />
            {errEdit.title && <p className="text-xs text-danger mt-1">{errEdit.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea rows={2} {...regEdit('description')} className="input-field !h-auto py-3 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Priority</label>
              <select {...regEdit('priority')} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select {...regEdit('status')} className="input-field">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Due Date</label>
            <input type="date" {...regEdit('dueDate')} className="input-field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'Updating...' : 'Update Task'}</button>
        </form>
      </Modal>

      <ConfirmationDialog isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDeleteTask} title="Delete Task?" message="This task will be permanently removed." />
    </div>
  );
}
