/**
 * Attract-quality parent personas for seeding (no "demo" label in product UI).
 * Identifiable via registrationSource === SEED_PARENT_SOURCE for reset.
 * India-only — real contacts (name / phone / email). No overseas fakes.
 */
export const SEED_PARENT_SOURCE = "seed:parent-attract-v5";

export type SeedParent = {
  email: string;
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  area: string;
  /** Always india for this seed set */
  region: "india";
};

export type SeedRequirement = {
  parentEmail: string;
  subject: string;
  classLevel: string;
  city: string;
  area: string;
  modes: ("online" | "student_home" | "tutor_home")[];
  budgetMin: number;
  budgetMax: number;
  details: string;
  startTimeline: "immediately" | "within_week" | "within_month" | "flexible";
  interestCount: number;
  postedHoursAgo: number;
};

/** 42 real Indian parent contacts with email (name, phone, email only from source) */
export const INDIAN_SEED_PARENTS: SeedParent[] = [
  { email: "pratapkumar33311@gmail.com", name: "Pratap Kumar", phoneNumber: "6203144541", country: "India", city: "Bengaluru", area: "Koramangala", region: "india" },
  { email: "fazluddin740@gmail.com", name: "Fazluddin", phoneNumber: "7406894054", country: "India", city: "Bengaluru", area: "HSR Layout", region: "india" },
  { email: "nellabaliindu17@gmail.com", name: "Indu Nelaballi", phoneNumber: "8341589209", country: "India", city: "Bengaluru", area: "Indiranagar", region: "india" },
  { email: "tarunkumarar8769@gmail.com", name: "Tarun Kumar A R", phoneNumber: "9113663384", country: "India", city: "Bengaluru", area: "Whitefield", region: "india" },
  { email: "atishjana89@gmail.com", name: "Atish Jana", phoneNumber: "9474564656", country: "India", city: "Bengaluru", area: "Jayanagar", region: "india" },
  { email: "laliteshwarpolupalli@gmail.com", name: "Subrahmanyam Polupalli", phoneNumber: "9390769936", country: "India", city: "Hyderabad", area: "Gachibowli", region: "india" },
  { email: "sangeethahrmicrosoft@gmail.com", name: "Sangeetha S Ravi", phoneNumber: "7795417409", country: "India", city: "Hyderabad", area: "Banjara Hills", region: "india" },
  { email: "shaikhmohammadyasir07@gmail.com", name: "Mohammadyasir Shaikh", phoneNumber: "7829937303", country: "India", city: "Mumbai", area: "Andheri West", region: "india" },
  { email: "yacharamsateeshsatish6@gmail.com", name: "Sateesh Satish", phoneNumber: "7386095649", country: "India", city: "Mumbai", area: "Powai", region: "india" },
  { email: "992505170076@mail.jiit.ac.in", name: "Abdurrahman Akhtar", phoneNumber: "9625644684", country: "India", city: "Delhi", area: "Saket", region: "india" },
  { email: "manojarkachari28@gmail.com", name: "Manoj Arkachari", phoneNumber: "8618402036", country: "India", city: "Delhi", area: "Vasant Kunj", region: "india" },
  { email: "kumarbinit535@gmail.com", name: "Binit Kumar", phoneNumber: "9327437377", country: "India", city: "Pune", area: "Kothrud", region: "india" },
  { email: "panugantiprashanthprashant@gmail.com", name: "Prashant Panuganti", phoneNumber: "7702056063", country: "India", city: "Pune", area: "Baner", region: "india" },
  { email: "shiv77holla@gmail.com", name: "Ashwin Kumar S S", phoneNumber: "9916345562", country: "India", city: "Chennai", area: "Adyar", region: "india" },
  { email: "pchinni460@gmail.com", name: "Lily", phoneNumber: "6303370579", country: "India", city: "Kolkata", area: "Salt Lake", region: "india" },
  { email: "harshkodge@gmail.com", name: "Harsh Kodge", phoneNumber: "8088791303", country: "India", city: "Noida", area: "Sector 62", region: "india" },
  { email: "ananya.joshi304@gmail.com", name: "Ananya Joshi", phoneNumber: "7999073448", country: "India", city: "Gurugram", area: "DLF Phase 3", region: "india" },
  { email: "akhipopping@gmail.com", name: "Akhilesh Kumar", phoneNumber: "8197538979", country: "India", city: "Bengaluru", area: "Electronic City", region: "india" },
  { email: "pk2345340@gmail.com", name: "Priyanshu Kumar", phoneNumber: "8541854597", country: "India", city: "Bengaluru", area: "JP Nagar", region: "india" },
  { email: "paladivyasri9@gmail.com", name: "Pala Divya Sri", phoneNumber: "7569514258", country: "India", city: "Bengaluru", area: "Marathahalli", region: "india" },
  { email: "sakibali21936@gmail.com", name: "Sakib Alam", phoneNumber: "9939086315", country: "India", city: "Bengaluru", area: "Bellandur", region: "india" },
  { email: "devanshupandey2008@gmail.com", name: "Devanshu Pandey", phoneNumber: "7004768198", country: "India", city: "Mumbai", area: "Borivali East", region: "india" },
  { email: "bhuradianishka@gmail.com", name: "Nishka Bhuradia", phoneNumber: "7338813532", country: "India", city: "Hyderabad", area: "Kondapur", region: "india" },
  { email: "rubban2008@gmail.com", name: "Ruvan Choudhury", phoneNumber: "9337045205", country: "India", city: "Pune", area: "Koregaon Park", region: "india" },
  { email: "saithaniparthi@gmail.com", name: "Thaniparthi Sai Srujan", phoneNumber: "9392147558", country: "India", city: "Bengaluru", area: "Malleshwaram", region: "india" },
  { email: "ankitrawat6299@gmail.com", name: "Prakash Jaiswal", phoneNumber: "9279853811", country: "India", city: "Chennai", area: "T Nagar", region: "india" },
  { email: "sukeshkumar1712@gmail.com", name: "Sukesh Kumar", phoneNumber: "9110044055", country: "India", city: "Delhi", area: "Dwarka", region: "india" },
  { email: "gk5045287@gmail.com", name: "Bhavesh", phoneNumber: "8529866045", country: "India", city: "Bengaluru", area: "Yelahanka", region: "india" },
  { email: "monishkumar22052010@gmail.com", name: "Monish Kumar", phoneNumber: "9994805447", country: "India", city: "Bengaluru", area: "BTM Layout", region: "india" },
  { email: "rsemwal810@gmail.com", name: "Divyanshi", phoneNumber: "9406658915", country: "India", city: "Bengaluru", area: "Hebbal", region: "india" },
  { email: "shubhaadi92@gmail.com", name: "Shubham Kumar", phoneNumber: "9263585521", country: "India", city: "Patna", area: "Boring Road", region: "india" },
  { email: "badshakaran99@gmail.com", name: "Karan Dattataray Khandekar", phoneNumber: "7841876599", country: "India", city: "Pune", area: "Hadapsar", region: "india" },
  { email: "rounakok8@gmail.com", name: "Rounak Mondal", phoneNumber: "9332513718", country: "India", city: "Kolkata", area: "Salt Lake", region: "india" },
  { email: "gamingshivu2540@gmail.com", name: "Shivkant Yadav", phoneNumber: "8445032300", country: "India", city: "Lucknow", area: "Gomti Nagar", region: "india" },
  { email: "gforcestudy21@gmail.com", name: "Harsh Kumar", phoneNumber: "7907910620", country: "India", city: "Delhi", area: "Rohini", region: "india" },
  { email: "touseefmohammed1997@gmail.com", name: "Mohammed Shoaib Abdur Rahaman", phoneNumber: "8121821969", country: "India", city: "Hyderabad", area: "Madhapur", region: "india" },
  { email: "namantomar520@gmail.com", name: "Naman Kumar", phoneNumber: "9149066366", country: "India", city: "Noida", area: "Sector 18", region: "india" },
  { email: "kashinigam382@gmail.com", name: "Aryansh Nigam", phoneNumber: "6390070707", country: "India", city: "Kanpur", area: "Kakadeo", region: "india" },
  { email: "deveshvkoli06@gmail.com", name: "Devesh Vasant Koli", phoneNumber: "9049519444", country: "India", city: "Pune", area: "Pimpri", region: "india" },
  { email: "mdar0769@gmail.com", name: "Dar Mohsin Imtiyaz", phoneNumber: "9797659221", country: "India", city: "Srinagar", area: "Lal Chowk", region: "india" },
  { email: "vikramchandra72@gmail.com", name: "Vikram Chandra", phoneNumber: "8081918013", country: "India", city: "Ranchi", area: "Lalpur", region: "india" },
  { email: "poojabrathod9860@gmail.com", name: "Pooja Bhimrao Rathod", phoneNumber: "8983097051", country: "India", city: "Nagpur", area: "Dharampeth", region: "india" },
];

/** India-only seed set (42). Foreign fakes removed. */
export const ALL_SEED_PARENTS: SeedParent[] = [...INDIAN_SEED_PARENTS];

/** Board posts from Indian seed parents only */
export const SEED_REQUIREMENTS: SeedRequirement[] = [
  {
    parentEmail: "pratapkumar33311@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 10",
    city: "Bengaluru",
    area: "Koramangala",
    modes: ["student_home", "online"],
    budgetMin: 600,
    budgetMax: 900,
    details:
      "Looking for a patient CBSE Class 10 maths tutor for my daughter. She needs help with quadratic equations and trigonometry before board exams. Prefer evenings after 6 pm, 3 days a week.",
    startTimeline: "within_week",
    interestCount: 4,
    postedHoursAgo: 6,
  },
  {
    parentEmail: "fazluddin740@gmail.com",
    subject: "Physics",
    classLevel: "Class 12",
    city: "Bengaluru",
    area: "HSR Layout",
    modes: ["online", "tutor_home"],
    budgetMin: 800,
    budgetMax: 1200,
    details:
      "Need a strong Physics faculty for JEE Main prep — optics and modern physics. Son is in Class 12. Online is fine if the tutor explains with diagrams clearly.",
    startTimeline: "immediately",
    interestCount: 7,
    postedHoursAgo: 14,
  },
  {
    parentEmail: "nellabaliindu17@gmail.com",
    subject: "English",
    classLevel: "Class 6",
    city: "Bengaluru",
    area: "Indiranagar",
    modes: ["student_home"],
    budgetMin: 400,
    budgetMax: 650,
    details:
      "Home tutor for Class 6 English — reading comprehension and writing. Soft-spoken tutor preferred. Twice a week near 100 Feet Road.",
    startTimeline: "flexible",
    interestCount: 2,
    postedHoursAgo: 28,
  },
  {
    parentEmail: "tarunkumarar8769@gmail.com",
    subject: "Chemistry",
    classLevel: "Class 11",
    city: "Bengaluru",
    area: "Whitefield",
    modes: ["online"],
    budgetMin: 700,
    budgetMax: 1000,
    details:
      "Organic chemistry basics for Class 11 CBSE. Looking for someone who can give weekly tests. Weekend mornings work best for us.",
    startTimeline: "within_week",
    interestCount: 3,
    postedHoursAgo: 9,
  },
  {
    parentEmail: "atishjana89@gmail.com",
    subject: "Coding",
    classLevel: "Class 5",
    city: "Bengaluru",
    area: "Jayanagar",
    modes: ["online"],
    budgetMin: 500,
    budgetMax: 800,
    details:
      "Want to introduce Scratch / basic Python for my Class 5 kid in a fun way — not exam coaching. 1 hour on Saturdays.",
    startTimeline: "within_month",
    interestCount: 5,
    postedHoursAgo: 40,
  },
  {
    parentEmail: "laliteshwarpolupalli@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 8",
    city: "Hyderabad",
    area: "Gachibowli",
    modes: ["student_home", "tutor_home"],
    budgetMin: 450,
    budgetMax: 700,
    details:
      "Class 8 ICSE maths — algebra and geometry. Looking for a tutor who can come home Mon/Wed/Fri after school.",
    startTimeline: "immediately",
    interestCount: 6,
    postedHoursAgo: 3,
  },
  {
    parentEmail: "sangeethahrmicrosoft@gmail.com",
    subject: "Kannada",
    classLevel: "Class 4",
    city: "Hyderabad",
    area: "Banjara Hills",
    modes: ["student_home"],
    budgetMin: 350,
    budgetMax: 550,
    details:
      "Need help with school Kannada for Class 4. Reading and writing practice. Local tutor who knows the school syllabus preferred.",
    startTimeline: "flexible",
    interestCount: 1,
    postedHoursAgo: 55,
  },
  {
    parentEmail: "shaikhmohammadyasir07@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 9",
    city: "Mumbai",
    area: "Andheri West",
    modes: ["online", "student_home"],
    budgetMin: 500,
    budgetMax: 750,
    details:
      "Class 9 CBSE maths — struggling with polynomials. Open to online if the tutor is experienced with board pattern.",
    startTimeline: "within_week",
    interestCount: 4,
    postedHoursAgo: 18,
  },
  {
    parentEmail: "yacharamsateeshsatish6@gmail.com",
    subject: "Science",
    classLevel: "Class 7",
    city: "Mumbai",
    area: "Powai",
    modes: ["student_home"],
    budgetMin: 400,
    budgetMax: 600,
    details:
      "General science (physics + bio) for Class 7. Looking for someone who can make concepts interesting, not just notes.",
    startTimeline: "within_month",
    interestCount: 2,
    postedHoursAgo: 72,
  },
  {
    parentEmail: "992505170076@mail.jiit.ac.in",
    subject: "Accountancy",
    classLevel: "Class 12",
    city: "Delhi",
    area: "Saket",
    modes: ["online"],
    budgetMin: 700,
    budgetMax: 1100,
    details:
      "Commerce Class 12 Accountancy — partnership and company accounts. Prefer CA / experienced faculty. Evenings IST.",
    startTimeline: "immediately",
    interestCount: 3,
    postedHoursAgo: 11,
  },
  {
    parentEmail: "manojarkachari28@gmail.com",
    subject: "Hindi",
    classLevel: "Class 5",
    city: "Delhi",
    area: "Vasant Kunj",
    modes: ["student_home", "online"],
    budgetMin: 350,
    budgetMax: 500,
    details:
      "Hindi reading and grammar for Class 5. We're a Kannada-speaking home so need gentle pace. Twice a week.",
    startTimeline: "flexible",
    interestCount: 2,
    postedHoursAgo: 33,
  },
  {
    parentEmail: "kumarbinit535@gmail.com",
    subject: "Biology",
    classLevel: "Class 11",
    city: "Pune",
    area: "Kothrud",
    modes: ["online", "tutor_home"],
    budgetMin: 650,
    budgetMax: 950,
    details:
      "NEET foundation biology for Class 11 — cell biology and plant physiology. Looking for structured weekly plans.",
    startTimeline: "within_week",
    interestCount: 5,
    postedHoursAgo: 20,
  },
  {
    parentEmail: "panugantiprashanthprashant@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 3",
    city: "Pune",
    area: "Baner",
    modes: ["student_home"],
    budgetMin: 300,
    budgetMax: 450,
    details:
      "Class 3 maths — tables, word problems, and confidence building. Female tutor preferred for home visits.",
    startTimeline: "within_week",
    interestCount: 3,
    postedHoursAgo: 8,
  },
  {
    parentEmail: "shiv77holla@gmail.com",
    subject: "Computer Science",
    classLevel: "Class 11",
    city: "Chennai",
    area: "Adyar",
    modes: ["online"],
    budgetMin: 700,
    budgetMax: 1000,
    details:
      "Python and basics of data structures for Class 11 CS. Can do late evenings after 8 pm.",
    startTimeline: "flexible",
    interestCount: 4,
    postedHoursAgo: 45,
  },
  {
    parentEmail: "pchinni460@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 10",
    city: "Kolkata",
    area: "Salt Lake",
    modes: ["online", "student_home"],
    budgetMin: 700,
    budgetMax: 1100,
    details:
      "SSC Class 10 maths — geometry and algebra. Need someone who has taken board students before. Weekend slots preferred.",
    startTimeline: "immediately",
    interestCount: 6,
    postedHoursAgo: 5,
  },
  {
    parentEmail: "harshkodge@gmail.com",
    subject: "Economics",
    classLevel: "Class 12",
    city: "Noida",
    area: "Sector 62",
    modes: ["online"],
    budgetMin: 600,
    budgetMax: 900,
    details:
      "CBSE Class 12 Economics — micro + macro revision. Looking for clear explanations and past-year paper practice.",
    startTimeline: "within_week",
    interestCount: 2,
    postedHoursAgo: 26,
  },
  {
    parentEmail: "ananya.joshi304@gmail.com",
    subject: "English",
    classLevel: "Class 4",
    city: "Gurugram",
    area: "DLF Phase 3",
    modes: ["student_home"],
    budgetMin: 350,
    budgetMax: 550,
    details:
      "Looking for a warm home tutor for Class 4 English — phonics catch-up, reading aloud, and short paragraphs. Daughter is shy so patience matters. Twice a week after 5 pm near HRBR Layout.",
    startTimeline: "within_week",
    interestCount: 2,
    postedHoursAgo: 5,
  },
  {
    parentEmail: "akhipopping@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 11",
    city: "Bengaluru",
    area: "Electronic City",
    modes: ["online", "tutor_home"],
    budgetMin: 700,
    budgetMax: 1100,
    details:
      "CBSE Class 11 maths — limits, derivatives, and trigonometry. Son needs weekly chapter tests and clear board-pattern practice. Prefer evenings or early weekend slots.",
    startTimeline: "immediately",
    interestCount: 5,
    postedHoursAgo: 2,
  },
  {
    parentEmail: "pk2345340@gmail.com",
    subject: "Science",
    classLevel: "Class 8",
    city: "Bengaluru",
    area: "JP Nagar",
    modes: ["student_home", "online"],
    budgetMin: 450,
    budgetMax: 700,
    details:
      "Class 8 CBSE science (physics + chemistry basics). Need someone who explains with everyday examples, not only textbook notes. 3 days a week after school near 27th Main.",
    startTimeline: "within_week",
    interestCount: 3,
    postedHoursAgo: 9,
  },
  {
    parentEmail: "paladivyasri9@gmail.com",
    subject: "Coding",
    classLevel: "Class 7",
    city: "Bengaluru",
    area: "Marathahalli",
    modes: ["online"],
    budgetMin: 500,
    budgetMax: 850,
    details:
      "Want a project-based coding mentor for Class 7 — Scratch moving to beginner Python. Not exam coaching; small games and logic puzzles. One hour on weekday evenings.",
    startTimeline: "flexible",
    interestCount: 4,
    postedHoursAgo: 14,
  },
  {
    parentEmail: "sakibali21936@gmail.com",
    subject: "Chemistry",
    classLevel: "Class 12",
    city: "Bengaluru",
    area: "Bellandur",
    modes: ["online", "student_home"],
    budgetMin: 750,
    budgetMax: 1200,
    details:
      "Maharashtra Board Class 12 Chemistry — organic reactions and numericals. Looking for a tutor who has guided HSC students before. Prefer weekend mornings plus one weekday online session.",
    startTimeline: "immediately",
    interestCount: 6,
    postedHoursAgo: 4,
  },
  {
    parentEmail: "devanshupandey2008@gmail.com",
    subject: "Physics",
    classLevel: "Class 10",
    city: "Mumbai",
    area: "Borivali East",
    modes: ["online"],
    budgetMin: 600,
    budgetMax: 950,
    details:
      "CBSE Class 10 Physics revision before boards — light, electricity, and magnetic effects. Need past-year paper drills and formula clarity. Online only, evenings IST.",
    startTimeline: "within_week",
    interestCount: 4,
    postedHoursAgo: 7,
  },
  {
    parentEmail: "bhuradianishka@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 5",
    city: "Hyderabad",
    area: "Kondapur",
    modes: ["student_home"],
    budgetMin: 400,
    budgetMax: 650,
    details:
      "Class 5 maths for my son — fractions, decimals, and word problems. Looking for a local home tutor who can build confidence without rushing. Twice a week after 6 pm.",
    startTimeline: "within_week",
    interestCount: 3,
    postedHoursAgo: 11,
  },
];
