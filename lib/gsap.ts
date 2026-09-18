import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV === "development") {
    // @ts-expect-error — debug-only global for inspecting ScrollTrigger state from devtools
    window.__gsap = gsap;
    // @ts-expect-error — debug-only global
    window.__ScrollTrigger = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger };
