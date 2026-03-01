const RECENT_REQUESTS = new Map<string, number>();

function checkRateLimit(url: string, limitMs: number): void {
  const now = Date.now();
  const last = RECENT_REQUESTS.get(url) || 0;
  if (now - last < limitMs) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }
  RECENT_REQUESTS.set(url, now);
}

export async function fetchWithTimeout({
  url,
  options = {},
  timeoutMs = 8000,
  rateLimitMs = 500,
}: {
  url: string;
  options?: RequestInit;
  timeoutMs?: number;
  rateLimitMs?: number;
}) {
  checkRateLimit(url, rateLimitMs);

  return await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMs),
  });
}
