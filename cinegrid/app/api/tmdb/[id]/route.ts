import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getWaitTime, getRateLimitStatus } from '@/lib/tmdbRateLimiter';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'movie'; // 'movie' or 'tv'

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
  }

  // Check rate limit
  if (!checkRateLimit()) {
    const waitTime = getWaitTime();
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again.', retryAfter: waitTime },
      { 
        status: 429,
        headers: { 'Retry-After': Math.ceil(waitTime / 1000).toString() }
      }
    );
  }

  try {
    const endpoint = type === 'series' ? `/tv/${id}` : `/movie/${id}`;
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`,
      {
        // Cache for 1 hour
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      throw new Error('TMDB API request failed');
    }

    const data = await response.json();
    
    const { remaining } = getRateLimitStatus();
    
    // Return only essential data for the modal
    return NextResponse.json({
      id: data.id,
      title: data.title || data.name,
      overview: data.overview || 'No overview available.',
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date || data.first_air_date,
      vote_average: data.vote_average,
      runtime: data.runtime || (data.episode_run_time?.[0] ?? null),
      genres: data.genres?.map((g: { id: number; name: string }) => g.name) || [],
      tagline: data.tagline || null,
    }, {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
      }
    });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
