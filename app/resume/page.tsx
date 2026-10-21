import { TextReveal } from "../components/text-reveal";
import { ArrowUpRight } from "lucide-react";
import { resumeSummary, technicalSkills } from "../profile";
import { PrintButton } from "./print-button";
import { ResumeNavigation } from "./resume-navigation";
import { ResumeCaseLink, ResumeEntry, ResumeSkill } from "./resume-motion";

const experiences = [
  {
    company: "Firmlytic Solutions", title: "Founder", period: "Jan 2024 - Present", location: "New Delhi, India", href: "/projects/firmlyticSolutions",
    highlights: [
      "Founded Firmlytic Solutions and lead product direction and full-stack engineering for Sainya Mitra, a legal platform in beta with case records, case tracking, and linked client accounts.",
      "Build across React interfaces, Node.js services, Hasura data access, and AWS infrastructure. Integrated Claude for document summarization, tagging, and clause extraction, with unit tests, integration tests, and manual QA; legal-workflow use remains under evaluation.",
      "Work with stakeholders to prioritize fixes and troubleshoot workflows. Configure Cloudflare WAF and least-privilege IAM, and maintain architecture and deployment documentation.",
      "Built OCR Scanflow, a separate document-processing prototype for a prospective client using open-source OCR tools.",
    ],
  },
  {
    company: "Arizona State University", title: "Production Assistant, Enterprise Brand & Strategy Management", period: "Oct 2024 - May 2026", location: "Tempe, Arizona", href: undefined,
    highlights: ["Proposed NAS-based file sharing and used Wrike, AudioNetwork, and SRT workflows to support production handoffs across the creative team."],
  },
  {
    company: "SS Pandey & Associates", title: "Junior Developer", period: "Aug 2023 - Jan 2024", location: "New Delhi, India (Hybrid)", href: "/projects/sspandey",
    highlights: [
      "Re-engineered a LAN-dependent document workflow into a Spring Boot service with JWT-secured REST APIs, enabling remote access to a legacy system.",
      "Diagnosed repeated-request latency and implemented caching across a hybrid cloud and on-premise infrastructure.",
    ],
  },
  {
    company: "CyberSophy", title: "Software Intern", period: "Jun 2023 - Aug 2023", location: "Hyderabad, India", href: undefined,
    highlights: [
      "Built a Python data-collection pipeline with Selenium and BeautifulSoup to process profiles from multiple sources.",
      "Improved MongoDB retrieval through schema design and indexing, and reduced redundant storage through deduplication.",
    ],
  },
];
const projects = [
  { name: "Lyra", role: "Primary Engineer, Sponsored ASU Capstone", period: "Aug 2025 - May 2026", href: "/projects/Capstone", detail: "Led architecture and full-stack development of a safety-focused dating platform using React, FastAPI, and PostgreSQL, deployed on Vercel and Render. Built weighted matching and AI-assisted recommendations, validated matching engines through unit, integration, and manual tests, and served as the sponsor’s primary technical contact." },
  { name: "Grocery Price Tracker", role: "Database Management Project", period: "Jan 2025 - May 2025", href: "/projects/priceTracker", detail: "Built a course-scoped monitoring and alerting system with React, Node.js, and PostgreSQL. Implemented price ingestion, basket comparisons, indexed aggregations, and caching; exercised alert behavior with simulated updates." },
  { name: "Sales Analytics Dashboard", role: "Developer & Data Analyst", period: "Sep 2024", href: "/projects/salesExplorer", detail: "Analyzed a Kaggle retail dataset with Pandas and NumPy, using regional z-tests and correlation analysis to explore seasonality. Presented findings through interactive React and D3.js visualizations." },
];
const certifications = [
  { name: "Vertex Pipelines: Qwik Start", url: "https://coursera.org/share/5a994ca1be192c787bc488cc9c37eade", detail: "Modular ML pipelines using Kubeflow on Vertex AI, including training, evaluation, and conditional deployment." },
  { name: "Introduction to Docker", url: "https://coursera.org/share/756528e70c349650df8df12d756e23d6", detail: "Containerized applications, images, registries, and container lifecycle workflows." },
];

export default function ResumePage() {
  return (
      <main id="main-content" className="resume page-width pb-24 pt-28 sm:pt-32">
        <div className="resume-heading border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-start justify-between gap-6"><TextReveal as="h1" className="page-title">Kushagra Pandey</TextReveal><PrintButton /></div>
          <p className="resume-intro mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400">{resumeSummary}</p>
          <div className="resume-contact mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
            <a className="inline-flex min-h-[44px] items-center hover:text-accent-300" href="mailto:kushagrapandeyy@gmail.com">kushagrapandeyy@gmail.com</a>
            <a className="inline-flex min-h-[44px] items-center hover:text-accent-300" href="tel:+16232816677">+1 (623) 281-6677</a>
            <span>New York, NY</span>
            <a className="inline-flex min-h-[44px] items-center hover:text-accent-300" href="https://www.linkedin.com/in/kushagra--pandey/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="inline-flex min-h-[44px] items-center hover:text-accent-300" href="https://github.com/kushagrapandeyy" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
        <div className="resume-grid mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-16">
          <ResumeNavigation />
          <div id="resume-content" className="min-w-0">
            <section id="experience" className="scroll-mt-8 lg:scroll-mt-0" aria-labelledby="experience-heading">
              <h2 id="experience-heading" className="mb-8 font-display text-2xl tracking-tight text-paper">Experience</h2>
              <div className="space-y-10 sm:space-y-12">
                {experiences.map(exp => <ResumeEntry key={exp.company}>
                  <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 print:block">
                    <p className="pt-1 text-xs leading-6 text-zinc-500 print:float-right print:mb-0 print:ml-3 print:pt-0">{exp.period}</p>
                    <div className="border-l border-white/15 pl-5 transition-colors group-hover:border-accent-300/60 group-focus-within:border-accent-300/60 sm:pl-6 print:border-0 print:pl-0">
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-100">{exp.href ? <ResumeCaseLink href={exp.href}>{exp.company}</ResumeCaseLink> : exp.company}</h3>
                      <p className="mt-2 text-sm font-medium text-accent-300">{exp.title}</p>
                      <p className="mt-1 text-xs text-zinc-400">{exp.location}</p>
                      <ul className="mt-4 list-disc space-y-3 pl-4 text-sm leading-7 text-zinc-400 marker:text-zinc-500">{exp.highlights.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
                    </div>
                  </div>
                </ResumeEntry>)}
              </div>
            </section>
            <section id="projects" className="mt-16 scroll-mt-8 border-t border-white/10 pt-10 lg:scroll-mt-0 print:border-0 print:pt-0" aria-labelledby="academic-heading">
              <h2 id="academic-heading" className="mb-8 font-display text-2xl tracking-tight text-paper">Academic projects</h2>
              <div className="space-y-10">{projects.map(project => <ResumeEntry key={project.name}>
                <div className="grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 print:block">
                  <p className="pt-1 text-xs leading-6 text-zinc-500 print:float-right print:mb-0 print:ml-3 print:pt-0">{project.period}</p>
                  <div className="border-l border-white/15 pl-5 transition-colors group-hover:border-accent-300/60 group-focus-within:border-accent-300/60 sm:pl-6 print:border-0 print:pl-0">
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-100"><ResumeCaseLink href={project.href}>{project.name}</ResumeCaseLink></h3>
                    <p className="mt-2 text-sm text-accent-300">{project.role}</p>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">{project.detail}</p>
                  </div>
                </div>
              </ResumeEntry>)}</div>
            </section>
            <aside className="mt-16 space-y-16">
              <section id="education" className="scroll-mt-8 border-t border-white/10 pt-10 lg:scroll-mt-0 print:border-0 print:pt-0" aria-labelledby="education-heading">
                <h2 id="education-heading" className="mb-8 font-display text-2xl tracking-tight text-paper">Education</h2>
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-10 print:block">
                  <div><h3 className="text-xl font-semibold tracking-tight text-zinc-100">Arizona State University</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Ira A. Fulton Schools of Engineering</p><p className="mt-4 text-sm text-accent-300">Graduated May 2026</p><p className="mt-2 text-sm text-zinc-400">GPA 3.2</p></div>
                  <div><p className="text-sm leading-6 text-zinc-300">B.S. Computer Science<br />Minor in Film and Media Production</p><p className="mt-4 text-sm leading-7 text-zinc-400">Coursework: Data Structures & Algorithms, Database Management Systems, Artificial Intelligence, Operating Systems, Human-Computer Interaction, Theoretical Computer Science.</p></div>
                </div>
              </section>
              <section id="skills" className="scroll-mt-8 border-t border-white/10 pt-10 lg:scroll-mt-0 print:border-0 print:pt-0" aria-labelledby="skills-heading">
                <h2 id="skills-heading" className="mb-8 font-display text-2xl tracking-tight text-paper">Technical skills</h2>
                <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 print:grid-cols-1 print:gap-0">{technicalSkills.map(({ label, skills }) => <ResumeSkill key={label} label={label} skills={skills} />)}</dl>
              </section>
              <section id="credentials" className="scroll-mt-8 border-t border-white/10 pt-10 lg:scroll-mt-0 print:border-0 print:pt-0" aria-labelledby="certifications-heading">
                <h2 id="certifications-heading" className="mb-8 font-display text-2xl tracking-tight text-paper">Credentials</h2>
                <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 print:block">{certifications.map(cert => <div key={cert.name} className="group"><a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 text-base font-medium text-zinc-200 transition-colors hover:text-accent-300 focus-visible:text-accent-300 print:min-h-0">{cert.name}<ArrowUpRight aria-hidden="true" size={16} className="shrink-0 text-zinc-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-within:-translate-y-0.5 group-focus-within:translate-x-0.5 print:hidden" /></a><p className="mt-1 text-xs text-accent-300">Google Cloud</p><p className="mt-3 text-sm leading-7 text-zinc-400">{cert.detail}</p></div>)}</div>
              </section>
            </aside>
          </div>
        </div>
      </main>
  );
}
