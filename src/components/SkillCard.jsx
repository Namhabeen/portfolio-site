import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * Single skill-group card in the "Skills & Expertise" grid. Reveals itself
 * (fade-in + slide-up) the first time it scrolls into view, staggered by
 * `index` — mirrors how `ProjectCard` reveals project cards.
 *
 * @param {object} props
 * @param {{ title: string, items: string[] }} props.skill - The skill group to render.
 * @param {number} [props.index] - Position within the grid, used to stagger the scroll-reveal entrance.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function SkillCard({ skill, index = 0, theme }) {
  const { dark, muted, cardBg, accentBg } = theme;
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${Math.min(index, 10) * 70}ms` : '0ms' }}
      className={`rounded-xl p-6 border ${dark ? 'border-white/12' : 'border-gray-300/60'} ${cardBg} transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <h3 className="font-semibold mb-4">{skill.title}</h3>
      <ul className="space-y-2">
        {skill.items.map((it) => (
          <li key={it} className={`flex items-center text-sm ${muted}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${accentBg}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
