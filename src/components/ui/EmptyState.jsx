import { HiOutlineInbox, HiOutlineSearch, HiOutlineClipboardList } from 'react-icons/hi';

const icons = {
  inbox: HiOutlineInbox,
  search: HiOutlineSearch,
  tasks: HiOutlineClipboardList,
};

export default function EmptyState({
  icon = 'inbox',
  title = 'No data found',
  description = '',
  action,
}) {
  const Icon = icons[icon] || HiOutlineInbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#64748B] dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#64748B] dark:text-gray-400 max-w-md mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
