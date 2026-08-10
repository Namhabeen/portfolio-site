import { ExternalLink } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * Text-only summary card for a project, with no image or placeholder
 * visual. Used for the "Education & Other Experience" section, where the
 * grid is small and uniform enough that a visual header isn't needed.
 * Opens the shared project detail modal when clicked, same as
 * `ProjectCard` — the modal still shows an image there if one is mapped.
 *
 * @param {object} props
 * @param {object} props.project - A project record as returned by the Apps Script backend (see `apps-script/Code.gs`).
 * @param {number} [props.index] - Position within the grid, used to stagger the scroll-reveal entrance.
 * @param {() => void} props.onSelect - Called when the card is clicked.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function SimpleProjectCard({ project, index = 0, onSelect, theme }) {
  const { dark, muted, border, cardBg, accent } = theme;
  const [ref, visible] = useScrollReveal();

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
        className={`group w-full h-full text-left rounded-xl border ${border} ${cardBg} p-6 flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none ${
          dark ? 'hover:border-white/20' : 'hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs ${muted}`}>{project.company}</span>
          <ExternalLink
            size={14}
            className={`${muted} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{project.cardName}</h3>
        <p className={`text-sm ${muted} mb-4`}>{project.summary}</p>
        <div className="flex flex-wrap gap-2 mt-6">
          {(project.jobTags || []).map((tag) => (
            <span key={tag} className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-blue-500/10' : 'bg-blue-50'} ${accent}`}>
              {tag}
            </span>
          ))}
        </div>
      </button>
    </div>
  );
}
