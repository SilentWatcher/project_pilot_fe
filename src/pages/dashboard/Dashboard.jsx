import { Link } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import { CardSkeleton } from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/helpers';
import { STATUS_COLORS, CHART_COLORS } from '../../utils/constants';
import {
  HiOutlineFolder,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineClipboardList,
  HiOutlineViewGrid,
  HiOutlineStatusOnline,
  HiArrowRight,
} from 'react-icons/hi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const statCards = [
  { key: 'totalProjects', label: 'Total Projects', icon: HiOutlineFolder, color: '#38BDF8' },
  { key: 'activeProjects', label: 'Active Projects', icon: HiOutlineStatusOnline, color: '#0EA5E9' },
  { key: 'completedProjects', label: 'Completed Projects', icon: HiOutlineCheckCircle, color: '#22C55E' },
  { key: 'totalTasks', label: 'Total Tasks', icon: HiOutlineClipboardList, color: '#8B5CF6' },
  { key: 'pendingTasks', label: 'Pending Tasks', icon: HiOutlineClock, color: '#F59E0B' },
  { key: 'inProgressTasks', label: 'In Progress', icon: HiOutlineViewGrid, color: '#38BDF8' },
  { key: 'completedTasks', label: 'Completed Tasks', icon: HiOutlineCheckCircle, color: '#22C55E' },
  { key: 'overdueTasks', label: 'Overdue Tasks', icon: HiOutlineExclamationCircle, color: '#EF4444' },
];

export default function Dashboard() {
  const { stats, charts, loading, error } = useDashboard();

  if (error) {
    return (
      <EmptyState
        icon="inbox"
        title="Failed to load dashboard"
        description={error}
      />
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-border dark:border-dark-border p-3">
          <p className="text-sm font-medium text-[#0F172A] dark:text-white">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Overview of your projects and tasks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((card) => (
              <StatCard
                key={card.key}
                icon={card.icon}
                label={card.label}
                value={stats?.[card.key] ?? 0}
                color={card.color}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">
            Tasks by Status
          </h3>
          {loading ? (
            <div className="h-64 skeleton" />
          ) : charts?.tasksByStatus ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.tasksByStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-[#64748B]">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">
            Tasks by Priority
          </h3>
          {loading ? (
            <div className="h-64 skeleton" />
          ) : charts?.tasksByPriority ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.tasksByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {charts.tasksByPriority.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">
            Projects by Status
          </h3>
          {loading ? (
            <div className="h-64 skeleton" />
          ) : charts?.projectsByStatus ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.projectsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.projectsByStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-[#64748B]">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#0F172A] dark:text-white">
              Recent Projects
            </h3>
            <Link
              to="/projects"
              className="text-sm text-[#38BDF8] font-medium hover:text-[#0EA5E9] flex items-center gap-1"
            >
              View all <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 skeleton" />
              ))}
            </div>
          ) : stats?.recentProjects?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] dark:text-white truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {project._count?.tasks ?? 0} tasks · {formatDate(project.deadline)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                      STATUS_COLORS[project.status] || ''
                    }`}
                  >
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="inbox"
              title="No recent projects"
              description="Create your first project to get started"
              action={
                <Link to="/projects" className="btn-primary text-sm">
                  Create Project
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
