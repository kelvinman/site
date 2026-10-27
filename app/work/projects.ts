/** The longer work page: each role with what I did there, newest first. Text comes from the
 * "Kelvin's Work" database in Notion; covers come from my own files and case studies. */

export type Link = { label: string; href: string };
export type Shot = { src: string; caption: string; width: number; height: number };
/** One image at the top of a role. Case study images sit behind the password, so covers are copies kept at /work. */
export type Cover = { src: string; alt: string; width: number; height: number; bare?: boolean };
export type Part = { title: string; text?: string; links?: Link[]; image?: Cover };

export type Project = {
  slug: string;
  name: string;
  href?: string;
  role: string;
  years: string;
  summary: string;
  parts?: Part[];
  cover?: Cover;
  shots?: Shot[];
  links?: Link[];
  /** Set when the role has its own case study page at /work/<slug>. */
  caseStudy?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "decorx",
    name: "DecorX",
    href: "https://www.decorx.com",
    role: "Founding design engineer",
    years: "2024–",
    caseStudy: true,
    cover: {
      src: "/work/cover-decorx.jpg",
      alt: "The DecorX Designer canvas: a sofa sketch turned into product shots and room scenes",
      width: 1600,
      height: 1036,
    },
    summary:
      "DecorX, an AI imagery platform for furniture brands, began as two products: one for interior designers that I designed, and one for retailers that I started as a prototype in January 2026. In 9 months mine became the one platform both run on, used by Wayfair, Nebraska Furniture Mart and Kathy Kuo Home. I designed and built its core, set how a team of 6 across the US and China builds on it, and plan strategy and priorities with the CEO.",
    parts: [
      {
        title: "The platform",
        text: "Started from an empty repo as a prototype for retailers, and grown in 9 months into the one platform both products run on. I wrote about 70% of the 1,600 commits, and designed and built the design system, data model, billing and infrastructure.",
      },
      {
        title: "Designer and Product Studio",
        text: "A node-based board for designers with AI editing tools, and Product Studio for generating full product image sets.",
        links: [{ label: "Changelog", href: "https://docs.decorx.com/changelog" }],
      },
      {
        title: "Sales tool and showroom app",
        text: "A follow-up tool that turns a buyer's picks into branded room scenes in about 5 minutes, and a QR-launched showroom app, both live at High Point Market in October 2026.",
      },
      {
        title: "How the team builds",
        text: "I wrote the engineering and Linear workflows, and review the team's pull requests: 80 of the 83 merged from others came through me.",
      },
    ],
    links: [
      {
        label: "Business of Home",
        href: "https://businessofhome.com/articles/an-industry-incubated-ai-startup-makes-its-debut",
      },
    ],
  },
  {
    slug: "left-field-labs",
    name: "Left Field Labs",
    href: "https://leftfieldlabs.com",
    role: "Senior product designer",
    years: "2023–",
    summary:
      "Left Field Labs brings me in project by project to design interactive experiences for brand events and conferences, for teams at Meta, Snap, Microsoft, GitHub and Salesforce.",
    parts: [
      {
        title: "The Connection Wall, Microsoft Build 2025",
        text: "A networking app built to connect about 4,000 attendees in Seattle with 200,000 watching online. Attendees signed in with LinkedIn, got an 8-bit avatar of their languages and communities, printed it as a sticker and found each other.",
        links: [{ label: "MediaPost", href: "https://www.mediapost.com/publications/article/406297" }],
        image: {
          src: "/work/connection-wall-app.webp",
          alt: "The Microsoft Build attendee app on mobile: sign in, create an avatar, get a sticker, find other builders",
          width: 1656,
          height: 852,
          bare: true,
        },
      },
      {
        title: "GitHub, Salesforce and Meta",
        text: "Playable experiences explaining GitHub Copilot and Salesforce's AI features at their conferences, including Dreamforce, and AR for Meta.",
      },
    ],
  },
  {
    slug: "sidecar-legal",
    name: "Sidecar Legal",
    caseStudy: true,
    role: "Product designer",
    years: "2025",
    cover: {
      src: "/work/cover-sidecar.webp",
      alt: "The NYPD payout estimator: ask about your case, then browse 12,000 real settlements",
      width: 1400,
      height: 856,
    },
    summary:
      "I designed a legal-tech startup's main app, then helped build two of its sites in code: the landing page and a web app that estimates payouts from lawsuits against the NYPD.",
    parts: [
      {
        title: "NYPD payout predictor",
        text: "A chat-led estimator with a library of real settlements. I led the UI overhaul in Next.js, set up Storybook and React Aria components, and built the case pages, PDF viewer and estimate summary.",
      },
    ],
  },
  {
    slug: "mirascope",
    name: "Mirascope",
    href: "https://mirascope.com",
    role: "Product designer",
    years: "2022–25",
    cover: {
      src: "/work/cover-mirascope.webp",
      alt: "Lilypad traces: a list of traced LLM calls with pass and fail results, and one call's cost, latency and output",
      width: 1400,
      height: 934,
    },
    summary:
      "Mirascope, which started as SOTAI, brought me back for several projects over two and a half years.",
    parts: [
      {
        title: "Artifice, 2022",
        text: "A no-code platform for building interpretable machine learning models, from a team out of Google AI. I designed it before its launch in April 2023.",
        links: [{ label: "Show HN", href: "https://news.ycombinator.com/item?id=35742104" }],
      },
      { title: "Design library, 2022 and 2023", text: "Two versions of the library behind its products." },
      {
        title: "Lilypad, 2025",
        text: "An open-source tool for versioning, tracing and annotating LLM calls, alongside Mirascope (1.5k GitHub stars).",
        links: [{ label: "GitHub", href: "https://github.com/Mirascope/mirascope" }],
      },
    ],
  },
  {
    slug: "moment",
    name: "Moment",
    caseStudy: true,
    role: "Senior product designer",
    years: "2022–23",
    summary:
      "I designed the Worlds web and mobile apps from zero to launch in 6 months: fan communities with boards, chat, shared spaces, merch and tickets. 5 creator worlds went live, including Paris Hilton and the Jonas Brothers. A separate 3D team built the spaces themselves. I shared the verified badges I drew for it on Figma Community, where 18.1k people have used them. Patreon acquired Moment in October 2023.",
    cover: {
      src: "/work/cover-moment.webp",
      alt: "Murder With My Husband World on iOS: home, board, chats, the 3D space and people",
      width: 1600,
      height: 617,
      bare: true,
    },
    links: [
      {
        label: "TechCrunch",
        href: "https://techcrunch.com/2023/10/17/patreon-acquires-livestream-ticketed-events-startup-moment/",
      },
      { label: "Figma Community", href: "https://www.figma.com/community/file/1157094402778889516/verified-icons" },
    ],
  },
  {
    slug: "wethos",
    name: "Wethos",
    href: "https://www.wethos.co",
    role: "Product designer, then senior",
    years: "2020–22",
    cover: {
      src: "/work/cover-wethos.webp",
      alt: "Wethos Templates: ready-made project scopes with a price, team size and phases",
      width: 1400,
      height: 906,
    },
    summary:
      "At Wethos, a platform for freelancers and small studios to scope projects and split payments, I led the design system and designed Templates, which customers credited with cutting proposal writing from 5 to 7 hours down to 1.",
  },
  {
    slug: "flipper",
    name: "Flipper",
    role: "Product designer",
    years: "2022",
    summary:
      "An NFT trading dashboard sponsored by BanklessDAO: rarity ranks as soon as a collection revealed, an appraisal to cut through the data, and buying without leaving the dashboard. Its presale sold out in 3 minutes.",
  },
];

/** Things I made on my own, after the client work. */
export const OWN: Project[] = [
  {
    slug: "the-last-apostate",
    name: "The Last Apostate",
    href: "https://github.com/kelvinman/the-last-apostate",
    role: "Designer and developer",
    years: "2026",
    cover: {
      src: "/notes/the-last-apostate-cycle.jpg",
      alt: "The Last Apostate in the browser",
      width: 1280,
      height: 800,
    },
    summary: "A browser game about how much of your thinking you hand over to AI, which I directed and shipped with AI.",
  },
];
