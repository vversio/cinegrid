'use client';

import { useSyncExternalStore } from 'react';

// Simple subscription that never changes
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

interface AnalyticsPanelProps {
  children: React.ReactNode;
  mainContent: React.ReactNode;
  filterControls?: React.ReactNode;
}

export default function AnalyticsPanel({
  children,
  mainContent,
  filterControls,
}: AnalyticsPanelProps) {
  const isClient = useIsClient();

  // Avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="h-full flex">
        <div className="w-[20%] p-3 pr-2">
          <div className="glass rounded-xl p-3 h-full animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {mainContent}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Analytics Sidebar - Fixed width, single frame */}
      <div className="hidden lg:block w-[20%] p-3 pr-2 overflow-hidden">
        <div className="glass large-panel rounded-xl p-3 h-full flex flex-col overflow-y-auto scrollbar-hide">
          {/* Analytics Dashboard */}
          <div className="flex-shrink-0">
            {children}
          </div>
          
          {/* Divider */}
          {filterControls && (
            <div className="my-3 border-t border-glass-border" />
          )}
          
          {/* Filter Controls */}
          {filterControls && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-2 flex-shrink-0">
                <span className="text-xs font-medium text-filmic-rose uppercase tracking-wide">Filters & Sort</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {filterControls}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {mainContent}
      </div>
    </div>
  );
}
