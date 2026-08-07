import { ArrowDown } from 'lucide-react';

/**
 * Landing section: headline, intro copy, and primary calls to action.
 *
 * The intro paragraph prefers the `positioning` sentence returned by the
 * backend (set per company via the `?c=` slug) and falls back to a
 * generic description while that data is loading or absent.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {string | null} props.positioning - Company-specific positioning sentence from the backend, if any.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Hero({ lang, positioning, theme }) {
  const { dark, muted, border, accent, accentBg } = theme;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-6">
          <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${dark ? 'bg-blue-500/10' : 'bg-blue-50'} ${accent}`}>
            Product Engineer &middot; AX Engineer
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            {lang === 'ko' ? (
              <>안녕하세요, <span className={accent}>남하빈</span>입니다</>
            ) : (
              <>Hi, I'm <span className={accent}>Habeen Nam</span></>
            )}
          </h1>
          <p className={`text-lg md:text-xl ${muted} max-w-xl leading-relaxed`}>
            {positioning
              ? positioning
              : lang === 'ko'
              ? '현업의 반복 업무와 분산된 데이터를 발견해, 자동화·연동 시스템으로 직접 설계하고 구축하는 백엔드 기반 엔지니어입니다.'
              : 'A backend engineer who finds repetitive, fragmented work in the field and turns it into automated, integrated systems — end to end.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#projects" className={`px-6 py-3 ${accentBg} text-white rounded-md font-medium hover:opacity-90 transition-all hover:-translate-y-0.5`}>
              {lang === 'ko' ? '프로젝트 보기' : 'View Projects'}
            </a>
            <a href="#contact" className={`px-6 py-3 rounded-md font-medium border ${border} hover:bg-white/5 transition-all hover:-translate-y-0.5`}>
              {lang === 'ko' ? '연락하기' : 'Contact Me'}
            </a>
          </div>
        </div>
        <div className="lg:col-span-2 aspect-square max-w-sm mx-auto relative">
          <div className={`absolute inset-0 border-2 rounded-2xl -m-2 -rotate-3 ${dark ? 'border-blue-500/20' : 'border-blue-200'}`} />
          <div className={`absolute inset-0 border-2 rounded-2xl -m-2 rotate-3 ${dark ? 'border-blue-500/10' : 'border-blue-100'}`} />
          <div className={`relative w-full h-full rounded-2xl flex items-center justify-center text-6xl font-bold ${dark ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400' : 'bg-gradient-to-br from-blue-50 to-white text-blue-500'} border ${border}`}>
            HN
          </div>
        </div>
      </div>
      <a href="#about" className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center ${muted} hover:${accent} transition-colors`}>
        <ArrowDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
