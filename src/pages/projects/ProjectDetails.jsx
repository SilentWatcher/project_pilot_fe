import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from '../../components/ui/TaskCard';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate, isOverdue } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import {
  HiArrowLeft,
  HiPlus,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getProject, updateProject, deleteProject } = useProjects();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, updateStatus } = useTasks();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProjectEditModal, setShowProjectEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register: registerCreate,
    handleSubmit: handleCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm();

  const {
    register: registerProject,
    handleSubmit: handleProjectEdit,
    reset: resetProject,
    formState: { errors: projectErrors },
  } = useForm();

  const loadProject = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id, getProject]);

  useEffect(() => { loadProject(); }, [loadProject]);
  useEffect(() => { if (id) fetchTasks(id); }, [id, fetchTasks]);

  const handleCreateTask = async (data) => {
    setSubmitting(true);
    try {
      await createTask(id, data);
      setShowCreateModal(false);
      resetCreate();
      fetchTasks(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (data) => {
    setSubmitting(true);
    try {
      await updateTask(taskToEdit.id, data);
      setShowEditModal(false);
      setTaskToEdit(null);
      fetchTasks(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      fetchTasks(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatus(taskId, status);
      fetchTasks(id);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateProject = async (data) => {
    setSubmitting(true);
    try {
      const updated = await updateProject(id, data);
      setProject(updated);
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const openEditTask = (task) => {
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

  if (loading) return <Loader />;
  if (!project) return <EmptyState icon="inbox" title="Project not found" />;

  const overdue = isOverdue(project.deadline, project.status);
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/projects"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5 text-[#64748B]" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
              {project.title}
            </h1>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                STATUS_COLORS[project.status] || ''
              }`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetProject({
                title: project.title,
                description: project.description,
                deadline: project.deadline ? project.deadline.split('T')[0] : '',
                status: project.status,
              });
              setShowProjectEditModal(true);
            }}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiOutlinePencil className="w-5 h-5 text-[#64748B]" />
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <HiOutlineTrash className="w-5 h-5 text-danger" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Deadline', value: formatDate(project.deadline), urgent: overdue },
          { label: 'Total Tasks', value: tasks.length },
          { label: 'In Progress', value: inProgressTasks, color: '#38BDF8' },
          { label: 'Completed', value: completedTasks, color: '#22C55E' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-xs text-[#64748B] font-medium">{stat.label}</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                stat.urgent ? 'text-danger' : stat.color ? '' : 'text-[#0F172A] dark:text-white'
              }`}
              style={stat.color ? { color: stat.color } : {}}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white">
          Tasks ({tasks.length})
        </h2>
        <button
          onClick={() => { resetCreate({ priority: 'medium' }); setShowCreateModal(true); }}
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          <HiPlus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="tasks"
          title="No tasks available"
          description="Add a task to keep your project moving forward."
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-sm"
            >
              Add First Task
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditTask}
              onDelete={(t) => setTaskToDelete(t)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetCreate(); }}
        title="Create Task"
      >
        <form onSubmit={handleCreate(handleCreateTask)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input
              type="text"
              {...registerCreate('title', { required: 'Title is required' })}
              className="input-field"
              placeholder="Task title"
            />
            {createErrors.title && <p className="text-xs text-danger mt-1">{createErrors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              rows={2}
              {...registerCreate('description')}
              className="input-field !h-auto py-3 resize-none"
              placeholder="Optional description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Priority</label>
              <select {...registerCreate('priority')} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date</label>
              <input type="date" {...registerCreate('dueDate')} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setTaskToEdit(null); }}
        title="Edit Task"
      >
        <form onSubmit={handleEdit(handleEditTask)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input
              type="text"
              {...registerEdit('title', { required: 'Title is required' })}
              className="input-field"
            />
            {editErrors.title && <p className="text-xs text-danger mt-1">{editErrors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              rows={2}
              {...registerEdit('description')}
              className="input-field !h-auto py-3 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Priority</label>
              <select {...registerEdit('priority')} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select {...registerEdit('status')} className="input-field">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Due Date</label>
            <input type="date" {...registerEdit('dueDate')} className="input-field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Updating...' : 'Update Task'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={showProjectEditModal}
        onClose={() => { setShowProjectEditModal(false); resetProject(); }}
        title="Edit Project"
      >
          <form onSubmit={handleProjectEdit(handleUpdateProject)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input
                type="text"
                {...registerProject('title', { required: 'Title is required' })}
                className="input-field"
              />
              {projectErrors.title && <p className="text-xs text-danger mt-1">{projectErrors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                rows={3}
                {...registerProject('description', { required: 'Description is required' })}
                className="input-field !h-auto py-3 resize-none"
              />
              {projectErrors.description && <p className="text-xs text-danger mt-1">{projectErrors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Deadline</label>
                <input type="date" {...registerProject('deadline')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select {...registerProject('status')} className="input-field">
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Updating...' : 'Update Project'}
            </button>
          </form>
        </Modal>
      

      <ConfirmationDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task?"
        message="This task will be permanently removed."
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        message="This will permanently delete the project and all its tasks."
      />
    </div>
  );
}
