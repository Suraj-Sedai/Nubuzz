"use client"

import { useTheme } from "../context/ThemeContext"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const CategoriesPage = () => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  const categories = [
    { name: "Technology", icon: "💻", color: "from-blue-500 to-purple-500" },
    { name: "Politics", icon: "🏛️", color: "from-red-500 to-orange-500" },
    { name: "Sports", icon: "🏆", color: "from-green-500 to-teal-500" },
    { name: "Health", icon: "🏥", color: "from-teal-500 to-cyan-500" },
    { name: "Entertainment", icon: "🎬", color: "from-purple-500 to-pink-500" },
    { name: "World", icon: "🌎", color: "from-indigo-500 to-blue-500" },
    { name: "Business", icon: "📈", color: "from-amber-500 to-yellow-500" },
    { name: "Science", icon: "🔬", color: "from-cyan-500 to-blue-500" },
  ]

  const handleCategoryClick = (category) => {
    navigate(`/explore?category=${category}`)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">News Categories</h1>
        <p className={`mb-8 max-w-2xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Browse news by category to find the stories that interest you most. Click on any category to see the latest
          headlines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`rounded-xl p-6 cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl
                ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-3xl mb-4`}
              >
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Latest {category.name.toLowerCase()} news and updates
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CategoriesPage
