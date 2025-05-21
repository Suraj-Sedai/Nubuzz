"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Share2, Bookmark, ExternalLink, Clock, MessageCircle, ChevronRight, Heart } from "lucide-react"

const NewsCard = ({ item }) => {
  const { darkMode } = useTheme()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  // Get the appropriate fields based on API response structure
  const title = item.title || item.headline || ""
  const category = item.category || (item.source && item.source.name) || "General"
  const summary = item.summary || item.description || item.content || ""
  const imageUrl = item.urlToImage || item.image || item.image_url || null
  const articleUrl = item.url || ""
  const publishedAt = item.publishedAt ? new Date(item.publishedAt) : null
  const sourceName = item.source && item.source.name ? item.source.name : null

  // Check if image is valid
  const [imageError, setImageError] = useState(false)
  const hasValidImage = imageUrl && !imageError

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

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleLike = () => {
    setLikeCount(likeCount + 1)
  }

  // Handle external link
  const handleReadMore = () => {
    if (articleUrl) {
      window.open(articleUrl, "_blank", "noopener,noreferrer")
    }
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return null

    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  }

  // Truncate text to a specific length
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Get source initial for avatar
  const getSourceInitial = () => {
    if (!sourceName) return "N"
    const words = sourceName.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return sourceName.charAt(0).toUpperCase()
  }

  // Generate a consistent color based on source name
  const getSourceColor = () => {
    if (!sourceName) return "purple"

    const colors = ["purple", "pink", "blue", "indigo", "teal", "green", "amber", "orange"]

    let hash = 0
    for (let i = 0; i < sourceName.length; i++) {
      hash = sourceName.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  const sourceColor = getSourceColor()
  const colorClasses = {
    purple: {
      bg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      text: darkMode ? "text-purple-400" : "text-purple-600",
      gradient: "from-purple-500 to-indigo-500",
    },
    pink: {
      bg: darkMode ? "bg-pink-900/30" : "bg-pink-100",
      text: darkMode ? "text-pink-400" : "text-pink-600",
      gradient: "from-pink-500 to-rose-500",
    },
    blue: {
      bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      text: darkMode ? "text-blue-400" : "text-blue-600",
      gradient: "from-blue-500 to-cyan-500",
    },
    indigo: {
      bg: darkMode ? "bg-indigo-900/30" : "bg-indigo-100",
      text: darkMode ? "text-indigo-400" : "text-indigo-600",
      gradient: "from-indigo-500 to-purple-500",
    },
    teal: {
      bg: darkMode ? "bg-teal-900/30" : "bg-teal-100",
      text: darkMode ? "text-teal-400" : "text-teal-600",
      gradient: "from-teal-500 to-green-500",
    },
    green: {
      bg: darkMode ? "bg-green-900/30" : "bg-green-100",
      text: darkMode ? "text-green-400" : "text-green-600",
      gradient: "from-green-500 to-emerald-500",
    },
    amber: {
      bg: darkMode ? "bg-amber-900/30" : "bg-amber-100",
      text: darkMode ? "text-amber-400" : "text-amber-600",
      gradient: "from-amber-500 to-orange-500",
    },
    orange: {
      bg: darkMode ? "bg-orange-900/30" : "bg-orange-100",
      text: darkMode ? "text-orange-400" : "text-orange-600",
      gradient: "from-orange-500 to-red-500",
    },
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        rounded-xl overflow-hidden shadow-lg transition-all duration-500 
        ${darkMode ? "bg-gray-800/90 hover:bg-gray-800" : "bg-white hover:bg-white"} 
        backdrop-blur-sm border ${darkMode ? "border-gray-700" : "border-gray-100"}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        hover:shadow-xl hover:shadow-${sourceColor}-500/10 transform hover:-translate-y-1
      `}
    >
      {/* Card layout with potential image */}
      <div className="flex flex-col h-full">
        {/* Header with source and time */}
        <div className="px-5 pt-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Source avatar with gradient */}
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              bg-gradient-to-br ${colorClasses[sourceColor].gradient}
              shadow-md
            `}
            >
              {getSourceInitial()}
            </div>
            <div className="ml-3">
              <p className={`font-medium text-sm ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                {sourceName || "Nubuzz News"}
              </p>
              {publishedAt && (
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center`}>
                  <Clock size={12} className="mr-1" />
                  {formatDate(publishedAt)}
                </p>
              )}
            </div>
          </div>
          <div>
            <span
              className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${colorClasses[sourceColor].bg} ${colorClasses[sourceColor].text}
            `}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Image and content layout */}
        <div className="flex-grow flex flex-col">
          {/* Title with hover effect */}
          <h3
            className={`
            px-5 pt-4 text-xl font-bold leading-tight
            transition-all duration-300
            ${isHovered ? colorClasses[sourceColor].text : ""}
          `}
          >
            {title}
          </h3>

          {/* Image (only if available and valid) */}
          {hasValidImage && (
            <div className="mt-4 px-5 overflow-hidden">
              <div className="rounded-lg overflow-hidden relative">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={title}
                  className={`
                    w-full object-cover transition-transform duration-700
                    ${isHovered ? "scale-105" : "scale-100"}
                  `}
                  style={{ maxHeight: "300px" }}
                  onError={() => setImageError(true)}
                />
                {/* Overlay gradient on hover */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-t from-black/50 to-transparent
                  transition-opacity duration-300
                  ${isHovered ? "opacity-100" : "opacity-0"}
                `}
                ></div>
              </div>
            </div>
          )}

          {/* Summary with animation */}
          <div className="px-5 pt-4 flex-grow">
            <p
              className={`
              text-base leading-relaxed
              ${darkMode ? "text-gray-300" : "text-gray-600"}
            `}
              style={{ lineHeight: "1.6" }}
            >
              {truncateText(summary, 200)}
              {summary.length > 200 && (
                <button
                  className={`
                    font-medium ml-1 inline-flex items-center
                    ${colorClasses[sourceColor].text}
                    transition-all duration-300
                    hover:underline
                  `}
                  onClick={handleReadMore}
                >
                  Read more
                  <ChevronRight
                    size={14}
                    className={`
                    ml-1 transition-transform duration-300
                    ${isHovered ? "translate-x-1" : ""}
                  `}
                  />
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons with animations */}
        <div className="px-5 py-4 mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {/* Like button */}
            <button
              className={`
                p-2 rounded-full transition-all duration-300
                ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
                flex items-center
              `}
              onClick={handleLike}
              aria-label="Like"
            >
              <Heart
                size={18}
                className={`
                  transition-all duration-300
                  ${likeCount > 0 ? colorClasses[sourceColor].text : darkMode ? "text-gray-400" : "text-gray-600"}
                `}
                fill={likeCount > 0 ? "currentColor" : "none"}
              />
              {likeCount > 0 && (
                <span
                  className={`
                  ml-1 text-sm font-medium
                  ${colorClasses[sourceColor].text}
                `}
                >
                  {likeCount}
                </span>
              )}
            </button>

            {/* Comment button */}
            <button
              className={`
                p-2 rounded-full transition-all duration-300
                ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
              `}
              aria-label="Comment"
            >
              <MessageCircle size={18} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>

            {/* Share button */}
            <button
              className={`
                p-2 rounded-full transition-all duration-300
                ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
              `}
              aria-label="Share"
            >
              <Share2 size={18} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bookmark button */}
            <button
              className={`
                p-2 rounded-full transition-all duration-300
                ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
              `}
              onClick={toggleBookmark}
              aria-label="Bookmark"
            >
              <Bookmark
                size={18}
                className={`
                  transition-all duration-300
                  ${isBookmarked ? colorClasses[sourceColor].text : darkMode ? "text-gray-400" : "text-gray-600"}
                `}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>

            {/* Read full article button */}
            <button
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300 transform
                bg-gradient-to-r ${colorClasses[sourceColor].gradient}
                text-white shadow-sm hover:shadow-md
                hover:shadow-${sourceColor}-500/20
                ${isHovered ? "scale-105" : "scale-100"}
              `}
              onClick={handleReadMore}
            >
              <span className="flex items-center">
                Read Article
                <ExternalLink size={14} className="ml-1.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
