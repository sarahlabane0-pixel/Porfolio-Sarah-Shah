import type { Metadata } from "next";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { SiteNav } from "@/components/nav/SiteNav";

// The previous visual direction, kept intact and reachable while the
// ALL ACCESS redesign is being built chapter by chapter.
export const metadata: Metadata = {
  title: "Sarah Shah — Archive v1",
  robots: { index: false, follow: false },
};

export default function ArchiveLayout({ children }: LayoutProps<"/v1">) {
  return (
    <div className="v1">
      <SiteNav />
      {children}
      <div className="grain" aria-hidden="true" />
      <CustomCursor />
    </div>
  );
}
