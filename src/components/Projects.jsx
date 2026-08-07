import { AlertCircle, Loader2 } from 'lucide-react';
import ProjectCard from './ProjectCard.jsx';

/**
 * "Projects" section. Renders a loading state, an error state, or a grid
 * of project cards depending on the current fetch status from
 * `usePortfolioData`.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {Array<object>} props.projects - Projects to display.
 * @param {boolean} props.loading - Whether the projects are still being fetched.
 * @param {string | null} props.error - Error message to display, if the fetch failed.
 * @param {(project: object) => void} props.onSelectProject - Called with a project when its card is clicked.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Projects({ lang, projects, loading, error, onSelectProject, theme }) {
  const { muted, sectionAlt, accentBg } = theme;

  return (
    <section id="projects" className={`py-24 px-6 ${sectionAlt}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '프로젝트' : 'Projects'}</h2>
          <div className={`h-1 w-16 mx-auto mb-4 ${accentBg} rounded-full`} />
          <p className={`${muted} max-w-xl mx-auto`}>
            {lang === 'ko'
              ? '현업 문제를 발견하고 자동화·연동 시스템으로 해결한 프로젝트입니다.'
              : 'Projects where I found a real operational problem and solved it with automation or integration.'}
          </p>
        </div>

        {loading && (
          <div className={`flex flex-col items-center justify-center py-20 ${muted}`}>
            <Loader2 size={28} className="animate-spin mb-3" />
            <span className="text-sm">{lang === 'ko' ? '프로젝트를 불러오는 중' : 'Loading projects'}</span>
          </div>
        )}

        {error && (
          <div className={`flex flex-col items-center justify-center py-20 ${muted}`}>
            <AlertCircle size={28} className="mb-3 text-red-400" />
            <span className="text-sm">{lang === 'ko' ? '불러오는 중 문제가 발생했습니다' : 'Something went wrong loading projects'}</span>
            <span className="text-xs mt-1 opacity-60">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p) => (
              <ProjectCard key={p.notionId} project={p} onSelect={() => onSelectProject(p)} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
