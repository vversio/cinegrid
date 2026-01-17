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
}

export default function Header({ 
  user, 
  onAuthChange, 
  onOpenAnalytics,
  showAnalyticsButton = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-14 glass large-panel border-b border-glass-border">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
        {/* Logo with neon glow */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold tracking-tight text-filmic-lavender text-neon-glow">
            CineGrid
          </h1>
        </div>

        {/* Desktop: Auth button */}
        <div className="hidden md:flex items-center gap-4">
          <AuthButton user={user} onAuthChange={onAuthChange} />
        </div>

        {/* Mobile: Hamburger menu + Analytics button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Analytics FAB for mobile */}
          {showAnalyticsButton && onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="p-2 rounded-lg glass neon-glow-blue hover:bg-filmic-seduction-light/20 transition-colors"
              aria-label="Open analytics"
            >
              <BarChart3 size={18} className="text-filmic-lavender" />
            </button>
          )}

          {/* Hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg glass hover:neon-glow-blue hover:bg-filmic-seduction-light/20 transition-all"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? (
                  <X size={18} className="text-filmic-lavender" />
                ) : (
                  <Menu size={18} className="text-filmic-lavender" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-filmic-charcoal-light border-l border-glass-border"
            >
              <div className="flex flex-col gap-6 pt-8">
                {/* Auth button */}
                <div className="pt-4 border-t border-glass-border">
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
