"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import NewsCard from "./NewsCard"
import { newsData } from "../data/newsData"

const NewsFeed = ({ searchTerm, activeCategory }) => {
  const { darkMode } = useTheme()
  const [filteredNews, setFilteredNews] = useState(newsData)

  useEffect(() => {
    let filtered = newsData

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) => item.headline.toLowerCase().includes(term) || item.summary.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (activeCategory && activeCategory !== "All") {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    setFilteredNews(filtered)
  }, [searchTerm, activeCategory])

  return (
    <section id="news-feed" className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>

        {filteredNews.length === 0 ? (
          <div className="text-center py-10">
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No news found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsFeed
