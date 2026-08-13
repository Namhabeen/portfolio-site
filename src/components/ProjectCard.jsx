import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { getProjectImageUrl } from '../data/projectImages.js';

/**
 * Clickable summary card for a single project. Opens the project's detail
 * modal when clicked.
 *
 * The card's top visual is, in priority order: a locally-hosted image
 * mapped by `notionId` (`PROJECT_IMAGES`), a Notion-sourced category/keyword
 * placeholder (`project.placeholderCategory` / `project.placeholderKeywords`),
 * or nothing at all if neither is present. `project.imageUrl` (the Notion
 * "이미지" field) is not used yet — see `src/data/projectImages.js`.
 *
 * @param {object} props
 * @param {object} props.project - A project record as returned by the Apps Script backend (see `apps-script/Code.gs`).
 * @param {number} [props.index] - Position within the project grid, used to stagger the scroll-reveal entrance.
 * @param {() => void} props.onSelect - Called when the card is clicked.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function ProjectCard({ project, index = 0, onSelect, theme }) {
  const { dark, text, muted, border, cardBg, accent, tagBg } = theme;
  const [ref, visible] = useScrollReveal();
  const [imgError, setImgError] = useState(false);

  const localImageUrl = getProjectImageUrl(project.notionId);
  const hasImage = Boolean(localImageUrl) && !imgError;
  const hasPlaceholder = !hasImage && Boolean(project.placeholderCategory);
  const showVisual = hasImage || hasPlaceholder;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${Math.min(index, 10) * 70}ms` : '0ms' }}
      className={`transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <button
        onClick={onSelect}
        className={`group w-full h-full text-left rounded-xl border ${border} ${cardBg} overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none ${
          dark ? 'hover:border-white/20' : 'hover:border-gray-300'
        }`}
      >
        {hasImage && (
          <img
            src={localImageUrl}
            alt={`${project.cardName} 대표 이미지`}
            onError={() => setImgError(true)}
            className="w-full h-48 object-cover object-top"
          />
        )}
        {hasPlaceholder && (
          <div
            className={`w-full h-48 flex flex-col items-center justify-center gap-1.5 px-6 text-center ${tagBg}`}
          >
            <span className={`text-xs font-semibold tracking-wide ${muted}`}>{project.placeholderCategory}</span>
            {project.placeholderKeywords && (
              <span className={`text-sm font-medium ${text}`}>{project.placeholderKeywords}</span>
            )}
          </div>
        )}
        <div className={`p-6 flex flex-col flex-grow ${showVisual ? '' : 'justify-center'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs ${muted}`}>{project.company}</span>
            <ExternalLink
              size={14}
              className={`${muted} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">{project.cardName}</h3>
          <p className={`text-sm ${muted} mb-4 ${showVisual ? 'flex-grow' : ''}`}>{project.summary}</p>
          <div className={`flex flex-wrap gap-2 ${showVisual ? 'mt-auto' : 'mt-6'}`}>
            {(project.jobTags || []).map((tag) => (
              <span key={tag} className={`text-xs px-2 py-1 rounded-full ${tagBg} ${accent}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
}
