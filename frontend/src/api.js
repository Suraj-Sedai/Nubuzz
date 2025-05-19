const API_BASE = "http://127.0.0.1:8000/nubuzz"
const NEWS_ENDPOINT = `${API_BASE}/api/news/`

export const fetchNewsData = async ({ category, location } = {}) => {
  const url = new URL(NEWS_ENDPOINT)
  if (category) url.searchParams.append("category", category)
  if (location) url.searchParams.append("location", location)

  console.log("Fetching from:", url.toString()) // 🔍 for debugging

  const response = await fetch(url, { mode: "cors" })
  if (!response.ok) {
    throw new Error(`Error fetching news: ${response.status} ${response.statusText}`)
  }
  const json = await response.json()
  return Array.isArray(json) ? json : json.results
}
1