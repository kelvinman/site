import { PageViewer } from "./PageViewer";

/**
 * Pages from the Wethos design system I led, one at a time in a fixed frame, with a toggle under it,
 * so the set can grow without the case study getting longer. Color and Type are from the Foundations
 * file; Buttons and Cards from the Components file, laid out for this page from their
 * Figma components (6 Nov 2026). The illustrations were a licensed pack, so they are left out.
 */
const PAGES = [
  {
    name: "Color",
    src: "/work/wethos/foundations-color.webp",
    width: 1600,
    height: 812,
    caption: "Color: a scale for each hue, from Gray to Skin Tone.",
  },
  {
    name: "Type",
    src: "/work/wethos/foundations-type.webp",
    width: 1600,
    height: 1178,
    caption: "Type: headers, body sizes and eyebrows, each a shared text style.",
  },
  {
    name: "Buttons",
    src: "/work/wethos/ds-buttons.webp",
    width: 1472,
    height: 740,
    caption: "Buttons: primary, outline, text and danger, in three sizes, with hover, focus and disabled.",
  },
  {
    name: "Cards",
    src: "/work/wethos/ds-cards.webp",
    width: 1600,
    height: 905,
    caption: "Debit cards for Wethos banking: physical and virtual, number hidden or shown, and inactive.",
  },
];

export function DesignSystem() {
  return <PageViewer pages={PAGES} label="Design system pages" />;
}
