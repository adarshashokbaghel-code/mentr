/**
 * CBSE / NCERT Maths chapter catalogs (Classes 9–12).
 * Same-origin PDFs via /api/ncert/class{N}-maths.
 */

export type NcertMathsChapter = {
  number: number;
  name: string;
  slug: string;
  downloadUrl: string;
  viewUrl: string;
  filename: string;
  blurb: string;
  /** Archive / public PDF filename when it differs from padded chapter code */
  pdfFile?: string;
  localReady?: boolean;
};

export type NcertMathsTextbook = {
  board: "CBSE";
  classLevel: 9 | 10 | 11 | 12;
  subject: "Mathematics";
  medium: "English";
  code: string;
  title: string;
  listApi: string;
  sourceNote: string;
  chapters: NcertMathsChapter[];
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function chapterUrls(classLevel: number, n: number, slug: string) {
  const pad = String(n).padStart(2, "0");
  return {
    downloadUrl: `/api/ncert/class${classLevel}-maths/${n}.pdf`,
    viewUrl: `/api/ncert/class${classLevel}-maths/${n}.pdf?view=1`,
    filename: `NCERT-Class${classLevel}-Maths-Ch${pad}-${slug}.pdf`,
  };
}

function buildChapters(
  classLevel: number,
  rows: { number: number; name: string; blurb: string; pdfFile?: string }[],
): NcertMathsChapter[] {
  return rows.map((r) => {
    const slug = slugify(r.name);
    return {
      number: r.number,
      name: r.name,
      slug,
      blurb: r.blurb,
      pdfFile: r.pdfFile,
      localReady: true,
      ...chapterUrls(classLevel, r.number, slug),
    };
  });
}

/** Class 9 — Number Systems syllabus still used in schools (rationalised map). */
export const NCERT_CLASS9_MATHS_CHAPTERS = buildChapters(9, [
  {
    number: 1,
    name: "Number Systems",
    blurb: "Naturals, wholes, integers, rationals, irrationals, and real numbers.",
    pdfFile: "iemh101.pdf",
  },
  {
    number: 2,
    name: "Polynomials",
    blurb: "Degrees, zeroes, factor and remainder theorems, algebraic identities.",
    pdfFile: "iemh102.pdf",
  },
  {
    number: 3,
    name: "Coordinate Geometry",
    blurb: "Cartesian plane, plotting points, and reading coordinates.",
    pdfFile: "iemh103.pdf",
  },
  {
    number: 4,
    name: "Linear Equations in Two Variables",
    blurb: "ax + by + c = 0, solutions, and graphing lines.",
    pdfFile: "iemh104.pdf",
  },
  {
    number: 5,
    name: "Introduction to Euclid’s Geometry",
    blurb: "Euclid’s definitions, axioms, postulates, and equivalent versions.",
    pdfFile: "iemh105.pdf",
  },
  {
    number: 6,
    name: "Lines and Angles",
    blurb: "Intersecting lines, parallel lines, and angle relationships.",
    pdfFile: "iemh106.pdf",
  },
  {
    number: 7,
    name: "Triangles",
    blurb: "Congruence criteria, inequalities, and basic triangle properties.",
    pdfFile: "iemh107.pdf",
  },
  {
    number: 8,
    name: "Quadrilaterals",
    blurb: "Parallelograms, mid-point theorem, and special quadrilaterals.",
    pdfFile: "iemh108.pdf",
  },
  {
    number: 9,
    name: "Circles",
    blurb: "Chords, angles in a circle, and cyclic quadrilaterals.",
    pdfFile: "iemh110.pdf",
  },
  {
    number: 10,
    name: "Heron’s Formula",
    blurb: "Area of a triangle using three sides (Heron’s formula).",
    pdfFile: "iemh112.pdf",
  },
  {
    number: 11,
    name: "Surface Areas and Volumes",
    blurb: "Cubes, cuboids, cylinders, cones, and spheres.",
    pdfFile: "iemh113.pdf",
  },
  {
    number: 12,
    name: "Statistics",
    blurb: "Collection of data, presentation, and measures of central tendency.",
    pdfFile: "iemh114.pdf",
  },
]);

export const NCERT_CLASS10_MATHS_CHAPTERS = buildChapters(10, [
  {
    number: 1,
    name: "Real Numbers",
    blurb: "Euclid’s division lemma, HCF, irrationality, and decimal expansions.",
    pdfFile: "jemh101.pdf",
  },
  {
    number: 2,
    name: "Polynomials",
    blurb: "Zeroes, relationship with coefficients, and division algorithm.",
    pdfFile: "jemh102.pdf",
  },
  {
    number: 3,
    name: "Pair of Linear Equations in Two Variables",
    blurb: "Graphical and algebraic methods for two linear equations.",
    pdfFile: "jemh103.pdf",
  },
  {
    number: 4,
    name: "Quadratic Equations",
    blurb: "Standard form, roots, discriminant, and nature of roots.",
    pdfFile: "jemh104.pdf",
  },
  {
    number: 5,
    name: "Arithmetic Progressions",
    blurb: "nth term and sum of the first n terms of an AP.",
    pdfFile: "jemh105.pdf",
  },
  {
    number: 6,
    name: "Triangles",
    blurb: "Similar triangles, criteria, and areas of similar triangles.",
    pdfFile: "jemh106.pdf",
  },
  {
    number: 7,
    name: "Coordinate Geometry",
    blurb: "Distance formula, section formula, and area of a triangle.",
    pdfFile: "jemh107.pdf",
  },
  {
    number: 8,
    name: "Introduction to Trigonometry",
    blurb: "Trigonometric ratios, identities, and complementary angles.",
    pdfFile: "jemh108.pdf",
  },
  {
    number: 9,
    name: "Some Applications of Trigonometry",
    blurb: "Heights and distances using trigonometric ratios.",
    pdfFile: "jemh109.pdf",
  },
  {
    number: 10,
    name: "Circles",
    blurb: "Tangents from an external point and related theorems.",
    pdfFile: "jemh110.pdf",
  },
  {
    number: 11,
    name: "Areas Related to Circles",
    blurb: "Areas of sectors and segments of a circle.",
    pdfFile: "jemh111.pdf",
  },
  {
    number: 12,
    name: "Surface Areas and Volumes",
    blurb: "Surface area and volume of combinations of solids.",
    pdfFile: "jemh112.pdf",
  },
  {
    number: 13,
    name: "Statistics",
    blurb: "Mean, median, and mode of grouped data.",
    pdfFile: "jemh113.pdf",
  },
  {
    number: 14,
    name: "Probability",
    blurb: "Classical probability and simple experiments.",
    pdfFile: "jemh114.pdf",
  },
]);

export const NCERT_CLASS11_MATHS_CHAPTERS = buildChapters(11, [
  {
    number: 1,
    name: "Sets",
    blurb: "Types of sets, Venn diagrams, and operations on sets.",
    pdfFile: "kemh101.pdf",
  },
  {
    number: 2,
    name: "Relations and Functions",
    blurb: "Cartesian products, relations, and types of functions.",
    pdfFile: "kemh102.pdf",
  },
  {
    number: 3,
    name: "Trigonometric Functions",
    blurb: "Angles, trigonometric ratios, and identities.",
    pdfFile: "kemh103.pdf",
  },
  {
    number: 4,
    name: "Principle of Mathematical Induction",
    blurb: "Principle of mathematical induction and its applications.",
    pdfFile: "kemh104.pdf",
  },
  {
    number: 5,
    name: "Complex Numbers and Quadratic Equations",
    blurb: "Argand plane, modulus, and quadratic equations.",
    pdfFile: "kemh105.pdf",
  },
  {
    number: 6,
    name: "Linear Inequalities",
    blurb: "Algebraic solutions and graphical representation.",
    pdfFile: "kemh106.pdf",
  },
  {
    number: 7,
    name: "Permutations and Combinations",
    blurb: "Fundamental principle of counting, P and C formulae.",
    pdfFile: "kemh107.pdf",
  },
  {
    number: 8,
    name: "Binomial Theorem",
    blurb: "Expansion of (a + b)^n and general term.",
    pdfFile: "kemh108.pdf",
  },
  {
    number: 9,
    name: "Sequences and Series",
    blurb: "AP, GP, and special series sums.",
    pdfFile: "kemh109.pdf",
  },
  {
    number: 10,
    name: "Straight Lines",
    blurb: "Slope, various forms of a line, and distance formulae.",
    pdfFile: "kemh110.pdf",
  },
  {
    number: 11,
    name: "Conic Sections",
    blurb: "Circles, parabola, ellipse, and hyperbola.",
    pdfFile: "kemh111.pdf",
  },
  {
    number: 12,
    name: "Introduction to Three Dimensional Geometry",
    blurb: "Coordinate axes, distance, and section formula in 3D.",
    pdfFile: "kemh112.pdf",
  },
  {
    number: 13,
    name: "Limits and Derivatives",
    blurb: "Intuitive idea of limit and derivative as rate of change.",
    pdfFile: "kemh113.pdf",
  },
  {
    number: 14,
    name: "Mathematical Reasoning",
    blurb: "Statements, connectives, implications, and validity.",
    pdfFile: "kemh114.pdf",
  },
  {
    number: 15,
    name: "Statistics",
    blurb: "Measures of dispersion — range, mean deviation, variance.",
    pdfFile: "kemh115.pdf",
  },
  {
    number: 16,
    name: "Probability",
    blurb: "Random experiments, events, and axiomatic probability.",
    pdfFile: "kemh116.pdf",
  },
]);

export const NCERT_CLASS12_MATHS_CHAPTERS = buildChapters(12, [
  {
    number: 1,
    name: "Relations and Functions",
    blurb: "Types of relations and functions; composition and invertible functions.",
    pdfFile: "lemh101.pdf",
  },
  {
    number: 2,
    name: "Inverse Trigonometric Functions",
    blurb: "Principal values and properties of inverse trigonometric functions.",
    pdfFile: "lemh102.pdf",
  },
  {
    number: 3,
    name: "Matrices",
    blurb: "Matrix types, operations, and elementary transformations.",
    pdfFile: "lemh103.pdf",
  },
  {
    number: 4,
    name: "Determinants",
    blurb: "Determinants, area of a triangle, adjoint, and inverse.",
    pdfFile: "lemh104.pdf",
  },
  {
    number: 5,
    name: "Continuity and Differentiability",
    blurb: "Continuity, differentiability, and derivatives of composite functions.",
    pdfFile: "lemh105.pdf",
  },
  {
    number: 6,
    name: "Application of Derivatives",
    blurb: "Rate of change, maxima/minima, and tangents & normals.",
    pdfFile: "lemh107.pdf",
  },
  {
    number: 7,
    name: "Integrals",
    blurb: "Indefinite integrals and methods of integration.",
    pdfFile: "lemh201.pdf",
  },
  {
    number: 8,
    name: "Application of Integrals",
    blurb: "Area under curves using definite integrals.",
    pdfFile: "lemh202.pdf",
  },
  {
    number: 9,
    name: "Differential Equations",
    blurb: "Order, degree, and solution of differential equations.",
    pdfFile: "lemh203.pdf",
  },
  {
    number: 10,
    name: "Vector Algebra",
    blurb: "Vectors, scalar and vector products.",
    pdfFile: "lemh204.pdf",
  },
  {
    number: 11,
    name: "Three Dimensional Geometry",
    blurb: "Direction cosines, lines, and planes in space.",
    pdfFile: "lemh205.pdf",
  },
  {
    number: 12,
    name: "Linear Programming",
    blurb: "Linear inequalities and graphical method for LPP.",
    pdfFile: "lemh206.pdf",
  },
  {
    number: 13,
    name: "Probability",
    blurb: "Conditional probability, Bayes’ theorem, and distributions.",
    pdfFile: "lemh207.pdf",
  },
]);

export const NCERT_MATHS_TEXTBOOKS: Record<9 | 10 | 11 | 12, NcertMathsTextbook> =
  {
    9: {
      board: "CBSE",
      classLevel: 9,
      subject: "Mathematics",
      medium: "English",
      code: "iemh1",
      title: "NCERT Class 9 Mathematics",
      listApi: "/api/ncert/class9-maths",
      sourceNote:
        "Chapter PDFs match the CBSE Class 9 Maths book still used in schools (Number Systems → Statistics).",
      chapters: NCERT_CLASS9_MATHS_CHAPTERS,
    },
    10: {
      board: "CBSE",
      classLevel: 10,
      subject: "Mathematics",
      medium: "English",
      code: "jemh1",
      title: "NCERT Class 10 Mathematics",
      listApi: "/api/ncert/class10-maths",
      sourceNote:
        "Full NCERT Class 10 Maths (Real Numbers → Probability).",
      chapters: NCERT_CLASS10_MATHS_CHAPTERS,
    },
    11: {
      board: "CBSE",
      classLevel: 11,
      subject: "Mathematics",
      medium: "English",
      code: "kemh1",
      title: "NCERT Class 11 Mathematics",
      listApi: "/api/ncert/class11-maths",
      sourceNote: "Full NCERT Class 11 Maths chapter set (Sets → Probability).",
      chapters: NCERT_CLASS11_MATHS_CHAPTERS,
    },
    12: {
      board: "CBSE",
      classLevel: 12,
      subject: "Mathematics",
      medium: "English",
      code: "lemh1",
      title: "NCERT Class 12 Mathematics (Parts I & II)",
      listApi: "/api/ncert/class12-maths",
      sourceNote:
        "NCERT Class 12 Maths Parts I & II (Relations → Probability).",
      chapters: NCERT_CLASS12_MATHS_CHAPTERS,
    },
  };

export function ncertMathsChaptersForClass(
  classLevel: number,
): NcertMathsChapter[] {
  const book = NCERT_MATHS_TEXTBOOKS[classLevel as 9 | 10 | 11 | 12];
  return book?.chapters ?? [];
}

/** @deprecated Prefer NCERT_CLASS9_MATHS_CHAPTERS from this module */
export type NcertClass9MathsChapter = NcertMathsChapter;
