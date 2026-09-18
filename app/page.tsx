"use client";

import { useState } from "react";
import { Iris } from "@/components/intro/Iris";
import { Hero } from "@/components/hero/Hero";
import { Recit } from "@/components/recit/Recit";
import { Mondes } from "@/components/mondes/Mondes";
import { Numbers } from "@/components/numbers/Numbers";
import { Professional } from "@/components/professional/Professional";
import { Travels } from "@/components/travels/Travels";
import { Places } from "@/components/places/Places";
import { Dance } from "@/components/dance/Dance";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Iris onComplete={() => setHeroReady(true)} />
      <main>
        <Hero play={heroReady} />
        <Recit />
        <Mondes />
        <Numbers />
        <Professional />
        <Travels />
        <Places />
        <Dance />
        <Contact />
      </main>
    </>
  );
}
