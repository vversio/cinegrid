'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Toggle } from '@/components/ui/toggle';
import type { WatchedMovie } from '@/lib/types';
import {
  aggregateByGenreAndMonth,
  getTopGenres,
  getQuickStats,
  getThisYearStartDate,
  getChartColor,
} from '@/lib/analyticsUtils';

interface GenreTrendChartProps {
  movies: WatchedMovie[];
  isLoading?: boolean;
}

const TIME_RANGE_KEY = 'cinegrid-analytics-time-range';

// Client-only state for hydration
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

// Get initial time range from localStorage (only runs on client)
function getStoredTimeRange(): 'all' | 'year' {
  if (typeof window === 'undefined') return 'all';
  const stored = localStorage.getItem(TIME_RANGE_KEY);
  if (stored === 'all' || stored === 'year') return stored;
  return 'all';
}

export default function GenreTrendChart({ movies, isLoading }: GenreTrendChartProps) {
  const isClient = useIsClient();
  const [timeRange, setTimeRange] = useState<'all' | 'year'>(() => getStoredTimeRange());

  // Persist time range changes
  const handleTimeRangeChange = (range: 'all' | 'year') => {
    setTimeRange(range);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIME_RANGE_KEY, range);
    }
  };

  const stats = useMemo(() => getQuickStats(movies), [movies]);
  
  const chartData = useMemo(() => {
    const startDate = timeRange === 'year' ? getThisYearStartDate() : undefined;
    return aggregateByGenreAndMonth(movies, startDate);
  }, [movies, timeRange]);

  const topGenres = useMemo(() => getTopGenres(movies, 7), [movies]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 shimmer rounded" />
          <div className="h-8 w-40 shimmer rounded-full" />
        </div>
        <div className="h-[200px] shimmer rounded-lg" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 shimmer rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="w-16 h-16 rounded-full bg-bg-tertiary/50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-text-secondary text-sm">Start tracking movies to see trends</p>
      </div>
    );
  }

  // Server-side render placeholder
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-text-primary">Genre Trends</h3>
        </div>
        <div className="h-[200px] bg-bg-tertiary/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with time range toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-text-primary">Genre Trends</h3>
        <div className="flex gap-1 p-1 rounded-full bg-bg-tertiary/50">
          <Toggle
            pressed={timeRange === 'all'}
            onPressedChange={() => handleTimeRangeChange('all')}
            className="px-3 py-1 text-xs rounded-full data-[state=on]:bg-text-primary data-[state=on]:text-bg-primary"
            size="sm"
          >
            All Time
          </Toggle>
          <Toggle
            pressed={timeRange === 'year'}
            onPressedChange={() => handleTimeRangeChange('year')}
            className="px-3 py-1 text-xs rounded-full data-[state=on]:bg-text-primary data-[state=on]:text-bg-primary"
            size="sm"
          >
            This Year
          </Toggle>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[180px]" style={{ minHeight: '180px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={180}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {topGenres.map((genre, index) => (
                  <linearGradient key={genre} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getChartColor(index)} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={getChartColor(index)} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: '#a0a0a0', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#a0a0a0', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)',
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}
                itemStyle={{ color: '#a0a0a0', fontSize: '12px' }}
              />
              {topGenres.map((genre, index) => (
                <Area
                  key={genre}
                  type="monotone"
                  dataKey={genre}
                  stackId="1"
                  stroke={getChartColor(index)}
                  fill={`url(#gradient-${index})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-text-secondary text-sm">
            No data for selected time range
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-bg-tertiary/30 text-center">
          <div className="text-base font-semibold text-text-primary">{stats.totalMovies}</div>
          <div className="text-xs text-text-secondary">Movies</div>
        </div>
        <div className="p-2 rounded-lg bg-bg-tertiary/30 text-center">
          <div className="text-base font-semibold text-text-primary">{stats.totalSeries}</div>
          <div className="text-xs text-text-secondary">Series</div>
        </div>
        <div className="p-2 rounded-lg bg-bg-tertiary/30 text-center">
          <div className="text-base font-semibold text-text-primary">
            {stats.avgRating ? `${stats.avgRating}` : '-'}
          </div>
          <div className="text-xs text-text-secondary">Avg Rating</div>
        </div>
      </div>
    </div>
  );
}
