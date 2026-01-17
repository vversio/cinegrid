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
          'glass border-glass-border filter-control-button text-filmic-beige text-sm',
          'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2',
          'hover:bg-filmic-seduction/30 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-filmic-lavender',
          open && 'bg-filmic-seduction/30'
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDownIcon 
          className={cn(
            'size-4 opacity-50 transition-transform shrink-0',
            open && 'rotate-180'
          )} 
        />
      </button>

      {/* Expanding Dropdown - Renders inline to push content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="glass border-glass-border filter-control-dropdown rounded-md">
              <div className="py-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none',
                      'text-filmic-beige hover:bg-filmic-seduction/30 transition-colors',
                      'focus:bg-filmic-seduction/30',
                      value === option.value && 'bg-filmic-seduction/20'
                    )}
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {value === option.value && (
                      <CheckIcon className="size-4 shrink-0" />
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
