/**
 * CBSE / NCERT Science chapter catalogs (Classes 9–10).
 * Same-origin PDFs via /api/ncert/class{N}-science.
 */

export type NcertScienceChapter = {
  number: number;
  name: string;
  slug: string;
  downloadUrl: string;
  viewUrl: string;
  filename: string;
  blurb: string;
  pdfFile?: string;
  localReady?: boolean;
};

export type NcertScienceTextbook = {
  board: "CBSE";
  classLevel: 9 | 10;
  subject: "Science";
  medium: "English";
  code: string;
  title: string;
  listApi: string;
  sourceNote: string;
  chapters: NcertScienceChapter[];
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/['’?]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function chapterUrls(classLevel: number, n: number, slug: string) {
  const pad = String(n).padStart(2, "0");
  return {
    downloadUrl: `/api/ncert/class${classLevel}-science/${n}.pdf`,
    viewUrl: `/api/ncert/class${classLevel}-science/${n}.pdf?view=1`,
    filename: `NCERT-Class${classLevel}-Science-Ch${pad}-${slug}.pdf`,
  };
}

function buildChapters(
  classLevel: number,
  prefix: string,
  rows: { number: number; name: string; blurb: string }[],
): NcertScienceChapter[] {
  return rows.map((r) => {
    const slug = slugify(r.name);
    return {
      number: r.number,
      name: r.name,
      slug,
      blurb: r.blurb,
      pdfFile: `${prefix}${String(r.number).padStart(2, "0")}.pdf`,
      localReady: true,
      ...chapterUrls(classLevel, r.number, slug),
    };
  });
}

export const NCERT_CLASS9_SCIENCE_CHAPTERS = buildChapters(9, "iesc1", [
  {
    number: 1,
    name: "Matter in Our Surroundings",
    blurb: "States of matter, evaporation, and particle nature of matter.",
  },
  {
    number: 2,
    name: "Is Matter Around Us Pure?",
    blurb: "Mixtures, solutions, colloids, and separation techniques.",
  },
  {
    number: 3,
    name: "Atoms and Molecules",
    blurb: "Laws of chemical combination, atoms, molecules, and mole concept.",
  },
  {
    number: 4,
    name: "Structure of the Atom",
    blurb: "Electrons, protons, neutrons, and atomic models.",
  },
  {
    number: 5,
    name: "The Fundamental Unit of Life",
    blurb: "Cell structure, organelles, and osmosis.",
  },
  {
    number: 6,
    name: "Tissues",
    blurb: "Plant and animal tissues and their functions.",
  },
  {
    number: 7,
    name: "Diversity in Living Organisms",
    blurb: "Classification of plants and animals.",
  },
  {
    number: 8,
    name: "Motion",
    blurb: "Distance, displacement, speed, velocity, and acceleration graphs.",
  },
  {
    number: 9,
    name: "Force and Laws of Motion",
    blurb: "Newton’s laws, inertia, momentum, and action–reaction.",
  },
  {
    number: 10,
    name: "Gravitation",
    blurb: "Universal law of gravitation, free fall, and buoyancy.",
  },
  {
    number: 11,
    name: "Work and Energy",
    blurb: "Work, kinetic & potential energy, and power.",
  },
  {
    number: 12,
    name: "Sound",
    blurb: "Production, propagation, reflection, and characteristics of sound.",
  },
  {
    number: 13,
    name: "Why Do We Fall Ill?",
    blurb: "Health, disease, and prevention.",
  },
  {
    number: 14,
    name: "Natural Resources",
    blurb: "Air, water, soil, and biogeochemical cycles.",
  },
  {
    number: 15,
    name: "Improvement in Food Resources",
    blurb: "Crop production, animal husbandry, and food security.",
  },
]);

export const NCERT_CLASS10_SCIENCE_CHAPTERS = buildChapters(10, "jesc1", [
  {
    number: 1,
    name: "Chemical Reactions and Equations",
    blurb: "Types of reactions, balancing equations, oxidation & reduction.",
  },
  {
    number: 2,
    name: "Acids, Bases and Salts",
    blurb: "pH, indicators, and important salts.",
  },
  {
    number: 3,
    name: "Metals and Non-metals",
    blurb: "Properties, reactivity series, and corrosion.",
  },
  {
    number: 4,
    name: "Carbon and its Compounds",
    blurb: "Bonding, homologous series, soaps and detergents.",
  },
  {
    number: 5,
    name: "Periodic Classification of Elements",
    blurb: "Mendeleev and modern periodic table trends.",
  },
  {
    number: 6,
    name: "Life Processes",
    blurb: "Nutrition, respiration, transportation, and excretion.",
  },
  {
    number: 7,
    name: "Control and Coordination",
    blurb: "Nervous system, hormones in animals and plants.",
  },
  {
    number: 8,
    name: "How do Organisms Reproduce?",
    blurb: "Asexual and sexual reproduction in plants and humans.",
  },
  {
    number: 9,
    name: "Heredity and Evolution",
    blurb: "Mendel’s laws, sex determination, and evolution.",
  },
  {
    number: 10,
    name: "Light – Reflection and Refraction",
    blurb: "Mirrors, lenses, and refractive index.",
  },
  {
    number: 11,
    name: "The Human Eye and the Colourful World",
    blurb: "Eye defects, dispersion, and atmospheric refraction.",
  },
  {
    number: 12,
    name: "Electricity",
    blurb: "Ohm’s law, resistance, and electric power.",
  },
  {
    number: 13,
    name: "Magnetic Effects of Electric Current",
    blurb: "Magnetic field, motors, generators, and domestic circuits.",
  },
  {
    number: 14,
    name: "Sources of Energy",
    blurb: "Conventional and non-conventional energy sources.",
  },
  {
    number: 15,
    name: "Our Environment",
    blurb: "Ecosystems, food chains, and waste management.",
  },
  {
    number: 16,
    name: "Sustainable Management of Natural Resources",
    blurb: "Conservation of forests, wildlife, water, and coal/petroleum.",
  },
]);

export const NCERT_SCIENCE_TEXTBOOKS: Record<9 | 10, NcertScienceTextbook> = {
  9: {
    board: "CBSE",
    classLevel: 9,
    subject: "Science",
    medium: "English",
    code: "iesc1",
    title: "NCERT Class 9 Science",
    listApi: "/api/ncert/class9-science",
    sourceNote: "Full NCERT Class 9 Science (Matter → Food Resources).",
    chapters: NCERT_CLASS9_SCIENCE_CHAPTERS,
  },
  10: {
    board: "CBSE",
    classLevel: 10,
    subject: "Science",
    medium: "English",
    code: "jesc1",
    title: "NCERT Class 10 Science",
    listApi: "/api/ncert/class10-science",
    sourceNote: "Full NCERT Class 10 Science (Chemical Reactions → Natural Resources).",
    chapters: NCERT_CLASS10_SCIENCE_CHAPTERS,
  },
};

export function ncertScienceChaptersForClass(
  classLevel: number,
): NcertScienceChapter[] {
  const book = NCERT_SCIENCE_TEXTBOOKS[classLevel as 9 | 10];
  return book?.chapters ?? [];
}
