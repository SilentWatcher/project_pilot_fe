import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl
                   text-sm text-[#0F172A] dark:text-white placeholder:text-[#64748B]
                   focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]
                   transition-all duration-200"
      />
    </div>
  );
}
