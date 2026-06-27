import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 300, 400, 500];

export default function Pagination({ page, totalPages, onPageChange, total, limit, onLimitChange }) {
  if (totalPages <= 1 && !onLimitChange) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
      <div className="flex items-center gap-3">
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#64748B]">Show</label>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-9 px-2 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#38BDF8]"
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-sm text-[#64748B]">per page</span>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <p className="text-sm text-[#64748B] mr-2">
            Page {page} of {totalPages} ({total} total)
          </p>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronLeft className="w-5 h-5 text-[#64748B]" />
          </button>

          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="px-2 text-[#64748B]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  p === page
                    ? 'bg-[#38BDF8] text-white'
                    : 'text-[#64748B] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronRight className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>
      )}
    </div>
  );
}
