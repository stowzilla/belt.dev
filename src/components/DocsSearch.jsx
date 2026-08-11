import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocsSearch } from '../search/useDocsSearch';

const TOPIC_TITLES = {
  routing: 'Routing',
  controllers: 'Controllers',
  models: 'Models',
  lambda_handler: 'Lambda Handler',
  observability: 'Observability',
  deployment: 'Deployment',
  generators: 'Generators',
  console: 'Console',
  backups: 'Backups',
  plugins: 'Plugins',
  structure: 'Project Structure',
};

function highlightMatch(text, query) {
  if (!query || query.length < 2) return text;
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
  if (terms.length === 0) return text;

  const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    terms.some(t => part.toLowerCase() === t)
      ? <mark key={i}>{part}</mark>
      : part
  );
}

function getSnippet(text, query, maxLen = 150) {
  if (!query || !text) return text.slice(0, maxLen);

  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
  const lower = text.toLowerCase();

  // Find the first term occurrence and center the snippet around it
  let firstIndex = -1;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1 && (firstIndex === -1 || idx < firstIndex)) {
      firstIndex = idx;
    }
  }

  if (firstIndex === -1) return text.slice(0, maxLen);

  const start = Math.max(0, firstIndex - 40);
  const end = Math.min(text.length, start + maxLen);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet = snippet + '…';

  return snippet;
}

export default function DocsSearch({ onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const { search, loading: indexLoading } = useDocsSearch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const r = search(initialQuery);
      setResults(r);
    }
  }, [initialQuery, search]);

  function handleSearch(value) {
    setQuery(value);
    if (value.trim().length >= 2) {
      const r = search(value);
      setResults(r);
    } else {
      setResults([]);
    }
  }

  function handleResultClick(result) {
    const anchor = result.anchor ? `#${result.anchor}` : '';
    navigate(`/docs/${result.topic}${anchor}`);
    if (onClose) onClose();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }

  return (
    <div className="docs-search-panel" onKeyDown={handleKeyDown}>
      <div className="docs-search-input-wrapper">
        <svg className="docs-search-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="docs-search-input"
          placeholder="Search docs…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search documentation"
        />
        {query && (
          <button
            className="docs-search-clear"
            onClick={() => handleSearch('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {indexLoading && (
        <div className="docs-search-status">Loading search index…</div>
      )}

      {!indexLoading && query.length >= 2 && results.length === 0 && (
        <div className="docs-search-status">No results for "{query}"</div>
      )}

      {results.length > 0 && (
        <div className="docs-search-results" role="listbox">
          {results.map((result) => (
            <button
              key={`${result.topic}-${result.id}`}
              className="docs-search-result"
              onClick={() => handleResultClick(result)}
              role="option"
            >
              <div className="docs-search-result-header">
                <span className="docs-search-result-topic">
                  {TOPIC_TITLES[result.topic] || result.topic}
                </span>
                <span className="docs-search-result-heading">
                  {highlightMatch(result.heading, query)}
                </span>
              </div>
              <div className="docs-search-result-snippet">
                {highlightMatch(getSnippet(result.text, query), query)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
