import { useEffect, useMemo, useState } from 'react';
import { usePortfolioData } from './api/usePortfolioData.js';
import About from './components/About.jsx';
import EducationExperience from './components/EducationExperience.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import LoadingBar from './components/LoadingBar.jsx';
import ProjectDetailModal from './components/ProjectDetailModal.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import { getTheme } from './theme.js';

/**
 * Root component of the portfolio site.
 *
 * Owns the UI-level state (dark mode, language, mobile menu, and the
 * currently open project modal) and delegates data fetching to
 * `usePortfolioData`, which talks to the Apps Script backend described in
 * `apps-script/Code.gs`.
 *
 * @returns {JSX.Element}
 */
export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('ko');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const { projects, positioning, resumeUrl, badgeText, pageTitle, portfolioUrl, heroCopy, featuredIds, loading, error } = usePortfolioData();
  const theme = getTheme(dark);

  const mainProjects = useMemo(() => projects.filter((p) => p.section !== '기타경험'), [projects]);
  const otherExperienceProjects = useMemo(() => projects.filter((p) => p.section === '기타경험'), [projects]);

  useEffect(() => {
    if (!pageTitle) return;
    document.title = pageTitle;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
  }, [pageTitle]);

  return (
    <div
      className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-300`}
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <LoadingBar loading={loading} />

      <Header
        dark={dark}
        setDark={setDark}
        lang={lang}
        setLang={setLang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        theme={theme}
      />

      <Hero lang={lang} heroCopy={heroCopy} badgeText={badgeText} loading={loading} theme={theme} />
      <About lang={lang} positioning={positioning} resumeUrl={resumeUrl} portfolioUrl={portfolioUrl} theme={theme} />
      <Skills lang={lang} theme={theme} />
      <Projects
        lang={lang}
        projects={mainProjects}
        featuredIds={featuredIds}
        loading={loading}
        error={error}
        onSelectProject={setActiveProject}
        theme={theme}
      />
      {!loading && !error && otherExperienceProjects.length > 0 && (
        <EducationExperience
          lang={lang}
          projects={otherExperienceProjects}
          onSelectProject={setActiveProject}
          theme={theme}
        />
      )}
      <Footer lang={lang} theme={theme} />

      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          lang={lang}
          onClose={() => setActiveProject(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
