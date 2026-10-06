import { PyProjectWorkspace } from "@/components/learn-python/lms/py-final";
import { getPyProject } from "@/lib/python-lms/projects";
import type { Metadata } from "next";

type Props = { params: Promise<{ project: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await params;
  const p = getPyProject(project);
  return { title: p ? `Project ${p.number}: ${p.title} | Learn Python` : "Project | Learn Python" };
}

export default async function LearnPythonProjectPage({ params }: Props) {
  const { project } = await params;
  return <PyProjectWorkspace id={project} />;
}
