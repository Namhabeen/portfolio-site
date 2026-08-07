import { Mail, MapPin } from 'lucide-react';

/**
 * "About" section: a short bio plus contact and experience summary cards.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function About({ lang, theme }) {
  const { muted, border, cardBg, sectionAlt, accentBg } = theme;

  return (
    <section id="about" className={`py-24 px-6 ${sectionAlt}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '소개' : 'About Me'}</h2>
        <div className={`h-1 w-16 mx-auto mb-10 ${accentBg} rounded-full`} />
        <p className={`${muted} leading-relaxed mb-4`}>
          {lang === 'ko'
            ? '커머스·제조·LMS 환경에서 반복 업무와 분산된 데이터를 발견하고, 이를 시스템과 자동화 구조로 전환해왔습니다. 요구사항 분석부터 설계·개발·배포·운영까지 전 과정을 직접 수행하며, 구축한 기능이 조직의 업무 방식으로 정착하도록 만드는 데 강점이 있습니다.'
            : 'Across commerce, manufacturing, and LMS environments, I find repetitive tasks and fragmented data, then turn them into systems and automation. I own the full loop — requirements to design, build, deploy, and operations — and focus on making what I build stick as part of how the team actually works.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-xl mx-auto text-left">
          <div className={`rounded-xl p-6 border ${border} ${cardBg}`}>
            <h4 className="font-semibold mb-3 text-sm">{lang === 'ko' ? '연락처' : 'Contact'}</h4>
            <ul className={`space-y-2 text-sm ${muted}`}>
              <li className="flex items-center gap-2"><Mail size={14} /> habing1104@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Seoul, South Korea</li>
            </ul>
          </div>
          <div className={`rounded-xl p-6 border ${border} ${cardBg}`}>
            <h4 className="font-semibold mb-3 text-sm">{lang === 'ko' ? '경력' : 'Experience'}</h4>
            <ul className={`space-y-2 text-sm ${muted}`}>
              <li>{lang === 'ko' ? '3년 11개월' : '3 yrs 11 mo'}</li>
              <li>{lang === 'ko' ? '타라티피에스 · 컴퓨존 · 주경야독' : 'Taratps · Compuzone · Jugyeongyadok'}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
