// src/api.js

const API_BASE      = 'http://127.0.0.1:8000/nubuzz';
const NEWS_ENDPOINT = `${API_BASE}/api/news/`;

export const fetchNewsData = async ({ category, location } = {}) => {
  const url = new URL(NEWS_ENDPOINT);
  if (category) url.searchParams.append('category', category);
  if (location) url.searchParams.append('location', location);

  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Error fetching news: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  // if DRF paginates, it'll return { count, next, previous, results: [...] }
  // otherwise it returns [...] directly
  return Array.isArray(json) ? json : json.results;
};
