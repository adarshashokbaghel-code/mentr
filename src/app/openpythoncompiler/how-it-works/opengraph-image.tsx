import { COMPILER_OG_SIZE, compilerOgImage } from "@/lib/compilers/og-image";

export const alt = "How we built a Python compiler that runs entirely in your browser";
export const size = COMPILER_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return compilerOgImage({
    kicker: "Engineering",
    title: "How we built a Python compiler in the browser",
    subtitle: "Pyodide, Web Workers and a SharedArrayBuffer trick for input(). Step by step.",
    code: ["# no server runs this", "import sys", "print(sys.version[:6])", "", "> 3.14.2"],
  });
}
