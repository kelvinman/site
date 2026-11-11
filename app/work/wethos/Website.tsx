import { PageViewer } from "./PageViewer";

/**
 * The Wethos website. Home and Pricing are crops of the home page I designed, frame "Organic 4" on
 * page V4 of the Figma file Website (Copy), its thumbnail dated Oct 2020 and its footer "Copyright
 * © 2020 Wethos" (exported 11 Nov 2026). Its testimonials are placeholder text, so they are left
 * out. Profiles is the "Website Graphics" entry of 13 May 2021 in my Notion hype doc.
 */
const PAGES = [
  {
    name: "Home",
    src: "/work/wethos/site-home.webp",
    width: 1440,
    height: 862,
    caption: "The home page I designed in 2020, with a project's scope and its team as the product shot.",
  },
  {
    name: "Pricing",
    src: "/work/wethos/site-pricing.webp",
    width: 790,
    height: 492,
    caption: "Further down the page, pricing a service by how complex it is, the expertise and time it needs, and how uncertain it is.",
  },
  {
    name: "Profiles",
    src: "/work/wethos/site-profiles.webp",
    width: 1600,
    height: 958,
    caption: "A graphic I made for the site in 2021: profile cards for the people a studio can team up with.",
  },
];

export function Website() {
  return <PageViewer pages={PAGES} label="Website pages" aspect="1440 / 862" />;
}
