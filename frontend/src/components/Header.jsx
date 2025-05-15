"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Menu, X, Moon, Sun } from "lucide-react"

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`sticky top-0 z-50 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
          >
            Nubuzz
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-purple-500 transition-colors">
            Home
          </Link>
          <Link to="/explore" className="font-medium hover:text-purple-500 transition-colors">
            Explore
          </Link>
          <Link to="/categories" className="font-medium hover:text-purple-500 transition-colors">
            Categories
          </Link>
          <Link
            to="/login"
            className="font-medium px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            Login / Signup
          </Link>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full mr-2 ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? "bg-gray-800" : "bg-white"} py-4 px-4 shadow-md`}>
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-purple-500 transition-colors py-2">
              Home
            </Link>
            <Link to="/explore" className="font-medium hover:text-purple-500 transition-colors py-2">
              Explore
            </Link>
            <Link to="/categories" className="font-medium hover:text-purple-500 transition-colors py-2">
              Categories
            </Link>
            <Link
              to="/login"
              className="font-medium py-2 px-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center"
            >
              Login / Signup
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
