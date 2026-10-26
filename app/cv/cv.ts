/**
 * The CV, as a ledger: one row per role, newest first. Facts come from my LinkedIn and the
 * DecorX case study. `current` rows get the accent colour on their years.
 */
export const ABOUT =
  "I shape products, design them and build them. I studied informatics, started out writing front-end code, moved into product, and taught myself design. Now I run SuperNice, a product studio for early-stage startups, usually as the only design and front-end person on a small team.";

export const ROLES = [
  {
    years: "2026 – now",
    name: "DecorX",
    role: "Founding design engineer",
    note: "via SuperNice",
    what: "An AI imagery platform for furniture brands, taken from an empty repo to a multi-tenant product in nine months. I designed and built the design system, the main tools, the data model, billing and the infrastructure.",
    current: true,
  },
  {
    years: "2023 – now",
    name: "Left Field Labs",
    role: "Senior product designer",
    note: "via SuperNice",
    what: "",
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
    years: "2022 – 23",
    name: "Moment",
    role: "Senior product designer",
    note: "via SuperNice",
    what: "Designed and launched the Worlds mobile app from zero to one in six months. Patreon acquired Moment in 2023.",
  },
  {
    years: "2020 – 22",
    name: "Wethos",
    role: "Product designer, then senior",
    what: "Led the design system, built for design-to-code handoff.",
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
    what: "Helped non-STEM students land first jobs in tech. Finalist, UCI New Venture and Butterworth competitions.",
  },
];

export const ALSO = [
  { label: "Projects", text: "The Last Apostate (2026), a browser game about how much of your thinking you hand over, directed and shipped with AI. Notes with live demos on kelvinman.com." },
  { label: "Education", text: "BS in Informatics, UC Irvine, 2018. Front End Development Certificate, freeCodeCamp." },
  { label: "Mentoring", text: "ADPList mentor since 2022, top 1% in design (2023). MentorCruise mentor since 2025." },
];
