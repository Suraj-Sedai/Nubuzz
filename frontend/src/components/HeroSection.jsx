"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"
import { TrendingUp, Zap, Globe, Sparkles, ArrowRight, Brain, Newspaper, Clock } from "lucide-react"
import { fetchNewsData } from "../api"

const HeroSection = () => {
  const { darkMode } = useTheme()
  const [animatedCount, setAnimatedCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeNewsIndex, setActiveNewsIndex] = useState(0)
  const [newsArticles, setNewsArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const heroRef = useRef(null)

  // Fetch real news data
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchNewsData({ limit: 4 }) // Fetch just 4 articles for the carousel
        setNewsArticles(data.slice(0, 4)) // Ensure we only use up to 4 articles
      } catch (err) {
        console.error("Failed to fetch news for hero section:", err)
        setError(err.message)
        // Fallback data if API fails
        setNewsArticles([
          { title: "AI Revolution", category: "Tech", publishedAt: new Date(Date.now() - 7200000).toISOString() },
          {
            title: "Global Markets Surge",
            category: "Finance",
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
          },
          {
            title: "Climate Summit Results",
            category: "Environment",
            publishedAt: new Date(Date.now() - 21600000).toISOString(),
          },
          { title: "Space Discovery", category: "Science", publishedAt: new Date(Date.now() - 43200000).toISOString() },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [])

  // Animated counter effect
  useEffect(() => {
    const target = 5000
    const duration = 2000 // ms
    const stepTime = 30 // ms
    const steps = duration / stepTime
    const increment = target / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setAnimatedCount(Math.floor(current))
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  // Rotate news items
  useEffect(() => {
    if (newsArticles.length === 0) return

    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % newsArticles.length)
    }, 5000) // Longer duration for better readability
    return () => clearInterval(interval)
  }, [newsArticles.length])

  // Animation on scroll
  useEffect(() => {
    setIsVisible(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Recent"

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  // Get category from article
  const getCategory = (article) => {
    if (!article) return "General"
    return article.category || (article.source && article.source.name) || "News"
  }

  // Truncate text
  const truncateText = (text, maxLength = 80) => {
    if (!text) return "No preview available."
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  // Get summary text
  const getSummary = (article) => {
    if (!article) return "No preview available."
    return article.summary || article.description || article.content || "No preview available."
  }

  return (
    <section
      ref={heroRef}
      className={`
        pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden relative
        ${darkMode ? "bg-gray-900" : "bg-white"}
      `}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 animate-float-slow-reverse"></div>

        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-500 rounded-full animate-pulse-float-delay"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-pink-300 rounded-full animate-pulse-float-slow-delay"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Creative headline with animated typing effect */}
        <div
          className={`max-w-5xl mx-auto text-center mb-16 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-300 font-medium text-sm">
            <span className="flex items-center">
              <Brain size={16} className="mr-2" />
              AI-Powered News Revolution
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="relative inline-block">
              <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg"></span>
              <span className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                News That Thinks
              </span>
            </span>
            <br />
            <span className={`relative ${darkMode ? "text-white" : "text-gray-900"}`}>
              <span className="typing-cursor">|</span> Like You Do
            </span>
          </h1>

          <p
            className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Experience the future of news with AI-powered summaries tailored to your interests.
            <span className="hidden md:inline">
              {" "}
              Save time, stay informed, and never miss what matters most to you.
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Interactive news feed preview with real data */}
          <div
            className={`w-full lg:w-1/2 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="relative">
              {/* Floating news cards */}
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/20">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  LIVE
                </div>

                {/* News feed header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Newspaper size={20} className="text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900 dark:text-white">Nubuzz Feed</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Personalized for you</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {newsArticles.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === activeNewsIndex ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Loading state */}
                {isLoading ? (
                  <div className="h-[280px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="h-[280px] flex items-center justify-center text-red-500">
                    <p>Could not load news data</p>
                  </div>
                ) : (
                  /* Animated news items with real data */
                  <div className="relative h-[280px] overflow-hidden">
                    {newsArticles.map((article, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-500 transform ${
                          index === activeNewsIndex
                            ? "translate-x-0 opacity-100"
                            : index < activeNewsIndex
                              ? "-translate-x-full opacity-0"
                              : "translate-x-full opacity-0"
                        }`}
                      >
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                          {article.urlToImage ? (
                            <img
                              src={article.urlToImage || "/placeholder.svg"}
                              alt={article.title}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.target.src = `/placeholder.svg?height=150&width=400&text=${encodeURIComponent(
                                  article.title || "News",
                                )}`
                              }}
                            />
                          ) : (
                            <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <Newspaper size={40} className="text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full">
                                {getCategory(article)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {formatDate(article.publishedAt)}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                              {truncateText(getSummary(article), 100)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive controls */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <TrendingUp size={18} className="text-purple-500" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <Sparkles size={18} className="text-pink-500" />
                    </button>
                  </div>
                  <a
                    href="#news-feed"
                    className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400"
                  >
                    View all <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-purple-100 dark:border-purple-900/30 transform rotate-6 z-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-2">
                    <Zap size={16} />
                  </div>
                  <span className="text-sm font-medium">Instant Updates</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-purple-100 dark:border-purple-900/30 transform -rotate-6 z-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
                    <Globe size={16} />
                  </div>
                  <span className="text-sm font-medium">Global Coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Stats and CTA */}
          <div
            className={`w-full lg:w-1/2 transform transition-all duration-1000 delay-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-100 dark:border-purple-900/30 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                    <Brain size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">AI-Powered</span>
                </div>
                <span className="block text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-1">
                  100%
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Smart Summaries</span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-100 dark:border-purple-900/30 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-3">
                    <Clock size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Saved</span>
                </div>
                <span className="block text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-1">
                  80%
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Read Less, Learn More</span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-100 dark:border-purple-900/30 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                    <Newspaper size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sources</span>
                </div>
                <span className="block text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-1">
                  100+
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Trusted Publishers</span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-100 dark:border-purple-900/30 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-3">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Users</span>
                </div>
                <span className="block text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-1">
                  {animatedCount.toLocaleString()}+
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Growing Community</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#news-feed"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-center shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">Explore News</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="absolute -inset-full top-0 block w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </a>
              <a
                href="#features"
                className={`px-8 py-4 rounded-xl font-medium text-center transition-all duration-200 relative overflow-hidden group ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  How It Works
                  <ArrowRight
                    size={16}
                    className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                  />
                </span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <Sparkles size={16} className="mr-2 text-purple-500" />
                <span className="text-sm">AI-Powered</span>
              </div>
              <div className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <Zap size={16} className="mr-2 text-pink-500" />
                <span className="text-sm">Real-time Updates</span>
              </div>
              <div className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <Globe size={16} className="mr-2 text-purple-500" />
                <span className="text-sm">Global Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`absolute bottom-0 w-full h-full ${darkMode ? "fill-gray-800" : "fill-gray-50"}`}
        >
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        
        @keyframes pulse-float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(10px, -10px) scale(1.2); opacity: 1; }
        }
        
        @keyframes pulse-float-delay {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(-10px, 10px) scale(1.2); opacity: 1; }
        }
        
        @keyframes pulse-float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(15px, -15px) scale(1.3); opacity: 0.8; }
        }
        
        @keyframes pulse-float-slow-delay {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-15px, 15px) scale(1.3); opacity: 0.8; }
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-float-slow-reverse {
          animation: float-slow-reverse 15s ease-in-out infinite;
        }
        
        .animate-pulse-float {
          animation: pulse-float 8s ease-in-out infinite;
        }
        
        .animate-pulse-float-delay {
          animation: pulse-float-delay 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-pulse-float-slow {
          animation: pulse-float-slow 12s ease-in-out infinite;
        }
        
        .animate-pulse-float-slow-delay {
          animation: pulse-float-slow-delay 12s ease-in-out infinite;
          animation-delay: 3s;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px),
                            linear-gradient(to bottom, ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .typing-cursor {
          display: inline-block;
          width: 2px;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
