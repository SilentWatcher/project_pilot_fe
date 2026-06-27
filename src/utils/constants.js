export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

export const STATUS_COLORS = {
  active: 'bg-[#38BDF8]/10 text-[#38BDF8]',
  completed: 'bg-[#22C55E]/10 text-[#22C55E]',
  archived: 'bg-gray-100 text-gray-500',
  pending: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  'in-progress': 'bg-[#38BDF8]/10 text-[#38BDF8]',
  low: 'bg-[#22C55E]/10 text-[#22C55E]',
  medium: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  high: 'bg-[#EF4444]/10 text-[#EF4444]',
};

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'HiViewGrid' },
  { label: 'Projects', path: '/projects', icon: 'HiFolder' },
  { label: 'Tasks', path: '/tasks', icon: 'HiCheckCircle' },
  { label: 'Analytics', path: '/analytics', icon: 'HiChartBar' },
  { label: 'Activity', path: '/activity', icon: 'HiClock' },
  { label: 'Settings', path: '/settings', icon: 'HiCog' },
];

export const CHART_COLORS = {
  sky: '#38BDF8',
  blue: '#0EA5E9',
  green: '#22C55E',
  orange: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  slate: '#64748B',
};
