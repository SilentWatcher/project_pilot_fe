import { HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, color = '#38BDF8' }) {
  const isUp = trend === 'up';

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#64748B] dark:text-gray-400 font-medium mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-[#0F172A] dark:text-white">
            {value}
          </h3>
          {trendLabel && (
            <div className="flex items-center gap-1 mt-2">
              {isUp ? (
                <HiOutlineArrowUp className="w-4 h-4 text-success" />
              ) : (
                <HiOutlineArrowDown className="w-4 h-4 text-danger" />
              )}
              <span
                className={`text-xs font-medium ${
                  isUp ? 'text-success' : 'text-danger'
                }`}
              >
                {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
