"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { Search, ChevronDown } from "lucide-react"

const SearchFilters = ({ onSearch, onCategoryChange }) => {
  const { darkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Tech", "Politics", "Sports", "Health", "Entertainment", "World"]

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) onSearch(value)
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    if (onCategoryChange) onCategoryChange(category)
  }

  return (
    <section className={`py-8 ${darkMode ? "bg-gray-900" : "bg-white"} sticky top-16 z-40 shadow-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div
            className={`relative w-full md:w-1/3 ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-full overflow-hidden`}
          >
            <input
              type="text"
              placeholder="Search news by keyword..."
              value={searchTerm}
              onChange={handleSearch}
              className={`w-full py-3 pl-12 pr-4 outline-none ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto py-2 no-scrollbar">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  ${
                    category === activeCategory
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : darkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Location Tag */}
          <div className={`flex items-center ${darkMode ? "text-gray-300" : "text-gray-700"} text-sm`}>
            <span className="flex items-center">
              Trending in <span className="font-semibold ml-1">New York</span>
              <ChevronDown size={16} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchFilters
