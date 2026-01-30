'use client';

import * as React from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandingSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export default function ExpandingSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className,
}: ExpandingSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'glass border-glass text-text-primary text-xs',
          'flex w-full items-center justify-between gap-1.5 rounded-md px-2 py-1.5',
          'hover:bg-bg-tertiary/50 transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-border-focus',
          open && 'bg-bg-tertiary/50'
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDownIcon 
          className={cn(
            'size-3 opacity-50 transition-transform shrink-0',
            open && 'rotate-180'
          )} 
        />
      </button>

      {/* Dropdown - Absolute positioned to overlap content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 mt-1 z-[9999]"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <div className="border border-border-subtle rounded-md shadow-lg overflow-hidden">
              <div className="py-0.5">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1 px-2 text-xs outline-none',
                      'text-text-primary hover:bg-bg-tertiary/50 transition-colors',
                      'focus:bg-bg-tertiary/50',
                      value === option.value && 'bg-bg-tertiary/30'
                    )}
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {value === option.value && (
                      <CheckIcon className="size-3 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
