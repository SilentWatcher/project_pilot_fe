import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineUser, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { formatDate, isOverdue, truncate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, selected, selectable, onToggleSelect }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  const statusOptions = ['pending', 'in-progress', 'completed'];

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {selectable && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect?.(task.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#38BDF8] focus:ring-[#38BDF8] cursor-pointer"
              />
            )}
            <span
              className={`w-2 h-2 rounded-full ${
                task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'
              }`}
            />
            <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">
              {task.title}
            </h4>
          </div>
          {task.description && (
            <p className="text-xs text-[#64748B] dark:text-gray-400 line-clamp-1 mb-2">
              {truncate(task.description, 60)}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
          >
            <HiOutlinePencil className="w-4 h-4 text-[#64748B]" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 w-40 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-border dark:border-dark-border py-1 z-20">
                <button
                  onClick={() => { setShowMenu(false); onEdit?.(task); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0F172A] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <HiOutlinePencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDelete?.(task); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <HiOutlineTrash className="w-4 h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
            STATUS_COLORS[task.priority] || ''
          }`}
        >
          {task.priority}
        </span>

        <div className="relative">
          <select
            value={task.status}
            onChange={(e) => onStatusChange?.(task.id, e.target.value)}
            className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize border-0 appearance-none cursor-pointer focus:outline-none ${
              STATUS_COLORS[task.status] || ''
            }`}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {task.dueDate && (
          <span
            className={`flex items-center gap-1 text-xs ${
              overdue ? 'text-danger font-medium' : 'text-[#64748B]'
            }`}
          >
            <HiOutlineCalendar className="w-3.5 h-3.5" />
            {formatDate(task.dueDate)}
          </span>
        )}

        {task.assignedUser && (
          <span className="flex items-center gap-1 text-xs text-[#64748B] ml-auto">
            <HiOutlineUser className="w-3.5 h-3.5" />
            {task.assignedUser.name}
          </span>
        )}
      </div>
    </div>
  );
}
