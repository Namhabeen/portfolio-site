import { ArrowDown } from 'lucide-react';
import Skeleton from './Skeleton.jsx';

/**
 * Landing section: headline, intro copy, and primary calls to action.
 *
 * The intro paragraph prefers the `heroCopy` sentence returned by the
 * backend (set per company via the `?company=` slug) and falls back to a
 * generic description while that data is loading or absent. `heroCopy` is
 * rendered as raw HTML (via `dangerouslySetInnerHTML`) rather than escaped
 * text, so the site owner can embed inline styling (e.g. `<span
 * style="color:...">`) directly in the Notion field; `\n` is still honored
 * as a line break.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {string | null} props.heroCopy - Company-specific Hero subcopy from the backend, if any. May contain HTML.
 * @param {string | null} [props.badgeText] - Company-specific badge text from the backend, if any; falls back to a generic title.
 * @param {boolean} [props.profileHidden] - Company-specific override (set per company via the `?company=` slug) that hides the profile photo and its rotated border decoration. When true, the intro text expands to fill the full section width and every element (badge, headline, name, subcopy, CTA buttons) is bumped up about half a step on Tailwind's type scale (arbitrary px values, since a full step felt too large), preserving their relative proportions to the default layout.
 * @param {boolean} [props.loading] - Whether portfolio data is still being fetched. While true, a gray pulsing skeleton is shown in place of the badge/name/subcopy/CTA buttons; once data is ready, the skeleton fades out and the real content fades in over the same 0.3s. The photo column isn't skeleton-placeholdered at all — see `showPhoto` — it simply isn't rendered until loading finishes and `profileHidden` is known, then fades/scales in if applicable.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Hero({ lang, heroCopy, badgeText, profileHidden, loading, theme }) {
  const { dark, muted, border, accent, accentBg, accentBgHover, accentTextOn, tagBg } = theme;

  // Whether the photo column should occupy space at all. Resolved only once
  // loading finishes (not "loading || !profileHidden") so the layout goes
  // straight to its final shape in one step, instead of first reserving a
  // round skeleton placeholder that then has to disappear if this turns out
  // to be a `profileHidden` company — that appear-then-vanish felt emptier
  // than never showing it in the first place.
  const showPhoto = !loading && !profileHidden;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative">
      <div
        className={`max-w-6xl w-full mx-auto grid grid-cols-1 gap-12 items-center ${
          showPhoto ? 'lg:grid-cols-5' : ''
        }`}
      >
        <div className={`order-2 lg:order-1 space-y-6 ${showPhoto ? 'lg:col-span-3' : ''}`}>
          {/* Badge */}
          <div className="relative inline-block">
            <span
              className={`inline-block font-medium rounded-full ${tagBg} ${accent} transition-opacity duration-300 ${
                profileHidden ? 'text-[15px] px-3.5 py-1' : 'text-sm px-3 py-1'
              } ${loading ? 'opacity-0' : 'opacity-100'}`}
            >
              {badgeText || 'Product Engineer · AX Engineer'}
            </span>
            <Skeleton
              dark={dark}
              className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                loading ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Name headline */}
          <div className="relative">
            <h1
              className={`font-bold tracking-tight leading-[1.1] transition-opacity duration-300 ${
                profileHidden ? 'text-[42px] md:text-[66px]' : 'text-4xl md:text-6xl'
              } ${loading ? 'opacity-0' : 'opacity-100'}`}
            >
              {lang === 'ko' ? (
                <>
                  안녕하세요,{' '}
                  <span
                    className={`hero-name-text leading-none ${
                      profileHidden ? 'text-[54px] md:text-[84px]' : 'text-5xl md:text-7xl'
                    } ${accent} ${loading ? '' : 'is-visible'}`}
                  >
                    남하빈
                  </span>
                  입니다.
                </>
              ) : (
                <>
                  Hi, I'm{' '}
                  <span
                    className={`hero-name-text leading-none ${
                      profileHidden ? 'text-[54px] md:text-[84px]' : 'text-5xl md:text-7xl'
                    } ${accent} ${loading ? '' : 'is-visible'}`}
                  >
                    Habeen Nam
                  </span>
                </>
              )}
            </h1>
            <Skeleton
              dark={dark}
              className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                loading ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Subcopy */}
          <div className={`relative ${profileHidden ? 'max-w-2xl' : 'max-w-xl'}`}>
            <p
              className={`${
                profileHidden ? 'text-[17px] md:text-[19px]' : 'text-base md:text-lg'
              } ${muted} leading-relaxed transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            >
              {heroCopy ? (
                // heroCopy comes from the Notion-backed backend (site owner's own
                // content, not arbitrary user input), so raw HTML the owner types
                // in for inline styling (e.g. <span style="color:...">) is
                // rendered as-is rather than escaped. `\n` is still honored as a
                // line break for parity with the plain-text authoring flow.
                <span dangerouslySetInnerHTML={{ __html: heroCopy.replace(/\n/g, '<br />') }} />
              ) : lang === 'ko' ? (
                <>
                  현업의 반복 업무와 분산된 데이터를 발견해, 자동화·연동 시스템으로
                  <br />
                  직접 설계하고 구축하는 백엔드 기반 엔지니어입니다.
                </>
              ) : (
                'A backend engineer who finds repetitive, fragmented work in the field and turns it into automated, integrated systems — end to end.'
              )}
            </p>
            <Skeleton
              dark={dark}
              className={`absolute inset-0 rounded transition-opacity duration-300 ${
                loading ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="relative inline-block">
              <a
                href="#projects"
                className={`${
                  profileHidden ? 'px-[26px] py-[13px] text-[17px]' : 'px-6 py-3'
                } ${accentBg} ${accentTextOn} rounded-md font-medium ${accentBgHover} transition-all hover:-translate-y-0.5 inline-block transition-opacity duration-300 ${
                  loading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {lang === 'ko' ? '프로젝트 보기' : 'View Projects'}
              </a>
              <Skeleton
                dark={dark}
                className={`absolute inset-0 rounded-md transition-opacity duration-300 ${
                  loading ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            <div className="relative inline-block">
              <a
                href="#about"
                className={`${
                  profileHidden ? 'px-[26px] py-[13px] text-[17px]' : 'px-6 py-3'
                } rounded-md font-medium border ${border} hover:bg-white/5 transition-all hover:-translate-y-0.5 inline-block transition-opacity duration-300 ${
                  loading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {lang === 'ko' ? '연락하기' : 'Contact Me'}
              </a>
              <Skeleton
                dark={dark}
                className={`absolute inset-0 rounded-md transition-opacity duration-300 ${
                  loading ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>
        </div>
        {showPhoto && (
          <div className="hero-photo-in order-1 lg:order-2 lg:col-span-2 aspect-square max-w-xs mx-auto relative">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/profile.png`}
                alt="남하빈 프로필 사진"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
      <a href="#about" className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center ${muted} hover:${accent} transition-colors`}>
        <ArrowDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
