const url = "https://aikatsu-academy.com/schedule/";

export const fetchSchedule = async (env: Env): Promise<string> => {
  const cached = await env.CACHE.get(url);
  if (cached) {
    return cached;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  const html = await res.text();
  await env.CACHE.put(URL, html, { expirationTtl: 3600 });
  return html;
};
