import { Router, type Response } from "express";
import fs from "fs";
import path from "path";

/**
 * Same-origin NCERT Maths (9–12) + Science (9–10) + Physics/Chemistry/Biology (11–12) PDFs.
 * Local files under public/ncert/class{N}-{maths|science|physics|chemistry|biology}/.
 * Fallback: Internet Archive NCERT scans (+ ncert.nic.in).
 */

const router = Router();

type ChapterMeta = {
  number: number;
  name: string;
  slug: string;
  pdfFile: string;
  archiveItem: string;
};

type ClassBook = {
  classLevel: number;
  subject: "Mathematics" | "Science" | "Physics" | "Chemistry" | "Biology";
  title: string;
  sourceNote: string;
  routeSlug: string;
  publicDir: string;
  chapters: ChapterMeta[];
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/['’?]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ch(
  number: number,
  name: string,
  pdfFile: string,
  archiveItem: string,
): ChapterMeta {
  return { number, name, slug: slugify(name), pdfFile, archiveItem };
}

const MATHS_BOOKS: ClassBook[] = [
  {
    classLevel: 9,
    subject: "Mathematics",
    title: "NCERT Class 9 Mathematics — Number Systems syllabus",
    sourceNote:
      "Chapter PDFs match the CBSE Class 9 Maths book still used in schools (Number Systems → Statistics).",
    routeSlug: "class9-maths",
    publicDir: "class9-maths",
    chapters: [
      ch(1, "Number Systems", "iemh101.pdf", "ncert-iemh1"),
      ch(2, "Polynomials", "iemh102.pdf", "ncert-iemh1"),
      ch(3, "Coordinate Geometry", "iemh103.pdf", "ncert-iemh1"),
      ch(4, "Linear Equations in Two Variables", "iemh104.pdf", "ncert-iemh1"),
      ch(5, "Introduction to Euclid’s Geometry", "iemh105.pdf", "ncert-iemh1"),
      ch(6, "Lines and Angles", "iemh106.pdf", "ncert-iemh1"),
      ch(7, "Triangles", "iemh107.pdf", "ncert-iemh1"),
      ch(8, "Quadrilaterals", "iemh108.pdf", "ncert-iemh1"),
      ch(9, "Circles", "iemh110.pdf", "ncert-iemh1"),
      ch(10, "Heron’s Formula", "iemh112.pdf", "ncert-iemh1"),
      ch(11, "Surface Areas and Volumes", "iemh113.pdf", "ncert-iemh1"),
      ch(12, "Statistics", "iemh114.pdf", "ncert-iemh1"),
    ],
  },
  {
    classLevel: 10,
    subject: "Mathematics",
    title: "NCERT Class 10 Mathematics",
    sourceNote: "Full NCERT Class 10 Maths (Real Numbers → Probability).",
    routeSlug: "class10-maths",
    publicDir: "class10-maths",
    chapters: [
      ch(1, "Real Numbers", "jemh101.pdf", "ncert-jemh1"),
      ch(2, "Polynomials", "jemh102.pdf", "ncert-jemh1"),
      ch(3, "Pair of Linear Equations in Two Variables", "jemh103.pdf", "ncert-jemh1"),
      ch(4, "Quadratic Equations", "jemh104.pdf", "ncert-jemh1"),
      ch(5, "Arithmetic Progressions", "jemh105.pdf", "ncert-jemh1"),
      ch(6, "Triangles", "jemh106.pdf", "ncert-jemh1"),
      ch(7, "Coordinate Geometry", "jemh107.pdf", "ncert-jemh1"),
      ch(8, "Introduction to Trigonometry", "jemh108.pdf", "ncert-jemh1"),
      ch(9, "Some Applications of Trigonometry", "jemh109.pdf", "ncert-jemh1"),
      ch(10, "Circles", "jemh110.pdf", "ncert-jemh1"),
      ch(11, "Areas Related to Circles", "jemh111.pdf", "ncert-jemh1"),
      ch(12, "Surface Areas and Volumes", "jemh112.pdf", "ncert-jemh1"),
      ch(13, "Statistics", "jemh113.pdf", "ncert-jemh1"),
      ch(14, "Probability", "jemh114.pdf", "ncert-jemh1"),
    ],
  },
  {
    classLevel: 11,
    subject: "Mathematics",
    title: "NCERT Class 11 Mathematics",
    sourceNote: "Full NCERT Class 11 Maths (Sets → Probability).",
    routeSlug: "class11-maths",
    publicDir: "class11-maths",
    chapters: [
      ch(1, "Sets", "kemh101.pdf", "ncert-kemh1"),
      ch(2, "Relations and Functions", "kemh102.pdf", "ncert-kemh1"),
      ch(3, "Trigonometric Functions", "kemh103.pdf", "ncert-kemh1"),
      ch(4, "Principle of Mathematical Induction", "kemh104.pdf", "ncert-kemh1"),
      ch(5, "Complex Numbers and Quadratic Equations", "kemh105.pdf", "ncert-kemh1"),
      ch(6, "Linear Inequalities", "kemh106.pdf", "ncert-kemh1"),
      ch(7, "Permutations and Combinations", "kemh107.pdf", "ncert-kemh1"),
      ch(8, "Binomial Theorem", "kemh108.pdf", "ncert-kemh1"),
      ch(9, "Sequences and Series", "kemh109.pdf", "ncert-kemh1"),
      ch(10, "Straight Lines", "kemh110.pdf", "ncert-kemh1"),
      ch(11, "Conic Sections", "kemh111.pdf", "ncert-kemh1"),
      ch(12, "Introduction to Three Dimensional Geometry", "kemh112.pdf", "ncert-kemh1"),
      ch(13, "Limits and Derivatives", "kemh113.pdf", "ncert-kemh1"),
      ch(14, "Mathematical Reasoning", "kemh114.pdf", "ncert-kemh1"),
      ch(15, "Statistics", "kemh115.pdf", "ncert-kemh1"),
      ch(16, "Probability", "kemh116.pdf", "ncert-kemh1"),
    ],
  },
  {
    classLevel: 12,
    subject: "Mathematics",
    title: "NCERT Class 12 Mathematics (Parts I & II)",
    sourceNote: "NCERT Class 12 Maths Parts I & II (Relations → Probability).",
    routeSlug: "class12-maths",
    publicDir: "class12-maths",
    chapters: [
      ch(1, "Relations and Functions", "lemh101.pdf", "ncert-lemh1"),
      ch(2, "Inverse Trigonometric Functions", "lemh102.pdf", "ncert-lemh1"),
      ch(3, "Matrices", "lemh103.pdf", "ncert-lemh1"),
      ch(4, "Determinants", "lemh104.pdf", "ncert-lemh1"),
      ch(5, "Continuity and Differentiability", "lemh105.pdf", "ncert-lemh1"),
      ch(6, "Application of Derivatives", "lemh107.pdf", "ncert-lemh1"),
      ch(7, "Integrals", "lemh201.pdf", "ncert-lemh2"),
      ch(8, "Application of Integrals", "lemh202.pdf", "ncert-lemh2"),
      ch(9, "Differential Equations", "lemh203.pdf", "ncert-lemh2"),
      ch(10, "Vector Algebra", "lemh204.pdf", "ncert-lemh2"),
      ch(11, "Three Dimensional Geometry", "lemh205.pdf", "ncert-lemh2"),
      ch(12, "Linear Programming", "lemh206.pdf", "ncert-lemh2"),
      ch(13, "Probability", "lemh207.pdf", "ncert-lemh2"),
    ],
  },
];

const SCIENCE_BOOKS: ClassBook[] = [
  {
    classLevel: 9,
    subject: "Science",
    title: "NCERT Class 9 Science",
    sourceNote: "Full NCERT Class 9 Science (Matter → Food Resources).",
    routeSlug: "class9-science",
    publicDir: "class9-science",
    chapters: [
      ch(1, "Matter in Our Surroundings", "iesc101.pdf", "ncert-iesc1"),
      ch(2, "Is Matter Around Us Pure?", "iesc102.pdf", "ncert-iesc1"),
      ch(3, "Atoms and Molecules", "iesc103.pdf", "ncert-iesc1"),
      ch(4, "Structure of the Atom", "iesc104.pdf", "ncert-iesc1"),
      ch(5, "The Fundamental Unit of Life", "iesc105.pdf", "ncert-iesc1"),
      ch(6, "Tissues", "iesc106.pdf", "ncert-iesc1"),
      ch(7, "Diversity in Living Organisms", "iesc107.pdf", "ncert-iesc1"),
      ch(8, "Motion", "iesc108.pdf", "ncert-iesc1"),
      ch(9, "Force and Laws of Motion", "iesc109.pdf", "ncert-iesc1"),
      ch(10, "Gravitation", "iesc110.pdf", "ncert-iesc1"),
      ch(11, "Work and Energy", "iesc111.pdf", "ncert-iesc1"),
      ch(12, "Sound", "iesc112.pdf", "ncert-iesc1"),
      ch(13, "Why Do We Fall Ill?", "iesc113.pdf", "ncert-iesc1"),
      ch(14, "Natural Resources", "iesc114.pdf", "ncert-iesc1"),
      ch(15, "Improvement in Food Resources", "iesc115.pdf", "ncert-iesc1"),
    ],
  },
  {
    classLevel: 10,
    subject: "Science",
    title: "NCERT Class 10 Science",
    sourceNote:
      "Full NCERT Class 10 Science (Chemical Reactions → Natural Resources).",
    routeSlug: "class10-science",
    publicDir: "class10-science",
    chapters: [
      ch(1, "Chemical Reactions and Equations", "jesc101.pdf", "ncert-jesc1"),
      ch(2, "Acids, Bases and Salts", "jesc102.pdf", "ncert-jesc1"),
      ch(3, "Metals and Non-metals", "jesc103.pdf", "ncert-jesc1"),
      ch(4, "Carbon and its Compounds", "jesc104.pdf", "ncert-jesc1"),
      ch(5, "Periodic Classification of Elements", "jesc105.pdf", "ncert-jesc1"),
      ch(6, "Life Processes", "jesc106.pdf", "ncert-jesc1"),
      ch(7, "Control and Coordination", "jesc107.pdf", "ncert-jesc1"),
      ch(8, "How do Organisms Reproduce?", "jesc108.pdf", "ncert-jesc1"),
      ch(9, "Heredity and Evolution", "jesc109.pdf", "ncert-jesc1"),
      ch(10, "Light – Reflection and Refraction", "jesc110.pdf", "ncert-jesc1"),
      ch(11, "The Human Eye and the Colourful World", "jesc111.pdf", "ncert-jesc1"),
      ch(12, "Electricity", "jesc112.pdf", "ncert-jesc1"),
      ch(13, "Magnetic Effects of Electric Current", "jesc113.pdf", "ncert-jesc1"),
      ch(14, "Sources of Energy", "jesc114.pdf", "ncert-jesc1"),
      ch(15, "Our Environment", "jesc115.pdf", "ncert-jesc1"),
      ch(16, "Sustainable Management of Natural Resources", "jesc116.pdf", "ncert-jesc1"),
    ],
  },
];

const PHYSICS_BOOKS: ClassBook[] = [
  {
    classLevel: 11,
    subject: "Physics",
    title: "NCERT Class 11 Physics (Parts I & II)",
    sourceNote:
      "Full NCERT Class 11 Physics — Part I (Units → Gravitation) + Part II (Solids → Waves), including exercises and additional/optional sets.",
    routeSlug: "class11-physics",
    publicDir: "class11-physics",
    chapters: [
      ch(1, "Units and Measurement", "keph101.pdf", "ncert-keph1"),
      ch(2, "Motion in a Straight Line", "keph102.pdf", "ncert-keph1"),
      ch(3, "Motion in a Plane", "keph103.pdf", "ncert-keph1"),
      ch(4, "Laws of Motion", "keph104.pdf", "ncert-keph1"),
      ch(5, "Work, Energy and Power", "keph105.pdf", "ncert-keph1"),
      ch(6, "System of Particles and Rotational Motion", "keph106.pdf", "ncert-keph1"),
      ch(7, "Gravitation", "keph107.pdf", "ncert-keph1"),
      ch(8, "Mechanical Properties of Solids", "keph201.pdf", "ncert-keph2"),
      ch(9, "Mechanical Properties of Fluids", "keph202.pdf", "ncert-keph2"),
      ch(10, "Thermal Properties of Matter", "keph203.pdf", "ncert-keph2"),
      ch(11, "Thermodynamics", "keph204.pdf", "ncert-keph2"),
      ch(12, "Kinetic Theory", "keph205.pdf", "ncert-keph2"),
      ch(13, "Oscillations", "keph206.pdf", "ncert-keph2"),
      ch(14, "Waves", "keph207.pdf", "ncert-keph2"),
    ],
  },
  {
    classLevel: 12,
    subject: "Physics",
    title: "NCERT Class 12 Physics (Parts I & II)",
    sourceNote:
      "Full NCERT Class 12 Physics — Part I (Electrostatics → EM Waves) + Part II (Optics → Semiconductors), including exercises and additional/optional sets.",
    routeSlug: "class12-physics",
    publicDir: "class12-physics",
    chapters: [
      ch(1, "Electric Charges and Fields", "leph101.pdf", "ncert-leph1"),
      ch(2, "Electrostatic Potential and Capacitance", "leph102.pdf", "ncert-leph1"),
      ch(3, "Current Electricity", "leph103.pdf", "ncert-leph1"),
      ch(4, "Moving Charges and Magnetism", "leph104.pdf", "ncert-leph1"),
      ch(5, "Magnetism and Matter", "leph105.pdf", "ncert-leph1"),
      ch(6, "Electromagnetic Induction", "leph106.pdf", "ncert-leph1"),
      ch(7, "Alternating Current", "leph107.pdf", "ncert-leph1"),
      ch(8, "Electromagnetic Waves", "leph108.pdf", "ncert-leph1"),
      ch(9, "Ray Optics and Optical Instruments", "leph201.pdf", "ncert-leph2"),
      ch(10, "Wave Optics", "leph202.pdf", "ncert-leph2"),
      ch(11, "Dual Nature of Radiation and Matter", "leph203.pdf", "ncert-leph2"),
      ch(12, "Atoms", "leph204.pdf", "ncert-leph2"),
      ch(13, "Nuclei", "leph205.pdf", "ncert-leph2"),
      ch(
        14,
        "Semiconductor Electronics: Materials, Devices and Simple Circuits",
        "leph206.pdf",
        "ncert-leph2",
      ),
    ],
  },
];

const CHEMISTRY_BOOKS: ClassBook[] = [
  {
    classLevel: 11,
    subject: "Chemistry",
    title: "NCERT Class 11 Chemistry (Parts I & II)",
    sourceNote:
      "Full NCERT Class 11 Chemistry — Part I (Basic Concepts → Equilibrium) + Part II (Redox → Environmental Chemistry).",
    routeSlug: "class11-chemistry",
    publicDir: "class11-chemistry",
    chapters: [
      ch(1, "Some Basic Concepts of Chemistry", "kech101.pdf", "ncert-kech1"),
      ch(2, "Structure of Atom", "kech102.pdf", "ncert-kech1"),
      ch(
        3,
        "Classification of Elements and Periodicity in Properties",
        "kech103.pdf",
        "ncert-kech1",
      ),
      ch(4, "Chemical Bonding and Molecular Structure", "kech104.pdf", "ncert-kech1"),
      ch(5, "States of Matter", "kech105.pdf", "ncert-kech1"),
      ch(6, "Thermodynamics", "kech106.pdf", "ncert-kech1"),
      ch(7, "Equilibrium", "kech107.pdf", "ncert-kech1"),
      ch(8, "Redox Reactions", "kech201.pdf", "ncert-kech2"),
      ch(9, "Hydrogen", "kech202.pdf", "ncert-kech2"),
      ch(10, "The s-Block Elements", "kech203.pdf", "ncert-kech2"),
      ch(11, "The p-Block Elements", "kech204.pdf", "ncert-kech2"),
      ch(
        12,
        "Organic Chemistry – Some Basic Principles and Techniques",
        "kech205.pdf",
        "ncert-kech2",
      ),
      ch(13, "Hydrocarbons", "kech206.pdf", "ncert-kech2"),
      ch(14, "Environmental Chemistry", "kech207.pdf", "ncert-kech2"),
    ],
  },
  {
    classLevel: 12,
    subject: "Chemistry",
    title: "NCERT Class 12 Chemistry (Parts I & II)",
    sourceNote:
      "Full NCERT Class 12 Chemistry — Part I (Solid State → Coordination) + Part II (Haloalkanes → Everyday Life).",
    routeSlug: "class12-chemistry",
    publicDir: "class12-chemistry",
    chapters: [
      ch(1, "The Solid State", "lech101.pdf", "ncert-lech1"),
      ch(2, "Solutions", "lech102.pdf", "ncert-lech1"),
      ch(3, "Electrochemistry", "lech103.pdf", "ncert-lech1"),
      ch(4, "Chemical Kinetics", "lech104.pdf", "ncert-lech1"),
      ch(5, "Surface Chemistry", "lech105.pdf", "ncert-lech1"),
      ch(
        6,
        "General Principles and Processes of Isolation of Elements",
        "lech106.pdf",
        "ncert-lech1",
      ),
      ch(7, "The p-Block Elements", "lech107.pdf", "ncert-lech1"),
      ch(8, "The d- and f-Block Elements", "lech108.pdf", "ncert-lech1"),
      ch(9, "Coordination Compounds", "lech109.pdf", "ncert-lech1"),
      ch(10, "Haloalkanes and Haloarenes", "lech201.pdf", "ncert-lech2"),
      ch(11, "Alcohols, Phenols and Ethers", "lech202.pdf", "ncert-lech2"),
      ch(12, "Aldehydes, Ketones and Carboxylic Acids", "lech203.pdf", "ncert-lech2"),
      ch(13, "Amines", "lech204.pdf", "ncert-lech2"),
      ch(14, "Biomolecules", "lech205.pdf", "ncert-lech2"),
      ch(15, "Polymers", "lech206.pdf", "ncert-lech2"),
      ch(16, "Chemistry in Everyday Life", "lech207.pdf", "ncert-lech2"),
    ],
  },
];

const BIOLOGY_BOOKS: ClassBook[] = [
  {
    classLevel: 11,
    subject: "Biology",
    title: "NCERT Class 11 Biology",
    sourceNote:
      "Full NCERT Class 11 Biology (The Living World → Chemical Coordination and Integration).",
    routeSlug: "class11-biology",
    publicDir: "class11-biology",
    chapters: [
      ch(1, "The Living World", "kebo101.pdf", "ncert-kebo1"),
      ch(2, "Biological Classification", "kebo102.pdf", "ncert-kebo1"),
      ch(3, "Plant Kingdom", "kebo103.pdf", "ncert-kebo1"),
      ch(4, "Animal Kingdom", "kebo104.pdf", "ncert-kebo1"),
      ch(5, "Morphology of Flowering Plants", "kebo105.pdf", "ncert-kebo1"),
      ch(6, "Anatomy of Flowering Plants", "kebo106.pdf", "ncert-kebo1"),
      ch(7, "Structural Organisation in Animals", "kebo107.pdf", "ncert-kebo1"),
      ch(8, "Cell: The Unit of Life", "kebo108.pdf", "ncert-kebo1"),
      ch(9, "Biomolecules", "kebo109.pdf", "ncert-kebo1"),
      ch(10, "Cell Cycle and Cell Division", "kebo110.pdf", "ncert-kebo1"),
      ch(11, "Transport in Plants", "kebo111.pdf", "ncert-kebo1"),
      ch(12, "Mineral Nutrition", "kebo112.pdf", "ncert-kebo1"),
      ch(13, "Photosynthesis in Higher Plants", "kebo113.pdf", "ncert-kebo1"),
      ch(14, "Respiration in Plants", "kebo114.pdf", "ncert-kebo1"),
      ch(15, "Plant Growth and Development", "kebo115.pdf", "ncert-kebo1"),
      ch(16, "Digestion and Absorption", "kebo116.pdf", "ncert-kebo1"),
      ch(17, "Breathing and Exchange of Gases", "kebo117.pdf", "ncert-kebo1"),
      ch(18, "Body Fluids and Circulation", "kebo118.pdf", "ncert-kebo1"),
      ch(19, "Excretory Products and their Elimination", "kebo119.pdf", "ncert-kebo1"),
      ch(20, "Locomotion and Movement", "kebo120.pdf", "ncert-kebo1"),
      ch(21, "Neural Control and Coordination", "kebo121.pdf", "ncert-kebo1"),
      ch(22, "Chemical Coordination and Integration", "kebo122.pdf", "ncert-kebo1"),
    ],
  },
  {
    classLevel: 12,
    subject: "Biology",
    title: "NCERT Class 12 Biology",
    sourceNote:
      "Full NCERT Class 12 Biology (Reproduction in Organisms → Environmental Issues).",
    routeSlug: "class12-biology",
    publicDir: "class12-biology",
    chapters: [
      ch(1, "Reproduction in Organisms", "lebo101.pdf", "ncert-lebo1"),
      ch(2, "Sexual Reproduction in Flowering Plants", "lebo102.pdf", "ncert-lebo1"),
      ch(3, "Human Reproduction", "lebo103.pdf", "ncert-lebo1"),
      ch(4, "Reproductive Health", "lebo104.pdf", "ncert-lebo1"),
      ch(5, "Principles of Inheritance and Variation", "lebo105.pdf", "ncert-lebo1"),
      ch(6, "Molecular Basis of Inheritance", "lebo106.pdf", "ncert-lebo1"),
      ch(7, "Evolution", "lebo107.pdf", "ncert-lebo1"),
      ch(8, "Human Health and Disease", "lebo108.pdf", "ncert-lebo1"),
      ch(
        9,
        "Strategies for Enhancement in Food Production",
        "lebo109.pdf",
        "ncert-lebo1",
      ),
      ch(10, "Microbes in Human Welfare", "lebo110.pdf", "ncert-lebo1"),
      ch(11, "Biotechnology: Principles and Processes", "lebo111.pdf", "ncert-lebo1"),
      ch(12, "Biotechnology and its Applications", "lebo112.pdf", "ncert-lebo1"),
      ch(13, "Organisms and Populations", "lebo113.pdf", "ncert-lebo1"),
      ch(14, "Ecosystem", "lebo114.pdf", "ncert-lebo1"),
      ch(15, "Biodiversity and Conservation", "lebo115.pdf", "ncert-lebo1"),
      ch(16, "Environmental Issues", "lebo116.pdf", "ncert-lebo1"),
    ],
  },
];

const ALL_BOOKS = [
  ...MATHS_BOOKS,
  ...SCIENCE_BOOKS,
  ...PHYSICS_BOOKS,
  ...CHEMISTRY_BOOKS,
  ...BIOLOGY_BOOKS,
];
const NCERT_LIVE_BASE = "https://ncert.nic.in/textbook/pdf";

function publicDir(book: ClassBook) {
  return path.join(process.cwd(), "public", "ncert", book.publicDir);
}

function cacheDir(book: ClassBook) {
  return path.join(process.cwd(), ".cache", `ncert-${book.publicDir}`);
}

function downloadFilename(book: ClassBook, chMeta: { number: number; slug: string }) {
  const pad = String(chMeta.number).padStart(2, "0");
  const subj =
    book.subject === "Science"
      ? "Science"
      : book.subject === "Physics"
        ? "Physics"
        : book.subject === "Chemistry"
          ? "Chemistry"
          : book.subject === "Biology"
            ? "Biology"
            : "Maths";
  return `NCERT-Class${book.classLevel}-${subj}-Ch${pad}-${chMeta.slug}.pdf`;
}

function findChapter(book: ClassBook, param: string) {
  const asNum = Number.parseInt(param, 10);
  if (Number.isFinite(asNum)) {
    return book.chapters.find((c) => c.number === asNum);
  }
  const slug = param.replace(/\.pdf$/i, "").toLowerCase();
  return book.chapters.find((c) => c.slug === slug);
}

function findExistingFile(book: ClassBook, pdfFile: string): string | null {
  const paths = [
    path.join(publicDir(book), pdfFile),
    path.join(cacheDir(book), pdfFile),
  ];
  for (const p of paths) {
    if (fs.existsSync(p) && fs.statSync(p).size > 10_000) return p;
  }
  return null;
}

async function fetchPdf(url: string): Promise<Buffer | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MentrSnapGrade/1.0; +https://mentr.in)",
        Accept: "application/pdf,*/*",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10_000 || buf.subarray(0, 4).toString() !== "%PDF") {
      return null;
    }
    return buf;
  } catch (err) {
    console.error("[ncert-pdf] fetch failed", url, err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function ensureCached(
  book: ClassBook,
  chMeta: ChapterMeta,
): Promise<string | { error: string; status: number }> {
  const existing = findExistingFile(book, chMeta.pdfFile);
  if (existing) return existing;

  const pub = publicDir(book);
  const cache = cacheDir(book);
  fs.mkdirSync(cache, { recursive: true });
  fs.mkdirSync(pub, { recursive: true });
  const dest = path.join(pub, chMeta.pdfFile);

  const archiveBase = `https://archive.org/download/${chMeta.archiveItem}`;
  const sources = [
    `${archiveBase}/${chMeta.pdfFile}`,
    `${NCERT_LIVE_BASE}/${chMeta.pdfFile}`,
  ];

  for (const url of sources) {
    const buf = await fetchPdf(url);
    if (!buf) continue;
    fs.writeFileSync(dest, buf);
    fs.writeFileSync(path.join(cache, chMeta.pdfFile), buf);
    return dest;
  }

  return {
    error: `Chapter ${chMeta.number} PDF is not available yet. Try again shortly.`,
    status: 503,
  };
}

function sendPdf(
  res: Response,
  filePath: string,
  filename: string,
  disposition: "attachment" | "inline" = "attachment",
) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `${disposition}; filename="${filename}"`,
  );
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("X-Content-Type-Options", "nosniff");
  fs.createReadStream(filePath).pipe(res);
}

for (const book of ALL_BOOKS) {
  router.get(`/${book.routeSlug}`, (_req, res) => {
    res.json({
      title: book.title,
      sourceNote: book.sourceNote,
      classLevel: book.classLevel,
      subject: book.subject,
      chapters: book.chapters.map((c) => ({
        number: c.number,
        name: c.name,
        slug: c.slug,
        downloadPath: `/api/ncert/${book.routeSlug}/${c.number}.pdf`,
        viewPath: `/api/ncert/${book.routeSlug}/${c.number}.pdf?view=1`,
        filename: downloadFilename(book, c),
        availableLocally: Boolean(findExistingFile(book, c.pdfFile)),
      })),
    });
  });

  router.get(`/${book.routeSlug}/:chapter`, async (req, res) => {
    const raw = String(req.params.chapter || "").replace(/\.pdf$/i, "");
    const chMeta = findChapter(book, raw);
    if (!chMeta) {
      res.status(404).json({
        error: `Chapter not found (use 1–${book.chapters.length})`,
      });
      return;
    }

    const cached = await ensureCached(book, chMeta);
    if (typeof cached !== "string") {
      res.status(cached.status).json({ error: cached.error });
      return;
    }

    const inline = String(req.query.view || "") === "1";
    sendPdf(
      res,
      cached,
      downloadFilename(book, chMeta),
      inline ? "inline" : "attachment",
    );
  });
}

router.get("/maths", (_req, res) => {
  res.json({
    classes: MATHS_BOOKS.map((book) => ({
      classLevel: book.classLevel,
      title: book.title,
      listPath: `/api/ncert/${book.routeSlug}`,
      chapterCount: book.chapters.length,
    })),
  });
});

router.get("/science", (_req, res) => {
  res.json({
    classes: SCIENCE_BOOKS.map((book) => ({
      classLevel: book.classLevel,
      title: book.title,
      listPath: `/api/ncert/${book.routeSlug}`,
      chapterCount: book.chapters.length,
    })),
  });
});

export default router;
