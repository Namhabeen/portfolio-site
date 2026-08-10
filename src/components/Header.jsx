import { Menu, Moon, Sun, X } from 'lucide-react';
import { NAV } from '../data/nav.js';

/**
 * Fixed top navigation bar with logo, section links, language toggle,
 * theme toggle, and a mobile menu.
 *
 * @param {object} props
 * @param {boolean} props.dark - Whether dark mode is active.
 * @param {(dark: boolean) => void} props.setDark - Toggles dark mode.
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {(lang: 'ko' | 'en') => void} props.setLang - Switches language.
 * @param {boolean} props.menuOpen - Whether the mobile menu is expanded.
 * @param {(open: boolean) => void} props.setMenuOpen - Toggles the mobile menu.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
// Temporarily hidden: English content isn't translated yet. Flip to true
// once EN copy is ready — `lang` state and all `lang === 'en'` branches
// elsewhere are left intact, so this is the only change needed to bring
// the toggle back.
const SHOW_LANG_TOGGLE = false;

export default function Header({ dark, setDark, lang, setLang, menuOpen, setMenuOpen, theme }) {
  const { text, muted, headerBg, border, accent } = theme;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerBg} backdrop-blur-md border-b ${border}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#home" className="text-lg font-bold tracking-tight">
          남하빈<span className={accent}>.</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`px-4 py-2 text-sm font-medium rounded-md ${muted} hover:${text} hover:bg-white/5 transition-colors`}
            >
              {n[lang]}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {SHOW_LANG_TOGGLE && (
            <button
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className={`text-xs font-semibold px-3 py-2 rounded-md border ${border} ${muted} hover:${text} transition-colors`}
            >
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>
          )}
          <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-md ${muted} hover:${text} hover:bg-white/5 transition-colors`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-md ${muted}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 gap-1">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={`py-2 text-sm ${muted}`} onClick={() => setMenuOpen(false)}>
              {n[lang]}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
