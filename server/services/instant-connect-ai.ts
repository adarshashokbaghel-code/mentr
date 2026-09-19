import { config } from "../config";
import type { MatchInput, MatchedTutorCard } from "./instant-connect-match";

type AiRerankResult = {
  orderedIds: string[];
  reasons: Record<string, string>;
};

function buildPrompt(
  input: MatchInput,
  candidates: MatchedTutorCard[],
): string {
  const need = {
    lookingFor: input.lookingFor || "either",
    subject: input.subject,
    classLevel: input.classLevel,
    board: input.board || "",
    mode: input.mode,
    location: input.location || null,
    budgetMin: input.budgetMin ?? null,
    budgetMax: input.budgetMax ?? null,
    notes: input.message || "",
  };
  const tutors = candidates.map((c) => ({
    id: c.id,
    name: c.name,
    designation: c.designation,
    subjects: c.subjects.slice(0, 8),
    levels: c.levels.slice(0, 8),
    teachingModes: c.teachingModes,
    city: c.city,
    area: c.area,
    hourlyRate: c.hourlyRate,
    ruleScore: c.score,
  }));

  return `You help Mentr Instant Connect pick the best tutors for a parent.

Parent need (JSON):
${JSON.stringify(need)}

Candidate tutors already filtered by rules (JSON array). Prefer fit to the parent's free-text notes when present — subject depth, board, level, mode, budget, location, learning goals.
${JSON.stringify(tutors)}

Return ONLY valid JSON (no markdown) with this shape:
{"orderedIds":["id1","id2","id3"],"reasons":{"id1":"≤12 words why this tutor fits"}}

Rules:
- orderedIds: best-first, length 1–3, only ids from the candidates
- Prefer tutors that match notes/subject/level; demote clear mismatches
- reasons: short parent-facing phrases, no internal scores`;
}

/**
 * Re-rank rule-scored Instant Connect candidates with OpenAI.
 * Returns null on missing key, empty notes, or any failure (caller falls back to rules).
 */
export async function rerankInstantConnectWithAi(
  input: MatchInput,
  candidates: MatchedTutorCard[],
  limit = 3,
): Promise<AiRerankResult | null> {
  const key = config.openaiApiKey;
  const notes = (input.message || "").trim();
  if (!key || !notes || candidates.length === 0) return null;

  const model = config.openaiIcModel;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a careful tutor-matching assistant. Reply with JSON only.",
          },
          { role: "user", content: buildPrompt(input, candidates) },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(
        "[ic-ai] OpenAI error",
        res.status,
        errText.slice(0, 200),
      );
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(raw) as Partial<AiRerankResult>;
    const allowed = new Set(candidates.map((c) => c.id));
    const orderedIds = (Array.isArray(parsed.orderedIds) ? parsed.orderedIds : [])
      .map(String)
      .filter((id) => allowed.has(id))
      .slice(0, limit);

    if (orderedIds.length === 0) return null;

    const reasons: Record<string, string> = {};
    const src = parsed.reasons && typeof parsed.reasons === "object"
      ? parsed.reasons
      : {};
    for (const id of orderedIds) {
      const r = String((src as Record<string, string>)[id] || "")
        .trim()
        .slice(0, 80);
      if (r) reasons[id] = r;
    }

    return { orderedIds, reasons };
  } catch (err) {
    console.warn("[ic-ai] rerank failed:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
