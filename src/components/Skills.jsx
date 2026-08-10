import { SKILLS } from '../data/skills.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import SkillCard from './SkillCard.jsx';

/**
 * "Skills & Expertise" section, rendered as a grid of skill-group cards.
 * The heading fades in as a block; each card reveals itself individually,
 * staggered, the same way project cards do.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language (affects only the section heading; skill data itself is language-independent).
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Skills({ lang, theme }) {
  const { bg, accentBg } = theme;
  const [headingRef, headingVisible] = useScrollReveal();

  return (
    <section id="skills" className={`py-24 px-6 ${bg}`}>
      <div className="max-w-6xl mx-auto">
        <div
          ref={headingRef}
          className={`text-center mb-14 transition-all duration-500 ease-out ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '기술 스택' : 'Skills & Expertise'}</h2>
          <div className={`h-1 w-16 mx-auto ${accentBg} rounded-full`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((s, i) => (
            <SkillCard key={s.title} skill={s} index={i} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}
