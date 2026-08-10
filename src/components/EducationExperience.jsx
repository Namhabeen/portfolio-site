import SimpleProjectCard from './SimpleProjectCard.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * "Education & Other Experience" section: freelance, bootcamp, and global
 * program entries that don't belong in the main full-time project grid.
 * Rendered directly below the Projects section as a fixed 2x2 grid of
 * text-only cards. Clicking a card opens the same `ProjectDetailModal`
 * used by the main project grid.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {Array<object>} props.projects - The (already order-filtered) projects to display here.
 * @param {(project: object) => void} props.onSelectProject - Called with a project when its card is clicked.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function EducationExperience({ lang, projects, onSelectProject, theme }) {
  const { bg, accentBg } = theme;
  const [headingRef, headingVisible] = useScrollReveal();

  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="education" className={`py-24 px-6 ${bg}`}>
      <div className="max-w-6xl mx-auto">
        <div
          ref={headingRef}
          className={`text-center mb-14 transition-all duration-500 ease-out ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === 'ko' ? '교육 및 기타 경험' : 'Education & Other Experience'}
          </h2>
          <div className={`h-1 w-16 mx-auto ${accentBg} rounded-full`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {sortedProjects.map((p, i) => (
            <SimpleProjectCard key={p.notionId} project={p} index={i} onSelect={() => onSelectProject(p)} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}
