import { COMPILER_OG_SIZE, compilerOgImage } from "@/lib/compilers/og-image";

export const alt = "Mentr online Python compiler: free, runs Python 3.14 in your browser";
export const size = COMPILER_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return compilerOgImage({
    kicker: "Free · No sign-up",
    title: "Online Python Compiler",
    subtitle: "Real Python 3.14 that runs in your browser, on phone and desktop. input() works like a terminal.",
    code: ['name = input("Name? ")', 'print(f"Hi {name}!")', "", "> Name? Aarav", "> Hi Aarav!"],
  });
}
