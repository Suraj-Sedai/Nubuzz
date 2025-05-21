"use client"

import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react"

const AuthPage = () => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
 
  // Check URL for login/register path
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [location.pathname])

  // Reset form when switching between login and register
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setErrors({})
    setTouched({})
    setFormError(null)
    setFormSuccess(null)
  }, [isLogin])

  const switchMode = () => {
    navigate(isLogin ? "/register" : "/login")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Validate on change if field has been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({
      ...touched,
      [name]: true,
    })
    validateField(name, value)
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case "name":
        if (!value && !isLogin) {
          newErrors.name = "Name is required"
        } else if (value && value.length < 2) {
          newErrors.name = "Name must be at least 2 characters"
        } else {
          delete newErrors.name
        }
        break
      case "email":
        if (!value) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Email is invalid"
        } else {
          delete newErrors.email
        }
        break
      case "password":
        if (!value) {
          newErrors.password = "Password is required"
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters"
        } else {
          delete newErrors.password
        }
        // Also validate confirmPassword if it exists
        if (!isLogin && formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
          } else {
            delete newErrors.confirmPassword
          }
        }
        break
      case "confirmPassword":
        if (!value && !isLogin) {
          newErrors.confirmPassword = "Please confirm your password"
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match"
        } else {
          delete newErrors.confirmPassword
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    // Mark all fields as touched
    const allTouched = {}
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true
    })
    setTouched(allTouched)

    // Validate all fields
    let isValid = true
    const newErrors = {}

    if (!isLogin && !formData.name) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);
  
    // pick the right URL (always include trailing slash!)
    const endpoint = isLogin
      ? "http://127.0.0.1:8000/nubuzz/api/login/"
      : "http://127.0.0.1:8000/nubuzz/api/register/";
  
    // match the field names your DRF serializers/views expect
    const payload = isLogin
      ? {
          username: formData.email,    // or formData.name if you really use that as username
          password: formData.password,
        }
      : {
          username: formData.name,     // map your “Full Name” → username
          email:    formData.email,
          password: formData.password,
          password2 :formData.confirmPassword,
        };
  
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        // parse the JSON error payload
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || `HTTP ${res.status}`);
      }
  
      const data = await res.json();
  
      // store your token & user info from the API response
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      setFormSuccess(
        isLogin
          ? "Login successful! Redirecting…"
          : "Registration successful! Please check your email."
      );
      if (isLogin) setTimeout(() => navigate("/"), 1000);
  
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
    
  

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Back to home link */}
      <Link
        to="/"
        className={`absolute top-6 left-6 flex items-center text-sm font-medium ${
          darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
        } transition-colors`}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Home
      </Link>

      {/* Logo */}
      <div className="mb-8">
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          Nubuzz
        </Link>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl shadow-xl overflow-hidden border ${
            darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-100"
          } backdrop-blur-sm`}
        >
          {/* Card header */}
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>

            {/* Content */}
            <div className="relative p-8 text-white">
              <h1 className="text-2xl font-bold mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
              <p className="text-white/80 text-sm">
                {isLogin
                  ? "Sign in to access your personalized news feed"
                  : "Join thousands of readers for a better news experience"}
              </p>
            </div>

            {/* Tab navigation */}
            <div className="flex bg-white dark:bg-gray-800">
              <button
                className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                  isLogin ? "text-purple-600 dark:text-purple-400" : darkMode ? "text-gray-400" : "text-gray-500"
                }`}
                onClick={() => navigate("/login")}
              >
                Login
                {isLogin && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                )}
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                  !isLogin ? "text-purple-600 dark:text-purple-400" : darkMode ? "text-gray-400" : "text-gray-500"
                }`}
                onClick={() => navigate("/register")}
              >
                Register
                {!isLogin && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Form success/error messages */}
            {formSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-start">
                <CheckCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 flex items-start">
                <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name field - only for registration */}
              {!isLogin && (
                <div className="mb-5">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                        errors.name && touched.name ? "text-red-500" : ""
                      }`}
                    >
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-10 py-3 rounded-lg border ${
                        errors.name && touched.name
                          ? "border-red-500 dark:border-red-500"
                          : darkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Enter your username"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && touched.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
              )}

              {/* Email field */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                      errors.email && touched.email ? "text-red-500" : ""
                    }`}
                  >
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-10 py-3 rounded-lg border ${
                      errors.email && touched.email
                        ? "border-red-500 dark:border-red-500"
                        : darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && touched.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password field */}
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                      errors.password && touched.password ? "text-red-500" : ""
                    }`}
                  >
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-10 py-3 rounded-lg border ${
                      errors.password && touched.password
                        ? "border-red-500 dark:border-red-500"
                        : darkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && touched.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                {!isLogin && !errors.password && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>

              {/* Confirm Password field - only for registration */}
              {!isLogin && (
                <div className="mb-5">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                        errors.confirmPassword && touched.confirmPassword ? "text-red-500" : ""
                      }`}
                    >
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-10 py-3 rounded-lg border ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500 dark:border-red-500"
                          : darkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Forgot password link - only for login */}
              {isLogin && (
                <div className="flex justify-end mb-6">
                  <a href="/forgot-password" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium 
                hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 
                flex items-center justify-center ${isLoading ? "opacity-80" : ""}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`py-3 rounded-lg font-medium flex items-center justify-center border ${
                  darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Google
              </button>
              <button
                className={`py-3 rounded-lg font-medium flex items-center justify-center border ${
                  darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
                  <linearGradient
                    id="Ld6sqrtcxMyckEl6xeDdMa"
                    x1="9.993"
                    x2="40.615"
                    y1="9.993"
                    y2="40.615"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#2aa4f4" />
                    <stop offset="1" stopColor="#007ad9" />
                  </linearGradient>
                  <path
                    fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
                    d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                  />
                  <path
                    fill="#fff"
                    d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                  />
                </svg>
                Facebook
              </button>
            </div>

            {/* Switch mode link */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={switchMode}
                  className="ml-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Terms notice */}
        <p className={`mt-8 text-center text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          By continuing, you agree to Nubuzz's{" "}
          <a href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default AuthPage
