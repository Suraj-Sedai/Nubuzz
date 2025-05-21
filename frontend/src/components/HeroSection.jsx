"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"
import { ArrowRight, ChevronRight, Clock, Sparkles, Zap, Globe, Search } from "lucide-react"
import { fetchNewsData } from "../api"

const HeroSection = () => {
  const { darkMode } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [newsArticles, setNewsArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const heroRef = useRef(null)
  const carouselRef = useRef(null)

  // Fetch real news data
  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchNewsData({ limit: 5 })
        setNewsArticles(data.slice(0, 5))
      } catch (err) {
        console.error("Failed to fetch news for hero section:", err)
        setError(err.message)
        // Fallback data
        setNewsArticles([
          { title: "AI Revolution in Healthcare", category: "Tech" },
          { title: "Global Markets Reach Record Highs", category: "Finance" },
          { title: "Climate Summit Produces Historic Agreement", category: "Environment" },
          { title: "New Space Discovery Challenges Physics", category: "Science" },
          { title: "Breakthrough in Renewable Energy Storage", category: "Technology" },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [])

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

  // Auto-rotate featured articles
  useEffect(() => {
    if (newsArticles.length === 0) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsArticles.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [newsArticles.length])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Just now"

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
    if (!article) return "News"
    return article.category || (article.source && article.source.name) || "News"
  }

  // Get summary text
  const getSummary = (article) => {
    if (!article) return ""
    return article.summary || article.description || article.content || ""
  }

  // Handle carousel navigation
  const handleCarouselNav = (index) => {
    setActiveIndex(index)
    if (carouselRef.current) {
      const scrollPosition = index * (carouselRef.current.offsetWidth / newsArticles.length)
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section
      ref={heroRef}
      className={`relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"} transition-colors duration-500`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient circles */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-purple-500/10 to-pink-500/5 blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/10 blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-float-reverse"></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-purple-300 rounded-full animate-float-slow-delay"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left column - Text content */}
            <div
              className={`w-full lg:w-1/2 space-y-8 transition-all duration-1000 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {/* Eyebrow text */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                <Sparkles size={16} className="mr-2" />
                <span>AI-Powered News Experience</span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className={`block ${darkMode ? "text-white" : "text-gray-900"}`}>Discover news</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  tailored for you
                </span>
              </h1>

              {/* Subheadline */}
              <p className={`text-xl md:text-2xl leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Experience the future of news with AI-powered summaries that save you time while keeping you informed on
                what matters most.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#news-feed"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Explore News
                    <ArrowRight
                      size={18}
                      className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>
                <a
                  href="#features"
                  className={`px-8 py-4 rounded-xl font-medium text-center border transition-all duration-300 ${
                    darkMode
                      ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Learn More
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 pt-6">
                <div className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
                    <Zap size={14} />
                  </div>
                  <span className="text-sm font-medium">Real-time Updates</span>
                </div>
                <div className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-2">
                    <Globe size={14} />
                  </div>
                  <span className="text-sm font-medium">Global Coverage</span>
                </div>
                <div className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
                    <Search size={14} />
                  </div>
                  <span className="text-sm font-medium">Personalized Feed</span>
                </div>
              </div>
            </div>

            {/* Right column - Featured news */}
            <div
              className={`w-full lg:w-1/2 transition-all duration-1000 delay-300 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {/* Featured article card */}
              <div
                className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                  darkMode ? "bg-gray-800/80" : "bg-white/90"
                } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-100"}`}
              >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>

                {/* Card content */}
                <div className="relative z-10">
                  {/* Loading state */}
                  {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : error ? (
                    <div className="h-[400px] flex items-center justify-center text-red-500 p-8 text-center">
                      <p>Could not load news data. Please try again later.</p>
                    </div>
                  ) : (
                    <>
                      {/* Featured article */}
                      <div className="relative">
                        {newsArticles.map((article, index) => (
                          <div
                            key={index}
                            className={`transition-all duration-700 ${
                              index === activeIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                            }`}
                          >
                            {/* Image */}
                            <div className="relative h-48 md:h-64 overflow-hidden">
                              {article.urlToImage ? (
                                <img
                                  src={article.urlToImage || "/placeholder.svg"}
                                  alt={article.title}
                                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                  onError={(e) => {
                                    e.target.src = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(
                                      article.title || "News",
                                    )}`
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {getCategory(article)}
                                  </span>
                                </div>
                              )}

                              {/* Category badge */}
                              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/90 text-white backdrop-blur-sm">
                                {getCategory(article)}
                              </div>

                              {/* Time badge */}
                              {article.publishedAt && (
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm flex items-center">
                                  <Clock size={10} className="mr-1" />
                                  {formatDate(article.publishedAt)}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                              <h2 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2">{article.title}</h2>
                              <p className={`mb-6 line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {getSummary(article) || "No summary available for this article."}
                              </p>
                              <a
                                href={article.url || "#news-feed"}
                                target={article.url ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline"
                              >
                                Read full article
                                <ChevronRight size={16} className="ml-1" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Navigation dots */}
                      <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
                        {newsArticles.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleCarouselNav(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              index === activeIndex
                                ? "bg-purple-600 w-8"
                                : darkMode
                                  ? "bg-gray-600 hover:bg-gray-500"
                                  : "bg-gray-300 hover:bg-gray-400"
                            }`}
                            aria-label={`View article ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* News headlines ticker */}
              <div
                ref={carouselRef}
                className={`mt-6 rounded-xl overflow-hidden ${
                  darkMode ? "bg-gray-800/80" : "bg-gray-50/80"
                } backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-100"}`}
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium">Latest Headlines</h3>
                </div>

                {isLoading ? (
                  <div className="p-4 flex justify-center">
                    <div className="animate-pulse w-full">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[180px] overflow-auto">
                    {newsArticles.map((article, index) => (
                      <div
                        key={index}
                        className={`p-4 transition-colors duration-300 cursor-pointer ${
                          index === activeIndex
                            ? darkMode
                              ? "bg-purple-900/20"
                              : "bg-purple-50"
                            : darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100/50"
                        }`}
                        onClick={() => handleCarouselNav(index)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium line-clamp-1">{article.title}</h4>
                          <ChevronRight
                            size={16}
                            className={`transform transition-transform duration-300 ${
                              index === activeIndex ? "translate-x-0" : "-translate-x-2 opacity-0"
                            } ${darkMode ? "text-purple-400" : "text-purple-600"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`absolute bottom-0 w-full h-full ${darkMode ? "fill-gray-800" : "fill-gray-50"}`}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 15px); }
        }
        
        @keyframes float-slow-delay {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -10px); }
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }
        
        .animate-float-slow-delay {
          animation: float-slow-delay 15s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px),
                            linear-gradient(to bottom, ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  )
}

export default HeroSection
