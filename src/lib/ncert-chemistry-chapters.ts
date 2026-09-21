/**
 * CBSE / NCERT Chemistry chapter catalogs (Classes 11–12).
 * Same-origin PDFs via /api/ncert/class{N}-chemistry.
 */

export type NcertChemistryChapter = {
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

export type NcertChemistryTextbook = {
  board: "CBSE";
  classLevel: 11 | 12;
  subject: "Chemistry";
  medium: "English";
  code: string;
  title: string;
  listApi: string;
  sourceNote: string;
  chapters: NcertChemistryChapter[];
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
    downloadUrl: `/api/ncert/class${classLevel}-chemistry/${n}.pdf`,
    viewUrl: `/api/ncert/class${classLevel}-chemistry/${n}.pdf?view=1`,
    filename: `NCERT-Class${classLevel}-Chemistry-Ch${pad}-${slug}.pdf`,
  };
}

function buildChapters(
  classLevel: number,
  rows: { number: number; name: string; blurb: string; pdfFile: string }[],
): NcertChemistryChapter[] {
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

export const NCERT_CLASS11_CHEMISTRY_CHAPTERS = buildChapters(11, [
  {
    number: 1,
    name: "Some Basic Concepts of Chemistry",
    blurb: "Mole concept, stoichiometry, and concentration terms.",
    pdfFile: "kech101.pdf",
  },
  {
    number: 2,
    name: "Structure of Atom",
    blurb: "Bohr model, quantum numbers, and electronic configuration.",
    pdfFile: "kech102.pdf",
  },
  {
    number: 3,
    name: "Classification of Elements and Periodicity in Properties",
    blurb: "Modern periodic table and periodic trends.",
    pdfFile: "kech103.pdf",
  },
  {
    number: 4,
    name: "Chemical Bonding and Molecular Structure",
    blurb: "VBT, hybridisation, VSEPR, and molecular orbital theory.",
    pdfFile: "kech104.pdf",
  },
  {
    number: 5,
    name: "States of Matter",
    blurb: "Gas laws, ideal gas equation, and intermolecular forces.",
    pdfFile: "kech105.pdf",
  },
  {
    number: 6,
    name: "Thermodynamics",
    blurb: "Enthalpy, entropy, Gibbs energy, and spontaneity.",
    pdfFile: "kech106.pdf",
  },
  {
    number: 7,
    name: "Equilibrium",
    blurb: "Chemical and ionic equilibrium, Ka, Kb, and buffer solutions.",
    pdfFile: "kech107.pdf",
  },
  {
    number: 8,
    name: "Redox Reactions",
    blurb: "Oxidation numbers, balancing redox, and electrochemical cells intro.",
    pdfFile: "kech201.pdf",
  },
  {
    number: 9,
    name: "Hydrogen",
    blurb: "Position of hydrogen, hydrides, and water chemistry.",
    pdfFile: "kech202.pdf",
  },
  {
    number: 10,
    name: "The s-Block Elements",
    blurb: "Alkali and alkaline earth metals — properties and compounds.",
    pdfFile: "kech203.pdf",
  },
  {
    number: 11,
    name: "The p-Block Elements",
    blurb: "Groups 13 and 14 — boron, carbon, and their compounds.",
    pdfFile: "kech204.pdf",
  },
  {
    number: 12,
    name: "Organic Chemistry – Some Basic Principles and Techniques",
    blurb: "IUPAC, isomerism, electronic effects, and purification methods.",
    pdfFile: "kech205.pdf",
  },
  {
    number: 13,
    name: "Hydrocarbons",
    blurb: "Alkanes, alkenes, alkynes, and aromatic hydrocarbons.",
    pdfFile: "kech206.pdf",
  },
  {
    number: 14,
    name: "Environmental Chemistry",
    blurb: "Atmospheric pollution, water pollution, and green chemistry.",
    pdfFile: "kech207.pdf",
  },
]);

export const NCERT_CLASS12_CHEMISTRY_CHAPTERS = buildChapters(12, [
  {
    number: 1,
    name: "The Solid State",
    blurb: "Crystal lattices, packing, imperfections, and electrical properties.",
    pdfFile: "lech101.pdf",
  },
  {
    number: 2,
    name: "Solutions",
    blurb: "Concentration, Raoult’s law, colligative properties, and van’t Hoff factor.",
    pdfFile: "lech102.pdf",
  },
  {
    number: 3,
    name: "Electrochemistry",
    blurb: "Galvanic cells, Nernst equation, conductance, and electrolysis.",
    pdfFile: "lech103.pdf",
  },
  {
    number: 4,
    name: "Chemical Kinetics",
    blurb: "Rate laws, order, molecularity, and Arrhenius equation.",
    pdfFile: "lech104.pdf",
  },
  {
    number: 5,
    name: "Surface Chemistry",
    blurb: "Adsorption, catalysis, colloids, and emulsions.",
    pdfFile: "lech105.pdf",
  },
  {
    number: 6,
    name: "General Principles and Processes of Isolation of Elements",
    blurb: "Occurrence, concentration, reduction, and refining of metals.",
    pdfFile: "lech106.pdf",
  },
  {
    number: 7,
    name: "The p-Block Elements",
    blurb: "Groups 15–18 — nitrogen, oxygen, halogens, and noble gases.",
    pdfFile: "lech107.pdf",
  },
  {
    number: 8,
    name: "The d- and f-Block Elements",
    blurb: "Transition metals, lanthanoids, and actinoids.",
    pdfFile: "lech108.pdf",
  },
  {
    number: 9,
    name: "Coordination Compounds",
    blurb: "Werner’s theory, nomenclature, isomerism, and bonding theories.",
    pdfFile: "lech109.pdf",
  },
  {
    number: 10,
    name: "Haloalkanes and Haloarenes",
    blurb: "Nomenclature, preparation, and nucleophilic substitution.",
    pdfFile: "lech201.pdf",
  },
  {
    number: 11,
    name: "Alcohols, Phenols and Ethers",
    blurb: "Preparation, properties, and reactions of alcohols, phenols, ethers.",
    pdfFile: "lech202.pdf",
  },
  {
    number: 12,
    name: "Aldehydes, Ketones and Carboxylic Acids",
    blurb: "Carbonyl compounds — preparation, nucleophilic addition, and acids.",
    pdfFile: "lech203.pdf",
  },
  {
    number: 13,
    name: "Amines",
    blurb: "Classification, preparation, basicity, and diazonium salts.",
    pdfFile: "lech204.pdf",
  },
  {
    number: 14,
    name: "Biomolecules",
    blurb: "Carbohydrates, proteins, vitamins, nucleic acids, and enzymes.",
    pdfFile: "lech205.pdf",
  },
  {
    number: 15,
    name: "Polymers",
    blurb: "Classification, polymerisation, and commercially important polymers.",
    pdfFile: "lech206.pdf",
  },
  {
    number: 16,
    name: "Chemistry in Everyday Life",
    blurb: "Drugs, cleansing agents, and food additives.",
    pdfFile: "lech207.pdf",
  },
]);

export const NCERT_CHEMISTRY_TEXTBOOKS: Record<11 | 12, NcertChemistryTextbook> = {
  11: {
    board: "CBSE",
    classLevel: 11,
    subject: "Chemistry",
    medium: "English",
    code: "kech1+kech2",
    title: "NCERT Class 11 Chemistry (Parts I & II)",
    listApi: "/api/ncert/class11-chemistry",
    sourceNote:
      "Full NCERT Class 11 Chemistry (Basic Concepts → Environmental Chemistry), including end-of-chapter exercises.",
    chapters: NCERT_CLASS11_CHEMISTRY_CHAPTERS,
  },
  12: {
    board: "CBSE",
    classLevel: 12,
    subject: "Chemistry",
    medium: "English",
    code: "lech1+lech2",
    title: "NCERT Class 12 Chemistry (Parts I & II)",
    listApi: "/api/ncert/class12-chemistry",
    sourceNote:
      "Full NCERT Class 12 Chemistry (Solid State → Chemistry in Everyday Life), including end-of-chapter exercises.",
    chapters: NCERT_CLASS12_CHEMISTRY_CHAPTERS,
  },
};

export function ncertChemistryChaptersForClass(
  classLevel: 11 | 12,
): NcertChemistryChapter[] {
  return NCERT_CHEMISTRY_TEXTBOOKS[classLevel]?.chapters ?? [];
}
