import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi';
import { formatDate, isOverdue, truncate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export default function TaskBoardView({ tasks, onStatusChange, onEdit, onDelete, selected, selectable, onToggleSelect }) {
  const [dragOver, setDragOver] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  const handleDragStart = (e, taskId) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(columnKey);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e, columnKey) => {
    e.preventDefault();
    setDragOver(null);
    setDraggedId(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onStatusChange) {
      onStatusChange(taskId, columnKey);
    }
  };

  const handleDragEnd = () => {
    setDragOver(null);
    setDraggedId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map((col) => {
        const columnTasks = grouped[col.key];
        const isOver = dragOver === col.key;

        return (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`rounded-xl border transition-all duration-200 ${
              isOver
                ? 'border-[#38BDF8] bg-[#38BDF8]/5'
                : 'border-border dark:border-dark-border bg-gray-50/50 dark:bg-gray-800/30'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[col.key]?.split(' ')[0] || 'bg-gray-400'}`} />
                {col.label}
              </h3>
              <span className="text-xs text-[#64748B] bg-white dark:bg-dark-card px-2 py-0.5 rounded-full border border-border dark:border-dark-border">
                {columnTasks.length}
              </span>
            </div>

            <div className="p-3 space-y-2 min-h-[200px]">
              {columnTasks.length === 0 && (
                <p className="text-xs text-[#64748B] text-center py-8">No tasks</p>
              )}
              {columnTasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className={`card !p-3 cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-all duration-200 ${
                      draggedId === task.id ? 'opacity-50 scale-[0.97]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {selectable && (
                        <input
                          type="checkbox"
                          checked={selected?.has(task.id)}
                          onChange={() => onToggleSelect?.(task.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#38BDF8] focus:ring-[#38BDF8] cursor-pointer"
                        />
                      )}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                        }`}
                      />
                      <h4
                        className="text-sm font-semibold text-[#0F172A] dark:text-white truncate flex-1 cursor-pointer hover:text-[#38BDF8]"
                        onClick={() => onEdit?.(task)}
                      >
                        {task.title}
                      </h4>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(task)}
                          className="text-xs text-danger hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          del
                        </button>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2 mb-2">
                        {truncate(task.description, 80)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[task.priority] || ''}`}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-danger font-medium' : 'text-[#64748B]'}`}>
                          <HiOutlineCalendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      {task.assignedUser && (
                        <span className="flex items-center gap-1 text-xs text-[#64748B] ml-auto">
                          <HiOutlineUser className="w-3 h-3" />
                          {task.assignedUser.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
