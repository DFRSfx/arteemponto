import { ChevronDown } from 'lucide-react';
import { SelectHTMLAttributes } from 'react';

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

const BASE = [
  'appearance-none bg-white border border-gray-200 rounded-lg',
  'text-sm text-gray-700 shadow-sm cursor-pointer',
  'w-full pl-3 pr-9 transition-colors',
  'hover:border-gray-400',
  'focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

export default function AdminSelect({
  className = '',
  wrapperClassName = '',
  children,
  ...props
}: AdminSelectProps) {
  return (
    <div className={`relative inline-grid ${wrapperClassName}`}>
      <select className={`${BASE} ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown
        size={15}
        strokeWidth={2.5}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
