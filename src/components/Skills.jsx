import { SKILLS } from '../data/skills.js';

/**
 * "Skills & Expertise" section, rendered as a grid of skill-group cards.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language (affects only the section heading; skill data itself is language-independent).
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Skills({ lang, theme }) {
  const { muted, border, cardBg, accentBg } = theme;

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '핵심 역량' : 'Skills & Expertise'}</h2>
          <div className={`h-1 w-16 mx-auto ${accentBg} rounded-full`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((s) => (
            <div key={s.title} className={`rounded-xl p-6 border ${border} ${cardBg}`}>
              <h3 className="font-semibold mb-4">{s.title}</h3>
              <ul className="space-y-2">
                {s.items.map((it) => (
                  <li key={it} className={`flex items-center text-sm ${muted}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${accentBg}`} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
