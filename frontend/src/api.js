// src/api.js

const API_BASE            = "http://127.0.0.1:8000/nubuzz"
const FETCH_NEWS_ENDPOINT = `${API_BASE}/fetch-news/`

export const fetchNewsData = async ({ category, location } = {}) => {
  const url = new URL(FETCH_NEWS_ENDPOINT)
  if (category) url.searchParams.append("category", category)
  if (location) url.searchParams.append("location", location)

  const response = await fetch(url, { mode: "cors" })
  if (!response.ok) {
    throw new Error(`Error fetching news: ${response.status}`)
  }

  const json = await response.json()
  if (!Array.isArray(json)) {
    throw new Error("Unexpected response format, expected an array of articles")
  }

  return json
}
