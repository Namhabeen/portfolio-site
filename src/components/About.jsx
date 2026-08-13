import { Fragment } from 'react';
import { Building2, Download, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * "About" section: a short bio, career/contact cards, and a resume download CTA.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {string | null} [props.positioning] - Company-specific positioning sentence from the backend, if any; falls back to a generic intro.
 * @param {string | null} props.resumeUrl - Company-specific resume URL from the backend, if any.
 * @param {string | null} [props.portfolioUrl] - Company-specific portfolio PDF URL from the backend, if any. When absent, no portfolio download button is rendered.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function About({ lang, positioning, resumeUrl, portfolioUrl, theme }) {
  const { dark, muted, border, cardBg, sectionAlt, accentBg, accentBgHover, accentTextOn } = theme;
  const [ref, visible] = useScrollReveal();

  // "주 버튼"(메인컬러 필박스) 스타일. 이력서 버튼은 항상 이 스타일이고,
  // 포트폴리오 버튼은 이력서 버튼이 없을 때(단독 노출)만 이 스타일을 가져다 쓴다.
  const primaryButtonClass = `inline-flex items-center gap-2 px-8 py-4 ${accentBg} ${accentTextOn} rounded-full font-medium ${accentBgHover} transition-all hover:-translate-y-0.5`;
  const secondaryButtonClass = `inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium border transition-all hover:-translate-y-0.5 ${
    dark ? `${border} hover:bg-white/5` : 'bg-white text-gray-700 border-gray-300 hover:opacity-90'
  }`;

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
        <p className={`${muted} leading-relaxed mb-4 break-keep`}>
          {positioning ? (
            positioning.split('\n').map((line, i, lines) => (
              <Fragment key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </Fragment>
            ))
          ) : lang === 'ko' ? (
            <>
              커머스·제조·LMS 환경에서 반복 업무와 분산된 데이터의 문제를 찾아 시스템과 자동화 구조로 전환해왔습니다.
              <br />
              현업의 업무 흐름을 이해하고, 요구사항 분석부터 설계·개발·배포·운영까지 End-to-End로 수행하며 지속적으로 개선합니다.
            </>
          ) : (
            <>
              I find problems in repetitive tasks and fragmented data across commerce, manufacturing, and LMS environments, and turn them into systems and automated workflows.
              <br />
              By understanding how the work actually happens, I own the full loop end-to-end — from requirements analysis to design, development, deployment, and operations — carrying it through to lasting adoption and continuous improvement.
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

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={primaryButtonClass}
          >
            <Download size={18} />
            {lang === 'ko' ? '이력서 다운로드' : 'Download Resume'}
          </a>
        )}
        {portfolioUrl && (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={resumeUrl ? secondaryButtonClass : primaryButtonClass}
          >
            <FileText size={18} />
            {lang === 'ko' ? '포트폴리오 PDF' : 'Download Portfolio PDF'}
          </a>
        )}
      </div>
    </section>
  );
}
