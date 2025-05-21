"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"
import NewsCard from "./NewsCard"
import { Newspaper, AlertCircle, Search, Sparkles, TrendingUp, Clock } from "lucide-react"

const FETCH_NEWS_ENDPOINT = "http://127.0.0.1:8000/nubuzz/fetch-news/"

export default function NewsFeed({ searchTerm = "", activeLocation, activeCategory }) {
  const { darkMode } = useTheme()
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(6)
  const [sortBy, setSortBy] = useState("latest")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

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

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const filteredNews = searchTerm.trim()
    ? news.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : news

  // Sort news based on selected option
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
    } else if (sortBy === "trending") {
      // This is a placeholder - in a real app you'd have a trending score
      return (b.likeCount || 0) - (a.likeCount || 0)
    }
    return 0
  })

  const displayedNews = sortedNews.slice(0, visibleCount)
  const hasMore = displayedNews.length < sortedNews.length

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  // Get categories from news items
  const categories = Array.from(new Set(filteredNews.map((item) => item.category || "General").filter(Boolean)))

  // Get featured article (first article or null)
  const featuredArticle = sortedNews.length > 0 ? sortedNews[0] : null

  return (
    <section
      id="news-feed"
      ref={sectionRef}
      className={`py-16 md:py-24 relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-pink-500/5 to-transparent rounded-full blur-3xl"></div>

        {/* Subtle grid pattern */}
        <div
          className={`absolute inset-0 opacity-[0.03] ${darkMode ? "bg-grid-pattern-dark" : "bg-grid-pattern-light"}`}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with animations */}
        <div
          className={`mb-12 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-3">
                <Newspaper size={14} className="mr-2" />
                <span>Latest Updates</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className={darkMode ? "text-white" : "text-gray-900"}>Today's </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Top Stories
                </span>
              </h2>
            </div>

            {/* Sort options */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sort by:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSortBy("latest")}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    sortBy === "latest"
                      ? "bg-purple-500 text-white"
                      : darkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Clock size={14} className="mr-1.5" />
                  Latest
                </button>
                <button
                  onClick={() => setSortBy("trending")}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    sortBy === "trending"
                      ? "bg-purple-500 text-white"
                      : darkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <TrendingUp size={14} className="mr-1.5" />
                  Trending
                </button>
              </div>
            </div>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activeCategory === category
                      ? "bg-purple-500 text-white"
                      : darkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-white text-gray-700"
                  } border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className={`rounded-2xl p-12 flex flex-col items-center justify-center ${
              darkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-pink-500 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin-reverse"></div>
            </div>
            <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Loading the latest stories...
            </p>
            <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Gathering news from around the world
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div
            className={`rounded-2xl p-12 flex flex-col items-center justify-center ${
              darkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <div
              className={`w-16 h-16 rounded-full ${
                darkMode ? "bg-red-900/30" : "bg-red-100"
              } flex items-center justify-center mb-6`}
            >
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <p className={`text-lg font-medium text-red-500 mb-2`}>{error}</p>
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              We're having trouble loading the news. Please try again later or check your connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredNews.length === 0 && (
          <div
            className={`rounded-2xl p-12 flex flex-col items-center justify-center ${
              darkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <div
              className={`w-16 h-16 rounded-full ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } flex items-center justify-center mb-6`}
            >
              <Search size={32} className={darkMode ? "text-gray-500" : "text-gray-400"} />
            </div>
            <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
              No articles found
            </p>
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Featured article (first item, larger display) */}
        {!isLoading && !error && featuredArticle && displayedNews.length > 0 && (
          <div
            className={`mb-10 transition-all duration-1000 delay-100 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-lg"></div>
              <div
                className={`rounded-2xl overflow-hidden border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } pl-4`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Featured tag */}
                  <div className="md:hidden py-3 px-4 flex items-center">
                    <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                      <Sparkles size={12} className="mr-1" />
                      Featured Story
                    </div>
                  </div>

                  {/* Featured content */}
                  <div className="flex-grow p-4">
                    <NewsCard item={featuredArticle} />
                  </div>

                  {/* Featured sidebar */}
                  <div className="hidden md:flex flex-col justify-center items-center w-24 bg-gradient-to-b from-purple-500 to-pink-500 text-white">
                    <div className="transform -rotate-90 whitespace-nowrap flex items-center">
                      <Sparkles size={16} className="mr-2 transform rotate-90" />
                      <span className="text-sm font-bold tracking-wider">FEATURED STORY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News grid */}
        {!isLoading && !error && displayedNews.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-200 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {/* Skip the first item if we're showing it as featured */}
              {displayedNews.slice(featuredArticle ? 1 : 0).map((item, index) => (
                <div
                  key={item.url || item.id || Math.random().toString(36).substr(2, 9)}
                  className={`transition-all duration-500 delay-${Math.min(index * 100, 500)}`}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  className={`
                    px-8 py-3 rounded-xl font-medium text-center
                    transition-all duration-300 transform hover:-translate-y-1
                    bg-gradient-to-r from-purple-600 to-pink-600 text-white
                    shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30
                  `}
                >
                  Load More Stories
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        .bg-grid-pattern-light {
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        
        .bg-grid-pattern-dark {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  )
}
