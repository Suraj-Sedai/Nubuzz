// src/components/NewsFeed.jsx
"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import NewsCard      from "./NewsCard"

const FETCH_NEWS_ENDPOINT = "http://127.0.0.1:8000/nubuzz/fetch-news/"

export default function NewsFeed({ searchTerm = "", activeLocation }) {
  const { darkMode } = useTheme()
  const [news,      setNews     ] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError    ] = useState(null)

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true)
      setError(null)

      try {
        const url = new URL(FETCH_NEWS_ENDPOINT)
        if (activeLocation) {
          url.searchParams.append("location", activeLocation)
        }

        const res  = await fetch(url.toString(), { mode: "cors" })
        const text = await res.text()

        // try parse JSON, or fail with clear error
        let data
        try {
          data = JSON.parse(text)
        } catch (e) {
          console.error("Non-JSON response from fetch-news:", text)
          throw new Error("Invalid JSON response from server")
        }

        if (!res.ok) {
          // Django returns { status: "error", message: "..." }
          throw new Error(data.message || data.error || res.statusText)
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
  }, [activeLocation])

  // apply search filter
  const filteredNews = searchTerm.trim()
    ? news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : news

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    )
  }

  if (!filteredNews.length) {
    return (
      <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        No articles found.
      </div>
    )
  }

  return (
    <section id="news-feed" className={`py-12 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Today's Top Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(item => (
            <NewsCard key={item.url} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
