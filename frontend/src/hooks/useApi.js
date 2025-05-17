"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook for API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} params - Parameters to pass to the API function
 * @param {boolean} immediate - Whether to call the API immediately
 * @returns {Object} - { data, isLoading, error, execute }
 */
export const useApi = (apiFunction, params = {}, immediate = true) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = async (overrideParams = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const mergedParams = { ...params, ...overrideParams }
      const result = await apiFunction(mergedParams)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error, execute }
}
