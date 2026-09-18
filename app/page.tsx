"use client";

import { useState } from "react";
import { Iris } from "@/components/intro/Iris";
import { Hero } from "@/components/hero/Hero";
import { Recit } from "@/components/recit/Recit";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Iris onComplete={() => setHeroReady(true)} />
      <main>
        <Hero play={heroReady} />
        <Recit />
      </main>
    </>
  );
}
