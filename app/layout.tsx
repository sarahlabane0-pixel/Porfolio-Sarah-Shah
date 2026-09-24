import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  Instrument_Sans,
  Instrument_Serif,
  Space_Grotesk,
} from "next/font/google";
import { SmoothScrollProvider } from "@/lib/SmoothScrollProvider";
import "./globals.css";

// ALL ACCESS type system: three families, no more.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Only used by the archived v1 route — not preloaded on the new experience.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  preload: false,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Sarah Shah — Communication événementielle & Brand Experiences",
  description:
    "Portfolio de Sarah Shah, spécialisée en communication événementielle, stratégie éditoriale et expériences de marque.",
  openGraph: {
    title: "Sarah Shah — ALL ACCESS",
    description:
      "Portfolio de Sarah Shah, spécialisée en communication événementielle, stratégie éditoriale et expériences de marque.",
    images: [{ url: "/assets/hero/sarah-portrait.webp", width: 1122, height: 1402 }],
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2A0712",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const fonts = [spaceGrotesk, instrumentSerif, plexMono, fraunces, instrumentSans]
    .map((f) => f.variable)
    .join(" ");

  return (
    <html lang="fr" className={fonts}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
