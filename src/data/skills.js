/**
 * Skill groups rendered in the "Skills & Expertise" section.
 *
 * This content is static (unlike project data, which is fetched from
 * Notion at runtime) because it changes far less often and does not need
 * to vary per company link.
 *
 * @type {Array<{ title: string, items: string[] }>}
 */
export const SKILLS = [
  { title: 'Backend & API', items: ['PHP', 'CodeIgniter', 'Python', 'REST API', 'Webhook', 'OAuth 2.0'] },
  { title: 'Data & ETL', items: ['MySQL', 'Oracle', 'SQL Tuning', 'Data Modeling', 'ETL', 'Data Migration'] },
  { title: 'Data Processing', items: ['pandas', 'openpyxl', 'CSV/Excel', 'Crawling', 'Batch', 'Scheduler'] },
  { title: 'BI & Visualization', items: ['Power BI', 'Dashboard Design', 'KPI Definition'] },
  { title: 'Automation & AI', items: ['Apps Script', 'n8n', 'RPA', 'LLM API', 'Prompt Design'] },
  { title: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Linux', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD'] },
  { title: 'Dev Tools', items: ['Cursor', 'Claude Code', 'Git', 'Postman'] },
  { title: 'Planning & Collaboration', items: ['Requirement Analysis', 'API Spec', 'Notion', 'Figma', 'Jira'] },
];
