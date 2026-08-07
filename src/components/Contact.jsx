import { Github, Linkedin, Mail } from 'lucide-react';

/**
 * "Contact" section with a mailto link and social profile links.
 *
 * @param {object} props
 * @param {'ko' | 'en'} props.lang - Current language.
 * @param {import('../theme.js').Theme} props.theme - Derived Tailwind class tokens.
 * @returns {JSX.Element}
 */
export default function Contact({ lang, theme }) {
  const { border, accentBg } = theme;

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{lang === 'ko' ? '연락하기' : 'Get In Touch'}</h2>
        <div className={`h-1 w-16 mx-auto mb-10 ${accentBg} rounded-full`} />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="mailto:habing1104@gmail.com" className={`flex items-center gap-2 px-6 py-3 ${accentBg} text-white rounded-md font-medium hover:opacity-90 transition-all`}>
            <Mail size={16} /> habing1104@gmail.com
          </a>
          <div className="flex gap-3">
            <a href="#" className={`p-3 rounded-full border ${border} hover:bg-white/5 transition-colors`} aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="#" className={`p-3 rounded-full border ${border} hover:bg-white/5 transition-colors`} aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
