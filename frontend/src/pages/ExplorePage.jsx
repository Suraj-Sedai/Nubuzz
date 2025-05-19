"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { useLocation } from "react-router-dom"
import Header from "../components/Header"
import SearchFilters from "../components/SearchFilters"
import NewsFeed from "../components/NewsFeed"
import Footer from "../components/Footer"

const ExplorePage = () => {
  const { darkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLocation, setActiveLocation] = useState("New York")

  // Get URL parameters
  const location = useLocation()

  // Set initial category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get("category")
    if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [location])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  const handleLocationChange = (location) => {
    setActiveLocation(location)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Explore News</h1>
          <p className={`mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Discover trending stories and deep dives on topics that matter to you.
          </p>
        </div>
        <SearchFilters
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onLocationChange={handleLocationChange}
        />
        <NewsFeed searchTerm={searchTerm} activeCategory={activeCategory} activeLocation={activeLocation} />
      </main>
      <Footer />
    </div>
  )
}

export default ExplorePage
