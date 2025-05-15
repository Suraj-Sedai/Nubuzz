"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import Header from "../components/Header"
import SearchFilters from "../components/SearchFilters"
import NewsFeed from "../components/NewsFeed"
import Footer from "../components/Footer"

const ExplorePage = () => {
  const { darkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
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
        <SearchFilters onSearch={handleSearch} onCategoryChange={handleCategoryChange} />
        <NewsFeed searchTerm={searchTerm} activeCategory={activeCategory} />
      </main>
      <Footer />
    </div>
  )
}

export default ExplorePage
