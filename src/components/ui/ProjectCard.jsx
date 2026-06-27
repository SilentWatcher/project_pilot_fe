import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineStatusOnline, HiOutlineClipboardList } from 'react-icons/hi';
import { formatDate, isOverdue, truncate } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

export default function ProjectCard({ project }) {
  const overdue = isOverdue(project.deadline, project.status);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="card-hover block group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-[#0F172A] dark:text-white group-hover:text-[#38BDF8] transition-colors">
          {truncate(project.title, 40)}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
            STATUS_COLORS[project.status] || ''
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4 line-clamp-2">
        {truncate(project.description, 80)}
      </p>

      <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <HiOutlineCalendar className="w-4 h-4" />
          <span className={overdue ? 'text-danger font-medium' : ''}>
            {formatDate(project.deadline)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <HiOutlineClipboardList className="w-4 h-4" />
          <span>{project._count?.tasks || 0} tasks</span>
        </div>
      </div>
    </Link>
  );
}
