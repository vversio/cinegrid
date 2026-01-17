'use client';

import { useState } from 'react';
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
}

export default function Header({ 
  user, 
  onAuthChange, 
  onOpenAnalytics,
  showAnalyticsButton = false,
  filterControls,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-12 glass border-b border-glass-border">
      <div className="max-w-[1920px] mx-auto px-3 lg:px-4 h-full flex items-center justify-between gap-3">
        {/* Logo with Starlord font */}
        <div className="flex items-center flex-shrink-0">
          <h1 className="text-lg font-display tracking-wide text-filmic-lavender text-neon-glow">
            CineGrid
          </h1>
        </div>

        {/* Desktop: Filter controls in center */}
        <div className="hidden md:flex flex-1 justify-center">
          {filterControls}
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
              className="p-1.5 rounded-lg glass hover:bg-filmic-seduction-light/20 transition-colors"
              aria-label="Open analytics"
            >
              <BarChart3 size={16} className="text-filmic-lavender" />
            </button>
          )}

          {/* Hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-1.5 rounded-lg glass hover:bg-filmic-seduction-light/20 transition-all"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? (
                  <X size={16} className="text-filmic-lavender" />
                ) : (
                  <Menu size={16} className="text-filmic-lavender" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[280px] bg-filmic-charcoal-light border-l border-glass-border"
            >
              <div className="flex flex-col gap-4 pt-6">
                {/* Filter controls on mobile */}
                {filterControls && (
                  <div className="pb-4 border-b border-glass-border">
                    <p className="text-xs text-filmic-rose uppercase tracking-wide mb-3">Filters</p>
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
    </header>
  );
}
