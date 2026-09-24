"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader } from "@/components/allaccess/loader/Loader";
import { AccessNav } from "@/components/allaccess/nav/AccessNav";
import { AccessCursor } from "@/components/allaccess/cursor/AccessCursor";
import { Hero } from "@/components/allaccess/hero/Hero";
import { Programme } from "@/components/allaccess/programme/Programme";
import { Work } from "@/components/allaccess/work/Work";
import { Skills } from "@/components/allaccess/skills/Skills";
import { Postcards } from "@/components/allaccess/postcards/Postcards";
import { Spaces } from "@/components/allaccess/spaces/Spaces";
import { Movement } from "@/components/allaccess/movement/Movement";
import { Contact } from "@/components/allaccess/contact/Contact";
import type { NiemeyerPhoto } from "@/lib/niemeyerPhotos";

// ALL ACCESS — the portfolio as one continuous event, in acts:
// entrance (loader, hero) → programme → 01 Work → 02 Skills → interlude and
// 03 Postcards → 04 Spaces → 05 Movement → 06 Contact.
export function Home({ niemeyerPhotos }: { niemeyerPhotos: NiemeyerPhoto[] }) {
  const [ready, setReady] = useState(false);
  const open = useCallback(() => setReady(true), []);

  useEffect(() => {
    // The entrance is a pinned sequence: always start it from the top.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aa">
      <Loader onOpen={open} />
      <AccessNav visible={ready} />
      <AccessCursor />
      <main>
        <Hero ready={ready} />
        <Programme />
        <Work />
        <Skills />
        <Postcards />
        <Spaces photos={niemeyerPhotos} />
        <Movement />
        <Contact />
      </main>
    </div>
  );
}
