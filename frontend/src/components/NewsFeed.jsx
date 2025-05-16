"use client"
import { useState, useEffect } from "react"
import { useTheme }         from "../context/ThemeContext"
import NewsCard             from "./NewsCard"
import { fetchNewsData }    from "../api.js"

const NewsFeed = ({ searchTerm, activeCategory }) => {
  const { darkMode } = useTheme()
  const [articles,    setArticles]    = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  // 1️⃣ Fetch all on mount
  useEffect(() => {
    setLoading(true)
    fetchNewsData()  // no filters here
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // 2️⃣ Client-side filter by search and category
  useEffect(() => {
    let filtered = articles

    // search
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        (item.summary || "").toLowerCase().includes(term)
      )
    }

    // category
    if (activeCategory && activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory)
    }

    setFilteredNews(filtered)
  }, [articles, searchTerm, activeCategory])

  // 3️⃣ Render states
  if (loading) return <div className="text-center py-10">Loading…</div>
  if (error)   return <div className="text-center py-10 text-red-500">Error: {error}</div>
  if (!filteredNews.length) {
    return (
      <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        No news found matching your criteria. Try adjusting your search or filters.
      </div>
    )
  }

  // 4️⃣ Render grid
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
