"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {
  ApiError,
  profileApi,
  type AvailabilitySlot,
  type FacultyProfile,
  type SocialLinks,
  type TeachingMode,
  type WeekDay,
} from "@/lib/api";
import {
  COMMON_TIMEZONES,
  detectTimezone,
  tzDisplayLabel,
} from "@/lib/timezone";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Check,
  Clock,
  Globe,
  GraduationCap,
  IndianRupee,
  Link2,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Trophy,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

/* ---------------------------------- data --------------------------------- */

const ROLES = ["Tutor", "Teacher", "Trainer", "Coach"] as const;

const COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Singapore",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Other",
] as const;

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Coding",
  "Science",
  "Hindi",
  "Kannada",
  "Social Science",
  "Exam Prep",
  "Music",
];

const LEVEL_OPTIONS = [
  "Class 1–5",
  "Class 6–8",
  "Class 9–10",
  "Class 11–12",
  "JEE / NEET",
  "College",
  "Working professionals",
];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Marathi",
  "Bengali",
];

const QUALIFICATION_OPTIONS = [
  "B.Sc / B.A / B.Com",
  "B.E / B.Tech",
  "B.Ed",
  "M.Sc / M.A / M.Com",
  "M.E / M.Tech",
  "M.Ed",
  "PhD",
  "Other",
];

const TEACHING_MODE_OPTIONS: {
  id: TeachingMode;
  label: string;
  hint: string;
}[] = [
  { id: "online", label: "Online", hint: "Video classes from anywhere" },
  { id: "student_home", label: "Student's home", hint: "You travel to the student" },
  { id: "tutor_home", label: "My place", hint: "Students come to you" },
];

const DAYS: { id: WeekDay; short: string; label: string }[] = [
  { id: "monday", short: "Mon", label: "Monday" },
  { id: "tuesday", short: "Tue", label: "Tuesday" },
  { id: "wednesday", short: "Wed", label: "Wednesday" },
  { id: "thursday", short: "Thu", label: "Thursday" },
  { id: "friday", short: "Fri", label: "Friday" },
  { id: "saturday", short: "Sat", label: "Saturday" },
  { id: "sunday", short: "Sun", label: "Sunday" },
];

const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
  icon: typeof Globe;
}[] = [
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username", icon: Link2 },
  { key: "github", label: "GitHub", placeholder: "github.com/username", icon: Link2 },
  { key: "website", label: "Website / portfolio", placeholder: "yoursite.com", icon: Globe },
  { key: "youtube", label: "YouTube channel", placeholder: "youtube.com/@channel", icon: Link2 },
  { key: "instagram", label: "Instagram", placeholder: "instagram.com/handle", icon: AtSign },
];

/** 06:00 → 22:30 in 30-minute steps */
const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 22; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

function formatTime(t: string, fmt: "12h" | "24h"): string {
  if (fmt === "24h") return t;
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/* --------------------------------- pieces -------------------------------- */

const inputCls =
  "h-11 w-full rounded-md border border-hairline bg-white px-3 text-[15px] text-ink outline-none placeholder:text-[#a8a29a] transition focus:border-ink/40";

const selectCls = cn(inputCls, "appearance-none");

function Field({
  label,
  optional,
  children,
  className,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline gap-1.5 text-[13px] font-semibold text-ink">
        {label}
        {optional && (
          <span className="text-[11px] font-medium text-muted">optional</span>
        )}
      </span>
      {children}
    </label>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-white text-ink hover:bg-cream-band",
      )}
    >
      {active && <Check className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof Globe;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-white p-4 sm:p-6">
      <header className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-wash">
          <Icon className="h-4 w-4 text-coral-dark" />
        </span>
        <div>
          <h2 className="text-[15px] font-bold text-ink">{title}</h2>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function toggleItem(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

/* ---------------------------------- page --------------------------------- */

const STEPS = [
  { label: "About you", icon: UserRound },
  { label: "Teaching", icon: GraduationCap },
  { label: "Availability", icon: CalendarDays },
  { label: "Links", icon: Link2 },
  { label: "Review", icon: BadgeCheck },
] as const;

/** ?step= slugs so the dashboard can deep-link into the edit flow */
const STEP_SLUGS = ["about", "teaching", "availability", "links", "review"] as const;

function ProfilingContent() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // About you
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState<string>("Tutor");
  const [gender, setGender] = useState<"" | "male" | "female" | "other">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState<string>("India");
  const [city, setCity] = useState("Bengaluru");
  const [area, setArea] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  // Teaching
  const [subjects, setSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [teachingModes, setTeachingModes] = useState<TeachingMode[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");

  // Availability
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [timezone, setTimezone] = useState<string>(() => detectTimezone());
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [slotDay, setSlotDay] = useState<WeekDay>("monday");
  const [slotStart, setSlotStart] = useState("16:00");
  const [slotEnd, setSlotEnd] = useState("18:00");

  // Links & extras
  const [socials, setSocials] = useState<Record<keyof SocialLinks, string>>({
    linkedin: "",
    github: "",
    website: "",
    youtube: "",
    instagram: "",
  });
  const [workplace, setWorkplace] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [introVideo, setIntroVideo] = useState("");

  // Bio
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/faculty");
      return;
    }
    // Parents have their own lightweight profiling flow
    if (user.role === "parent") router.replace("/parent/profiling");
  }, [loading, user, router]);

  // Deep link: /profiling?step=links jumps straight to a section when the
  // profile is already complete (all earlier steps are valid then).
  const canJumpSteps = Boolean(user?.profileCompleted);
  useEffect(() => {
    if (!canJumpSteps) return;
    const slug = searchParams?.get("step");
    const idx = STEP_SLUGS.indexOf(slug as (typeof STEP_SLUGS)[number]);
    if (idx > 0) setStep(idx);
  }, [canJumpSteps, searchParams]);

  useEffect(() => {
    if (!user || prefilled) return;
    setPrefilled(true);
    profileApi
      .get()
      .then(({ profile }) => {
        if (!profile) return;
        if (profile.name) setName(profile.name);
        if (profile.designation) setDesignation(profile.designation);
        if (profile.gender) setGender(profile.gender);
        if (profile.phoneNumber) setPhoneNumber(profile.phoneNumber);
        if (profile.country) setCountry(profile.country);
        if (profile.city) setCity(profile.city);
        if (profile.area) setArea(profile.area);
        if (profile.languages?.length) setLanguages(profile.languages);
        if (profile.subjects?.length) setSubjects(profile.subjects);
        if (profile.levels?.length) setLevels(profile.levels);
        if (profile.qualification) setQualification(profile.qualification);
        if (profile.experienceYears != null)
          setExperienceYears(String(profile.experienceYears));
        if (profile.teachingModes?.length) setTeachingModes(profile.teachingModes);
        if (profile.hourlyRate != null) setHourlyRate(String(profile.hourlyRate));
        if (profile.timeFormat) setTimeFormat(profile.timeFormat);
        if (profile.timezone) setTimezone(profile.timezone);
        if (profile.availability?.length) setAvailability(profile.availability);
        if (profile.workplace) setWorkplace(profile.workplace);
        if (profile.certifications?.length)
          setCertifications(profile.certifications);
        if (profile.achievements?.length) setAchievements(profile.achievements);
        if (profile.introVideo) setIntroVideo(profile.introVideo);
        if (profile.socials) {
          setSocials((prev) => ({ ...prev, ...profile.socials }));
        }
        if (profile.bio) setBio(profile.bio);
      })
      .catch(() => {});
  }, [user, prefilled]);

  // Curated zones plus whatever the browser (or a saved profile) reports,
  // so nobody ends up with a select that can't display their own zone.
  const tzOptions = useMemo(() => {
    const list = [...COMMON_TIMEZONES];
    for (const tz of [detectTimezone(), timezone]) {
      if (tz && !list.some((z) => z.id === tz)) {
        list.unshift({ id: tz, label: tz.replace(/_/g, " ") });
      }
    }
    return list;
  }, [timezone]);

  const stepError = useMemo(() => {
    if (step === 0) {
      if (!name.trim()) return "Enter your full name";
      if (!/^\+?[\d\s-]{10,15}$/.test(phoneNumber.trim()))
        return "Enter a valid WhatsApp number";
      if (!city.trim()) return "Enter your city";
      if (!area.trim()) return "Enter your area / locality";
      if (languages.length === 0) return "Pick at least one language";
    }
    if (step === 1) {
      if (subjects.length === 0) return "Pick at least one subject";
      if (levels.length === 0) return "Pick at least one level";
      if (!qualification) return "Select your highest qualification";
      const exp = Number(experienceYears);
      if (experienceYears === "" || !Number.isFinite(exp) || exp < 0 || exp > 60)
        return "Enter years of experience (0–60)";
      if (teachingModes.length === 0) return "Pick at least one teaching mode";
    }
    if (step === 2) {
      if (availability.length === 0) return "Add at least one weekly time slot";
    }
    if (step === 3) {
      for (const f of SOCIAL_FIELDS) {
        const v = socials[f.key].trim();
        if (v && !v.includes(".")) return `Enter a valid ${f.label} URL`;
      }
      const video = introVideo.trim();
      if (video && !video.includes(".")) return "Enter a valid video URL";
    }
    if (step === 4) {
      if (bio.trim().length < 30) return "Bio needs at least 30 characters";
    }
    return null;
  }, [
    step,
    name,
    phoneNumber,
    city,
    area,
    languages,
    subjects,
    levels,
    qualification,
    experienceYears,
    teachingModes,
    availability,
    socials,
    introVideo,
    bio,
  ]);

  function next() {
    if (stepError) {
      setError(stepError);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0 });
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0 });
  }

  function addSlot() {
    if (toMinutes(slotStart) >= toMinutes(slotEnd)) {
      setError("Slot end time must be after start time");
      return;
    }
    const dup = availability.some(
      (s) => s.day === slotDay && s.start === slotStart && s.end === slotEnd,
    );
    if (dup) return;
    setError("");
    setAvailability((prev) =>
      [...prev, { day: slotDay, start: slotStart, end: slotEnd }].sort(
        (a, b) =>
          DAYS.findIndex((d) => d.id === a.day) -
            DAYS.findIndex((d) => d.id === b.day) ||
          toMinutes(a.start) - toMinutes(b.start),
      ),
    );
  }

  function addCustomSubject() {
    const s = customSubject.trim();
    if (!s) return;
    if (!subjects.includes(s)) setSubjects((prev) => [...prev, s]);
    setCustomSubject("");
  }

  function addCertification() {
    const c = certInput.trim();
    if (!c) return;
    if (!certifications.includes(c)) setCertifications((prev) => [...prev, c]);
    setCertInput("");
  }

  function addAchievement() {
    const a = achievementInput.trim();
    if (!a) return;
    if (!achievements.includes(a)) setAchievements((prev) => [...prev, a]);
    setAchievementInput("");
  }

  async function handleSubmit() {
    if (stepError) {
      setError(stepError);
      return;
    }
    setError("");
    setSaving(true);
    try {
      const cleanSocials: SocialLinks = {};
      for (const f of SOCIAL_FIELDS) {
        const v = socials[f.key].trim();
        if (v) cleanSocials[f.key] = v;
      }
      const payload: FacultyProfile = {
        name: name.trim(),
        designation,
        phoneNumber: phoneNumber.trim(),
        bio: bio.trim(),
        subjects,
        country,
        city: city.trim(),
        area: area.trim(),
        levels,
        languages,
        qualification,
        experienceYears: Number(experienceYears),
        teachingModes,
        hourlyRate: hourlyRate.trim() ? Number(hourlyRate) : undefined,
        timeFormat,
        timezone,
        availability,
        gender: gender || undefined,
        workplace: workplace.trim() || undefined,
        certifications,
        achievements,
        introVideo: introVideo.trim() || undefined,
        socials: Object.keys(cleanSocials).length > 0 ? cleanSocials : undefined,
      };
      const { user: saved } = await profileApi.save(payload);
      setUser(saved);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to save. Try again.",
      );
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-sm text-muted">
        Loading…
      </main>
    );
  }

  const slotsByDay = DAYS.filter((d) => availability.some((s) => s.day === d.id));
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* slim progress bar only — no navbar on the profiling flow */}
      <div className="sticky top-0 z-20 h-1 w-full bg-cream-band">
        <div
          className="h-full rounded-r-full bg-coral transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ------------------------------- content ------------------------------- */}
      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* stepper pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            const clickable = i < step || (canJumpSteps && !stepError);
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => clickable && setStep(i)}
                disabled={!clickable && i > step}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition",
                  current
                    ? "border-ink bg-ink text-white"
                    : done
                      ? "border-sage/30 bg-sage-wash text-sage"
                      : "border-hairline bg-white text-muted",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            {step === 0 && "Tell parents who you are"}
            {step === 1 && "What do you teach?"}
            {step === 2 && "When are you available?"}
            {step === 3 && "Links & extras"}
            {step === 4 && "Bio & final check"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {step === 0 && "Name, contact and where you're based."}
            {step === 1 && "Subjects, levels, experience and how you teach."}
            {step === 2 && "Parents only message you inside these windows."}
            {step === 3 && "All optional — these build trust with parents."}
            {step === 4 && "Write a short bio and you're live."}
          </p>
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 rounded-lg border border-coral/40 bg-coral-wash px-3.5 py-2.5 text-[13px] font-medium text-coral-dark">
            <X className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        {/* ------------------------------ step 1 ------------------------------ */}
        {step === 0 && (
          <div className="mt-5 space-y-4">
            <Section icon={UserRound} title="Identity">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Sharma"
                    autoFocus
                    className={inputCls}
                  />
                </Field>
                <Field label="Gender" optional>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as typeof gender)}
                    className={selectCls}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="I am a">
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => (
                      <Chip
                        key={r}
                        active={designation === r}
                        onClick={() => setDesignation(r)}
                      >
                        {r}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            <Section icon={Phone} title="Contact & location">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="WhatsApp number">
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    inputMode="tel"
                    className={inputCls}
                  />
                </Field>
                <Field label="Country">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={selectCls}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="City">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className={inputCls}
                  />
                </Field>
                <Field label="Area / locality">
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="HSR Layout"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>

            <Section icon={Globe} title="Languages" hint="Languages you can teach in">
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((l) => (
                  <Chip
                    key={l}
                    active={languages.includes(l)}
                    onClick={() => setLanguages((prev) => toggleItem(prev, l))}
                  >
                    {l}
                  </Chip>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ------------------------------ step 2 ------------------------------ */}
        {step === 1 && (
          <div className="mt-5 space-y-4">
            <Section icon={GraduationCap} title="Subjects & levels">
              <Field label="Subjects">
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map((s) => (
                    <Chip
                      key={s}
                      active={subjects.includes(s)}
                      onClick={() => setSubjects((prev) => toggleItem(prev, s))}
                    >
                      {s}
                    </Chip>
                  ))}
                  {subjects
                    .filter((s) => !SUBJECT_OPTIONS.includes(s))
                    .map((s) => (
                      <Chip
                        key={s}
                        active
                        onClick={() =>
                          setSubjects((prev) => prev.filter((x) => x !== s))
                        }
                      >
                        {s}
                      </Chip>
                    ))}
                </div>
              </Field>
              <div className="mt-3 flex gap-2">
                <input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSubject();
                    }
                  }}
                  placeholder="Add another subject"
                  className={cn(inputCls, "max-w-[240px]")}
                />
                <button
                  type="button"
                  onClick={addCustomSubject}
                  className="flex h-11 items-center gap-1 rounded-md border border-hairline bg-cream px-4 text-sm font-semibold text-ink transition hover:bg-cream-band"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="mt-5">
                <Field label="Levels">
                  <div className="flex flex-wrap gap-2">
                    {LEVEL_OPTIONS.map((l) => (
                      <Chip
                        key={l}
                        active={levels.includes(l)}
                        onClick={() => setLevels((prev) => toggleItem(prev, l))}
                      >
                        {l}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            <Section icon={Award} title="Experience & rate">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Highest qualification">
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className={selectCls}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {QUALIFICATION_OPTIONS.map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Years of experience">
                  <input
                    value={experienceYears}
                    onChange={(e) =>
                      setExperienceYears(
                        e.target.value.replace(/\D/g, "").slice(0, 2),
                      )
                    }
                    placeholder="5"
                    inputMode="numeric"
                    className={inputCls}
                  />
                </Field>
                <Field label="Hourly rate (₹)" optional>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    <input
                      value={hourlyRate}
                      onChange={(e) =>
                        setHourlyRate(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="600"
                      inputMode="numeric"
                      className={cn(inputCls, "pl-8")}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <Section icon={Briefcase} title="How do you teach?" hint="Pick all that apply">
              <div className="grid gap-2 sm:grid-cols-3">
                {TEACHING_MODE_OPTIONS.map((m) => {
                  const active = teachingModes.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setTeachingModes((prev) =>
                          active ? prev.filter((x) => x !== m.id) : [...prev, m.id],
                        )
                      }
                      className={cn(
                        "rounded-lg border p-3.5 text-left transition",
                        active
                          ? "border-coral bg-coral-wash"
                          : "border-hairline bg-white hover:bg-cream",
                      )}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                        {active && <Check className="h-3.5 w-3.5 text-coral-dark" />}
                        {m.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {m.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Section>
          </div>
        )}

        {/* ------------------------------ step 3 ------------------------------ */}
        {step === 2 && (
          <div className="mt-5 space-y-4">
            <Section
              icon={Globe}
              title="Your time zone"
              hint="Parents in other countries automatically see your slots converted to their local time"
            >
              <Field label="I set my slots in">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={selectCls}
                >
                  {tzOptions.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label} · {tzDisplayLabel(z.id)}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="mt-2 text-xs text-muted">
                All times below are {tzDisplayLabel(timezone)}. Detected from
                your device — change it if you&apos;re travelling.
              </p>
            </Section>

            <Section icon={Clock} title="Add a weekly slot">
              <div className="mb-4 flex justify-end">
                <div className="flex overflow-hidden rounded-full border border-hairline bg-white">
                  {(["12h", "24h"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setTimeFormat(f)}
                      className={cn(
                        "px-3.5 py-1.5 text-xs font-bold transition",
                        timeFormat === f
                          ? "bg-ink text-white"
                          : "text-muted hover:text-ink",
                      )}
                    >
                      {f === "12h" ? "AM/PM" : "24-HR"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
                <Field label="Day" className="col-span-2 sm:col-span-1">
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value as WeekDay)}
                    className={selectCls}
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="From">
                  <select
                    value={slotStart}
                    onChange={(e) => setSlotStart(e.target.value)}
                    className={selectCls}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t, timeFormat)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="To">
                  <select
                    value={slotEnd}
                    onChange={(e) => setSlotEnd(e.target.value)}
                    className={selectCls}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t, timeFormat)}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="col-span-2 flex items-end sm:col-span-1">
                  <button
                    type="button"
                    onClick={addSlot}
                    className="flex h-11 w-full items-center justify-center gap-1.5 rounded-md bg-coral px-4 text-sm font-semibold text-white transition hover:bg-coral-dark sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </Section>

            <Section
              icon={CalendarDays}
              title={`Your week · ${availability.length} slot${availability.length === 1 ? "" : "s"}`}
            >
              {availability.length === 0 ? (
                <p className="rounded-lg border border-dashed border-hairline px-4 py-8 text-center text-sm text-muted">
                  No slots yet — add your first weekly window above.
                </p>
              ) : (
                <div className="divide-y divide-hairline">
                  {slotsByDay.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="w-10 shrink-0 pt-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                        {d.short}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {availability
                          .filter((s) => s.day === d.id)
                          .map((s) => (
                            <span
                              key={`${s.day}-${s.start}-${s.end}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-sage-wash py-1.5 pl-3 pr-1.5 text-[13px] font-semibold text-sage"
                            >
                              {formatTime(s.start, timeFormat)} –{" "}
                              {formatTime(s.end, timeFormat)}
                              <button
                                type="button"
                                onClick={() =>
                                  setAvailability((prev) =>
                                    prev.filter(
                                      (x) =>
                                        !(
                                          x.day === s.day &&
                                          x.start === s.start &&
                                          x.end === s.end
                                        ),
                                    ),
                                  )
                                }
                                className="flex h-5 w-5 items-center justify-center rounded-full text-sage/70 transition hover:bg-white hover:text-coral-dark"
                                aria-label="Remove slot"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ------------------------------ step 4 ------------------------------ */}
        {step === 3 && (
          <div className="mt-5 space-y-4">
            <Section
              icon={Link2}
              title="Online presence"
              hint="All optional — parents trust faculty they can look up"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {SOCIAL_FIELDS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Field key={f.key} label={f.label} optional>
                      <div className="relative">
                        <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                        <input
                          value={socials[f.key]}
                          onChange={(e) =>
                            setSocials((prev) => ({
                              ...prev,
                              [f.key]: e.target.value,
                            }))
                          }
                          placeholder={f.placeholder}
                          className={cn(inputCls, "pl-8")}
                        />
                      </div>
                    </Field>
                  );
                })}
              </div>
            </Section>

            <Section icon={Briefcase} title="Work & certifications">
              <Field label="Current workplace / institution" optional>
                <input
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  placeholder="e.g. DPS Bengaluru, freelance, own academy"
                  className={inputCls}
                />
              </Field>

              <div className="mt-4">
                <Field label="Certifications" optional>
                  <div className="flex gap-2">
                    <input
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCertification();
                        }
                      }}
                      placeholder="e.g. CTET qualified, B.Ed, IIT alumnus"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={addCertification}
                      className="flex h-11 shrink-0 items-center gap-1 rounded-md border border-hairline bg-cream px-4 text-sm font-semibold text-ink transition hover:bg-cream-band"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </Field>
                {certifications.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {certifications.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 rounded-full bg-sage-wash py-1.5 pl-3 pr-1.5 text-[13px] font-semibold text-sage"
                      >
                        <Award className="h-3 w-3" />
                        {c}
                        <button
                          type="button"
                          onClick={() =>
                            setCertifications((prev) =>
                              prev.filter((x) => x !== c),
                            )
                          }
                          className="flex h-5 w-5 items-center justify-center rounded-full text-sage/70 transition hover:bg-white hover:text-coral-dark"
                          aria-label={`Remove ${c}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            <Section
              icon={Trophy}
              title="Achievements & results"
              hint="Concrete outcomes convince parents fastest"
            >
              <Field label="Add an achievement" optional>
                <div className="flex gap-2">
                  <input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAchievement();
                      }
                    }}
                    placeholder="e.g. 12 students scored 95%+ in boards, 200+ students taught"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="flex h-11 shrink-0 items-center gap-1 rounded-md border border-hairline bg-cream px-4 text-sm font-semibold text-ink transition hover:bg-cream-band"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </Field>
              {achievements.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {achievements.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full bg-butter/70 py-1.5 pl-3 pr-1.5 text-[13px] font-semibold text-ink"
                    >
                      <Trophy className="h-3 w-3" />
                      {a}
                      <button
                        type="button"
                        onClick={() =>
                          setAchievements((prev) => prev.filter((x) => x !== a))
                        }
                        className="flex h-5 w-5 items-center justify-center rounded-full text-ink/50 transition hover:bg-white hover:text-coral-dark"
                        aria-label={`Remove ${a}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Section>

            <Section
              icon={Video}
              title="Intro video"
              hint="A 1–2 minute video of you teaching builds instant trust"
            >
              <Field label="Video link (YouTube, Drive…)" optional>
                <div className="relative">
                  <Video className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  <input
                    value={introVideo}
                    onChange={(e) => setIntroVideo(e.target.value)}
                    placeholder="youtube.com/watch?v=…"
                    className={cn(inputCls, "pl-8")}
                  />
                </div>
              </Field>
            </Section>
          </div>
        )}

        {/* ------------------------------ step 5 ------------------------------ */}
        {step === 4 && (
          <div className="mt-5 space-y-4">
            <Section icon={UserRound} title="About you" hint="Shown at the top of your listing">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 1200))}
                rows={5}
                placeholder="What you teach, how you teach, results you've helped students achieve…"
                className="w-full rounded-md border border-hairline bg-white px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-[#a8a29a] transition focus:border-ink/40"
              />
              <p
                className={cn(
                  "mt-1 text-right text-xs",
                  bio.trim().length < 30 ? "text-coral-dark" : "text-muted",
                )}
              >
                {bio.trim().length} / 1200 · min 30 characters
              </p>
            </Section>

            <Section icon={BadgeCheck} title="Quick review" hint="Everything parents will see">
              <dl className="grid gap-x-8 gap-y-3.5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted">Name & role</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {name || "—"} · {designation}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Location</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {[area, city, country].filter(Boolean).join(", ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Subjects</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {subjects.join(", ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Levels</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {levels.join(", ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Experience</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {experienceYears || "0"} yrs · {qualification || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Availability</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {availability.length} slot{availability.length === 1 ? "" : "s"} ·{" "}
                    {slotsByDay.length} day{slotsByDay.length === 1 ? "" : "s"} a week ·{" "}
                    {tzDisplayLabel(timezone)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Languages</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {languages.join(", ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Rate</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {hourlyRate ? `₹${hourlyRate}/hr` : "Not shown"}
                  </dd>
                </div>
                {workplace && (
                  <div>
                    <dt className="text-xs text-muted">Workplace</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{workplace}</dd>
                  </div>
                )}
                {certifications.length > 0 && (
                  <div>
                    <dt className="text-xs text-muted">Certifications</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {certifications.join(", ")}
                    </dd>
                  </div>
                )}
                {SOCIAL_FIELDS.some((f) => socials[f.key].trim()) && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted">Links</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {SOCIAL_FIELDS.filter((f) => socials[f.key].trim())
                        .map((f) => f.label)
                        .join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </Section>

            <div className="flex items-start gap-2.5 rounded-lg bg-sage-wash px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <p className="text-[13px] text-ink/80">
                Your WhatsApp number is only shared when a parent taps Contact —
                Mentr takes no commission, ever.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------ footer bar ------------------------------ */}
      <footer className="sticky bottom-0 z-20 border-t border-hairline bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] w-full max-w-[760px] items-center justify-between gap-3 px-4 sm:px-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              disabled={saving}
              className="flex h-11 items-center gap-1.5 rounded-md border border-hairline bg-white px-5 text-sm font-semibold text-ink transition hover:bg-cream-band disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <span className="text-xs text-muted">Takes about 2 minutes</span>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex h-11 items-center gap-1.5 rounded-md bg-coral px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex h-11 items-center gap-2 rounded-md bg-coral px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BadgeCheck className="h-4 w-4" />
              )}
              {saving ? "Saving…" : "Finish & go live"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function ProfilingPage() {
  return (
    <Suspense fallback={null}>
      <ProfilingContent />
    </Suspense>
  );
}
