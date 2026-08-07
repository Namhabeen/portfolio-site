import { useEffect, useState } from 'react';

/**
 * Reads the `c` query parameter from the current URL, if present.
 *
 * The value is used as a company slug: when set, the Apps Script backend
 * returns a filtered, company-specific project list and positioning
 * sentence instead of the full master portfolio.
 *
 * @returns {string | null} The slug value, or null if absent or if
 *   `window` is not available (e.g. during server-side rendering).
 */
function getSlugFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('c');
}

/**
 * Fetches portfolio data (projects and, optionally, a positioning
 * sentence) from the Apps Script backend defined by `VITE_API_URL`.
 *
 * If the current URL has a `?c=<slug>` parameter, it is forwarded to the
 * backend so a company-specific subset of projects is returned; otherwise
 * the full master project list is requested.
 *
 * @returns {{
 *   projects: Array<object>,
 *   positioning: string | null,
 *   loading: boolean,
 *   error: string | null,
 * }} The current fetch state.
 */
export function usePortfolioData() {
  const [projects, setProjects] = useState([]);
  const [positioning, setPositioning] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError('VITE_API_URL이 설정되어 있지 않습니다. .env 파일을 확인해주세요.');
      setLoading(false);
      return;
    }

    const slug = getSlugFromUrl();
    const url = slug ? `${apiUrl}?c=${encodeURIComponent(slug)}` : apiUrl;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProjects(data.projects || []);
        setPositioning(data.positioning || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || '데이터를 불러오지 못했습니다');
        setLoading(false);
      });
  }, []);

  return { projects, positioning, loading, error };
}
