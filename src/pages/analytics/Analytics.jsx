import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/ui/StatCard';
import { CardSkeleton } from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import {
  HiOutlineFolder,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineClipboardList,
  HiOutlineViewGrid,
  HiOutlineStatusOnline,
  HiOutlineChartBar,
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-border dark:border-dark-border p-3">
        <p className="text-xs text-[#64748B] mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { stats, charts, loading, error } = useDashboard();

  if (error) {
    return <EmptyState icon="inbox" title="Failed to load analytics" description={error} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Analytics</h1>
        <p className="text-sm text-[#64748B] mt-1">Detailed insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((card) => (
              <StatCard key={card.key} icon={card.icon} label={card.label} value={stats?.[card.key] ?? 0} color={card.color} />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">Tasks by Status</h3>
          {loading ? (
            <div className="h-72 skeleton" />
          ) : charts?.tasksByStatus ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={charts.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {charts.tasksByStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-[#64748B]">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">Projects by Status</h3>
          {loading ? (
            <div className="h-72 skeleton" />
          ) : charts?.projectsByStatus ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={charts.projectsByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#64748B' }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                  {charts.projectsByStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">Tasks by Priority</h3>
          {loading ? (
            <div className="h-72 skeleton" />
          ) : charts?.tasksByPriority ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={charts.tasksByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={80}>
                  {charts.tasksByPriority.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">Overview Summary</h3>
        {loading ? (
          <div className="h-48 skeleton" />
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Completion Rate', value: stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0, unit: '%', color: '#22C55E' },
              { label: 'Active Projects', value: stats.activeProjects, unit: '', color: '#38BDF8' },
              { label: 'Overdue Rate', value: stats.totalTasks ? Math.round((stats.overdueTasks / stats.totalTasks) * 100) : 0, unit: '%', color: '#EF4444' },
              { label: 'In Progress', value: stats.inProgressTasks, unit: 'tasks', color: '#F59E0B' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-3xl font-bold" style={{ color: item.color }}>{item.value}{item.unit}</p>
                <p className="text-sm text-[#64748B] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
