'use client';

import { memo } from 'react';

interface AnalyticsPanelProps {
  children: React.ReactNode;
  mainContent: React.ReactNode;
  filterControls?: React.ReactNode;
}

/**
 * PERFORMANCE OPTIMIZED:
 * - Removed framer-motion completely
 * - Removed useSyncExternalStore (unnecessary complexity)
 * - Wrapped in React.memo
 */
const AnalyticsPanel = memo(function AnalyticsPanel({  
  children,
  mainContent,
}: AnalyticsPanelProps) {
  return (
    <div className="h-full px-3 pb-3">
      <div 
        className="h-full rounded-b-2xl overflow-hidden flex"
        style={{
          background: 'rgba(20, 20, 20, 0.7)',
        }}
      >
        {/* Analytics Sidebar */}
        <div className="hidden lg:flex w-[240px] flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-text-primary mb-1">Analytics</h2>
              <p className="text-xs text-text-muted">My watching stats</p>
            </div>
            {children}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {mainContent}
        </div>
      </div>
    </div>
  );
});

export default AnalyticsPanel;
