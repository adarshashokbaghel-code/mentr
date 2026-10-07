/**
 * Public compiler URLs. Kept free of "@/" imports so next.config.ts can read it
 * (every compiler page needs cross-origin isolation for interactive input()).
 */
export const COMPILER_PATHS = {
  python: "/openpythoncompiler",
} as const;

export type CompilerId = keyof typeof COMPILER_PATHS;

export const COMPILERS_HUB_PATH = "/compilers";

/** Header and footer links (lightweight: imported by client nav). */
export const COMPILER_LINKS: { id: CompilerId; label: string; href: string; description: string }[] = [
  {
    id: "python",
    label: "Online Python compiler",
    href: COMPILER_PATHS.python,
    description: "Write and run Python in your browser, free",
  },
];

export function howItWorksPath(id: CompilerId): string {
  return `${COMPILER_PATHS[id]}/how-it-works`;
}
