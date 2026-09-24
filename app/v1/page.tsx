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
import { SectionBridge } from "@/components/shared/SectionBridge";

export default function ArchiveV1() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Iris onComplete={() => setHeroReady(true)} />
      <main>
        <Hero play={heroReady} />
        <SectionBridge from="#0c0a0b" to="#0c0a0b" />
        <Recit />
        <SectionBridge from="#2b0710" to="#2b0710" />
        <Mondes />
        <SectionBridge from="#2b0710" to="#0c0a0b" />
        <Numbers />
        <SectionBridge from="#0c0a0b" to="#3a0c17" />
        <Professional />
        <SectionBridge from="#3d1e12" to="#0c0a0b" />
        <Travels />
        <SectionBridge from="#f5efe4" to="#0c0a0b" />
        <Places />
        <SectionBridge from="#2b0710" to="#0c0a0b" />
        <Dance />
        <SectionBridge from="#0c0a0b" to="#0c0a0b" />
        <Contact />
      </main>
    </>
  );
}
