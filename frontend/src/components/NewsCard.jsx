"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { ThumbsUp, MessageCircle, Share2, Bookmark, ExternalLink } from "lucide-react"

const NewsCard = ({ item }) => {
  const { darkMode } = useTheme()
  const [summaryLength, setSummaryLength] = useState(70)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const sentimentColors = {
    positive: "bg-green-100 text-green-800",
    negative: "bg-red-100 text-red-800",
    neutral: "bg-gray-100 text-gray-800",
  }

  const sentimentColorsDark = {
    positive: "bg-green-900 bg-opacity-30 text-green-400",
    negative: "bg-red-900 bg-opacity-30 text-red-400",
    neutral: "bg-gray-800 text-gray-400",
  }

  const handleSummaryChange = (e) => {
    setSummaryLength(e.target.value)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleLike = () => {
    setLikeCount(likeCount + 1)
  }

  // Calculate how much of the summary to show based on slider
  const summaryToShow = () => {
    if (!item.summary) return ""
    const fullLength = item.summary.length
    const showChars = Math.floor((fullLength * summaryLength) / 100)

    if (showChars >= fullLength) return item.summary
    return `${item.summary.substring(0, showChars)}...`
  }

  // Handle external link if provided by API
  const handleReadMore = () => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      {/* Image */}
      <img
        src={item.image || "/placeholder.svg?height=200&width=400"}
        alt={item.headline}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? "bg-purple-900 bg-opacity-30 text-purple-400" : "bg-purple-100 text-purple-800"}`}
          >
            {item.category}
          </span>
          {item.sentiment && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? sentimentColorsDark[item.sentiment] : sentimentColors[item.sentiment]}`}
            >
              {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">{item.headline}</h3>
        <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          {summaryToShow()}
          {(summaryLength < 100 || item.url) && (
            <button className="text-purple-500 font-medium ml-1 inline-flex items-center" onClick={handleReadMore}>
              Read more
              {item.url && <ExternalLink size={14} className="ml-1" />}
            </button>
          )}
        </p>

        {/* Adjust Summary Slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Adjust Summary</span>
            <span className={`text-xs font-medium ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
              {summaryLength < 33 ? "Brief" : summaryLength < 66 ? "Standard" : "Detailed"}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={summaryLength}
            onChange={handleSummaryChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} flex items-center`}
            onClick={handleLike}
          >
            <ThumbsUp
              size={18}
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} ${likeCount > 0 ? "text-purple-500" : ""}`}
            />
            {likeCount > 0 && <span className="ml-1 text-xs font-medium">{likeCount}</span>}
          </button>
          <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
            <MessageCircle size={18} className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
          <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
            <Share2 size={18} className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
          <button
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            onClick={toggleBookmark}
          >
            <Bookmark
              size={18}
              className={`${isBookmarked ? "text-purple-500 fill-purple-500" : darkMode ? "text-gray-400" : "text-gray-600"}`}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
