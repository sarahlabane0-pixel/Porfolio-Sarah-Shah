// Mirrors styles/tokens.css. GSAP can't reliably animate CSS custom
// properties as color values, so anything tweened in JS (background-color
// crossfades, etc.) reads from here instead — keep the two in sync by hand.

export const colors = {
  black: "#0c0a0b",
  bordeauxDeep: "#2b0710",
  bordeaux: "#4a0e1f",
  wine: "#7a1128",
  plum: "#3d1226",
  plumSoft: "#5a2138",
  blush: "#f2e1de",
  cream: "#f5efe4",
  ivory: "#faf7f1",
  goldDim: "#a9895f",
} as const;
