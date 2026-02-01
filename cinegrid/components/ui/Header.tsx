'use client';

import { useState, memo } from 'react';
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

/**
 * PERFORMANCE OPTIMIZED:
 * - Removed framer-motion animations
 * - Wrapped in React.memo
 */
const Header = memo(function Header({ 
  user, 
  onAuthChange, 
  onOpenAnalytics,
  showAnalyticsButton = false,
  filterControls,
  navbarFilterControls,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] px-3 pt-3">
      <div 
        className="rounded-t-2xl overflow-hidden"
        style={{
          background: 'rgba(20, 20, 20, 0.75)',
        }}
      >
        <div className="h-14 px-5 flex items-center justify-between gap-4">
          {/* Logo + subtext */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1 className="text-xl font-bold tracking-wide text-text-primary">
              CineGrid
            </h1>
            <span className="hidden sm:inline text-xs text-text-muted font-normal border-l border-border-subtle pl-2">
              Movies & series I recently watched
            </span>
          </div>

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
              <button
                onClick={onOpenAnalytics}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Open analytics"
              >
                <BarChart3 size={18} className="text-text-primary" />
              </button>
            )}

            {/* Hamburger menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  aria-label="Open menu"
                >
                  {mobileMenuOpen ? (
                    <X size={18} className="text-text-primary" />
                  ) : (
                    <Menu size={18} className="text-text-primary" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] border-l-0"
                style={{
                  background: 'rgba(15, 15, 15, 0.85)',
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
      </div>
    </header>
  );
});

export default Header;
