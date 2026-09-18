"use client";

import {
  ToolImagesToPdf,
  ToolPdfCompress,
  ToolPdfMerge,
  ToolPdfOrganize,
  ToolPdfSplit,
} from "@/components/tools/tools-pdf-apps";
import {
  ToolAnswerKeyGenerator,
  ToolCgpaCalculator,
  ToolLessonPlanGenerator,
  ToolQuestionPaperGenerator,
  ToolWorksheetGenerator,
} from "@/components/tools/tools-generator-apps";
import {
  ToolNameTags,
  ToolPdfExtractText,
  ToolStudyTimetable,
  ToolWordCounter,
} from "@/components/tools/tools-study-apps";
import { ToolBackgroundRemover } from "@/components/tools/tools-bg-remover-app";

export function ToolApp({ slug }: { slug: string }) {
  switch (slug) {
    case "background-remover":
      return <ToolBackgroundRemover />;
    case "pdf-merge":
      return <ToolPdfMerge />;
    case "pdf-split":
      return <ToolPdfSplit />;
    case "pdf-compress":
      return <ToolPdfCompress />;
    case "images-to-pdf":
      return <ToolImagesToPdf />;
    case "pdf-organize":
      return <ToolPdfOrganize />;
    case "pdf-extract-text":
      return <ToolPdfExtractText />;
    case "worksheet-generator":
      return <ToolWorksheetGenerator />;
    case "question-paper-generator":
      return <ToolQuestionPaperGenerator />;
    case "answer-key-generator":
      return <ToolAnswerKeyGenerator />;
    case "lesson-plan-generator":
      return <ToolLessonPlanGenerator />;
    case "cgpa-calculator":
      return <ToolCgpaCalculator />;
    case "name-tags":
      return <ToolNameTags />;
    case "word-counter":
      return <ToolWordCounter />;
    case "study-timetable":
      return <ToolStudyTimetable />;
    default:
      return (
        <p className="text-[14px] font-semibold text-muted">Tool not found.</p>
      );
  }
}
