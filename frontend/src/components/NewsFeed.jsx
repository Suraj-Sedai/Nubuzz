"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import NewsCard from "./NewsCard"
import { fetchNewsData } from "../api"
import { newsData } from "../data/newsData" // Keep as fallback

const NewsFeed = ({ searchTerm, activeCategory, activeLocation }) => {
  const { darkMode } = useTheme()
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch news from API
  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Only pass category if it's not "All"
        const category = activeCategory !== "All" ? activeCategory : null
        const data = await fetchNewsData({
          category,
          location: activeLocation,
        })
        setNews(data)
      } catch (err) {
        console.error("Failed to fetch news:", err)
        setError(err.message)
        // Fallback to mock data if API fails
        setNews(newsData)
      } finally {
        setIsLoading(false)
      }
    }

    getNews()
  }, [activeCategory, activeLocation])

  // Filter news by search term
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      const filtered = news.filter(
        (item) =>
          item.headline?.toLowerCase().includes(term) ||
          item.summary?.toLowerCase().includes(term) ||
          item.title?.toLowerCase().includes(term) || // Support different API field names
          item.description?.toLowerCase().includes(term),
      )
      setFilteredNews(filtered)
    } else {
      setFilteredNews(news)
    }
  }, [searchTerm, news])

  // Normalize API data to match our component structure
  const normalizeNewsItem = (item) => {
    return {
      id: item.id || item.news_id || Math.random().toString(36).substr(2, 9),
      headline: item.headline || item.title || "",
      category: item.category || "General",
      summary: item.summary || item.description || item.content || "",
      sentiment: item.sentiment || "neutral",
      image: item.image || item.urlToImage || item.image_url || "/placeholder.svg?height=200&width=400",
    }
  }

  return (
    <section id="news-feed" className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className={`text-lg ${darkMode ? "text-red-400" : "text-red-600"} mb-4`}>{error}</p>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Showing fallback data instead.</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No news found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <NewsCard key={item.id || Math.random()} item={normalizeNewsItem(item)} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsFeed
