import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { formatDate, isOverdue } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

const statusOptions = ['pending', 'in-progress', 'completed'];

export default function TaskListView({ tasks, onEdit, onDelete, onStatusChange, selected, selectable, onToggleSelect, onSelectAll }) {
  const allSelected = selectable && tasks.length > 0 && tasks.every((t) => selected?.has(t.id));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border dark:border-dark-border text-left text-[#64748B]">
            <th className="pb-3 font-medium">
              {selectable && (
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll?.(!allSelected)}
                  className="w-4 h-4 rounded border-gray-300 text-[#38BDF8] focus:ring-[#38BDF8] cursor-pointer mr-2 align-middle"
                />
              )}
              Title
            </th>
            <th className="pb-3 font-medium">Priority</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Due Date</th>
            <th className="pb-3 font-medium">Assigned To</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <tr
                key={task.id}
                className="border-b border-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {selectable && (
                      <input
                        type="checkbox"
                        checked={selected?.has(task.id)}
                        onChange={() => onToggleSelect?.(task.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#38BDF8] focus:ring-[#38BDF8] cursor-pointer"
                      />
                    )}
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}
                    />
                    <span className="font-medium text-[#0F172A] dark:text-white">
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1 ml-4">
                      {task.description}
                    </p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      STATUS_COLORS[task.priority] || ''
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange?.(task.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize border-0 appearance-none cursor-pointer focus:outline-none ${
                      STATUS_COLORS[task.status] || ''
                    }`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className={`py-3 pr-4 whitespace-nowrap ${overdue ? 'text-danger font-medium' : 'text-[#64748B]'}`}>
                  {task.dueDate ? formatDate(task.dueDate) : '—'}
                </td>
                <td className="py-3 pr-4 text-[#64748B]">
                  {task.assignedUser?.name || '—'}
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onEdit?.(task)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Edit task"
                  >
                    <HiOutlinePencil className="w-4 h-4 text-[#64748B]" />
                  </button>
                  <button
                    onClick={() => onDelete?.(task)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
                    title="Delete task"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-danger" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
