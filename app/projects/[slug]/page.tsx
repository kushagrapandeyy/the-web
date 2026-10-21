import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "../../components/mdx";
import { Header } from "./header";
import { ReportView } from "./view";
import { ProjectSidebar } from "./sidebar";
import { Reveal } from "../../components/reveal";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return allProjects.filter(p => p.published).map(p => ({ slug: p.slug }));
}
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const project = allProjects.find(p => p.slug === slug && p.published);
  if (!project) notFound();
  return (
    <>
      <Header project={project} />
      <ReportView slug={project.slug} />
      <main id="main-content" className="page-width grid grid-cols-1 gap-10 pb-24 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-16">
        <Reveal className="lg:order-2"><ProjectSidebar {...project} /></Reveal>
        <article className="min-w-0 lg:order-1"><Mdx code={project.body.code} /></article>
      </main>
    </>
  );
}
