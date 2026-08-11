import { Fragment } from 'react';
import { ArrowDown } from 'lucide-react';

/**
 * Landing section: headline, intro copy, and primary calls to action.
 *
 * The intro paragraph prefers the `heroCopy` sentence returned by the
 * backend (set per company via the `?company=` slug) and falls back to a
 * generic description while that data is loading or absent.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {string | null} props.heroCopy - Company-specific Hero subcopy from the backend, if any.
 * @param {string | null} [props.badgeText] - Company-specific badge text from the backend, if any; falls back to a generic title.
 * @param {boolean} [props.loading] - Whether portfolio data is still being fetched. While true, the badge, the accented name, and the subcopy all stay invisible (but still laid out) so a company-specific override never flashes the generic default first — everything reveals together once data is ready.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Hero({ lang, heroCopy, badgeText, loading, theme }) {
  const { dark, muted, border, accent, accentBg } = theme;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-6">
          <span
            className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${dark ? 'bg-blue-500/10' : 'bg-blue-50'} ${accent} transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {badgeText || 'Product Engineer · AX Engineer'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            {lang === 'ko' ? (
              <>
                안녕하세요,{' '}
                <span className="hero-name-mask">
                  <span className={`hero-name-text ${accent} ${loading ? '' : 'is-visible'}`}>남하빈</span>
                </span>
                입니다
              </>
            ) : (
              <>
                Hi, I'm{' '}
                <span className="hero-name-mask">
                  <span className={`hero-name-text ${accent} ${loading ? '' : 'is-visible'}`}>Habeen Nam</span>
                </span>
              </>
            )}
          </h1>
          <p
            className={`text-base md:text-lg ${muted} max-w-xl leading-relaxed transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {heroCopy
              ? heroCopy.split('\n').map((line, i, lines) => (
                  <Fragment key={i}>
                    {line}
                    {i < lines.length - 1 && <br />}
                  </Fragment>
                ))
              : lang === 'ko'
              ? (
                  <>
                    현업의 반복 업무와 분산된 데이터를 발견해, 자동화·연동 시스템으로
                    <br />
                    직접 설계하고 구축하는 백엔드 기반 엔지니어입니다.
                  </>
                )
              : 'A backend engineer who finds repetitive, fragmented work in the field and turns it into automated, integrated systems — end to end.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#projects" className={`px-6 py-3 ${accentBg} text-white rounded-md font-medium hover:opacity-90 transition-all hover:-translate-y-0.5`}>
              {lang === 'ko' ? '프로젝트 보기' : 'View Projects'}
            </a>
            <a href="#about" className={`px-6 py-3 rounded-md font-medium border ${border} hover:bg-white/5 transition-all hover:-translate-y-0.5`}>
              {lang === 'ko' ? '연락하기' : 'Contact Me'}
            </a>
          </div>
        </div>
        <div className="lg:col-span-2 aspect-square max-w-sm mx-auto relative">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}images/profile.png`}
              alt="남하빈 프로필 사진"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <a href="#about" className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center ${muted} hover:${accent} transition-colors`}>
        <ArrowDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
