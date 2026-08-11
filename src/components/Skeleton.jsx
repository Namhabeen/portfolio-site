/**
 * A single gray placeholder block with a left-to-right shimmer sweep,
 * used while portfolio data is still loading. Caller supplies sizing,
 * rounding, and positioning via `className` (e.g. `h-4 w-20 rounded` for
 * an in-flow block, or `absolute inset-0 rounded-lg` to overlay a sibling
 * of a `relative` parent) — `position: relative` isn't set by default here
 * so callers can use `absolute` instead without a conflict; this component
 * only owns the base color and the shimmer overlay.
 *
 * @param {object} props
 * @param {string} [props.className] - Sizing/rounding/position utility classes for the block itself.
 * @param {boolean} props.dark - Whether dark mode is active, from the current theme.
 * @returns {JSX.Element}
 */
export default function Skeleton({ className = '', dark }) {
  return (
    <div className={`overflow-hidden ${dark ? 'bg-gray-700' : 'bg-gray-200'} ${className}`}>
      <div
        className={`skeleton-shimmer absolute inset-0 bg-gradient-to-r ${
          dark ? 'from-transparent via-white/10 to-transparent' : 'from-transparent via-white/60 to-transparent'
        }`}
      />
    </div>
  );
}
