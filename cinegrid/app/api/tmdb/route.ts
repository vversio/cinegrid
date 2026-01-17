import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getWaitTime, getRateLimitStatus } from '@/lib/tmdbRateLimiter';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const type = searchParams.get('type') || 'movie'; // 'movie' or 'series'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
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
    const endpoint = type === 'series' ? '/search/tv' : '/search/movie';
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
      {
        // Cache search results for 5 minutes
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    const data = await response.json();
    const { remaining } = getRateLimitStatus();
    
    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
      }
    });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
