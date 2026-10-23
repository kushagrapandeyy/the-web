import { ArrowUpRight } from "lucide-react";

type Props = { tags?: string[]; role?: string; date?: string; status?: string; url?: string; repository?: string; slug?: string; category?: string };

export function ProjectSidebar({ tags = [], role, date, status, url, repository, slug, category }: Props) {
  const websiteLabel = slug === "firmlyticSolutions" ? "Company website" : slug === "Capstone" ? "ASU showcase" : slug === "sspandey" ? "Firm website" : "Website";
  return (
    <aside className="border-b border-paper/10 pb-8 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-8">
      <div className="lg:sticky lg:top-28">
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-1">
          {[["Role", role], ["Status", status], ["Date", date ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date)) : undefined]].map(([label, value]) => value && <div key={label}><dt className="text-xs text-secondary">{label}</dt><dd className="mt-2 text-sm leading-6 text-paper">{value}</dd></div>)}
          {tags.length > 0 && <div><dt className="text-xs text-secondary">{category === "design" ? "Tools & focus" : "Stack"}</dt><dd className="mt-2 text-sm leading-7 text-secondary">{tags.join(", ")}</dd></div>}
        </dl>
        {(url || repository) && <div className="mt-6 flex flex-wrap gap-x-5 lg:flex-col lg:items-start">
          {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-link">{websiteLabel}<ArrowUpRight size={15} aria-hidden="true" /></a>}
          {repository && <a href={`https://github.com/${repository}`} target="_blank" rel="noopener noreferrer" className="text-link">Source code<ArrowUpRight size={15} aria-hidden="true" /></a>}
        </div>}
      </div>
    </aside>
  );
}
