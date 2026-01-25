'use client';

import { useMemo } from 'react';
import { Film, Tv, Clock, Star, Trophy, Calendar } from 'lucide-react';
import type { WatchedMovie } from '@/lib/types';

interface StatisticsPanelProps {
  movies: WatchedMovie[];
  isLoading?: boolean;
}

// Estimated average runtime in minutes
const MOVIE_AVG_RUNTIME = 120;
const SERIES_AVG_RUNTIME = 45; // per episode, assume 8 episodes

interface Stats {
  totalMovies: number;
  totalSeries: number;
  totalHours: number;
  avgRating: number | null;
  topGenre: string | null;
  thisMonth: number;
  thisYear: number;
  fiveStarCount: number;
}

function calculateStats(movies: WatchedMovie[]): Stats {
  const totalMovies = movies.filter(m => m.media_type === 'movie').length;
  const totalSeries = movies.filter(m => m.media_type === 'series').length;
  
  // Estimate total hours (rough calculation)
  const movieHours = totalMovies * MOVIE_AVG_RUNTIME / 60;
  const seriesHours = totalSeries * SERIES_AVG_RUNTIME * 8 / 60; // Assume 8 episodes per series
  const totalHours = Math.round(movieHours + seriesHours);

  // Average rating
  const ratedMovies = movies.filter(m => m.user_rating !== null);
  const avgRating = ratedMovies.length > 0
    ? parseFloat((ratedMovies.reduce((sum, m) => sum + (m.user_rating || 0), 0) / ratedMovies.length).toFixed(1))
    : null;

  // Top genre
  const genreCounts: Record<string, number> = {};
  movies.forEach(m => {
    genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1;
  });
  const topGenre = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // This month / this year
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYearStart = new Date(now.getFullYear(), 0, 1);
  
  const thisMonth = movies.filter(m => new Date(m.watched_date) >= thisMonthStart).length;
  const thisYear = movies.filter(m => new Date(m.watched_date) >= thisYearStart).length;

  // 5-star ratings
  const fiveStarCount = movies.filter(m => m.user_rating === 5).length;

  return {
    totalMovies,
    totalSeries,
    totalHours,
    avgRating,
    topGenre,
    thisMonth,
    thisYear,
    fiveStarCount,
  };
}

export default function StatisticsPanel({ movies, isLoading }: StatisticsPanelProps) {
  const stats = useMemo(() => calculateStats(movies), [movies]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-primary">Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 shimmer rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  const statCards = [
    { icon: Film, label: 'Movies', value: stats.totalMovies },
    { icon: Tv, label: 'Series', value: stats.totalSeries },
    { icon: Clock, label: 'Hours', value: `~${stats.totalHours}` },
    { icon: Star, label: 'Avg Rating', value: stats.avgRating ?? '-' },
    { icon: Trophy, label: 'Top Genre', value: stats.topGenre || '-', isText: true },
    { icon: Calendar, label: 'This Year', value: stats.thisYear },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-primary">Statistics</h3>
      <div className="grid grid-cols-2 gap-2">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-lg bg-bg-tertiary/30 flex items-center gap-2"
          >
            <stat.icon size={16} className="text-text-primary" />
            <div className="min-w-0">
              <div className={`text-sm font-semibold text-text-primary ${stat.isText ? 'text-xs truncate' : ''}`}>
                {stat.value}
              </div>
              <div className="text-xs text-text-secondary truncate">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
