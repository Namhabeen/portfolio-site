import { Building2, Download, Github, Linkedin, Mail } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * "About" section: a short bio, career/contact cards, and a resume download CTA.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {string | null} props.resumeUrl - Company-specific resume URL from the backend, if any.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function About({ lang, resumeUrl, theme }) {
  const { muted, border, cardBg, sectionAlt, accentBg } = theme;
  const resumeHref = resumeUrl || `${import.meta.env.BASE_URL}resume/남하빈_이력서.pdf`;
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="about"
      ref={ref}
      className={`py-24 px-6 ${sectionAlt} transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '소개' : 'About Me'}</h2>
        <div className={`h-1 w-16 mx-auto mb-10 ${accentBg} rounded-full`} />
        <p className={`${muted} leading-relaxed mb-4`}>
          {lang === 'ko' ? (
            <>
              커머스·제조·LMS 환경에서 반복 업무와 분산된 데이터를 발견해 시스템으로 전환해왔습니다.
              <br />
              요구사항 분석부터 설계·개발·배포·운영까지 직접 수행하며, 구축한 기능이 조직의 업무 방식으로 정착하도록 만듭니다.
            </>
          ) : (
            <>
              I find repetitive tasks and fragmented data across commerce, manufacturing, and LMS environments, then turn them into systems.
              <br />
              I own the full loop from requirements to design, build, deploy, and operations — making what I build stick as part of how the team works.
            </>
          )}
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
        <div className={`rounded-xl p-6 border ${border} ${cardBg} flex flex-col`}>
          <h4 className="font-semibold mb-3 text-sm">{lang === 'ko' ? '경력' : 'Experience'}</h4>
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-lg sm:text-xl font-bold mb-3">{lang === 'ko' ? '3년 11개월' : '3 yrs 11 mo'}</p>
            <ul className={`space-y-2 text-sm ${muted}`}>
              <li className="flex items-center gap-2">
                <Building2 size={14} />
                {lang === 'ko' ? '타라티피에스 - IT지원팀 매니저' : 'Taratps - IT Support Team Manager'}
              </li>
              <li className="flex items-center gap-2">
                <Building2 size={14} />
                {lang === 'ko' ? '컴퓨존 - 전산팀 사원' : 'Compuzone - IT Team Staff'}
              </li>
              <li className="flex items-center gap-2">
                <Building2 size={14} />
                {lang === 'ko' ? '주경야독 - 개발팀 사원' : 'Jugyeongyadok - Development Team Associate'}
              </li>
            </ul>
          </div>
        </div>
        <div className={`rounded-xl p-6 border ${border} ${cardBg} flex flex-col`}>
          <h4 className="font-semibold mb-3 text-sm">{lang === 'ko' ? '연락처' : 'Contact'}</h4>
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-lg sm:text-xl font-bold mb-3">서울특별시 은평구</p>
            <ul className={`space-y-2 text-sm ${muted}`}>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <a href="mailto:habing1104@gmail.com" className="hover:underline">
                  habing1104@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Github size={14} />
                <a href="https://github.com/Namhabeen" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  github.com/Namhabeen
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin size={14} />
                <a href="https://www.linkedin.com/in/habeen/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  linkedin.com/in/habeen
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <a
          href={resumeHref}
          download
          className={`inline-flex items-center gap-2 px-8 py-4 ${accentBg} text-white rounded-full font-medium hover:opacity-90 transition-all hover:-translate-y-0.5`}
        >
          <Download size={18} />
          {lang === 'ko' ? '이력서 다운로드' : 'Download Resume'}
        </a>
      </div>
    </section>
  );
}
