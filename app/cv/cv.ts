/**
 * The CV, as a ledger: one row per role, newest first. Facts come from my LinkedIn and the
 * DecorX case study. `current` rows get the accent colour on their years.
 */
export const ABOUT =
  "I like making the thing itself, not just the picture of it. I studied informatics, started in front-end code, moved into product and taught myself design, and each role since has closed more of the distance between design and code. Now I run SuperNice, a product studio for early-stage startups, usually as the only design and front-end person on a small team.";

export const ROLES = [
  {
    years: "2024 – now",
    name: "DecorX",
    role: "Founding design engineer",
    note: "via SuperNice",
    what: "An AI imagery platform for furniture brands. I designed it while an outside team built it, then in January 2026 started a prototype that replaced their platform. In nine months it grew into a multi-tenant product, and I designed and built the design system, the main tools, the data model, billing and the infrastructure.",
    current: true,
  },
  {
    years: "2023 – now",
    name: "Left Field Labs",
    role: "Senior product designer",
    note: "via SuperNice",
    what: "Interactive experiences for brand events and conferences, brought in project by project: an AR experience for Meta, a networking app for a Microsoft event where attendees built avatar profiles, printed them as stickers and found each other, and booth games for GitHub and Salesforce.",
    href: "https://leftfieldlabs.com",
    current: true,
  },
  {
    years: "2022 – now",
    name: "SuperNice",
    role: "Founder",
    what: "A product studio on embedded monthly retainers. Clients have raised over $100M.",
    href: "https://www.studiosupernice.com",
    current: true,
  },
  {
    years: "2025",
    name: "Sidecar Legal",
    role: "Product designer",
    note: "via SuperNice",
    what: "Designed a legal-tech startup's main app and helped build two of its sites in code, one a web app that estimates lawsuit payouts.",
  },
  {
    years: "2022 – 23",
    name: "Moment",
    role: "Senior product designer",
    note: "via SuperNice",
    what: "Took the Worlds mobile app from zero to launch in six months. Patreon acquired Moment in 2023.",
  },
  {
    years: "2020 – 22",
    name: "Wethos",
    role: "Product designer, then senior",
    what: "Led the design system, built for design-to-code handoff with engineering, on a platform for scoping projects and splitting payments across independent teams.",
    href: "https://www.wethos.co",
  },
  {
    years: "2017 – 22",
    name: "Freelance",
    role: "Product designer",
    what: "Atticus, estate settlement software, a 2021 Fast Company World Changing Ideas finalist.",
  },
  {
    years: "2017 – 19",
    name: "BluPrint",
    role: "Co-founder",
    what: "Helped non-STEM students land first jobs in tech. Led brand, UX and visual design. Finalist, UCI New Venture and Butterworth competitions.",
  },
];

export const ALSO = [
  { label: "Projects", text: "The Last Apostate (2026), a browser game about how much of your thinking you hand over to AI, directed and shipped with AI. Notes with live demos on kelvinman.com." },
  { label: "Education", text: "BS in Informatics, UC Irvine, 2018. Front End Development Certificate, freeCodeCamp." },
  { label: "Mentoring", text: "ADPList mentor since 2022, top 1% in design (2023). MentorCruise mentor since 2025." },
];
