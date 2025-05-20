"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { TrendingUp, Zap, Globe, Sparkles } from "lucide-react"

const HeroSection = () => {
  const { darkMode } = useTheme()
  const [animatedCount, setAnimatedCount] = useState(0)

  // Animated counter effect
  useEffect(() => {
    const target = 5000
    const duration = 2000 // ms
    const stepTime = 30 // ms
    const steps = duration / stepTime
    const increment = target / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setAnimatedCount(Math.floor(current))
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className={`
        pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden relative
        ${darkMode ? "bg-gray-900" : "bg-white"}
      `}
    >
      {/* Background gradient shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side - Content */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-300 font-medium text-sm">
              <span className="flex items-center">
                <TrendingUp size={16} className="mr-2" />
                AI-Powered News Platform
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Smarter News.
              </span>
              <br />
              <span className={darkMode ? "text-white" : "text-gray-900"}>Personalized For You.</span>
            </h1>

            <p
              className={`text-lg md:text-xl mb-8 max-w-xl leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Get AI-curated news summaries tailored to your interests. Save time and stay informed with the stories
              that matter most to you.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-100 dark:border-purple-900/30">
                <span className="block text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-1">
                  {animatedCount.toLocaleString()}+
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Active Users</span>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-100 dark:border-purple-900/30">
                <span className="block text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-1">
                  100+
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>News Sources</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#news-feed"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-center shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 transform hover:-translate-y-1"
              >
                Explore News
              </a>
              <a
                href="#features"
                className={`px-8 py-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } font-medium text-center transition-all duration-200`}
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Right side - App mockup */}
          <div className="w-full md:w-1/2 relative">
            {/* Main device */}
            <div className="relative z-10 mx-auto max-w-xs">
              <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-800 shadow-2xl relative bg-gray-800">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl z-10"></div>
                <img
                  src="/placeholder.svg?height=600&width=300"
                  alt="Nubuzz mobile app"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-600 rounded-full"></div>

                {/* Animated elements */}
                <div className="absolute top-20 left-8 right-8 p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white mr-2">
                      <Zap size={14} />
                    </div>
                    <h4 className="font-bold text-sm">Breaking News</h4>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    AI breakthrough increases computing speed by 200x...
                  </p>
                </div>

                <div className="absolute bottom-24 right-4 p-3 rounded-full bg-pink-500 shadow-lg animate-pulse">
                  <Globe size={24} className="text-white" />
                </div>

                <div className="absolute bottom-40 left-6 p-3 rounded-full bg-purple-500/80 shadow-lg transform animate-bounce">
                  <Sparkles size={18} className="text-white" />
                </div>
              </div>

              {/* Reflection effect */}
              <div className="mt-4 mx-auto w-3/4 h-4 bg-black/10 dark:bg-white/10 blur-md rounded-full"></div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/3 right-4 w-24 h-24 rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-xl"></div>
            <div className="absolute bottom-1/4 left-8 w-20 h-20 rounded-full bg-pink-400/20 dark:bg-pink-600/10 blur-lg"></div>

            {/* Feature cards */}
            <div className="absolute top-10 md:-right-10 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-purple-100 dark:border-purple-900/30 transform rotate-6 hidden md:block">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-2">
                  <TrendingUp size={16} />
                </div>
                <span className="text-sm font-medium">Smart Analysis</span>
              </div>
            </div>

            <div className="absolute bottom-10 md:-left-10 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-purple-100 dark:border-purple-900/30 transform -rotate-6 hidden md:block">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
                  <Sparkles size={16} />
                </div>
                <span className="text-sm font-medium">Personalized Feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`absolute bottom-0 w-full h-full ${darkMode ? "fill-gray-800" : "fill-gray-50"}`}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,32,0,48Z"></path>
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
