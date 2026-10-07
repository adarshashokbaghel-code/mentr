# Online compilers: SEO keyword map and playbook

Goal: rank the compiler page #1 for "<language> compiler" / "online <language> compiler", with the how-it-works article as the second result (or a sitelink) for the brand query "mentr <language> compiler".

Everything is driven by the registry in `src/lib/compilers/`. Metadata, JSON-LD, sitemap, nav, footer, blog CTAs and the on-page explainer are generated from one `CompilerDef`.

## 1. Page structure (same for every language)

| URL | Role | Primary keyword | Schema |
| --- | --- | --- | --- |
| `/open<lang>compiler` | The tool (money page) | online `<lang>` compiler | WebApplication, HowTo, FAQPage, BreadcrumbList |
| `/open<lang>compiler/how-it-works` | Engineering article, brand + links | how online `<lang>` compiler works | TechArticle, BreadcrumbList |
| `/blog/<slug>` × 5 | Long-tail cluster that links up to the tool | see map below | BlogPosting, FAQPage |
| `/compilers` | Hub; noindex until 2+ compilers exist | free online compilers | ItemList, BreadcrumbList |

The compiler page = full-screen tool in the first viewport (`#compiler`), then a server-rendered explainer (`#about`) with: facts, features, how-to, mobile, input, compiler-vs-interpreter, examples, engineering teaser, honest limits, learn CTA, FAQ, related guides. The header "?" button links to `#about`.

## 2. Python keyword map

### Tool page `/openpythoncompiler`

| Cluster | Keywords | Where on page |
| --- | --- | --- |
| Head | online python compiler, python compiler, python online compiler, python compiler online | `<title>`, H1 (compiler header), intro, WebApplication name |
| Synonyms | run python online, python interpreter online, online python ide, python editor online, python 3 online compiler, free python compiler | description, features, FAQ |
| Brand | mentr python compiler | title suffix, JSON-LD `alternateName`, OG image |
| Long tail | online python compiler with input, python compiler for mobile/android, run python code in browser, python compiler no sign up, python compiler with numpy | `#input`, `#mobile`, features, FAQ |

### How-it-works `/openpythoncompiler/how-it-works`

how online python compiler works · browser based python compiler · pyodide architecture · python webassembly · pyodide input sharedarraybuffer · web worker python · build an online compiler

### Blog cluster (pillar: for-students, all CTA → compiler)

| Slug | Target keyword | Intent | Funnel |
| --- | --- | --- | --- |
| how-to-run-python-code-online | how to run python code online | informational | top |
| is-python-compiled-or-interpreted | is python compiled or interpreted | informational | top |
| online-python-compiler-with-input | online python compiler with input | commercial | mid |
| python-compiler-for-mobile | python compiler for mobile | commercial | mid |
| best-free-online-python-compiler-for-beginners | best free online python compiler for beginners | commercial | bottom |

### Next posts to write (backlog)

| Target keyword | Angle |
| --- | --- |
| python compiler for android | Android-only walkthrough, add-to-home-screen |
| online python compiler with numpy | numpy/pandas in the browser, what loads, examples |
| python eoferror eof when reading a line | Fix guide; why online compilers raise it |
| python indentationerror fix | Beginner error guide with runnable examples |
| python projects for beginners online | 10 projects runnable in the compiler (link Final Challenge) |
| python practice questions online | Link course practice + compiler |

## 3. Internal links (must exist for every compiler)

- Header nav: Learn group + Tools group (`COMPILER_LINKS` in `paths.ts`).
- Footer: Learn column + Tools column.
- Course landing (`/learn<lang>`) → compiler (plain `<a>`, full load for isolation) and → how-it-works.
- Compiler page → how-it-works (2 links), course, every cluster post.
- How-it-works → compiler, `#faq`, every cluster post.
- Every cluster post → compiler (top CTA, inline CTA, bottom box), how-it-works, course.
- `public/llms.txt` one-line answer + URLs.

## 4. Playbook: adding a new compiler (e.g. JavaScript)

1. `src/lib/compilers/paths.ts`: add `javascript: "/openjavascriptcompiler"` to `COMPILER_PATHS` and an entry to `COMPILER_LINKS`. This also adds the COOP/COEP headers in `next.config.ts` automatically.
2. `src/lib/compilers/javascript.ts`: a `CompilerDef` like `python.ts`. Rules:
   - `seo.title` ≤ 60 chars, primary keyword first, ends with `| Mentr`.
   - `seo.description` ≤ 160 chars, includes "free", "browser", "no sign-up".
   - Every number and claim must be true in the code (versions, limits, sizes).
   - 8–10 FAQs that answer real "People also ask" questions; `limits` must be honest.
3. Register it in `COMPILERS` in `src/lib/compilers/index.ts`. The `/compilers` hub becomes indexable and joins the sitemap and breadcrumbs once there are 2 compilers.
4. Pages (copy the Python ones):
   - `src/app/open<lang>compiler/page.tsx`: `compilerMetadata`, `compilerJsonLd`, tool + `<CompilerLanding>` + `<Footer>`.
   - `src/app/open<lang>compiler/opengraph-image.tsx` and `how-it-works/opengraph-image.tsx` using `compilerOgImage`.
   - `src/app/open<lang>compiler/how-it-works/page.tsx`: `howItWorksMetadata`, `howItWorksJsonLd`, the architecture article.
5. Five cluster posts: entries in `src/lib/blog-posts.ts` with `ctaHref` = the compiler path (this switches on compiler keywords and CTAs automatically), content in a `src/lib/blog-content/*.ts` batch, slugs in `blogSlugs`.
6. Add the one-line answer to `public/llms.txt`.
7. After deploy: submit the sitemap in Search Console, request indexing for the tool page and how-it-works, and check the Rich Results Test for both.

## 5. After launch: what to watch (Search Console)

- Queries containing "compiler" for `/openpythoncompiler`: impressions → position → CTR. If position is 5–15 with low CTR, test a new `seo.title`.
- How-it-works ranking for "mentr python compiler" and engineering queries; it earns links from LinkedIn and dev communities.
- Core Web Vitals: the compiler page is client-heavy; keep the explainer server-rendered and image-free.
- Backlinks: share how-it-works on LinkedIn, dev.to, Hashnode, Reddit r/learnpython and Hacker News (Show HN). Link back from the GitHub README (the repo is open source).
