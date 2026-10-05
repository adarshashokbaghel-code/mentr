/** Copy shared by /stats UI and its JSON-LD (server + client safe). */

export const STATS_PAGE_PATH = "/stats";

export const STATS_PRODUCTS = [
  {
    name: "Mentr tutor marketplace",
    path: "/search",
    description:
      "Find verified home and online tutors by subject, class, board and area. Book a free demo and chat on WhatsApp after the tutor accepts. Tutors keep 100% of fees.",
  },
  {
    name: "Mentr Learn",
    path: "/learn",
    description:
      "Free coding for Class 3–5 kids — computer science, AI literacy and math-for-coding across 60 modules with narrated video lessons, Build Arena, practice and Problem of the Day.",
  },
  {
    name: "Snap & Grade",
    path: "/snapandgrade",
    description:
      "Photograph a handwritten answer and get it graded as per CBSE step marking for Class 9–12 NCERT practice questions in Maths and Science.",
  },
  {
    name: "Free study tools",
    path: "/tools",
    description:
      "Free browser tools for students and parents: CGPA to percentage calculator, study timetable maker, PDF merge, compress, split, images to PDF, background remover and more.",
  },
] as const;

export const STATS_FAQS = [
  {
    question: "Is Mentr free for parents?",
    answer:
      "Yes. Parents can browse verified tutors without logging in, book demos, use Instant Connect and post requirements for free. There is no upfront charge and no platform fee — you pay the tutor directly for classes.",
  },
  {
    question: "How are tutors on Mentr verified?",
    answer:
      "Every tutor completes a profile with subjects, classes, experience and location before appearing in search. Parents can review profiles and take a trial class before deciding. WhatsApp contact unlocks only after the tutor accepts your request.",
  },
  {
    question: "Do tutors pay commission on Mentr?",
    answer:
      "No. Tutors list free and keep 100% of their tuition fees. There are no coins or lead fees. An optional Premium plan ($5/month, ₹449 in India) adds unlimited pitches, daily parent contact unlocks, instant new-parent alerts and featured placement.",
  },
  {
    question: "What is Mentr Learn?",
    answer:
      "Mentr Learn is a free, self-paced coding programme for Class 3–5 children covering computer science, AI literacy and math-for-coding across 60 modules, with 5+ hours of narrated video lessons, practice and a daily Problem of the Day.",
  },
  {
    question: "What is Snap & Grade?",
    answer:
      "Snap & Grade lets Class 9–12 students photograph a handwritten answer to an NCERT or board practice question and get it graded as per CBSE step marking, so they learn where marks are lost. It has 4,000+ practice questions and new users get free credits.",
  },
  {
    question: "Which free study tools does Mentr offer?",
    answer:
      "Mentr offers free browser-based tools including a CGPA to percentage calculator, study timetable PDF maker, PDF merge, compress, split and organise, images to PDF, PDF text extraction, background remover, name tags and a word counter. Files are processed in your browser.",
  },
  {
    question: "Can I find online tutors outside India on Mentr?",
    answer:
      "Yes. Mentr lists home tutors in Indian cities and online tutors who teach students worldwide. Filter by online mode to see tutors available for your time zone.",
  },
] as const;
