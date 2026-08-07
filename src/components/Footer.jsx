import { ArrowUp, Sparkles } from 'lucide-react';

/**
 * Site footer with copyright, an attribution line, and a scroll-to-top link.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Footer({ lang, theme }) {
  const { muted, border, accent } = theme;

  return (
    <footer className={`border-t ${border} px-6 py-8`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className={`text-sm ${muted}`}>&copy; 2026 Nam Habeen. All rights reserved.</p>
        <p className={`text-xs ${muted} flex items-center gap-1.5`}>
          <Sparkles size={12} className={accent} />
          {lang === 'ko'
            ? 'Claude Code · Notion API · Apps Script로 제작되었습니다'
            : 'Built with Claude Code, the Notion API, and Apps Script'}
        </p>
        <a href="#home" className={`p-2 rounded-full border ${border} hover:bg-white/5 transition-colors`} aria-label="Scroll to top">
          <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
}
