'use client';

import { BarChart3 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MobileAnalyticsDrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileAnalyticsDrawer({
  children,
  open,
  onOpenChange,
}: MobileAnalyticsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[340px] sm:w-[400px] bg-bg-secondary border-r border-border-subtle p-0"
      >
        <SheetHeader className="p-4 border-b border-border-subtle">
          <SheetTitle className="text-text-primary flex items-center gap-2">
            <BarChart3 size={20} className="text-text-primary" />
            Analytics
          </SheetTitle>
        </SheetHeader>
        <div className="p-4 h-[calc(100vh-60px)] overflow-y-auto">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Floating Action Button for opening analytics on mobile
export function AnalyticsFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 lg:hidden z-30 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
      aria-label="Open analytics"
    >
      <BarChart3 size={20} className="text-text-primary" />
    </button>
  );
}
