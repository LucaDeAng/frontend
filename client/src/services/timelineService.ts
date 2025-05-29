const CACHE_KEY = 'ai_timeline';
const CACHE_TTL = 60 * 60 * 1000; // 1 ora

export async function getAiTimeline(fetchTimeline: () => Promise<any[]>): Promise<any[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  const cachedAt = localStorage.getItem(CACHE_KEY + '_at');
  if (cached && cachedAt && Date.now() - parseInt(cachedAt) < CACHE_TTL) {
    return JSON.parse(cached);
  }
  const data = await fetchTimeline();
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_KEY + '_at', Date.now().toString());
  return data;
} 