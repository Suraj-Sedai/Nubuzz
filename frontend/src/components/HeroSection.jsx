"use client"

import { useTheme } from "../context/ThemeContext"

const HeroSection = () => {
  const { darkMode } = useTheme()

  return (
    <section className={`py-16 md:py-24 ${darkMode ? "bg-gray-800" : "bg-gradient-to-br from-purple-50 to-pink-50"}`}>
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Smarter News. Faster.
        </h1>
        <p className={`text-xl md:text-2xl mb-8 max-w-2xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Get personalized news summaries in seconds.
        </p>
        <a
          href="#news-feed"
          className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          Explore Now
        </a>

        {/* Floating devices mockup */}
        <div className="mt-16 relative w-full max-w-4xl">
          <div className="relative z-10 mx-auto w-64 md:w-80 rounded-xl shadow-2xl overflow-hidden border-8 border-white dark:border-gray-800">
            <img src="/placeholder.svg?height=600&width=300" alt="Nubuzz mobile app" className="w-full" />
          </div>
          <div className="absolute top-12 -right-4 md:right-20 w-48 md:w-64 rounded-xl shadow-xl overflow-hidden border-8 border-white dark:border-gray-800 rotate-6 hidden sm:block">
            <img src="/placeholder.svg?height=400&width=200" alt="Nubuzz mobile app" className="w-full" />
          </div>
          <div className="absolute top-12 -left-4 md:left-20 w-48 md:w-64 rounded-xl shadow-xl overflow-hidden border-8 border-white dark:border-gray-800 -rotate-6 hidden sm:block">
            <img src="/placeholder.svg?height=400&width=200" alt="Nubuzz mobile app" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
