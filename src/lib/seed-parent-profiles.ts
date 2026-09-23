/**
 * Attract-quality parent personas for seeding (no "demo" label in product UI).
 * Identifiable via registrationSource === SEED_PARENT_SOURCE for reset.
 */
export const SEED_PARENT_SOURCE = "seed:parent-attract-v1";

export type SeedParent = {
  email: string;
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  area: string;
  /** Indian vs overseas persona */
  region: "india" | "foreign";
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

/** 35 Indian parents — Bengaluru-focused, genuine local names & numbers */
export const INDIAN_SEED_PARENTS: SeedParent[] = [
  { email: "priya.menon.jayanagar@gmail.com", name: "Priya Menon", phoneNumber: "9845123401", country: "India", city: "Bengaluru", area: "Jayanagar", region: "india" },
  { email: "rajesh.iyer.koramangala@gmail.com", name: "Rajesh Iyer", phoneNumber: "9876501234", country: "India", city: "Bengaluru", area: "Koramangala", region: "india" },
  { email: "anjali.sharma.indiranagar@gmail.com", name: "Anjali Sharma", phoneNumber: "9900123456", country: "India", city: "Bengaluru", area: "Indiranagar", region: "india" },
  { email: "suresh.nair.hsr@gmail.com", name: "Suresh Nair", phoneNumber: "9731122088", country: "India", city: "Bengaluru", area: "HSR Layout", region: "india" },
  { email: "meera.krishnan.whitefield@gmail.com", name: "Meera Krishnan", phoneNumber: "9886014725", country: "India", city: "Bengaluru", area: "Whitefield", region: "india" },
  { email: "vikram.reddy.btm@gmail.com", name: "Vikram Reddy", phoneNumber: "9611557788", country: "India", city: "Bengaluru", area: "BTM Layout", region: "india" },
  { email: "divya.patel.malleshwaram@gmail.com", name: "Divya Patel", phoneNumber: "9845098765", country: "India", city: "Bengaluru", area: "Malleshwaram", region: "india" },
  { email: "arun.kumar.electroniccity@gmail.com", name: "Arun Kumar", phoneNumber: "9900881122", country: "India", city: "Bengaluru", area: "Electronic City", region: "india" },
  { email: "lakshmi.venugopal.banashankari@gmail.com", name: "Lakshmi Venugopal", phoneNumber: "9741123344", country: "India", city: "Bengaluru", area: "Banashankari", region: "india" },
  { email: "karthik.rao.hebbal@gmail.com", name: "Karthik Rao", phoneNumber: "9986004455", country: "India", city: "Bengaluru", area: "Hebbal", region: "india" },
  { email: "nisha.gupta.marathahalli@gmail.com", name: "Nisha Gupta", phoneNumber: "9845226677", country: "India", city: "Bengaluru", area: "Marathahalli", region: "india" },
  { email: "amit.joshi.yelahanka@gmail.com", name: "Amit Joshi", phoneNumber: "9611223399", country: "India", city: "Bengaluru", area: "Yelahanka", region: "india" },
  { email: "sowmya.bhat.jpnagar@gmail.com", name: "Sowmya Bhat", phoneNumber: "9886770011", country: "India", city: "Bengaluru", area: "JP Nagar", region: "india" },
  { email: "ravi.chandran.rtnagar@gmail.com", name: "Ravi Chandran", phoneNumber: "9741885566", country: "India", city: "Bengaluru", area: "RT Nagar", region: "india" },
  { email: "pooja.desai.sarjapur@gmail.com", name: "Pooja Desai", phoneNumber: "9900778899", country: "India", city: "Bengaluru", area: "Sarjapur Road", region: "india" },
  { email: "manoj.singh.basavanagudi@gmail.com", name: "Manoj Singh", phoneNumber: "9845001122", country: "India", city: "Bengaluru", area: "Basavanagudi", region: "india" },
  { email: "kavitha.suresh.rrnagar@gmail.com", name: "Kavitha Suresh", phoneNumber: "9731456789", country: "India", city: "Bengaluru", area: "RR Nagar", region: "india" },
  { email: "deepak.mishra.bellandur@gmail.com", name: "Deepak Mishra", phoneNumber: "9986443322", country: "India", city: "Bengaluru", area: "Bellandur", region: "india" },
  { email: "anita.fernandes.fraser@gmail.com", name: "Anita Fernandes", phoneNumber: "9845765432", country: "India", city: "Bengaluru", area: "Fraser Town", region: "india" },
  { email: "sanjay.pillai.ulsoor@gmail.com", name: "Sanjay Pillai", phoneNumber: "9611889900", country: "India", city: "Bengaluru", area: "Ulsoor", region: "india" },
  { email: "rekha.iyengar.vijayanagar@gmail.com", name: "Rekha Iyengar", phoneNumber: "9900112233", country: "India", city: "Bengaluru", area: "Vijayanagar", region: "india" },
  { email: "naveen.shetty.kundalahalli@gmail.com", name: "Naveen Shetty", phoneNumber: "9741009988", country: "India", city: "Bengaluru", area: "Kundalahalli", region: "india" },
  { email: "shweta.agarwal.baner@gmail.com", name: "Shweta Agarwal", phoneNumber: "9876540099", country: "India", city: "Pune", area: "Baner", region: "india" },
  { email: "rahul.mehta.andheri@gmail.com", name: "Rahul Mehta", phoneNumber: "9820123456", country: "India", city: "Mumbai", area: "Andheri West", region: "india" },
  { email: "neha.kapoor.saket@gmail.com", name: "Neha Kapoor", phoneNumber: "9810011223", country: "India", city: "Delhi", area: "Saket", region: "india" },
  { email: "gautam.das.saltlake@gmail.com", name: "Gautam Das", phoneNumber: "9830012345", country: "India", city: "Kolkata", area: "Salt Lake", region: "india" },
  { email: "fatima.shaikh.banjara@gmail.com", name: "Fatima Shaikh", phoneNumber: "9849011223", country: "India", city: "Hyderabad", area: "Banjara Hills", region: "india" },
  { email: "arjun.varma.adyar@gmail.com", name: "Arjun Varma", phoneNumber: "9884012345", country: "India", city: "Chennai", area: "Adyar", region: "india" },
  { email: "ishita.bose.gachibowli@gmail.com", name: "Ishita Bose", phoneNumber: "9000123456", country: "India", city: "Hyderabad", area: "Gachibowli", region: "india" },
  { email: "pranav.kulkarni.kothrud@gmail.com", name: "Pranav Kulkarni", phoneNumber: "9822098765", country: "India", city: "Pune", area: "Kothrud", region: "india" },
  { email: "sneha.thakur.powai@gmail.com", name: "Sneha Thakur", phoneNumber: "9820456789", country: "India", city: "Mumbai", area: "Powai", region: "india" },
  { email: "harish.gupta.noida@gmail.com", name: "Harish Gupta", phoneNumber: "9811122334", country: "India", city: "Noida", area: "Sector 62", region: "india" },
  { email: "aishwarya.rao.hsrlayout@gmail.com", name: "Aishwarya Rao", phoneNumber: "9845007788", country: "India", city: "Bengaluru", area: "HSR Layout", region: "india" },
  { email: "rohit.bansal.gurgaon@gmail.com", name: "Rohit Bansal", phoneNumber: "9810099887", country: "India", city: "Gurugram", area: "DLF Phase 3", region: "india" },
  { email: "tanvi.joshi.whitefield2@gmail.com", name: "Tanvi Joshi", phoneNumber: "9886001122", country: "India", city: "Bengaluru", area: "Whitefield", region: "india" },
];

/** 25 overseas parents — looking for online / India-curriculum tutors */
export const FOREIGN_SEED_PARENTS: SeedParent[] = [
  { email: "sarah.mitchell.dxb@outlook.com", name: "Sarah Mitchell", phoneNumber: "+971501234567", country: "United Arab Emirates", city: "Dubai", area: "Jumeirah", region: "foreign" },
  { email: "james.walker.london@outlook.com", name: "James Walker", phoneNumber: "+447911123456", country: "United Kingdom", city: "London", area: "Wimbledon", region: "foreign" },
  { email: "aisha.khan.sg@outlook.com", name: "Aisha Khan", phoneNumber: "+6591234567", country: "Singapore", city: "Singapore", area: "Bukit Timah", region: "foreign" },
  { email: "michael.chen.nyc@outlook.com", name: "Michael Chen", phoneNumber: "+12125550198", country: "United States", city: "New York", area: "Queens", region: "foreign" },
  { email: "emily.brown.toronto@outlook.com", name: "Emily Brown", phoneNumber: "+14165550123", country: "Canada", city: "Toronto", area: "North York", region: "foreign" },
  { email: "omar.hassan.abu@outlook.com", name: "Omar Hassan", phoneNumber: "+971554433221", country: "United Arab Emirates", city: "Abu Dhabi", area: "Al Reem Island", region: "foreign" },
  { email: "sophia.mueller.berlin@outlook.com", name: "Sophia Müller", phoneNumber: "+491701234567", country: "Germany", city: "Berlin", area: "Charlottenburg", region: "foreign" },
  { email: "daniel.okonkwo.lagos@outlook.com", name: "Daniel Okonkwo", phoneNumber: "+2348012345678", country: "Nigeria", city: "Lagos", area: "Lekki", region: "foreign" },
  { email: "priyanka.das.sydney@outlook.com", name: "Priyanka Das", phoneNumber: "+61412345678", country: "Australia", city: "Sydney", area: "Parramatta", region: "foreign" },
  { email: "thomas.nguyen.hcmc@outlook.com", name: "Thomas Nguyen", phoneNumber: "+84901234567", country: "Vietnam", city: "Ho Chi Minh City", area: "District 7", region: "foreign" },
  { email: "fatima.alrashid.riyadh@outlook.com", name: "Fatima Al-Rashid", phoneNumber: "+966501234567", country: "Saudi Arabia", city: "Riyadh", area: "Olaya", region: "foreign" },
  { email: "lucas.silva.sp@outlook.com", name: "Lucas Silva", phoneNumber: "+5511987654321", country: "Brazil", city: "São Paulo", area: "Pinheiros", region: "foreign" },
  { email: "yuki.tanaka.tokyo@outlook.com", name: "Yuki Tanaka", phoneNumber: "+819012345678", country: "Japan", city: "Tokyo", area: "Setagaya", region: "foreign" },
  { email: "amelia.scott.manchester@outlook.com", name: "Amelia Scott", phoneNumber: "+447700900123", country: "United Kingdom", city: "Manchester", area: "Didsbury", region: "foreign" },
  { email: "kevin.obrien.dublin@outlook.com", name: "Kevin O'Brien", phoneNumber: "+353871234567", country: "Ireland", city: "Dublin", area: "Rathmines", region: "foreign" },
  { email: "nina.petrov.moscow@outlook.com", name: "Nina Petrov", phoneNumber: "+79031234567", country: "Russia", city: "Moscow", area: "Khamovniki", region: "foreign" },
  { email: "hassan.ali.doha@outlook.com", name: "Hassan Ali", phoneNumber: "+97455123456", country: "Qatar", city: "Doha", area: "West Bay", region: "foreign" },
  { email: "claire.dupont.paris@outlook.com", name: "Claire Dupont", phoneNumber: "+33612345678", country: "France", city: "Paris", area: "15th Arrondissement", region: "foreign" },
  { email: "rajiv.malhotra.sf@outlook.com", name: "Rajiv Malhotra", phoneNumber: "+14155550167", country: "United States", city: "San Francisco", area: "Sunset District", region: "foreign" },
  { email: "leila.benali.casablanca@outlook.com", name: "Leila Benali", phoneNumber: "+212612345678", country: "Morocco", city: "Casablanca", area: "Maarif", region: "foreign" },
  { email: "anders.berg.stockholm@outlook.com", name: "Anders Berg", phoneNumber: "+46701234567", country: "Sweden", city: "Stockholm", area: "Södermalm", region: "foreign" },
  { email: "maria.garcia.madrid@outlook.com", name: "María García", phoneNumber: "+34612345678", country: "Spain", city: "Madrid", area: "Chamberí", region: "foreign" },
  { email: "william.park.seoul@outlook.com", name: "William Park", phoneNumber: "+821012345678", country: "South Korea", city: "Seoul", area: "Gangnam", region: "foreign" },
  { email: "zara.ahmed.kl@outlook.com", name: "Zara Ahmed", phoneNumber: "+60123456789", country: "Malaysia", city: "Kuala Lumpur", area: "Mont Kiara", region: "foreign" },
  { email: "ethan.wilson.auckland@outlook.com", name: "Ethan Wilson", phoneNumber: "+64211234567", country: "New Zealand", city: "Auckland", area: "Remuera", region: "foreign" },
];

export const ALL_SEED_PARENTS: SeedParent[] = [
  ...INDIAN_SEED_PARENTS,
  ...FOREIGN_SEED_PARENTS,
];

/** 25 board posts from a mix of Indian + foreign parents */
export const SEED_REQUIREMENTS: SeedRequirement[] = [
  {
    parentEmail: "priya.menon.jayanagar@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 10",
    city: "Bengaluru",
    area: "Jayanagar",
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
    parentEmail: "rajesh.iyer.koramangala@gmail.com",
    subject: "Physics",
    classLevel: "Class 12",
    city: "Bengaluru",
    area: "Koramangala",
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
    parentEmail: "anjali.sharma.indiranagar@gmail.com",
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
    parentEmail: "suresh.nair.hsr@gmail.com",
    subject: "Chemistry",
    classLevel: "Class 11",
    city: "Bengaluru",
    area: "HSR Layout",
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
    parentEmail: "meera.krishnan.whitefield@gmail.com",
    subject: "Coding",
    classLevel: "Class 5",
    city: "Bengaluru",
    area: "Whitefield",
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
    parentEmail: "vikram.reddy.btm@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 8",
    city: "Bengaluru",
    area: "BTM Layout",
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
    parentEmail: "divya.patel.malleshwaram@gmail.com",
    subject: "Kannada",
    classLevel: "Class 4",
    city: "Bengaluru",
    area: "Malleshwaram",
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
    parentEmail: "arun.kumar.electroniccity@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 9",
    city: "Bengaluru",
    area: "Electronic City",
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
    parentEmail: "lakshmi.venugopal.banashankari@gmail.com",
    subject: "Science",
    classLevel: "Class 7",
    city: "Bengaluru",
    area: "Banashankari",
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
    parentEmail: "karthik.rao.hebbal@gmail.com",
    subject: "Accountancy",
    classLevel: "Class 12",
    city: "Bengaluru",
    area: "Hebbal",
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
    parentEmail: "nisha.gupta.marathahalli@gmail.com",
    subject: "Hindi",
    classLevel: "Class 5",
    city: "Bengaluru",
    area: "Marathahalli",
    modes: ["student_home", "online"],
    budgetMin: 350,
    budgetMax: 500,
    details:
      "Hindi reading and grammar for Class 5. We’re a Kannada-speaking home so need gentle pace. Twice a week.",
    startTimeline: "flexible",
    interestCount: 2,
    postedHoursAgo: 33,
  },
  {
    parentEmail: "sowmya.bhat.jpnagar@gmail.com",
    subject: "Biology",
    classLevel: "Class 11",
    city: "Bengaluru",
    area: "JP Nagar",
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
    parentEmail: "pooja.desai.sarjapur@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 3",
    city: "Bengaluru",
    area: "Sarjapur Road",
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
    parentEmail: "deepak.mishra.bellandur@gmail.com",
    subject: "Computer Science",
    classLevel: "Class 11",
    city: "Bengaluru",
    area: "Bellandur",
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
    parentEmail: "rahul.mehta.andheri@gmail.com",
    subject: "Mathematics",
    classLevel: "Class 10",
    city: "Mumbai",
    area: "Andheri West",
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
    parentEmail: "neha.kapoor.saket@gmail.com",
    subject: "Economics",
    classLevel: "Class 12",
    city: "Delhi",
    area: "Saket",
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
    parentEmail: "sarah.mitchell.dxb@outlook.com",
    subject: "Mathematics",
    classLevel: "Class 9",
    city: "Dubai",
    area: "Jumeirah",
    modes: ["online"],
    budgetMin: 800,
    budgetMax: 1400,
    details:
      "Our daughter follows CBSE via an Indian school in Dubai. Need an online maths tutor in IST evenings for Class 9 — algebra focus. Native English or clear Indian English both fine.",
    startTimeline: "within_week",
    interestCount: 5,
    postedHoursAgo: 12,
  },
  {
    parentEmail: "james.walker.london@outlook.com",
    subject: "Physics",
    classLevel: "Class 11",
    city: "London",
    area: "Wimbledon",
    modes: ["online"],
    budgetMin: 900,
    budgetMax: 1500,
    details:
      "Looking for an online Physics mentor for Class 11 (CBSE) while we are based in London. Prefer tutors experienced with board + competitive exam overlap. GMT evenings / IST mornings.",
    startTimeline: "flexible",
    interestCount: 3,
    postedHoursAgo: 36,
  },
  {
    parentEmail: "aisha.khan.sg@outlook.com",
    subject: "Chemistry",
    classLevel: "Class 10",
    city: "Singapore",
    area: "Bukit Timah",
    modes: ["online"],
    budgetMin: 750,
    budgetMax: 1200,
    details:
      "CBSE Class 10 Chemistry revision before boards — acids, bases, metals. Online only. Looking for patient teaching style.",
    startTimeline: "immediately",
    interestCount: 4,
    postedHoursAgo: 7,
  },
  {
    parentEmail: "michael.chen.nyc@outlook.com",
    subject: "Mathematics",
    classLevel: "Class 8",
    city: "New York",
    area: "Queens",
    modes: ["online"],
    budgetMin: 700,
    budgetMax: 1100,
    details:
      "Son is in an Indian curriculum weekend programme. Need Class 8 maths support online — fractions, linear equations. US Eastern evenings.",
    startTimeline: "within_month",
    interestCount: 2,
    postedHoursAgo: 60,
  },
  {
    parentEmail: "emily.brown.toronto@outlook.com",
    subject: "English",
    classLevel: "Class 7",
    city: "Toronto",
    area: "North York",
    modes: ["online"],
    budgetMin: 600,
    budgetMax: 950,
    details:
      "Want an Indian English tutor for creative writing and grammar (Class 7 level). Helps keep connection with CBSE-style writing.",
    startTimeline: "flexible",
    interestCount: 1,
    postedHoursAgo: 48,
  },
  {
    parentEmail: "omar.hassan.abu@outlook.com",
    subject: "Mathematics",
    classLevel: "Class 12",
    city: "Abu Dhabi",
    area: "Al Reem Island",
    modes: ["online"],
    budgetMin: 1000,
    budgetMax: 1600,
    details:
      "JEE Main maths — calculus and coordinate geometry. Looking for a serious mentor who can run 4 sessions a week online from India.",
    startTimeline: "immediately",
    interestCount: 8,
    postedHoursAgo: 4,
  },
  {
    parentEmail: "priyanka.das.sydney@outlook.com",
    subject: "Biology",
    classLevel: "Class 11",
    city: "Sydney",
    area: "Parramatta",
    modes: ["online"],
    budgetMin: 800,
    budgetMax: 1300,
    details:
      "NEET biology for Class 11 while we are in Australia. Prefer early morning IST / evening AEST slots.",
    startTimeline: "within_week",
    interestCount: 3,
    postedHoursAgo: 22,
  },
  {
    parentEmail: "rajiv.malhotra.sf@outlook.com",
    subject: "Computer Science",
    classLevel: "Class 10",
    city: "San Francisco",
    area: "Sunset District",
    modes: ["online"],
    budgetMin: 900,
    budgetMax: 1500,
    details:
      "Class 10 CS / coding fundamentals with an Indian curriculum tutor. Python preferred. Weekend US Pacific mornings.",
    startTimeline: "flexible",
    interestCount: 2,
    postedHoursAgo: 70,
  },
  {
    parentEmail: "zara.ahmed.kl@outlook.com",
    subject: "Mathematics",
    classLevel: "Class 6",
    city: "Kuala Lumpur",
    area: "Mont Kiara",
    modes: ["online"],
    budgetMin: 500,
    budgetMax: 850,
    details:
      "Class 6 maths for a child in an international school who also follows Indian worksheets at home. Friendly online tutor, 2× week.",
    startTimeline: "within_month",
    interestCount: 2,
    postedHoursAgo: 52,
  },
];
