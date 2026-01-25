'use client';

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';

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
}: AnalyticsPanelProps) {
  const isClient = useIsClient();

  // Avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="h-full px-3 pb-3">
        <div 
          className="h-full rounded-b-2xl overflow-hidden flex"
          style={{
            background: 'rgba(20, 20, 20, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="hidden lg:block w-[240px] animate-pulse" />
          <div className="flex-1 overflow-y-auto">
            {mainContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-3 pb-3">
      {/* Unified glass container - seamless connection to navbar */}
      <motion.div 
        className="h-full rounded-b-2xl overflow-hidden flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: 'rgba(20, 20, 20, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Analytics Sidebar - Fixed width, no border separator */}
        <motion.div 
          className="hidden lg:flex w-[240px] flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* Analytics Dashboard */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-sm font-semibold text-text-primary mb-1">Analytics</h2>
              <p className="text-xs text-text-muted">Your watching stats</p>
            </motion.div>
            {children}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div 
          className="flex-1 overflow-y-auto scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {mainContent}
        </motion.div>
      </motion.div>
    </div>
  );
}
