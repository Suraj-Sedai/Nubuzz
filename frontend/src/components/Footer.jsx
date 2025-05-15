"use client"

import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  const { darkMode } = useTheme()

  return (
    <footer
      className={`py-8 ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"} border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
            >
              Nubuzz
            </Link>
            <p className="text-sm mt-1">© {new Date().getFullYear()} Nubuzz. All rights reserved.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <nav className="flex space-x-6 mb-4 md:mb-0 md:mr-8">
              <Link to="/about" className="text-sm hover:text-purple-500 transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-sm hover:text-purple-500 transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm hover:text-purple-500 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
