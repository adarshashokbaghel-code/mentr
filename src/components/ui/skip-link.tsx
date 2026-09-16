"use client";

export function SkipLink() {
  function skipToMain(e: React.MouseEvent<HTMLAnchorElement>) {
    const main = document.querySelector("main");
    if (!main) return;
    e.preventDefault();
    if (!main.hasAttribute("tabindex")) {
      main.setAttribute("tabindex", "-1");
      main.addEventListener("blur", () => main.removeAttribute("tabindex"), {
        once: true,
      });
    }
    main.focus();
  }

  return (
    <a
      href="#main-content"
      onClick={skipToMain}
      className="sr-only rounded-md bg-white text-sm font-semibold text-ink shadow-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[600] focus:px-4 focus:py-2 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
