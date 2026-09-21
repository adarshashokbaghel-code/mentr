/**
 * CBSE / NCERT Biology chapter catalogs (Classes 11–12).
 * Same-origin PDFs via /api/ncert/class{N}-biology.
 */

export type NcertBiologyChapter = {
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

export type NcertBiologyTextbook = {
  board: "CBSE";
  classLevel: 11 | 12;
  subject: "Biology";
  medium: "English";
  code: string;
  title: string;
  listApi: string;
  sourceNote: string;
  chapters: NcertBiologyChapter[];
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
    downloadUrl: `/api/ncert/class${classLevel}-biology/${n}.pdf`,
    viewUrl: `/api/ncert/class${classLevel}-biology/${n}.pdf?view=1`,
    filename: `NCERT-Class${classLevel}-Biology-Ch${pad}-${slug}.pdf`,
  };
}

function buildChapters(
  classLevel: number,
  rows: { number: number; name: string; blurb: string; pdfFile: string }[],
): NcertBiologyChapter[] {
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

export const NCERT_CLASS11_BIOLOGY_CHAPTERS = buildChapters(11, [
  {
    number: 1,
    name: "The Living World",
    blurb: "Diversity, taxonomy, and binomial nomenclature.",
    pdfFile: "kebo101.pdf",
  },
  {
    number: 2,
    name: "Biological Classification",
    blurb: "Five-kingdom classification and major groups of organisms.",
    pdfFile: "kebo102.pdf",
  },
  {
    number: 3,
    name: "Plant Kingdom",
    blurb: "Algae, bryophytes, pteridophytes, gymnosperms, and angiosperms.",
    pdfFile: "kebo103.pdf",
  },
  {
    number: 4,
    name: "Animal Kingdom",
    blurb: "Basis of classification and major animal phyla.",
    pdfFile: "kebo104.pdf",
  },
  {
    number: 5,
    name: "Morphology of Flowering Plants",
    blurb: "Root, stem, leaf, flower, fruit, and seed morphology.",
    pdfFile: "kebo105.pdf",
  },
  {
    number: 6,
    name: "Anatomy of Flowering Plants",
    blurb: "Tissues, tissue systems, and secondary growth.",
    pdfFile: "kebo106.pdf",
  },
  {
    number: 7,
    name: "Structural Organisation in Animals",
    blurb: "Animal tissues and morphology of earthworm, cockroach, frog.",
    pdfFile: "kebo107.pdf",
  },
  {
    number: 8,
    name: "Cell: The Unit of Life",
    blurb: "Cell theory, prokaryotic and eukaryotic cell structure.",
    pdfFile: "kebo108.pdf",
  },
  {
    number: 9,
    name: "Biomolecules",
    blurb: "Carbohydrates, proteins, lipids, nucleic acids, and enzymes.",
    pdfFile: "kebo109.pdf",
  },
  {
    number: 10,
    name: "Cell Cycle and Cell Division",
    blurb: "Mitosis, meiosis, and the cell cycle.",
    pdfFile: "kebo110.pdf",
  },
  {
    number: 11,
    name: "Transport in Plants",
    blurb: "Water potential, xylem/phloem transport, and transpiration.",
    pdfFile: "kebo111.pdf",
  },
  {
    number: 12,
    name: "Mineral Nutrition",
    blurb: "Essential elements, deficiency symptoms, and nitrogen metabolism.",
    pdfFile: "kebo112.pdf",
  },
  {
    number: 13,
    name: "Photosynthesis in Higher Plants",
    blurb: "Light reactions, Calvin cycle, C4 pathway, and photorespiration.",
    pdfFile: "kebo113.pdf",
  },
  {
    number: 14,
    name: "Respiration in Plants",
    blurb: "Glycolysis, Krebs cycle, ETC, and respiratory quotient.",
    pdfFile: "kebo114.pdf",
  },
  {
    number: 15,
    name: "Plant Growth and Development",
    blurb: "Growth, differentiation, and plant growth regulators.",
    pdfFile: "kebo115.pdf",
  },
  {
    number: 16,
    name: "Digestion and Absorption",
    blurb: "Human digestive system, enzymes, and absorption.",
    pdfFile: "kebo116.pdf",
  },
  {
    number: 17,
    name: "Breathing and Exchange of Gases",
    blurb: "Human respiratory system, exchange, and transport of gases.",
    pdfFile: "kebo117.pdf",
  },
  {
    number: 18,
    name: "Body Fluids and Circulation",
    blurb: "Blood, lymph, and the human circulatory system.",
    pdfFile: "kebo118.pdf",
  },
  {
    number: 19,
    name: "Excretory Products and their Elimination",
    blurb: "Human excretory system, urine formation, and osmoregulation.",
    pdfFile: "kebo119.pdf",
  },
  {
    number: 20,
    name: "Locomotion and Movement",
    blurb: "Muscles, skeletal system, and types of movement.",
    pdfFile: "kebo120.pdf",
  },
  {
    number: 21,
    name: "Neural Control and Coordination",
    blurb: "Neuron, CNS, PNS, and the human eye and ear.",
    pdfFile: "kebo121.pdf",
  },
  {
    number: 22,
    name: "Chemical Coordination and Integration",
    blurb: "Endocrine glands and hormones.",
    pdfFile: "kebo122.pdf",
  },
]);

export const NCERT_CLASS12_BIOLOGY_CHAPTERS = buildChapters(12, [
  {
    number: 1,
    name: "Reproduction in Organisms",
    blurb: "Asexual and sexual reproduction across organisms.",
    pdfFile: "lebo101.pdf",
  },
  {
    number: 2,
    name: "Sexual Reproduction in Flowering Plants",
    blurb: "Flower structure, pollination, fertilisation, and seed development.",
    pdfFile: "lebo102.pdf",
  },
  {
    number: 3,
    name: "Human Reproduction",
    blurb: "Male and female reproductive systems, gametogenesis, and pregnancy.",
    pdfFile: "lebo103.pdf",
  },
  {
    number: 4,
    name: "Reproductive Health",
    blurb: "Contraception, STIs, infertility, and assisted reproductive technologies.",
    pdfFile: "lebo104.pdf",
  },
  {
    number: 5,
    name: "Principles of Inheritance and Variation",
    blurb: "Mendelism, linkage, sex determination, and genetic disorders.",
    pdfFile: "lebo105.pdf",
  },
  {
    number: 6,
    name: "Molecular Basis of Inheritance",
    blurb: "DNA structure, replication, transcription, translation, and regulation.",
    pdfFile: "lebo106.pdf",
  },
  {
    number: 7,
    name: "Evolution",
    blurb: "Origin of life, evidences, theories, and human evolution.",
    pdfFile: "lebo107.pdf",
  },
  {
    number: 8,
    name: "Human Health and Disease",
    blurb: "Pathogens, immunity, AIDS, cancer, and drug abuse.",
    pdfFile: "lebo108.pdf",
  },
  {
    number: 9,
    name: "Strategies for Enhancement in Food Production",
    blurb: "Animal husbandry, plant breeding, and tissue culture.",
    pdfFile: "lebo109.pdf",
  },
  {
    number: 10,
    name: "Microbes in Human Welfare",
    blurb: "Microbes in household products, industry, sewage, and biocontrol.",
    pdfFile: "lebo110.pdf",
  },
  {
    number: 11,
    name: "Biotechnology: Principles and Processes",
    blurb: "Genetic engineering tools, recombinant DNA, and bioprocess.",
    pdfFile: "lebo111.pdf",
  },
  {
    number: 12,
    name: "Biotechnology and its Applications",
    blurb: "Bt crops, gene therapy, transgenic animals, and ethical issues.",
    pdfFile: "lebo112.pdf",
  },
  {
    number: 13,
    name: "Organisms and Populations",
    blurb: "Organism–environment interactions and population attributes.",
    pdfFile: "lebo113.pdf",
  },
  {
    number: 14,
    name: "Ecosystem",
    blurb: "Structure, productivity, energy flow, and ecological pyramids.",
    pdfFile: "lebo114.pdf",
  },
  {
    number: 15,
    name: "Biodiversity and Conservation",
    blurb: "Patterns of biodiversity, loss, and conservation strategies.",
    pdfFile: "lebo115.pdf",
  },
  {
    number: 16,
    name: "Environmental Issues",
    blurb: "Pollution, greenhouse effect, ozone depletion, and degradation.",
    pdfFile: "lebo116.pdf",
  },
]);

export const NCERT_BIOLOGY_TEXTBOOKS: Record<11 | 12, NcertBiologyTextbook> = {
  11: {
    board: "CBSE",
    classLevel: 11,
    subject: "Biology",
    medium: "English",
    code: "kebo1",
    title: "NCERT Class 11 Biology",
    listApi: "/api/ncert/class11-biology",
    sourceNote:
      "Full NCERT Class 11 Biology (The Living World → Chemical Coordination), including end-of-chapter exercises.",
    chapters: NCERT_CLASS11_BIOLOGY_CHAPTERS,
  },
  12: {
    board: "CBSE",
    classLevel: 12,
    subject: "Biology",
    medium: "English",
    code: "lebo1",
    title: "NCERT Class 12 Biology",
    listApi: "/api/ncert/class12-biology",
    sourceNote:
      "Full NCERT Class 12 Biology (Reproduction → Environmental Issues), including end-of-chapter exercises.",
    chapters: NCERT_CLASS12_BIOLOGY_CHAPTERS,
  },
};

export function ncertBiologyChaptersForClass(
  classLevel: 11 | 12,
): NcertBiologyChapter[] {
  return NCERT_BIOLOGY_TEXTBOOKS[classLevel]?.chapters ?? [];
}
