const CACHE_KEY = 'quiz_data';
const CACHE_TTL = 30 * 60 * 1000; // 30 minuti

export async function getQuizData(fetchQuiz: () => Promise<any[]>): Promise<any[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  const cachedAt = localStorage.getItem(CACHE_KEY + '_at');
  if (cached && cachedAt && Date.now() - parseInt(cachedAt) < CACHE_TTL) {
    return JSON.parse(cached);
  }
  const data = await fetchQuiz();
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_KEY + '_at', Date.now().toString());
  return data;
} 