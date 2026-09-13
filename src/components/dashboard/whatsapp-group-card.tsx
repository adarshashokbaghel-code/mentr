import { cn } from "@/lib/utils";

export const MENTR_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/FUUpqvQeuxY3oaUV4E1WkT?mode=gi_t";

const DEFAULT_DESCRIPTION =
  "Dear mentors and tutors — daily updates, new postings and quick answers from the Mentr team.";

function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.199.198-.396.223-.694.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.347-.446.52-.669.174-.223.232-.375.348-.573.116-.198.058-.371-.03-.52-.087-.148-.652-1.57-.893-2.14-.213-.505-.43-.5-.588-.5-.153 0-.33-.014-.508-.014-.177 0-.464.066-.707.331-.242.265-.924.898-.924 2.19 0 1.29.94 2.538 1.07 2.71.132.174 1.822 2.762 4.415 3.876.617.266 1.098.425 1.474.545.618.196 1.18.169 1.625.102.494-.074 1.523-.622 1.738-1.223.215-.6.215-1.115.15-1.223-.064-.107-.24-.174-.5-.322zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function WhatsappGroupCard({
  description = DEFAULT_DESCRIPTION,
  className,
}: {
  description?: string;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-xl border border-hairline bg-white", className)}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sage-wash text-sage">
          <WhatsappGlyph className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-sm font-bold text-ink">Official WhatsApp group</h2>
            <span className="rounded-md bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
              Free
            </span>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
        </div>

        <a
          href={MENTR_WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-sage px-3 text-[11px] font-semibold text-white transition hover:opacity-90 max-sm:w-full max-sm:justify-center"
        >
          <WhatsappGlyph className="h-3 w-3" />
          Join group
        </a>
      </div>
    </section>
  );
}
