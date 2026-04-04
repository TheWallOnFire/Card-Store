/**
 * Simple in-memory rate limiter for server actions and routes.
 * In a real production environment, this should use Upstash Redis (e.g. @upstash/ratelimit)
 * to work across multiple serverless function instances.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(identifier) || { count: 0, lastReset: now };

  if (now - userData.lastReset > windowMs) {
    userData.count = 0;
    userData.lastReset = now;
  }

  if (userData.count >= limit) {
    return false;
  }

  userData.count++;
  rateLimitMap.set(identifier, userData);
  return true;
}

/**
 * Returns a simple JSON response for rate limited requests.
 */
export const rateLimitResponse = () => {
  return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json' },
  });
};
