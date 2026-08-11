/**
 * Thin indeterminate progress bar fixed to the very top of the viewport,
 * shown while portfolio data is loading. There's no real progress
 * fraction to report (the fetch is a single request), so the fill sweeps
 * left-to-right on a loop instead of tracking an actual percentage.
 *
 * @param {object} props
 * @param {boolean} props.loading - Whether portfolio data is still being fetched.
 * @returns {JSX.Element}
 */
export default function LoadingBar({ loading }) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-[3px] overflow-hidden pointer-events-none transition-opacity duration-200 ${
        loading ? 'opacity-100' : 'opacity-0'
      }`}
      role="progressbar"
      aria-label="로딩 중"
      aria-hidden={!loading}
    >
      <div className="loading-bar-fill absolute top-0 bottom-0 w-2/5 rounded-full bg-blue-500" />
    </div>
  );
}
