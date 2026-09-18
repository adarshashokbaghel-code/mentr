/** Lightweight analytics for Mentr Tools (gtag). Never send PII. */

type ToolEvent =
  | "tool_open"
  | "tool_viewed"
  | "tool_started"
  | "tool_generated"
  | "tool_downloaded"
  | "tool_printed"
  | "tool_reset"
  | "tool_complete"
  | "tool_cta_click"
  | "tool_error";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackToolEvent(
  event: ToolEvent,
  params: { slug: string; cta?: string; detail?: string },
) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, {
      tool_name: params.slug,
      tool_slug: params.slug,
      cta: params.cta,
      detail: params.detail,
    });
  } catch {
    /* ignore */
  }
}
