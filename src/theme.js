import { getBrandColors } from './utils/color.js';

/**
 * @typedef {object} Theme
 * @property {boolean} dark - Whether dark mode is currently active.
 * @property {import('./utils/color.js').BrandColors | null} brand - Derived
 *   variants of the company CI color, or `null` when no `mainColor` was
 *   provided (in which case every accent token below falls back to the
 *   default blue).
 * @property {string} bg - Page background color class.
 * @property {string} text - Primary text color class.
 * @property {string} muted - Secondary/muted text color class.
 * @property {string} headerBg - Header background color class.
 * @property {string} border - Border color class.
 * @property {string} cardBg - Card background color class.
 * @property {string} sectionAlt - Alternate section background color class.
 * @property {string} accent - Accent text color class.
 * @property {string} accentBg - Accent background color class.
 * @property {string} accentBgHover - Hover-state class for `accentBg` elements.
 * @property {string} accentTextOn - Text color class for text placed on top of `accentBg`.
 * @property {string} tagBg - Background color class for accent-tinted badges/tags.
 * @property {string} loadingBar - Background color class for the top loading bar.
 * @property {string} overlayBg - Modal overlay background color class.
 */

/**
 * Derives the Tailwind class tokens used across the site from a single
 * `dark` flag, so every component reads color decisions from one place
 * instead of re-deriving them from `dark` locally.
 *
 * When `mainColor` (a company CI color) is provided, every token that
 * plays an accent role switches from the default blue Tailwind classes to
 * `var(--brand...)` arbitrary-value classes instead. Those CSS custom
 * properties are computed from `mainColor` by `getBrandColors` and must be
 * injected by the caller (see `App.jsx`) on an ancestor element — this
 * function only decides *which* variable each token should point at.
 *
 * @param {boolean} dark - Whether dark mode is currently active.
 * @param {string | null} [mainColor] - Company CI color as a hex string, if any.
 * @returns {Theme} Tailwind class fragments keyed by their visual role.
 */
export function getTheme(dark, mainColor) {
  const brand = getBrandColors(mainColor);

  return {
    dark,
    brand,
    bg: dark ? 'bg-black' : 'bg-white',
    text: dark ? 'text-gray-50' : 'text-gray-900',
    muted: dark ? 'text-gray-400' : 'text-gray-500',
    headerBg: dark ? 'bg-black/80' : 'bg-white/80',
    border: dark ? 'border-white/10' : 'border-gray-200',
    cardBg: dark ? 'bg-white/5' : 'bg-white shadow-sm border border-gray-200/60',
    sectionAlt: dark ? 'bg-white/[0.02]' : 'bg-gray-100',
    accent: brand ? (dark ? 'text-[var(--brand-dark)]' : 'text-[var(--brand)]') : 'text-blue-500',
    accentBg: brand ? 'bg-[var(--brand)]' : 'bg-blue-600',
    accentBgHover: brand ? 'hover:bg-[var(--brand-hover)]' : 'hover:opacity-90',
    accentTextOn: brand ? 'text-[var(--brand-text-on)]' : 'text-white',
    tagBg: brand
      ? dark
        ? 'bg-[var(--brand-tint-dark)]'
        : 'bg-[var(--brand-light)]'
      : dark
      ? 'bg-blue-500/10'
      : 'bg-blue-50',
    loadingBar: brand ? 'bg-[var(--brand)]' : 'bg-blue-500',
    overlayBg: dark ? 'bg-black/80' : 'bg-black/40',
  };
}
