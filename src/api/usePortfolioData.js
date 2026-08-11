import { useEffect, useState } from 'react';

/**
 * Reads the `company` query parameter from the current URL, if present.
 *
 * The value is used as a company slug: when set, the Apps Script backend
 * returns a filtered, company-specific project list and positioning
 * sentence instead of the full master portfolio.
 *
 * Named `company` rather than `c` because Apps Script's deployment URL
 * handling reportedly treats `c` as an internally reserved parameter name.
 *
 * @returns {string | null} The slug value, or null if absent or if
 *   `window` is not available (e.g. during server-side rendering).
 */
function getSlugFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('company');
}

/**
 * Single in-flight (or already-settled) request for the portfolio data,
 * shared by every `usePortfolioData()` call. Memoized at module scope so
 * the fetch fires exactly once — kicked off below as soon as this module
 * is first evaluated, rather than waiting for a component to mount and an
 * effect to flush. That overlaps the network round trip with the rest of
 * the app's JS parsing/rendering instead of starting it only afterward,
 * and incidentally means React 18 StrictMode's dev-mode double-invoke of
 * effects can never trigger a second real request.
 *
 * @type {Promise<object> | null}
 */
let portfolioDataPromise = null;

function fetchPortfolioData() {
  if (portfolioDataPromise) return portfolioDataPromise;

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    portfolioDataPromise = Promise.reject(
      new Error('VITE_API_URL이 설정되어 있지 않습니다. .env 파일을 확인해주세요.')
    );
    return portfolioDataPromise;
  }

  const slug = getSlugFromUrl();
  const url = slug ? `${apiUrl}?company=${encodeURIComponent(slug)}` : apiUrl;

  portfolioDataPromise = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });

  return portfolioDataPromise;
}

if (typeof window !== 'undefined') {
  fetchPortfolioData();
}

/**
 * Fetches portfolio data (projects and, optionally, a positioning
 * sentence) from the Apps Script backend defined by `VITE_API_URL`.
 *
 * If the current URL has a `?company=<slug>` parameter, it is forwarded to
 * the backend so a company-specific subset of projects is returned;
 * otherwise the full master project list is requested.
 *
 * @returns {{
 *   projects: Array<object>,
 *   positioning: string | null,
 *   resumeUrl: string | null,
 *   badgeText: string | null,
 *   pageTitle: string | null,
 *   portfolioUrl: string | null,
 *   heroCopy: string | null,
 *   featuredIds: string[],
 *   loading: boolean,
 *   error: string | null,
 * }} The current fetch state.
 */
export function usePortfolioData() {
  const [projects, setProjects] = useState([]);
  const [positioning, setPositioning] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [badgeText, setBadgeText] = useState(null);
  const [pageTitle, setPageTitle] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState(null);
  const [heroCopy, setHeroCopy] = useState(null);
  const [featuredIds, setFeaturedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchPortfolioData()
      .then((data) => {
        if (cancelled) return;
        setProjects(data.projects || []);
        setPositioning(data.positioning || null);
        setResumeUrl(data.resumeUrl || null);
        setBadgeText(data.badgeText || null);
        setPageTitle(data.pageTitle || null);
        setPortfolioUrl(data.portfolioUrl || null);
        setHeroCopy(data.heroCopy || null);
        setFeaturedIds(data.featuredIds || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || '데이터를 불러오지 못했습니다');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, positioning, resumeUrl, badgeText, pageTitle, portfolioUrl, heroCopy, featuredIds, loading, error };
}
