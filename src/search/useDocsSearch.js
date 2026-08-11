import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Client-side docs search using the pre-built search index.
 * Performs simple token-based matching with scoring.
 */
export function useDocsSearch() {
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const indexRef = useRef(null);

  useEffect(() => {
    async function loadIndex() {
      try {
        const resp = await fetch('/search-index.json');
        if (resp.ok) {
          const data = await resp.json();
          indexRef.current = data;
          setIndex(data);
        }
      } catch {
        // Search unavailable — degrade gracefully
      }
      setLoading(false);
    }
    loadIndex();
  }, []);

  const search = useCallback((query) => {
    const data = indexRef.current;
    if (!data || !query || query.trim().length < 2) return [];

    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
    if (terms.length === 0) return [];

    const scored = data.map(section => {
      let score = 0;
      const headingLower = section.heading.toLowerCase();
      const textLower = section.text.toLowerCase();
      const topicLower = section.topic.toLowerCase();

      for (const term of terms) {
        // Heading matches score highest
        if (headingLower.includes(term)) score += 10;
        // Topic name matches
        if (topicLower.includes(term)) score += 5;
        // Body text matches
        const bodyMatches = (textLower.match(new RegExp(term, 'g')) || []).length;
        score += Math.min(bodyMatches, 5); // cap at 5 per term to avoid keyword stuffing
      }

      return { ...section, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, []);

  return { search, loading, indexLoaded: !!index };
}
