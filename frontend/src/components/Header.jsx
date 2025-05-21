"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Menu, X, Moon, Sun, User, LogOut, Settings, Bell } from "lucide-react"

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (e) {
          console.error("Error parsing user data:", e)
          handleLogout()
        }
      } else {
        setUser(null)
      }
    }

    checkAuth()
    // Listen for storage events (for multi-tab support)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    setUserMenuOpen(false)

    // Redirect to home
    navigate("/")
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

          {user ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 font-medium hover:text-purple-500 transition-colors focus:outline-none"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </button>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 
                  ${darkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-100"} 
                  ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/notifications"
                    className={`flex items-center px-4 py-2 text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Bell size={16} className="mr-2" />
                    Notifications
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center px-4 py-2 text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="font-medium px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
            >
              Login / Signup
            </Link>
          )}

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

            {user ? (
              <>
                <div className="py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center py-2 hover:text-purple-500">
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link to="/notifications" className="flex items-center py-2 hover:text-purple-500">
                    <Bell size={16} className="mr-2" />
                    Notifications
                  </Link>
                  <Link to="/settings" className="flex items-center py-2 hover:text-purple-500">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center py-2 text-red-600 dark:text-red-400 w-full text-left"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="font-medium py-2 px-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center"
              >
                Login / Signup
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
