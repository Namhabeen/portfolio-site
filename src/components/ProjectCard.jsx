import { ExternalLink } from 'lucide-react';

/**
 * Clickable summary card for a single project. Opens the project's detail
 * modal when clicked.
 *
 * @param {object} props
 * @param {object} props.project - A project record as returned by the Apps Script backend (see `apps-script/Code.gs`).
 * @param {() => void} props.onSelect - Called when the card is clicked.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function ProjectCard({ project, onSelect, theme }) {
  const { dark, muted, border, cardBg, accent } = theme;

  return (
    <button
      onClick={onSelect}
      className={`group text-left rounded-xl border ${border} ${cardBg} p-6 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs ${muted}`}>{project.company}</span>
        <ExternalLink size={14} className={`${muted} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{project.cardName}</h3>
      <p className={`text-sm ${muted} mb-4 flex-grow`}>{project.summary}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {(project.jobTags || []).map((tag) => (
          <span key={tag} className={`text-xs px-2 py-1 rounded-full ${dark ? 'bg-blue-500/10' : 'bg-blue-50'} ${accent}`}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
