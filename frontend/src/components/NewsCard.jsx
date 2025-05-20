"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { ThumbsUp, Share2, Bookmark, ExternalLink, Clock } from "lucide-react"

const NewsCard = ({ item }) => {
  const { darkMode } = useTheme()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

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

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${darkMode ? "bg-gray-800" : "bg-white"} flex flex-col`}
    >
      {/* Header with source and time */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Source avatar/icon */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${darkMode ? "bg-gray-700" : "bg-purple-500"}`}
          >
            {sourceName ? sourceName.charAt(0).toUpperCase() : "N"}
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
            className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-purple-900 bg-opacity-30 text-purple-400" : "bg-purple-100 text-purple-800"}`}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="px-5 pt-4 text-xl font-bold leading-tight">{title}</h3>

      {/* Image (only if available and valid) */}
      {hasValidImage && (
        <div className="mt-4 px-5">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: "300px" }}
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Summary */}
      <div className="px-5 pt-4 flex-grow">
        <p
          className={`text-base ${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}
          style={{ lineHeight: "1.6" }}
        >
          {truncateText(summary, 200)}
          {summary.length > 200 && (
            <button className="text-purple-500 font-medium ml-1 inline-flex items-center" onClick={handleReadMore}>
              Read more
              {articleUrl && <ExternalLink size={14} className="ml-1" />}
            </button>
          )}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 mt-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
        <button
          className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} flex items-center`}
          onClick={handleLike}
          aria-label="Like"
        >
          <ThumbsUp
            size={20}
            className={`${darkMode ? "text-gray-400" : "text-gray-600"} ${likeCount > 0 ? "text-purple-500 fill-purple-500" : ""}`}
            fill={likeCount > 0 ? "currentColor" : "none"}
          />
          {likeCount > 0 && <span className="ml-1 text-sm font-medium">{likeCount}</span>}
        </button>
        <button
          className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          aria-label="Share"
        >
          <Share2 size={20} className={darkMode ? "text-gray-400" : "text-gray-600"} />
        </button>
        <button
          className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          onClick={toggleBookmark}
          aria-label="Bookmark"
        >
          <Bookmark
            size={20}
            className={`${isBookmarked ? "text-purple-500 fill-purple-500" : darkMode ? "text-gray-400" : "text-gray-600"}`}
            fill={isBookmarked ? "currentColor" : "none"}
          />
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            darkMode ? "bg-purple-700 hover:bg-purple-600 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
          onClick={handleReadMore}
        >
          Read Full Article
        </button>
      </div>
    </div>
  )
}

export default NewsCard
