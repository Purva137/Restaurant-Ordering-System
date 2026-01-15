type RateEntry = {
  count: number;
  resetAt: number;
};

const store = globalThis as unknown as {
  rateLimitStore?: Map<string, RateEntry>;
};

const rateLimitStore =
  store.rateLimitStore ?? new Map<string, RateEntry>();

if (!store.rateLimitStore) {
  store.rateLimitStore = rateLimitStore;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: limit - entry.count };
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const realIp = req.headers.get("x-real-ip") ?? "";
  const ip = forwarded.split(",")[0].trim() || realIp || "unknown";
  return ip;
}

