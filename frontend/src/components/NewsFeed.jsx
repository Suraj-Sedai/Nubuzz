"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import NewsCard from "./NewsCard"
import { fetchNewsData } from "../api.js"   // ↖️ your DRF helper

const NewsFeed = ({ searchTerm, activeCategory, location }) => {
  const { darkMode } = useTheme()

  // full list from the API
  const [articles, setArticles] = useState([])
  // list after applying search + category filters
  const [filteredNews, setFilteredNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // 1️⃣ Fetch on mount (or when activeCategory / location changes)
  useEffect(() => {
    setLoading(true)
    fetchNewsData({ category: activeCategory, location })
      .then(data => {
        setArticles(data)    // data is an array of article objects
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [activeCategory, location])

  // 2️⃣ Re-filter whenever articles, searchTerm, or activeCategory changes
  useEffect(() => {
    let filtered = articles

    // Filter by search term
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        (item.summarize_article || "").toLowerCase().includes(term)
      )
    }

    // Filter by category (if you also want client-side category filtering)
    if (activeCategory && activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory)
    }

    setFilteredNews(filtered)
  }, [articles, searchTerm, activeCategory])

  // 3️⃣ Render loading / error / empty states
  if (loading) return <div className="text-center py-10">Loading…</div>
  if (error)   return <div className="text-center py-10 text-red-500">Error: {error}</div>
  if (!filteredNews.length) {
    return (
      <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        No news found matching your criteria. Try adjusting your search or filters.
      </div>
    )
  }

  // 4️⃣ Render the grid of NewsCards
  return (
    <section id="news-feed" className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsFeed
