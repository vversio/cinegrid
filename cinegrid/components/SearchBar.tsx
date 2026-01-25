'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search your collection...',
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className={cn('relative', className)}>
      <Search
        size={12}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-7 pr-6 py-1.5 rounded-md glass text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-focus transition-all"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-bg-tertiary/50 transition-colors"
          aria-label="Clear search"
        >
          <X size={12} className="text-text-muted" />
        </button>
      )}
    </div>
  );
}
