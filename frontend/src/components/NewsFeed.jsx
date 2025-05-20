"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import NewsCard from "./NewsCard"

const FETCH_NEWS_ENDPOINT = "http://127.0.0.1:8000/nubuzz/fetch-news/"

export default function NewsFeed({ searchTerm = "", activeLocation, activeCategory }) {
  const { darkMode } = useTheme()
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true)
      setError(null)

      try {
        const url = new URL(FETCH_NEWS_ENDPOINT)
        if (activeLocation) {
          url.searchParams.append("location", activeLocation)
        }
        if (activeCategory && activeCategory !== "All") {
          url.searchParams.append("category", activeCategory)
        }

        console.log("Fetching from:", url.toString()) // For debugging

        const res = await fetch(url.toString(), { mode: "cors" })
        const text = await res.text()

        let data
        try {
          data = JSON.parse(text)
        } catch {
          console.error("Non-JSON response:", text)
          throw new Error("Invalid JSON response from server")
        }

        if (!res.ok) {
          throw new Error(data.message || res.statusText)
        }
        setNews(data)
      } catch (err) {
        setError(err.message)
        setNews([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [activeLocation, activeCategory])

  const filteredNews = searchTerm.trim()
    ? news.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : news

  if (isLoading) {
    return (
      <section className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>
          <div className="text-center py-10">
            <p className={`text-lg ${darkMode ? "text-red-400" : "text-red-600"} mb-4`}>{error}</p>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Unable to load news. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (!filteredNews.length) {
    return (
      <section className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>
          <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <p className="text-lg mb-2">No articles found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="news-feed" className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <NewsCard key={item.url || item.id || Math.random().toString(36).substr(2, 9)} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
