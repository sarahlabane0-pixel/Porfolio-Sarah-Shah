"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader } from "@/components/allaccess/loader/Loader";
import { AccessNav } from "@/components/allaccess/nav/AccessNav";
import { AccessCursor } from "@/components/allaccess/cursor/AccessCursor";
import { Hero } from "@/components/allaccess/hero/Hero";
import { AfterEntry } from "@/components/allaccess/after/AfterEntry";

// ALL ACCESS — hero prototype. Only the entrance is built; the chapters
// that follow are designed after this one is reviewed.
export default function Home() {
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
        <AfterEntry />
      </main>
    </div>
  );
}
