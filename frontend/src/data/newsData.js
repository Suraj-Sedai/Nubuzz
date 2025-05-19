import { useEffect, useState } from 'react';
import { fetchNewsData } from '../api.js';

function newsData({ category, location }) {
  const [articles, setArticles] = useState([]);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchNewsData({ category: activeCategory, location })
      .then(data => setArticles(data))
      .catch(err => setError(err.message))
  }, [activeCategory, location]);
  

  if (error) return <div>Error: {error}</div>;
  if (!articles.length) return <div>Loading…</div>;

  return (
    <ul>
      {articles.map(a => (
        <li key={a.id}>
          <h3>{a.title}</h3>
          <p><em>Source:</em> {a.source.name} &mdash; <em>Category:</em> {a.category}</p>
          <img src={a.urlToImage} alt="" style={{ maxWidth: 400 }} />
          <p>{a.summarize_article}</p>
          <a href={a.url} target="_blank" rel="noopener noreferrer">Read more</a>
        </li>
      ))}
    </ul>
  );
}
