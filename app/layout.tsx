import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { SmoothScrollProvider } from "@/lib/SmoothScrollProvider";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { SiteNav } from "@/components/nav/SiteNav";
import { siteMeta } from "@/content/copy";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${instrument.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          <SiteNav />
          {children}
        </SmoothScrollProvider>
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
      </body>
    </html>
  );
}
