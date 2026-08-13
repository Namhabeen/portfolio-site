import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getProjectImageUrl } from '../data/projectImages.js';

/**
 * Labeled block within the project detail modal (e.g. "Overview",
 * "Problem", "Results").
 *
 * @param {object} props
 * @param {string} props.title - Block heading.
 * @param {import('react').ReactNode} props.children - Block content.
 * @param {string} props.muted - Muted text color class, from the current theme.
 * @param {boolean} [props.last] - When true, omits the bottom margin used to separate blocks.
 * @returns {JSX.Element}
 */
function DetailBlock({ title, children, muted, last }) {
  return (
    <div className={last ? '' : 'mb-6'}>
      <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${muted}`}>{title}</h4>
      {children}
    </div>
  );
}

/**
 * Renders a list of strings as bullet points. Renders nothing if the list
 * is empty or missing, so empty Notion fields don't leave a stray heading.
 *
 * @param {object} props
 * @param {string[] | undefined} props.items - Lines to render as bullets.
 * @param {string} props.muted - Muted text color class, from the current theme.
 * @param {string} props.accentBg - Accent background color class, used for the bullet dot.
 * @returns {JSX.Element | null}
 */
function BulletList({ items, muted, accentBg }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start text-sm leading-relaxed ${muted}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0 ${accentBg}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Full-screen overlay showing the full detail of a selected project
 * (overview, problem, decisions, implementation, results, skills shown).
 * Clicking the backdrop or the close button dismisses it.
 *
 * @param {object} props
 * @param {object} props.project - The project to display, as returned by the Apps Script backend.
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {() => void} props.onClose - Called when the modal should close.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function ProjectDetailModal({ project, lang, onClose, theme }) {
  const { bg, muted, border, accent, accentBg, overlayBg, tagBg } = theme;
  const [imgError, setImgError] = useState(false);

  const localImageUrl = getProjectImageUrl(project.notionId);
  const hasImage = Boolean(localImageUrl) && !imgError;

  // Lock background scroll while the modal is mounted; restore whatever
  // the body's overflow was set to before, on close.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] ${overlayBg} backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10 px-4`}
      onClick={onClose}
    >
      <div
        className={`${bg} ${border} border rounded-2xl max-w-2xl w-full p-8 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full ${muted} hover:bg-white/5`}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <span className={`text-xs ${muted}`}>{project.company}</span>
        <h3 className="text-2xl font-bold mt-1 mb-3">{project.cardName}</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {(project.jobTags || []).map((tag) => (
            <span key={tag} className={`text-xs px-2 py-1 rounded-full ${tagBg} ${accent}`}>
              {tag}
            </span>
          ))}
        </div>

        {hasImage && (
          <img
            src={localImageUrl}
            alt={`${project.cardName} 상세 이미지`}
            onError={() => setImgError(true)}
            className={`w-full h-auto rounded-lg border ${border} mb-6`}
          />
        )}

        {(() => {
          const sections = [
            {
              title: lang === 'ko' ? '프로젝트 개요' : 'Overview',
              content: project.overview ? <p className={`text-sm leading-relaxed ${muted}`}>{project.overview}</p> : null,
            },
            {
              title: lang === 'ko' ? '문제 상황' : 'Problem',
              content: project.problem && project.problem.length > 0 ? <BulletList items={project.problem} muted={muted} accentBg={accentBg} /> : null,
            },
            {
              title: lang === 'ko' ? '의사결정 및 역할' : 'Decisions & Role',
              content: project.decisions && project.decisions.length > 0 ? <BulletList items={project.decisions} muted={muted} accentBg={accentBg} /> : null,
            },
            {
              title: project.implementationLabel || (lang === 'ko' ? '주요 구현 내용' : 'Implementation'),
              content: project.implementation && project.implementation.length > 0 ? <BulletList items={project.implementation} muted={muted} accentBg={accentBg} /> : null,
            },
            {
              title: lang === 'ko' ? '성과' : 'Results',
              content: project.results && project.results.length > 0 ? <BulletList items={project.results} muted={muted} accentBg={accentBg} /> : null,
            },
            {
              title: lang === 'ko' ? '보여준 역량' : 'Skills Demonstrated',
              content: project.skillsShown && project.skillsShown.length > 0 ? <BulletList items={project.skillsShown} muted={muted} accentBg={accentBg} /> : null,
            },
          ];
          const visibleSections = sections.filter((s) => s.content !== null);

          return visibleSections.map((s, i) => (
            <DetailBlock key={s.title} title={s.title} muted={muted} last={i === visibleSections.length - 1}>
              {s.content}
            </DetailBlock>
          ));
        })()}
      </div>
    </div>
  );
}
