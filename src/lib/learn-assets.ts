/** Brand + helper assets for Mentr Learn. */

export const LEARN_DINO_SRC = "/learn/learn-dino-icon.png";

/**
 * Same dino gripping a panel at its right side — used while the guide card is on
 * its intro view. Measured geometry (fractions of the 783×952 file): the body
 * silhouette ends at 0.845 of the width, the paw tips reach 0.996, the upper arm
 * spans 0.387–0.552 of the height and the lower arm 0.555–0.683, with a clean
 * gap between them at 0.552. The popup pins the card's left edge to 0.865 of the
 * dino width and lifts only the upper arm in front of the panel.
 */
export const LEARN_DINO_HOLD_SRC = "/learn/learn-dino-hold.png";
export const LEARN_DINO_HOLD_SIZE = { width: 783, height: 952 } as const;

/**
 * Same dino peeking out and waving — used once the card switches to the chat
 * view, where the dino drops fully behind the glass. Its head and waving paw sit
 * in the left 0.62 of the 707×935 artwork, so that fraction stays outside the
 * card and the rest reads as a blurred silhouette through the panel.
 */
export const LEARN_DINO_PEEK_SRC = "/learn/learn-dino-peek.png";
export const LEARN_DINO_PEEK_SIZE = { width: 707, height: 935 } as const;

/**
 * The dino is always the original brand PNG — motion comes from CSS so the
 * artwork never changes between placements.
 */
export const LEARN_DINO_ACTIONS = {
  still: "",
  blink: "learn-dino-breathe",
  wave: "learn-dino-wave",
  peek: "learn-dino-peek",
  handshake: "learn-dino-shake",
  cheer: "learn-dino-hop",
} as const;

export type LearnDinoAction = keyof typeof LEARN_DINO_ACTIONS;

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
