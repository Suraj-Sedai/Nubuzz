"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import SearchFilters from "../components/SearchFilters"
import NewsFeed from "../components/NewsFeed"
import Footer from "../components/Footer"

const HomePage = () => {
  const { darkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLocation, setActiveLocation] = useState("New York")

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
        <HeroSection />
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

export default HomePage
