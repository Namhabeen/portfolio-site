/**
 * @typedef {object} Theme
 * @property {boolean} dark - Whether dark mode is currently active.
 * @property {string} bg - Page background color class.
 * @property {string} text - Primary text color class.
 * @property {string} muted - Secondary/muted text color class.
 * @property {string} headerBg - Header background color class.
 * @property {string} border - Border color class.
 * @property {string} cardBg - Card background color class.
 * @property {string} sectionAlt - Alternate section background color class.
 * @property {string} accent - Accent text color class.
 * @property {string} accentBg - Accent background color class.
 * @property {string} overlayBg - Modal overlay background color class.
 */

/**
 * Derives the Tailwind class tokens used across the site from a single
 * `dark` flag, so every component reads color decisions from one place
 * instead of re-deriving them from `dark` locally.
 *
 * @param {boolean} dark - Whether dark mode is currently active.
 * @returns {Theme} Tailwind class fragments keyed by their visual role.
 */
export function getTheme(dark) {
  return {
    dark,
    bg: dark ? 'bg-black' : 'bg-white',
    text: dark ? 'text-gray-50' : 'text-gray-900',
    muted: dark ? 'text-gray-400' : 'text-gray-500',
    headerBg: dark ? 'bg-black/80' : 'bg-white/80',
    border: dark ? 'border-white/10' : 'border-gray-200',
    cardBg: dark ? 'bg-white/5' : 'bg-gray-50',
    sectionAlt: dark ? 'bg-white/[0.02]' : 'bg-gray-50',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-600',
    overlayBg: dark ? 'bg-black/80' : 'bg-black/40',
  };
}
