import { PY_LESSON_INDEX, getPyLesson } from "@/lib/python-lms";

let awardable = 0;
let total = 0;
for (const l of PY_LESSON_INDEX) {
  const lesson = getPyLesson(l.slug);
  if (!lesson) continue;
  const n = lesson.examples.filter((e) => e.type === "trace" || (e.type === "playground" && e.goal)).length;
  awardable += n;
  total += lesson.examples.length;
  console.log(l.slug, "awardable", n, "of", lesson.examples.length);
}
console.log("TOTAL awardable", awardable, "of", total);
