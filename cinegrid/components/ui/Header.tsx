'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, BarChart3 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/AuthButton';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  onAuthChange: () => void;
  onOpenAnalytics?: () => void;
  showAnalyticsButton?: boolean;
  filterControls?: React.ReactNode;
  navbarFilterControls?: React.ReactNode;
}

export default function Header({ 
  user, 
  onAuthChange, 
  onOpenAnalytics,
  showAnalyticsButton = false,
  filterControls,
  navbarFilterControls,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      {/* Glass navbar - seamless top of frame (no bottom border) */}
      <motion.div 
        className="rounded-t-2xl overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: 'rgba(20, 20, 20, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="h-14 px-5 flex items-center justify-between gap-4">
          {/* Logo with Starlord font */}
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-xl font-display tracking-wide text-text-primary">
              CineGrid
            </h1>
          </motion.div>

          {/* Desktop: Filter controls in center */}
          <div className="hidden lg:flex flex-1 justify-center">
            {navbarFilterControls}
          </div>

          {/* Desktop: Auth button */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <AuthButton user={user} onAuthChange={onAuthChange} />
          </div>

          {/* Mobile: Hamburger menu + Analytics button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Analytics FAB for mobile */}
            {showAnalyticsButton && onOpenAnalytics && (
              <motion.button
                onClick={onOpenAnalytics}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                aria-label="Open analytics"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 size={18} className="text-text-primary" />
              </motion.button>
            )}

            {/* Hamburger menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.button
                  className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                  aria-label="Open menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mobileMenuOpen ? (
                    <X size={18} className="text-text-primary" />
                  ) : (
                    <Menu size={18} className="text-text-primary" />
                  )}
                </motion.button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] border-l-0"
                style={{
                  background: 'rgba(15, 15, 15, 0.85)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                }}
              >
                <div className="flex flex-col gap-4 pt-6">
                  {/* Filter controls on mobile */}
                  {filterControls && (
                    <div className="pb-4 border-b border-white/10">
                      <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">Filters</p>
                      {filterControls}
                    </div>
                  )}
                  {/* Auth button */}
                  <div>
                    <AuthButton user={user} onAuthChange={onAuthChange} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
