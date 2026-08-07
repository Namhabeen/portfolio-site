import { useState } from 'react';
import { usePortfolioData } from './api/usePortfolioData.js';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
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
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState('ko');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const { projects, positioning, loading, error } = usePortfolioData();
  const theme = getTheme(dark);

  return (
    <div
      className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-300`}
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
      `}</style>

      <Header
        dark={dark}
        setDark={setDark}
        lang={lang}
        setLang={setLang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        theme={theme}
      />

      <Hero lang={lang} positioning={positioning} theme={theme} />
      <About lang={lang} theme={theme} />
      <Skills lang={lang} theme={theme} />
      <Projects
        lang={lang}
        projects={projects}
        loading={loading}
        error={error}
        onSelectProject={setActiveProject}
        theme={theme}
      />
      <Contact lang={lang} theme={theme} />
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
