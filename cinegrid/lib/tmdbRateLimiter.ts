/**
 * Simple in-memory rate limiter for TMDB API
 * TMDB allows 40 requests per 10 seconds
 */

interface RateLimitState {
  requests: number[];
  isLimited: boolean;
}

// TMDB limits: 40 requests per 10 seconds
const RATE_LIMIT = 40;
const WINDOW_MS = 10000; // 10 seconds

// In-memory state (resets on server restart, which is fine for rate limiting)
const state: RateLimitState = {
  requests: [],
  isLimited: false,
};

/**
 * Check if we can make a request, and record it if so
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(): boolean {
  const now = Date.now();
  
  // Remove old requests outside the window
  state.requests = state.requests.filter(time => now - time < WINDOW_MS);
  
  // Check if we're at the limit
  if (state.requests.length >= RATE_LIMIT) {
    state.isLimited = true;
    return false;
  }
  
  // Record this request
  state.requests.push(now);
  state.isLimited = false;
  return true;
}

/**
 * Get the wait time until we can make another request
 * @returns milliseconds to wait, or 0 if not rate limited
 */
export function getWaitTime(): number {
  if (state.requests.length < RATE_LIMIT) {
    return 0;
  }
  
  const oldestRequest = Math.min(...state.requests);
  const waitTime = WINDOW_MS - (Date.now() - oldestRequest);
  return Math.max(0, waitTime);
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(): { remaining: number; resetIn: number } {
  const now = Date.now();
  state.requests = state.requests.filter(time => now - time < WINDOW_MS);
  
  return {
    remaining: Math.max(0, RATE_LIMIT - state.requests.length),
    resetIn: state.requests.length > 0 
      ? WINDOW_MS - (now - Math.min(...state.requests))
      : 0,
  };
}
