// api.js
const API_BASE      = 'http://127.0.0.1:8000/nubuzz';
const NEWS_ENDPOINT = `${API_BASE}/api/news/`;

export const fetchNewsData = async ({ category, location } = {}) => {
  // Build the URL with optional filters
  const url = new URL(NEWS_ENDPOINT);
  if (category) url.searchParams.append('category', category);
  if (location) url.searchParams.append('location', location);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching news: ${response.statusText}`);
  }
  // DRF returns an array of articles, each with a "summarize_article" field
  return await response.json();
};
