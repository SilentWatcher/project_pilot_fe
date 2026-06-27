import { Link } from 'react-router-dom';
import { formatDate, isOverdue } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';

export default function ProjectListView({ projects }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border dark:border-dark-border text-left text-[#64748B]">
            <th className="pb-3 font-medium">Title</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Deadline</th>
            <th className="pb-3 font-medium text-right">Tasks</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const overdue = isOverdue(project.deadline, project.status);
            return (
              <tr
                key={project.id}
                className="border-b border-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 pr-4">
                  <Link
                    to={`/projects/${project.id}`}
                    className="font-medium text-[#0F172A] dark:text-white hover:text-[#38BDF8] transition-colors"
                  >
                    {project.title}
                  </Link>
                  {project.description && (
                    <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                      {project.description}
                    </p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      STATUS_COLORS[project.status] || ''
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className={`py-3 pr-4 whitespace-nowrap ${overdue ? 'text-danger font-medium' : 'text-[#64748B]'}`}>
                  {formatDate(project.deadline)}
                </td>
                <td className="py-3 text-right text-[#64748B] whitespace-nowrap">
                  {project._count?.tasks || 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
