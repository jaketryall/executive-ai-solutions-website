import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, nextProject } from "@/lib/work";
import { CaseStudy } from "@/components/work/case-study";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.client} | Work | Executive AI Solutions`;
  return {
    title,
    description: project.lede,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.lede,
      url: `https://executiveaisolutions.com/work/${project.slug}`,
      siteName: "Executive AI Solutions",
      type: "article",
      images: [{ url: project.cover.src }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudy project={project} next={nextProject(slug)} />;
}
