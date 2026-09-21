/**
 * CBSE / NCERT Physics chapter catalogs (Classes 11–12).
 * Same-origin PDFs via /api/ncert/class{N}-physics.
 */

export type NcertPhysicsChapter = {
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

export type NcertPhysicsTextbook = {
  board: "CBSE";
  classLevel: 11 | 12;
  subject: "Physics";
  medium: "English";
  code: string;
  title: string;
  listApi: string;
  sourceNote: string;
  chapters: NcertPhysicsChapter[];
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
    downloadUrl: `/api/ncert/class${classLevel}-physics/${n}.pdf`,
    viewUrl: `/api/ncert/class${classLevel}-physics/${n}.pdf?view=1`,
    filename: `NCERT-Class${classLevel}-Physics-Ch${pad}-${slug}.pdf`,
  };
}

function buildChapters(
  classLevel: number,
  rows: { number: number; name: string; blurb: string; pdfFile: string }[],
): NcertPhysicsChapter[] {
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

export const NCERT_CLASS11_PHYSICS_CHAPTERS = buildChapters(11, [
  {
    number: 1,
    name: "Units and Measurement",
    blurb: "SI units, significant figures, and dimensional analysis.",
    pdfFile: "keph101.pdf",
  },
  {
    number: 2,
    name: "Motion in a Straight Line",
    blurb: "Position, velocity, acceleration, and kinematic equations.",
    pdfFile: "keph102.pdf",
  },
  {
    number: 3,
    name: "Motion in a Plane",
    blurb: "Vectors, projectile motion, and uniform circular motion.",
    pdfFile: "keph103.pdf",
  },
  {
    number: 4,
    name: "Laws of Motion",
    blurb: "Newton’s laws, friction, and circular motion dynamics.",
    pdfFile: "keph104.pdf",
  },
  {
    number: 5,
    name: "Work, Energy and Power",
    blurb: "Work–energy theorem, conservation of energy, and collisions.",
    pdfFile: "keph105.pdf",
  },
  {
    number: 6,
    name: "System of Particles and Rotational Motion",
    blurb: "Centre of mass, torque, angular momentum, and rigid body rotation.",
    pdfFile: "keph106.pdf",
  },
  {
    number: 7,
    name: "Gravitation",
    blurb: "Newton’s law of gravitation, Kepler’s laws, and satellites.",
    pdfFile: "keph107.pdf",
  },
  {
    number: 8,
    name: "Mechanical Properties of Solids",
    blurb: "Elasticity, stress, strain, and Hooke’s law.",
    pdfFile: "keph201.pdf",
  },
  {
    number: 9,
    name: "Mechanical Properties of Fluids",
    blurb: "Pressure, buoyancy, Bernoulli’s principle, and viscosity.",
    pdfFile: "keph202.pdf",
  },
  {
    number: 10,
    name: "Thermal Properties of Matter",
    blurb: "Heat, temperature, expansion, and calorimetry.",
    pdfFile: "keph203.pdf",
  },
  {
    number: 11,
    name: "Thermodynamics",
    blurb: "Laws of thermodynamics, heat engines, and Carnot cycle.",
    pdfFile: "keph204.pdf",
  },
  {
    number: 12,
    name: "Kinetic Theory",
    blurb: "Ideal gas, molecular speeds, and mean free path.",
    pdfFile: "keph205.pdf",
  },
  {
    number: 13,
    name: "Oscillations",
    blurb: "SHM, energy in oscillations, and the simple pendulum.",
    pdfFile: "keph206.pdf",
  },
  {
    number: 14,
    name: "Waves",
    blurb: "Wave motion, speed of waves, and superposition.",
    pdfFile: "keph207.pdf",
  },
]);

export const NCERT_CLASS12_PHYSICS_CHAPTERS = buildChapters(12, [
  {
    number: 1,
    name: "Electric Charges and Fields",
    blurb: "Coulomb’s law, electric field, and Gauss’s theorem.",
    pdfFile: "leph101.pdf",
  },
  {
    number: 2,
    name: "Electrostatic Potential and Capacitance",
    blurb: "Potential, capacitors, and energy stored in a capacitor.",
    pdfFile: "leph102.pdf",
  },
  {
    number: 3,
    name: "Current Electricity",
    blurb: "Ohm’s law, Kirchhoff’s rules, and electrical instruments.",
    pdfFile: "leph103.pdf",
  },
  {
    number: 4,
    name: "Moving Charges and Magnetism",
    blurb: "Magnetic force, Biot–Savart law, and Ampere’s law.",
    pdfFile: "leph104.pdf",
  },
  {
    number: 5,
    name: "Magnetism and Matter",
    blurb: "Bar magnet, Earth’s magnetism, and magnetic materials.",
    pdfFile: "leph105.pdf",
  },
  {
    number: 6,
    name: "Electromagnetic Induction",
    blurb: "Faraday’s law, Lenz’s law, and inductance.",
    pdfFile: "leph106.pdf",
  },
  {
    number: 7,
    name: "Alternating Current",
    blurb: "AC circuits, resonance, and power in AC.",
    pdfFile: "leph107.pdf",
  },
  {
    number: 8,
    name: "Electromagnetic Waves",
    blurb: "Displacement current and the electromagnetic spectrum.",
    pdfFile: "leph108.pdf",
  },
  {
    number: 9,
    name: "Ray Optics and Optical Instruments",
    blurb: "Reflection, refraction, lenses, microscopes, and telescopes.",
    pdfFile: "leph201.pdf",
  },
  {
    number: 10,
    name: "Wave Optics",
    blurb: "Huygens principle, interference, and diffraction.",
    pdfFile: "leph202.pdf",
  },
  {
    number: 11,
    name: "Dual Nature of Radiation and Matter",
    blurb: "Photoelectric effect and de Broglie waves.",
    pdfFile: "leph203.pdf",
  },
  {
    number: 12,
    name: "Atoms",
    blurb: "Bohr model and atomic spectra.",
    pdfFile: "leph204.pdf",
  },
  {
    number: 13,
    name: "Nuclei",
    blurb: "Nuclear structure, radioactivity, and nuclear energy.",
    pdfFile: "leph205.pdf",
  },
  {
    number: 14,
    name: "Semiconductor Electronics: Materials, Devices and Simple Circuits",
    blurb: "Intrinsic/extrinsic semiconductors, diodes, and logic gates.",
    pdfFile: "leph206.pdf",
  },
]);

export const NCERT_PHYSICS_TEXTBOOKS: Record<11 | 12, NcertPhysicsTextbook> = {
  11: {
    board: "CBSE",
    classLevel: 11,
    subject: "Physics",
    medium: "English",
    code: "keph1+keph2",
    title: "NCERT Class 11 Physics (Parts I & II)",
    listApi: "/api/ncert/class11-physics",
    sourceNote:
      "Full NCERT Class 11 Physics (Units & Measurement → Waves), including exercises and additional/optional sets.",
    chapters: NCERT_CLASS11_PHYSICS_CHAPTERS,
  },
  12: {
    board: "CBSE",
    classLevel: 12,
    subject: "Physics",
    medium: "English",
    code: "leph1+leph2",
    title: "NCERT Class 12 Physics (Parts I & II)",
    listApi: "/api/ncert/class12-physics",
    sourceNote:
      "Full NCERT Class 12 Physics (Electric Charges → Semiconductors), including exercises and additional/optional sets.",
    chapters: NCERT_CLASS12_PHYSICS_CHAPTERS,
  },
};

export function ncertPhysicsChaptersForClass(
  classLevel: 11 | 12,
): NcertPhysicsChapter[] {
  return NCERT_PHYSICS_TEXTBOOKS[classLevel]?.chapters ?? [];
}
