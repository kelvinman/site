/**
 * The journey map from the NYPP problem-framing board in Figma: each stage's feeling, the person's words,
 * what could lose them and what the design does about it, worded close to the board. `mood` is my reading
 * of the board's feeling words on a 0 to 1 scale, for the curve's heights; the board has no numbers.
 */
export const STAGES = [
  {
    name: "Awareness",
    feeling: "Curious",
    mood: 0.6,
    thought: "Maybe my story is similar?",
    risk: "Skeptical it's clickbait",
    answer: "an authoritative headline with a sample range",
  },
  {
    name: "Start",
    feeling: "Cautious hope",
    mood: 0.55,
    thought: "Let's try. It costs me nothing.",
    risk: "Legal jargon",
    answer: "a one-sentence explainer, the disclaimer above the fold",
  },
  {
    name: "Questions",
    feeling: "Mild anxiety",
    mood: 0.3,
    thought: "Okay, it's narrowing in.",
    risk: "Typing the same details twice",
    answer: "quick-reply chips, the likely claim shown once known",
  },
  {
    name: "Result",
    feeling: "Relief or disappointment",
    mood: 0.5,
    thought: "That's higher than I thought.",
    risk: "Doubting the number",
    answer: "a confidence meter and a “How we calculated” link",
  },
  {
    name: "Next step",
    feeling: "Empowered",
    mood: 0.85,
    thought: "Let's talk to a pro.",
    risk: "Handing over personal details",
    answer: "a booking form pre-filled from the chat, with a privacy note",
  },
  {
    name: "Follow-up",
    feeling: "Prepared",
    mood: 0.8,
    thought: "I have proof of what I saw.",
    risk: "Losing the estimate",
    answer: "the estimate as a PDF by email, with a save-to-drive link",
  },
];
