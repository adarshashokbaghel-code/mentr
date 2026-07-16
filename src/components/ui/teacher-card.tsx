import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Teacher, whatsappLink } from "@/lib/teachers";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Briefcase,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TeacherCardProps {
  teacher: Teacher;
  className?: string;
  showProfileLink?: boolean;
}

/** Compact card for grids / landing previews */
export function TeacherCard({
  teacher,
  className,
  showProfileLink = true,
}: TeacherCardProps) {
  const available = teacher.openSlots > 0;
  const wa = whatsappLink(teacher);

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_3px_rgba(26,35,28,0.04)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,35,28,0.08)]",
        !available && "opacity-75",
        className,
      )}
    >
      <div className="relative aspect-[16/11] bg-cream-band">
        <Image
          src={teacher.imageUrl}
          alt={teacher.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              {showProfileLink ? (
                <Link
                  href={`/teachers/${teacher.id}`}
                  className="truncate text-base font-bold text-ink hover:text-coral"
                >
                  {teacher.name}
                </Link>
              ) : (
                <h3 className="truncate text-base font-bold">{teacher.name}</h3>
              )}
              {teacher.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-sage" />
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-coral">
              {teacher.subjectLine}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-butter/70 px-1.5 py-0.5">
            <Star className="h-3 w-3 fill-coral text-coral" />
            <span className="text-xs font-bold">{teacher.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {teacher.locality}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {teacher.experienceYears} yrs
          </span>
        </p>

        <div className="mt-3">
          {available ? (
            <Badge variant="sage">{teacher.openSlots} open slots</Badge>
          ) : (
            <Badge variant="muted">Fully booked</Badge>
          )}
        </div>

        <div className="mt-4">
          {available ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="whatsapp" className="w-full rounded-xl" size="md">
                <MessageCircle className="h-4 w-4" />
                Contact
              </Button>
            </a>
          ) : (
            <Button variant="ghost" className="w-full" disabled>
              Notify when free
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
