import type { ArticleContent } from "./types";

export const TRUST_SAFETY_ARTICLES: Record<string, ArticleContent> = {
  "how-mentr-verifies-tutors": {
    slug: "how-mentr-verifies-tutors",
    publishedAt: "2026-03-10",
    updatedAt: "2026-07-01",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "When you invite a tutor into your home or your child's video call, trust is not optional — it is the foundation of the entire arrangement. Indian parents often rely on neighbour referrals or WhatsApp groups where anyone can claim to be an IIT graduate with zero proof. Mentr was built to close that gap. This article walks through our verification process step by step: what we check, what the Verified badge means, what it does not guarantee, and what you should still confirm before day one.",
    sections: [
      {
        heading: "Why tutor verification matters in India",
        blocks: [
          {
            type: "paragraph",
            text: "The informal tutoring market in India is enormous and largely unregulated. A person with a smartphone and a tuition flyer can reach dozens of families in a week. Most are genuine educators trying to earn a living. A small but real fraction are not — fake qualifications, mismatched identity, or profiles recycled from other platforms. Parents in Bengaluru, Pune, Delhi, and tier-2 cities report the same pattern: the tutor seemed fine on the phone, problems surfaced only after advance payment or several sessions with a child who grew uncomfortable.",
          },
          {
            type: "paragraph",
            text: "Verification does not replace parental judgement. It removes a category of risk before you ever share your address or schedule a video call. Government ID checks confirm the person is who they claim to be. Qualification review confirms their stated degree or exam rank is documented, not invented. Platform-level checks also mean there is a record of the profile — if something goes wrong, you are not dealing with a disposable phone number and a deleted WhatsApp display picture.",
          },
          {
            type: "callout",
            title: "Verification vs quality",
            text: "A verified tutor has passed identity and credential checks. That does not automatically mean they are the best teacher for your child. Teaching skill, patience, and subject fit still require a trial session and your own assessment. Verification filters fraud; you filter fit.",
          },
        ],
      },
      {
        heading: "The Mentr verification process — step by step",
        blocks: [
          {
            type: "paragraph",
            text: "Every tutor who wants a live profile on Mentr goes through a structured review before parents can contact them. The process is designed to be thorough enough to catch common fraud patterns while staying fast enough that genuine educators are not waiting weeks to start earning.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Profile submission: the tutor creates a faculty account with name, photo, subjects, areas served, and teaching mode (home, online, or both).",
              "Government ID upload: Aadhaar, PAN, or passport is submitted for identity matching against the profile name.",
              "Qualification documents: degree certificates, mark sheets, or professional credentials relevant to listed subjects are reviewed.",
              "Profile consistency check: listed subjects and class levels are compared against qualifications — a B.Com graduate listing JEE Physics raises a flag.",
              "Manual review: the Mentr team reviews flagged or incomplete submissions; straightforward profiles are approved once documents align.",
              "Verified badge issued: tutors who pass all checks receive the Verified badge visible on their public profile.",
            ],
          },
          {
            type: "paragraph",
            text: "Tutors whose documents are unclear, expired, or inconsistent with their listed expertise are asked to resubmit or have subject listings adjusted before going live. Profiles that cannot be verified are not published. This is stricter than most free listing sites and many paid lead platforms, where a phone number OTP is often the only gate.",
          },
        ],
      },
      {
        heading: "What the Verified badge means — and what it does not",
        blocks: [
          {
            type: "paragraph",
            text: "The Verified badge on a Mentr tutor profile tells you three things: the person's identity has been checked against government ID, their highest relevant qualification has been reviewed, and their profile information is internally consistent. It is not a character certificate, a police verification, or a guarantee of teaching outcomes.",
          },
          {
            type: "list",
            items: [
              "Verified means: real name, real documents, subjects aligned with credentials",
              "Verified does not mean: police background check, child safety training certification, or parent references confirmed by Mentr",
              "Verified does not mean: the tutor will be punctual, patient, or effective — that is what trials and references are for",
              "Unverified or pending profiles: not shown to parents in search results on Mentr",
            ],
          },
          {
            type: "paragraph",
            text: "Think of the badge as the first filter in a hiring funnel, not the final hire decision. In the same way you would not skip a job interview because a candidate passed a document check, you should not skip a trial session because a tutor is verified. The badge saves you from starting conversations with profiles that fail basic authenticity tests.",
          },
        ],
      },
      {
        heading: "What parents should still confirm themselves",
        blocks: [
          {
            type: "paragraph",
            text: "Even with platform verification, responsible parents complete a short personal checklist before the first session. Ask for one or two parent references and actually call them. Confirm session logistics: where the session happens, who else is home, and whether the tutor is comfortable with a parent nearby for the first meeting. For home visits, share your address only after you are satisfied — not in the first WhatsApp message.",
          },
          {
            type: "list",
            items: [
              "Run a paid trial session before committing to a monthly package",
              "Meet the tutor in person or on video before leaving your child alone with them",
              "Agree on communication channels — keep initial contact through the platform",
              "Set boundaries: no personal social media, no off-platform video calls until trust is established",
              "For younger children (under 12), stay within earshot for the first three to four sessions",
            ],
          },
          {
            type: "callout",
            title: "Home visit safety",
            text: "Inform a family member or neighbour about session timings when a new tutor visits your home. Keep sessions in a common area — living room or dining table — not a child's bedroom with the door closed. These habits matter regardless of verification status.",
          },
        ],
      },
      {
        heading: "Reporting concerns and keeping the community safe",
        blocks: [
          {
            type: "paragraph",
            text: "If a verified tutor behaves inappropriately, misrepresents themselves after verification, or pressures you for off-platform contact before you are comfortable, report it to Mentr immediately. Reports trigger a review of the profile and, where warranted, suspension or permanent removal. Serious safety concerns — anything involving a child's wellbeing — should also be reported to local authorities; platforms can remove profiles but cannot investigate criminal matters.",
          },
          {
            type: "paragraph",
            text: "Mentr re-verifies profiles when tutors update qualifications or when parents flag document discrepancies. A badge is not a one-time stamp that lasts forever regardless of behaviour. Community reporting is part of how the system stays honest — parents who speak up protect other families from repeat problems.",
          },
          {
            type: "list",
            items: [
              "Use the in-app report option on any tutor profile",
              "Include specifics: dates, behaviour, and any screenshots of concerning messages",
              "For payment disputes, document agreements in writing before transferring money",
              "Switch tutors without guilt if your child is uncomfortable — comfort outweighs convenience",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does Mentr run police verification on tutors?",
        answer:
          "No. Mentr verifies identity through government ID and reviews qualification documents. Police verification (PCC) is not part of the standard process. Parents who want an additional layer can ask tutors directly if they hold a valid Police Clearance Certificate, though this is uncommon in informal tutoring and not required for the Verified badge.",
      },
      {
        question: "How long does tutor verification take on Mentr?",
        answer:
          "Most straightforward profiles are reviewed within one to three business days after document submission. Incomplete uploads or mismatched credentials take longer because the tutor must resubmit. Tutors cannot receive parent enquiries through Mentr search until verification is complete.",
      },
      {
        question: "Can a tutor lose the Verified badge?",
        answer:
          "Yes. If a tutor updates their profile with unverifiable credentials, receives substantiated fraud reports, or violates platform policies, the badge can be revoked and the profile suspended. Verification is an ongoing standard, not a permanent label.",
      },
      {
        question: "Is a Verified tutor on Mentr safe to leave alone with my child?",
        answer:
          "Verification confirms identity and credentials, not behaviour or intentions. For younger children, we recommend a parent or trusted adult remain within earshot for early sessions regardless of verification status. Build comfort over several sessions before stepping away entirely.",
      },
      {
        question: "How is Mentr verification different from tuition agency checks?",
        answer:
          "Many tuition agencies verify little beyond collecting a photocopy and a registration fee. Mentr does not charge tutors lead fees to be listed, so verification is not a paid checkbox — it is a gate to going live. Agencies also sometimes rotate tutors without re-verifying; Mentr profiles are tied to the individual who submitted documents.",
      },
    ],
    relatedLinks: [
      { label: "Tutor safety checklist for parents", href: "/blog/tutor-safety-checklist-parents" },
      { label: "Online tutoring safety for kids", href: "/blog/online-tutoring-safety-kids" },
      { label: "Browse verified tutors", href: "/search" },
    ],
  },

  "tutor-safety-checklist-parents": {
    slug: "tutor-safety-checklist-parents",
    publishedAt: "2026-03-17",
    updatedAt: "2026-07-01",
    readTimeMinutes: 8,
    author: "Mentr Editorial Team",
    intro:
      "Hiring a tutor is one of the few situations where you hand a near-stranger regular access to your child — in your home, on a video call, or both. Most tutoring relationships in India are safe and productive. The ones that go wrong often share preventable gaps: skipped reference checks, advance payments before a trial, or sessions held behind closed doors on day one. This checklist gives you a practical, India-specific safety routine to run before day one and maintain through the year.",
    sections: [
      {
        heading: "Before you contact a tutor — the screening basics",
        blocks: [
          {
            type: "paragraph",
            text: "Safety starts before the first phone call. Use platforms that verify identity and qualifications rather than open WhatsApp groups where profiles cannot be traced. On Mentr, filter for Verified tutors so you are only comparing candidates who have passed document review. Read the full profile: photo, bio, subjects, areas served, and teaching mode. Vague profiles with stock images or no qualification mention are worth skipping regardless of how low the quoted fee is.",
          },
          {
            type: "list",
            items: [
              "Confirm the tutor lists your child's exact subject, class, and board",
              "Check for a Verified badge or equivalent credential review on the platform",
              "Avoid tutors who refuse to share full name or insist on cash-only, no-receipt deals upfront",
              "Compare at least three candidates before shortlisting — speed is not safety",
              "Keep initial messages on the platform until you have shortlisted one or two options",
            ],
          },
          {
            type: "callout",
            title: "Share your address last",
            text: "Do not send your home address in the first message. Confirm subject fit, fee, and availability first. Share location details only when you are ready to schedule an in-person trial or home visit.",
          },
        ],
      },
      {
        heading: "Before day one — the pre-session checklist",
        blocks: [
          {
            type: "paragraph",
            text: "Run through this list before your child meets the tutor for the first time, whether at home or online. Treat it like a short safety audit — five minutes of diligence prevents months of regret.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Identity confirmed: government ID name matches the profile; Verified badge present on Mentr",
              "Qualification reviewed: degree or exam credentials align with subjects being taught",
              "References called: speak to at least one current parent client, not just a forwarded WhatsApp contact",
              "Trial session scheduled: one or two paid trials before any monthly advance",
              "Meeting logistics set: common area of the house for home visits; parent present or within earshot for first session",
              "Emergency contact exchanged: you have the tutor's full name and phone number saved",
              "Boundaries discussed: no personal social media, no off-platform video links until trust is built",
              "Child briefed: your child knows they can tell you immediately if anything feels uncomfortable",
            ],
          },
          {
            type: "paragraph",
            text: "For home visits in Indian apartment complexes, inform security about the tutor's expected arrival time and name. Many gated communities in Bengaluru, Hyderabad, and NCR already require visitor registration — use that system rather than bypassing it for convenience.",
          },
        ],
      },
      {
        heading: "During sessions — ongoing safety habits",
        blocks: [
          {
            type: "paragraph",
            text: "Safety is not a one-time checkbox. Patterns that seemed minor in week one — lateness, dismissive comments, phone use during sessions — can signal deeper problems. Maintain light oversight without micromanaging every minute of teaching.",
          },
          {
            type: "list",
            items: [
              "Keep sessions in shared spaces for children under 14, especially with new tutors",
              "Drop in unexpectedly once a month — not to spy, but to confirm normal session conduct",
              "Ask your child open questions after sessions: 'What did you learn? How did you feel?'",
              "Watch for secrecy: tutors who tell children not to mention activities to parents are a serious red flag",
              "Maintain a simple written fee and attendance log to avoid disputes",
            ],
          },
          {
            type: "paragraph",
            text: "Good tutors welcome parent visibility early and gradually earn the privacy that focused one-on-one teaching requires. If a tutor resists any parent presence during the first month, that resistance itself is information.",
          },
        ],
      },
      {
        heading: "Online sessions — additional checks",
        blocks: [
          {
            type: "paragraph",
            text: "Online tutoring introduces different risks: private video links, screen sharing, and communication that can move to personal accounts. Apply the same caution as home visits, adapted for virtual sessions.",
          },
          {
            type: "list",
            items: [
              "Use platform-recommended or well-known video tools — Google Meet, Zoom — not obscure apps",
              "Child joins from a common room; camera background should not reveal private spaces",
              "Disable screen recording by the tutor unless you have explicitly agreed and use a trusted tool",
              "No switching to personal Instagram, Snapchat, or Discord for 'doubt clearing'",
              "Parent within earshot for the first three to four online sessions with children under 13",
            ],
          },
          {
            type: "callout",
            title: "The closed-door rule",
            text: "Whether online or in person, a child alone behind a closed door with an adult they have known for less than a month is a risk pattern worth avoiding. Common areas protect children without signalling distrust — it is standard practice in responsible tutoring setups across India.",
          },
        ],
      },
      {
        heading: "Red flags that should stop the engagement immediately",
        blocks: [
          {
            type: "paragraph",
            text: "Some behaviours override every positive signal from references and verification. End the arrangement — politely but firmly — if you encounter any of the following. Your child's safety is not negotiable for the sake of avoiding an awkward conversation or losing a prepaid month.",
          },
          {
            type: "list",
            items: [
              "Requests to meet the child alone away from your home without a clear academic reason",
              "Pressure to communicate only on personal channels and delete platform messages",
              "Gift-giving, secret-keeping, or physical contact beyond a formal handshake",
              "Your child expresses fear, anxiety, or unwillingness to attend without academic explanation",
              "Tutor refuses to provide ID or becomes hostile when you ask routine safety questions",
              "Inappropriate comments, jokes, or content shared during or between sessions",
            ],
          },
          {
            type: "paragraph",
            text: "Report the profile to Mentr or whichever platform you used. If you believe a child has been harmed or is at risk of harm, contact local child protection authorities and, where appropriate, file a police report. Document messages and session dates before the tutor deletes accounts.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I run a police verification check on home tutors?",
        answer:
          "Police Clearance Certificates are rare in informal tutoring but some parents request them for long-term home visits, especially for younger children. Mentr's Verified badge covers ID and qualifications, not PCC. If this matters to you, ask the tutor directly — legitimate educators usually understand the request even if they do not have a certificate ready.",
      },
      {
        question: "Is it okay to sit in the room during tutoring sessions?",
        answer:
          "For the first several sessions, especially with children under 12, yes. Most professional tutors expect this. After trust is established, staying nearby but not at the same table is a reasonable middle ground. Never let a brand-new tutor take your child to a separate room with the door closed on day one.",
      },
      {
        question: "What should I tell my child before the first tutoring session?",
        answer:
          "Use age-appropriate language: the tutor is here to help with studies, sessions happen where family can see or hear, and they should tell you immediately if anything feels wrong or confusing. Avoid framing it as fear — frame it as a normal family safety habit, the same way you discuss school pickup rules.",
      },
      {
        question: "How do I verify references tutors provide?",
        answer:
          "Call the reference on a normal phone call, not just WhatsApp chat. Ask specific questions: how long has the tutor taught their child, punctuality, communication style, and whether they would hire again. Vague praise or references who seem unprepared for your call may be fabricated.",
      },
      {
        question: "Can I trust tutors found through family friends without a platform check?",
        answer:
          "Referrals from trusted friends are a strong starting point but still deserve a trial session and your own comfort check. Friend networks can repeat the same blind spots. Combining a personal referral with Mentr-style verification — or at least your own ID and qualification review — is the safest approach.",
      },
    ],
    relatedLinks: [
      { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
      { label: "Online tutoring safety for kids", href: "/blog/online-tutoring-safety-kids" },
      { label: "Tutor red flags to watch for", href: "/blog/tutor-red-flags" },
    ],
  },

  "online-tutoring-safety-kids": {
    slug: "online-tutoring-safety-kids",
    publishedAt: "2026-03-24",
    updatedAt: "2026-07-01",
    readTimeMinutes: 9,
    author: "Mentr Editorial Team",
    intro:
      "Online tutoring is now a default option for Indian families — from CBSE doubt sessions in tier-2 cities to JEE prep over Zoom in metro apartments. The format is convenient, but it moves your child into a private digital space with an adult you may have met only once on a screen. Camera policies, screen sharing, recording, and off-platform contact are the new safety frontier. This guide covers practical rules parents can set today to keep virtual sessions as safe as a well-run home visit.",
    sections: [
      {
        heading: "Setting up a safe online learning space at home",
        blocks: [
          {
            type: "paragraph",
            text: "Where your child sits for online tutoring matters as much as which tutor you hire. A session from a child's bedroom with the door closed removes the natural oversight that a dining-table setup provides. Choose a common area — living room, study nook near the kitchen, or a desk in a parent's home office — where an adult can hear the conversation without hovering over the screen.",
          },
          {
            type: "list",
            items: [
              "Position the device so the camera shows the study area, not beds or private corners",
              "Use headphones only if you can still hear the tutor's side of the conversation nearby",
              "Keep chargers and devices in shared spaces overnight — no midnight 'doubt sessions' on personal phones",
              "Set a fixed weekly schedule so online sessions do not become open-ended evening chats",
              "Younger children (under 11) should use a parent-managed laptop or tablet, not a personal phone",
            ],
          },
          {
            type: "callout",
            title: "Device ownership",
            text: "If your child uses their own smartphone for tutoring, you should know the passcode and which apps are installed. Tutoring should happen through agreed video tools — not switched mid-session to personal messaging apps that you do not monitor.",
          },
        ],
      },
      {
        heading: "Camera, microphone, and screen-sharing rules",
        blocks: [
          {
            type: "paragraph",
            text: "Video tutoring works best when both sides can see and hear clearly, but that visibility must be bounded. Agree on camera expectations before session one: video on for both tutor and student during teaching time is reasonable; recording the session is not automatic and requires explicit consent from parents.",
          },
          {
            type: "list",
            items: [
              "Video on by default during active teaching; brief audio-only breaks are fine",
              "Tutor should not ask your child to turn off video while they remain on camera without a clear reason",
              "Screen sharing: student shares only the study window or whiteboard — not full desktop with personal files",
              "No remote-control software unless you understand exactly what access it grants",
              "Blur or neutral virtual backgrounds are fine; avoid backgrounds that reveal home address details",
            ],
          },
          {
            type: "paragraph",
            text: "If a tutor requests session recording 'for revision purposes,' the recording should be shared with you — the parent — not stored privately on the tutor's device. Many Indian parents reasonably decline recording altogether for younger children. That refusal should be respected without pressure.",
          },
        ],
      },
      {
        heading: "Keeping communication on safe channels",
        blocks: [
          {
            type: "paragraph",
            text: "The moment tutoring moves from a platform or official email to personal WhatsApp, Instagram DMs, or Telegram, oversight becomes harder and accountability disappears. This drift is one of the most common precursors to problems in online tutoring relationships — not because every tutor has bad intent, but because private channels erase the paper trail.",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Week one to four: communicate through Mentr or the agreed platform messaging system",
              "Share phone numbers only after a successful trial and your comfort check",
              "If using WhatsApp for scheduling, keep a parent in the group chat — not child-only threads",
              "Ban personal social media contact for children under 16",
              "Document fee agreements in writing before UPI transfers",
            ],
          },
          {
            type: "paragraph",
            text: "Tutors who push aggressively to move off-platform in the first session — 'WhatsApp is easier for doubt photos' — are not necessarily unsafe, but the pattern deserves a direct conversation. Legitimate educators adjust to parent preferences; those who resist platform boundaries often have something to hide or simply poor professional habits.",
          },
        ],
      },
      {
        heading: "Parent monitoring without disrupting learning",
        blocks: [
          {
            type: "paragraph",
            text: "Children need some privacy to ask embarrassing academic questions. Parents need enough visibility to confirm sessions are appropriate. The balance is earshot, not surveillance. For the first month, be in the next room with the door open. Glance in once per session. After trust builds, periodic check-ins are sufficient for most teenagers.",
          },
          {
            type: "list",
            items: [
              "Listen for teaching tone — patience, focus on subject matter, normal academic language",
              "Be alert to long silences, laughter unrelated to study, or sessions that routinely run 30+ minutes over time",
              "Ask your child weekly: 'Anything odd about the online sessions?' — normalise reporting",
              "Review chat logs if your child uses a shared family device; spot-check, do not read every message secretly",
              "For older teens, agree on a check-in schedule rather than constant presence",
            ],
          },
          {
            type: "callout",
            title: "Teenagers need rules too",
            text: "Parents sometimes relax safety rules for Class 11–12 students because they seem mature. Online risks do not disappear at 16. Keep channel rules, session scheduling, and an open-door policy for the first month even with older teens meeting a new tutor.",
          },
        ],
      },
      {
        heading: "Red flags and what to do if something feels wrong",
        blocks: [
          {
            type: "paragraph",
            text: "Online tutoring red flags mirror in-person ones with a digital twist: requests for private video calls late at night, sending unrelated links or memes, commenting on appearance, or building a 'special friendship' outside academics. Take your child's discomfort seriously even if they cannot articulate why — behavioural shifts like avoiding sessions or deleting chat history are signals.",
          },
          {
            type: "list",
            items: [
              "End the engagement immediately if grooming patterns appear — personal compliments, secrecy, gift offers",
              "Screenshot concerning messages before blocking the tutor",
              "Report the profile on Mentr or the platform where you found them",
              "Contact child safety helplines or local police for serious incidents — platforms cannot prosecute",
              "Switch tutors without sharing details with the child if the situation is distressing",
            ],
          },
          {
            type: "paragraph",
            text: "India's National Commission for Protection of Child Rights (NCPCR) and state child helplines accept reports of online exploitation. You do not need proof beyond a reasonable concern to seek guidance. Err on the side of protecting your child over preserving a tutoring arrangement.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should online tutoring sessions be recorded?",
        answer:
          "Recording is optional, not standard. If you agree to it, the file should be stored on your device or a parent-controlled cloud account, not kept privately by the tutor. Many families skip recording entirely and rely on camera-on policies and parent proximity instead.",
      },
      {
        question: "Is it safe for my child to use their own phone for tutoring?",
        answer:
          "For children under 13, a parent-managed device in a shared room is safer. Teenagers often prefer their own phones — if so, keep video calls on speaker in a common area for early sessions and maintain clear rules about which apps are used for academic contact only.",
      },
      {
        question: "What video platforms are safest for kids' tutoring sessions?",
        answer:
          "Mainstream tools with meeting links and waiting rooms — Google Meet, Zoom, Microsoft Teams — are preferable to unknown apps. Avoid platforms designed for social networking rather than meetings. The tool matters less than camera policy, parent proximity, and keeping communication traceable.",
      },
      {
        question: "Can my child have WhatsApp-only contact with their online tutor?",
        answer:
          "Child-only WhatsApp threads with a new tutor are not recommended. If you use WhatsApp for scheduling or sharing homework photos, include a parent in the conversation or use a family account on a shared device. Move to this only after several successful sessions and your comfort check.",
      },
      {
        question: "How do I find online tutors who take safety seriously?",
        answer:
          "Start with verified profiles on Mentr that list online as a teaching mode. During the trial, observe whether the tutor suggests appropriate meeting tools, respects camera boundaries, and communicates professionally. Tutors who rush to personal channels or late-night calls before establishing trust are poor safety bets regardless of subject expertise.",
      },
    ],
    relatedLinks: [
      { label: "Tutor safety checklist for parents", href: "/blog/tutor-safety-checklist-parents" },
      { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
      { label: "Home tutor vs online tutor", href: "/blog/home-tutor-vs-online-tutor" },
    ],
  },

  "how-to-find-verified-tutor-online": {
    slug: "how-to-find-verified-tutor-online",
    publishedAt: "2026-07-18",
    updatedAt: "2026-07-18",
    readTimeMinutes: 10,
    author: "Mentr Editorial Team",
    intro:
      "Every tutoring website claims 'verified tutors.' Few explain what was verified, by whom, or what you should still check yourself. For parents hiring online — especially across countries — verification is the difference between a qualified educator and a recycled profile with a stock photo. This guide breaks down what a verified tutor online should mean, how Mentr's checks work, and the trial steps you should never skip.",
    sections: [
      {
        heading: "Layers of verification — what to demand",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Identity: government ID matched to profile name and photo",
              "Contact: phone number verified (OTP or callback)",
              "Qualifications: degree or exam rank documents aligned with listed subjects",
              "Consistency: subjects taught match credentials — no B.Com tutor listing JEE Physics",
              "Platform record: profile tied to an account, not a disposable WhatsApp number",
            ],
          },
          {
            type: "callout",
            title: "Verification ≠ perfect teaching",
            text: "A verified tutor passed fraud checks. Teaching style, patience, and fit for your child still require a trial session and your judgement.",
          },
        ],
      },
      {
        heading: "How to find verified tutors online (step by step)",
        blocks: [
          {
            type: "paragraph",
            text: "Use platforms that show verification status on the profile — not buried in FAQ pages. On Mentr, the Verified badge appears only after ID and credential review. Search by subject, filter online mode, and open profiles that list specific class levels rather than generic 'all classes.'",
          },
          {
            type: "list",
            items: [
              "Compare 3–5 profiles before messaging — fees, experience, languages",
              "Send a connect request with your child's class, board, and schedule",
              "Schedule a video intro before paying for a full month",
              "Ask one curriculum-specific question to test subject depth",
              "Confirm cancellation and payment terms in writing",
            ],
          },
        ],
      },
      {
        heading: "Global hiring: extra checks for cross-border tutors",
        blocks: [
          {
            type: "paragraph",
            text: "Families in the UAE, UK, US, and Singapore often hire tutors based in India for CBSE, coding, or competitive exam prep. Extra diligence helps:",
          },
          {
            type: "list",
            items: [
              "Confirm video platform and recording policy for child safety",
              "Agree on currency and payment method before block bookings",
              "Test audio/video quality in your child's study setup during trial",
              "Keep initial communication on-platform until trust is established",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is OTP verification enough for a tutor?",
        answer:
          "Phone OTP confirms a number exists — not that the person is qualified. Look for ID plus qualification review, not phone verification alone.",
      },
      {
        question: "Can verified tutors still be bad teachers?",
        answer:
          "Yes. Verification removes impersonation and fake degrees. Teaching quality requires a trial, reference checks, and watching how your child responds after 2–3 sessions.",
      },
      {
        question: "Where can I find verified tutors for free search?",
        answer:
          "Mentr lets parents search and send connect requests without lead fees. Tutors pay nothing to list. Browse verified profiles at mentr.com/search.",
      },
    ],
    relatedLinks: [
      { label: "How Mentr verifies tutors", href: "/blog/how-mentr-verifies-tutors" },
      { label: "Browse verified tutors", href: "/search" },
      { label: "Online tutor near me guide", href: "/blog/find-online-tutor-near-me" },
    ],
  },
};
