import { LmsBuildArena } from "@/components/learn/lms/build/lms-build-arena";
import { getBuildMission } from "@/lib/learn-build-missions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ missionId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { missionId } = await params;
  const mission = getBuildMission(missionId);
  return {
    title: mission
      ? `${mission.title} — Build Arena`
      : "Build mission — Mentr Learn",
    robots: { index: false, follow: false },
  };
}

export default async function LearnBuildMissionPage({ params }: Props) {
  const { missionId } = await params;
  const mission = getBuildMission(missionId);
  if (!mission || !mission.playable) notFound();
  return <LmsBuildArena mission={mission} />;
}
