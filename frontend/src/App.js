import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import ErrorBoundary from "./components/ErrorBoundary"
import HomePage from "./pages/HomePage"
import ExplorePage from "./pages/ExplorePage"
import CategoriesPage from "./pages/CategoriesPage"
import LoginPage from "./pages/LoginPage"
import "./index.css"

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
