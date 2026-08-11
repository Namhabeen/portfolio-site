import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import ProjectCard from './ProjectCard.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

const PAGE_SIZE = 6;

/**
 * "Projects" section. Renders a loading state, an error state, or a grid
 * of project cards depending on the current fetch status from
 * `usePortfolioData`.
 *
 * Projects are sorted by `order` and revealed 6 at a time via a "show
 * more" button, so the page doesn't front-load every project's images at
 * once. The visible count resets whenever the `projects` array itself
 * changes (e.g. a different `?company=` slug loads a different list).
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
  const { muted, border, bg, dark, sectionAlt, accent, accentBg } = theme;
  const [headingRef, headingVisible] = useScrollReveal();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [projects]);

  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  const visibleProjects = sortedProjects.slice(0, visibleCount);
  const remaining = sortedProjects.length - visibleProjects.length;

  return (
    <section id="projects" className={`py-24 px-6 ${sectionAlt}`}>
      <div className="max-w-6xl mx-auto">
        <div
          ref={headingRef}
          className={`text-center mb-14 transition-all duration-500 ease-out ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '프로젝트' : 'Projects'}</h2>
          <div className={`h-1 w-16 mx-auto mb-4 ${accentBg} rounded-full`} />
          <p className={`${muted} max-w-xl mx-auto`}>
            {lang === 'ko'
              ? '보안 정책에 따라 일부 내용은 블러 처리 및 가능한 범위 내에서 재가공하였습니다.'
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleProjects.map((p, i) => (
                <ProjectCard key={p.notionId} project={p} index={i} onSelect={() => onSelectProject(p)} theme={theme} />
              ))}
            </div>

            {remaining > 0 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className={`inline-flex items-center gap-2 px-6 py-3 ${bg} rounded-md font-medium border ${border} transition-all hover:-translate-y-0.5`}
                >
                  <span>{lang === 'ko' ? '프로젝트 더 보기' : 'Show more'}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-semibold ${
                      dark ? 'bg-blue-500/10' : 'bg-blue-50'
                    } ${accent}`}
                  >
                    {remaining}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
