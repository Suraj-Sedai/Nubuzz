// src/data/NewsData.jsx

import React, { useState, useEffect } from 'react'
import { fetchNewsData } from '../api.js'

export default function NewsData({ location, searchTerm = '' }) {
  const [articles, setArticles] = useState([])
  const [loading,  setLoading ] = useState(true)
  const [error,    setError   ] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchNewsData({ location })
      .then(data => setArticles(data))
      .catch(err => {
        setError(err.message)
        setArticles([])
      })
      .finally(() => setLoading(false))
  }, [location]) // ← only depends on `location`

  if (loading)          return <div>Loading…</div>
  if (error)            return <div style={{ color: 'red' }}>Error: {error}</div>

  // filter by search term if given
  const filtered = searchTerm.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : articles

  if (!filtered.length) return <div>No articles found.</div>

  return (
    <ul>
      {filtered.map(a => (
        <li key={a.url} style={{ margin: '1rem 0' }}>
          <h3>{a.title}</h3>
          <p>
            <em>{a.source.name}</em> —{' '}
            {new Date(a.publishedAt).toLocaleString()}
          </p>
          {a.urlToImage && (
            <img src={a.urlToImage} alt={a.title} style={{ maxWidth: '100%' }} />
          )}
          <p>{a.summary}</p>
          <a href={a.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </li>
      ))}
    </ul>
  )
}
