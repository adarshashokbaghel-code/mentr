/**
 * Must match the installed `pyodide` npm package; scripts/copy-pyodide.mjs fails the build if it doesn't.
 * To upgrade: `npm i pyodide@<v> --save-exact`, bump this, bump WORKER_REVISION.
 */
export const PYODIDE_VERSION = "314.0.7";

/** Bump when public/py-worker.js changes so browsers drop the cached copy. */
export const WORKER_REVISION = 3;

/** Same-origin copy, served by Vercel's CDN with immutable caching. */
export const SELF_HOSTED_INDEX_URL = `/pyodide/v${PYODIDE_VERSION}/`;

/** Used if the same-origin files fail to load, and for optional packages (numpy, etc.) that aren't self-hosted. */
export const CDN_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export const WORKER_URL = `/py-worker.js?v=${PYODIDE_VERSION}-${WORKER_REVISION}`;

/** Lessons expect short programs; the compiler allows longer ones. */
export const LESSON_TIMEOUT_MS = 6_000;
export const COMPILER_TIMEOUT_MS = 15_000;

/** Output beyond this is dropped so a runaway print loop can't freeze the tab. */
export const MAX_OUTPUT_CHARS = 200_000;
