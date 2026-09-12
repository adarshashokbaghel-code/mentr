/** Brand + helper assets for Mentr Learn. */

export const LEARN_DINO_SRC = "/learn/learn-dino-icon.png";

export function learnGuideAvatar(_seed = "Zappy") {
  return LEARN_DINO_SRC;
}

export function learnKidAvatar(_seed = "Learner") {
  return LEARN_DINO_SRC;
}

export function learnBuddyStageAvatar(_stage: 1 | 2 | 3) {
  return LEARN_DINO_SRC;
}

export const LEARN_TWEMOJI = {
  robot: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f916.svg",
  star: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg",
  rocket: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f680.svg",
  trophy: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c6.svg",
  video: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4fa.svg",
  game: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3ae.svg",
  fire: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f525.svg",
  sparkles: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg",
} as const;

export const GUIDE_LINES = [
  "CS, AI & Math — free for Class 3–5.",
  "Watch → Quiz → Play → Boss.",
  "About 15 minutes a day.",
  "Parents get a weekly email.",
] as const;

export const FLOATING_MODULES = [
  {
    id: "A1",
    title: "What Is a Computer?",
    track: "CS",
    className: "left-[2%] top-[8%] learn-module-drift-1",
    tint: "border-coral/40 bg-coral-wash",
  },
  {
    id: "B3",
    title: "Pattern Detective",
    track: "AI",
    className: "right-[0%] top-[18%] learn-module-drift-2",
    tint: "border-lavender bg-lavender/90",
  },
  {
    id: "C2",
    title: "Shapes & Symmetry",
    track: "Math",
    className: "left-[6%] bottom-[22%] learn-module-drift-3",
    tint: "border-sage/40 bg-sage-wash",
  },
] as const;
