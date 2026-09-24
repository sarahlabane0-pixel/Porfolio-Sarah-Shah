"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { experiences, type Experience } from "@/content/experiences";
import { work } from "@/content/allaccess";
import { Photo, sharpWidth } from "../Photo";
import s from "./Work.module.css";

// The stage layout only exists on wide screens with motion allowed; the same
// query drives the CSS, so markup never flashes between layouts.
const STAGE_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

type Palette = { bg: string; fg: string; theme: "dark" | "light"; glow: string };

// One light per scene. All from the brand palette: the change of light is
// what makes a company change feel like a scene change.
const PALETTE: Record<string, Palette> = {
  adecco: { bg: "#2a0712", fg: "#f2ece4", theme: "dark", glow: "#651a35" },
  ketil: { bg: "#0d0b0c", fg: "#f2ece4", theme: "dark", glow: "#651a35" },
  choiseul: { bg: "#651a35", fg: "#f2ece4", theme: "dark", glow: "#ff6557" },
  dce: { bg: "#f2ece4", fg: "#0d0b0c", theme: "light", glow: "#c6c5c2" },
  disney: { bg: "#0d0b0c", fg: "#f2ece4", theme: "dark", glow: "#ff6557" },
};

// Photo placement on the stage: left/top in % of the stage, width in vw,
// z in px (positive = nearer the camera). Width is additionally capped by
// each file's real resolution (see Photo.sharpWidth).
type Slot = { x: number; y: number; w: number; z: number };
const SLOTS: Record<string, Slot[]> = {
  adecco: [
    { x: 53, y: 15, w: 27, z: 0 },
    { x: 69, y: 55, w: 22, z: 170 },
    { x: 82, y: 10, w: 13, z: -240 },
  ],
  ketil: [
    { x: 53, y: 12, w: 19, z: 0 },
    { x: 75, y: 7, w: 16, z: -280 },
    { x: 79, y: 47, w: 15, z: 110 },
    { x: 62, y: 57, w: 12, z: 230 },
    { x: 49, y: 71, w: 15, z: -140 },
  ],
  choiseul: [
    { x: 53, y: 18, w: 29, z: 0 },
    { x: 76, y: 52, w: 16, z: 190 },
  ],
  dce: [],
  disney: [
    { x: 58, y: 7, w: 18, z: 0 },
    { x: 73, y: 57, w: 21, z: 170 },
  ],
};

// DCE has no photographs: its keywords become the depth field instead.
const WORD_SLOTS: Slot[] = [
  { x: 49, y: 14, w: 0, z: 40 },
  { x: 57, y: 36, w: 0, z: -220 },
  { x: 50, y: 58, w: 0, z: 120 },
  { x: 60, y: 77, w: 0, z: -60 },
];

const SHORT: Record<string, string> = {
  adecco: "Adecco",
  ketil: "Ketil",
  choiseul: "Choiseul",
  dce: "Digital Content Expert",
  disney: "Disneyland",
};

/** Greedy split of a company name into display lines (~11 characters). */
function titleLines(name: string) {
  const out: string[] = [];
  for (const word of name.split(" ")) {
    const last = out[out.length - 1];
    if (last && (last + " " + word).length <= 11) out[out.length - 1] = `${last} ${word}`;
    else out.push(word);
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Work() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenisRef();
  // Scroll positions of each scene's settled state, filled by the stage timeline.
  const scenePositions = useRef<number[]>([]);

  useEffect(() => {
    const el = root.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const html = document.documentElement;
    const mm = gsap.matchMedia();
    const scenes = Array.from(stage.querySelectorAll<HTMLElement>(`.${s.scene}`));
    const rail = Array.from(stage.querySelectorAll<HTMLElement>(`.${s.railItem}`));

    // ── Wide screens: one pinned stage, five scenes ───────────────────
    mm.add(STAGE_QUERY, () => {
      const q = (sc: HTMLElement, sel: string) => Array.from(sc.querySelectorAll<HTMLElement>(sel));
      const zOf = (_: number, t: HTMLElement) => Number(t.dataset.z);
      const dirOf = (t: HTMLElement) => (Number(t.dataset.x) >= 66 ? 1 : -1);

      // Everything but the first scene starts hidden, deep in the field.
      scenes.forEach((sc, i) => {
        gsap.set(sc, { autoAlpha: i === 0 ? 1 : 0 });
        gsap.set(q(sc, "[data-slot]"), { z: zOf, x: 0, autoAlpha: 1 });
        gsap.set(q(sc, `.${s.details}`), { autoAlpha: 0 });
        const items = q(sc, `.${s.missions} li, .${s.stat}, .${s.chips}`);
        if (items.length) gsap.set(items, { autoAlpha: 0 });
      });
      const door = stage.querySelector<HTMLElement>(`.${s.door}`)!;
      const wipe = stage.querySelector<HTMLElement>(`.${s.wipe}`)!;
      const CLOSED = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
      const OPEN = "polygon(0% -12%, 100% 0%, 100% 100%, 0% 100%)";
      gsap.set(wipe, { clipPath: CLOSED });
      gsap.set(door, { backgroundColor: PALETTE[scenes[0].dataset.id!].bg });
      gsap.set(stage, { color: PALETTE[scenes[0].dataset.id!].fg });

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      const labels: number[] = [];
      let t = 0;

      scenes.forEach((sc, i) => {
        const id = sc.dataset.id!;
        const pal = PALETTE[id];
        const slots = q(sc, "[data-slot]");
        const lines = q(sc, `.${s.titleLine} > span`);
        const meta = q(sc, "[data-meta]");
        const head = sc.querySelector<HTMLElement>(`.${s.head}`)!;
        const lead = sc.querySelector<HTMLElement>(`.${s.lead}`)!;
        const details = sc.querySelector<HTMLElement>(`.${s.details}`)!;
        const items = q(sc, `.${s.missions} li, .${s.stat}, .${s.chips}`);
        const slate = sc.querySelector<HTMLElement>(`.${s.slate}`)!;
        // How far the details block must rise once the title shrinks.
        const lift = () => head.offsetHeight * 0.5;

        if (i > 0) {
          tl.set(sc, { autoAlpha: 1 }, t)
            // Scene change: the next light rises like a curtain, then
            // becomes the stage's own background.
            .set(wipe, { backgroundColor: pal.bg, clipPath: CLOSED }, t - 0.35)
            .to(wipe, { clipPath: OPEN, duration: 1.05, ease: "power2.inOut" }, t - 0.35)
            .set(door, { backgroundColor: pal.bg }, t + 0.7)
            .set(wipe, { clipPath: CLOSED }, t + 0.7)
            .to(stage, { color: pal.fg, duration: 0.5, ease: "power1.inOut" }, t + 0.1)
            .fromTo(slots, { z: (k, n) => zOf(k, n) - 1400, autoAlpha: 0 }, { z: zOf, x: 0, autoAlpha: 1, duration: 1.5, ease: "power2.out", stagger: 0.07 }, t)
            .fromTo(slate, { z: -2200, autoAlpha: 0 }, { z: -900, autoAlpha: 1, duration: 1.5, ease: "power2.out" }, t)
            .fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, t + 0.4)
            .fromTo(meta, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power2.out" }, t + 0.55)
            .fromTo(lead, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, t + 0.75);
          t += 1.5;
        }
        labels.push(t);
        t += 0.7; // establishing shot

        // Beat B — the title steps back, the missions come forward. A scene
        // with nothing more to say (Disney) simply holds its first beat.
        if (items.length === 0) {
          tl.to(slots, { z: (k, n) => zOf(k, n) - 120, duration: 2.2 }, t);
          t += 2.2;
        } else {
        tl.to(head, { scale: 0.5, duration: 1, ease: "power2.inOut" }, t)
          .to(lead, { autoAlpha: 0, y: -24, duration: 0.45 }, t)
          .fromTo(details, { autoAlpha: 0, y: () => 40 - lift() }, { autoAlpha: 1, y: () => -lift(), duration: 0.8, ease: "power2.out" }, t + 0.3)
          .fromTo(items, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }, t + 0.45)
          .to(slots, { z: (k, n) => zOf(k, n) - 280, x: "3vw", autoAlpha: 0.42, duration: 1, ease: "power2.inOut" }, t);
        t += 1 + 1.5; // …and holds long enough to read
        }

        if (i < scenes.length - 1) {
          // Exit: the camera travels through the scene.
          tl.to(slots, { z: (k, n) => zOf(k, n) + 700, x: (k, n) => `${dirOf(n) * 14}vw`, duration: 1.3, ease: "power2.in", stagger: 0.04 }, t)
            .to(slots, { autoAlpha: 0, duration: 0.75, ease: "power1.in", stagger: 0.04 }, t + 0.2)
            .to(slate, { z: 300, autoAlpha: 0, duration: 1.3, ease: "power2.in" }, t)
            .to(lines, { yPercent: -112, duration: 0.6, stagger: 0.05, ease: "power2.in" }, t)
            .to([...meta, details], { autoAlpha: 0, duration: 0.45 }, t)
            .set(sc, { autoAlpha: 0 }, t + 1.3)
            .set(head, { scale: 1 }, t + 1.3);
          t += 0.65;
        }
      });

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => `+=${Math.round(t * 30)}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          // Scroll position, not the (smoothed) animation time — so the rail
          // is right even straight after a jump.
          const time = self.progress * tl.duration();
          let active = 0;
          labels.forEach((l, k) => {
            if (time >= l - 0.8) active = k;
          });
          rail.forEach((r, k) => {
            r.dataset.state = k < active ? "done" : k === active ? "on" : "off";
            const from = labels[k] - (k ? 1.5 : 0);
            const to = labels[k + 1] ?? tl.duration();
            r.style.setProperty("--p", String(gsap.utils.clamp(0, 1, (time - from) / (to - from))));
          });
          if (self.isActive) html.setAttribute("data-aa-theme", PALETTE[scenes[active].dataset.id!].theme);
        },
        onRefresh: (self) => {
          scenePositions.current = labels.map((l) => self.start + (l / tl.duration()) * (self.end - self.start));
        },
      });

      // The stage door: the frame opens as the stage rises into view.
      const doorOpen = gsap.fromTo(
        door,
        { clipPath: "inset(9% 5% 0% 5% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "top top", scrub: true },
        },
      );

      // Cursor: moving the vanishing point gives true parallax — nearer
      // photos travel further — without touching any photo's transform.
      const fields = Array.from(stage.querySelectorAll<HTMLElement>(`.${s.depth}`));
      const target = { x: 0.62, y: 0.45 };
      const cur = { ...target };
      const onMove = (e: PointerEvent) => {
        target.x = 0.62 + ((e.clientX / window.innerWidth) * 2 - 1) * 0.22;
        target.y = 0.45 + ((e.clientY / window.innerHeight) * 2 - 1) * 0.16;
      };
      const tick = (_: number, dt: number) => {
        if (!st.isActive) return;
        const k = 1 - Math.pow(1 - 0.06, dt / 16.67);
        cur.x += (target.x - cur.x) * k;
        cur.y += (target.y - cur.y) * k;
        const v = `${(cur.x * 100).toFixed(2)}% ${(cur.y * 100).toFixed(2)}%`;
        for (const f of fields) f.style.perspectiveOrigin = v;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
        st.kill();
        doorOpen.scrollTrigger?.kill();
        doorOpen.kill();
        tl.kill();
        scenePositions.current = [];
      };
    });

    // ── Narrow screens / tablets: scenes in flow, each revealed on entry ─
    mm.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
      const triggers = scenes.map((sc) => {
        const pal = PALETTE[sc.dataset.id!];
        const lines = sc.querySelectorAll(`.${s.titleLine} > span`);
        const reveal = gsap.fromTo(
          lines,
          { yPercent: 112 },
          { yPercent: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: sc, start: "top 75%" } },
        );
        const photos = gsap.fromTo(
          sc.querySelectorAll("[data-slot]"),
          { autoAlpha: 0, x: 60 },
          { autoAlpha: 1, x: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: sc.querySelector(`.${s.depth}`), start: "top 85%" } },
        );
        const theme = ScrollTrigger.create({
          trigger: sc,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => self.isActive && html.setAttribute("data-aa-theme", pal.theme),
        });
        return [reveal, photos, theme] as const;
      });
      return () =>
        triggers.forEach(([a, b, c]) => {
          a.scrollTrigger?.kill();
          b.scrollTrigger?.kill();
          a.kill();
          b.kill();
          c.kill();
        });
    });

    // ── Reduced motion: flow layout, theme only ──────────────────────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const triggers = scenes.map((sc) =>
        ScrollTrigger.create({
          trigger: sc,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => self.isActive && html.setAttribute("data-aa-theme", PALETTE[sc.dataset.id!].theme),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  // Line-up: jump to a scene (on the stage, to its settled beat).
  const goTo = (i: number) => {
    const lenis = lenisRef.current;
    const pos = scenePositions.current[i];
    const target =
      pos ?? (stageRef.current?.querySelectorAll<HTMLElement>(`.${s.scene}`)[i]?.getBoundingClientRect().top ?? 0) + window.scrollY;
    if (lenis) lenis.scrollTo(target, { duration: 1.8 });
    else window.scrollTo({ top: target, behavior: "auto" });
  };

  // Hover preview on the line-up (fine pointers only; purely decorative).
  const onLineupMove = (e: MouseEvent<HTMLElement>) => {
    const p = previewRef.current;
    if (!p) return;
    gsap.to(p, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out", overwrite: "auto" });
  };
  const showPreview = (i: number | null) => {
    const p = previewRef.current;
    if (!p || !window.matchMedia("(pointer: fine)").matches) return;
    p.dataset.active = i === null ? "" : String(i);
  };

  return (
    <section ref={root} id="work" className={s.work} data-chapter="01" aria-labelledby="work-title">
      <header className={s.intro} data-theme-zone="light">
        <p className={`${s.kicker} aa-micro`}>
          <span>01 — {work.kicker}</span>
          <span>{work.count}</span>
        </p>
        <h2 id="work-title" className={s.introTitle}>
          {work.titleA} <em>{work.titleB}</em>
        </h2>
        <p className={s.introLead}>{work.lead}</p>

        <ol className={s.lineup} onMouseMove={onLineupMove} onMouseLeave={() => showPreview(null)}>
          {experiences.map((x, i) => (
            <li key={x.id}>
              <button
                type="button"
                className={s.lineupRow}
                onClick={() => goTo(i)}
                onMouseEnter={() => showPreview(i)}
                onFocus={() => showPreview(null)}
                data-cursor="work"
                data-cursor-label="Enter"
              >
                <span className="aa-micro">{pad(i + 1)}</span>
                <span className={s.lineupName}>{x.company}</span>
                <span className={s.lineupRole}>{x.role}</span>
                <span className="aa-micro">{x.period}</span>
              </button>
            </li>
          ))}
        </ol>

        <div ref={previewRef} className={s.preview} aria-hidden="true">
          {experiences.map((x, i) =>
            x.media[0] ? (
              <div key={x.id} className={s.previewItem} data-i={i}>
                <Photo media={x.media[0]} sizes="240px" />
              </div>
            ) : (
              <div key={x.id} className={`${s.previewItem} ${s.previewWord}`} data-i={i}>
                {x.keywords?.[0]}
              </div>
            ),
          )}
        </div>
      </header>

      <div ref={stageRef} className={s.stage}>
        <div className={s.door}>
          <div className={s.wipe} aria-hidden="true" />
          {experiences.map((x, i) => (
            <Scene key={x.id} x={x} i={i} total={experiences.length} />
          ))}
        </div>

        <nav className={s.rail} aria-label="Expériences">
          <ol>
            {experiences.map((x, i) => (
              <li key={x.id}>
                <button type="button" className={s.railItem} data-state={i === 0 ? "on" : "off"} onClick={() => goTo(i)}>
                  <span className="aa-micro">
                    {pad(i + 1)} {SHORT[x.id]}
                  </span>
                  <span className={s.railBar} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

function Scene({ x, i, total }: { x: Experience; i: number; total: number }) {
  const pal = PALETTE[x.id];
  const slots = SLOTS[x.id] ?? [];
  const style = { "--bg": pal.bg, "--fg": pal.fg, "--glow": pal.glow } as CSSProperties;

  return (
    <article
      className={s.scene}
      data-id={x.id}
      data-long={x.missions.length > 4 ? "" : undefined}
      style={style}
      aria-labelledby={`work-${x.id}`}
    >
      <div className={s.glowLayer} aria-hidden="true" />

      <div className={s.depth}>
        <p className={s.slate} aria-hidden="true">
          {pad(i + 1)}
        </p>
        {x.media.map((m, k) => {
          const slot = slots[k] ?? slots[slots.length - 1];
          const cap = sharpWidth(m);
          return (
            <figure
              key={m.src}
              className={s.slot}
              data-slot
              data-z={slot.z}
              data-x={slot.x}
              style={{ "--x": `${slot.x}%`, "--y": `${slot.y}%`, "--w": `min(${slot.w}vw, ${cap}px)`, "--cap": `${cap}px` } as CSSProperties}
            >
              <Photo media={m} sizes={`(min-width: 1024px) min(${slot.w}vw, ${cap}px), min(72vw, ${cap}px)`} />
            </figure>
          );
        })}
        {x.media.length === 0 &&
          x.keywords?.map((w, k) => {
            const slot = WORD_SLOTS[k % WORD_SLOTS.length];
            return (
              <p
                key={w}
                className={`${s.slot} ${s.word} ${k % 2 ? s.wordOutline : ""}`}
                data-slot
                data-z={slot.z}
                data-x={slot.x}
                style={{ "--x": `${slot.x}%`, "--y": `${slot.y}%` } as CSSProperties}
                aria-hidden="true"
              >
                {w}
              </p>
            );
          })}
      </div>

      <div className={s.col}>
        <div className={s.head}>
          <p className={`${s.index} aa-micro`} data-meta>
            <span>
              {pad(i + 1)} / {pad(total)}
            </span>
            <span>{x.period}</span>
          </p>
          <h3 id={`work-${x.id}`} className={s.title}>
            {titleLines(x.company).map((line) => (
              <span key={line} className={s.titleLine}>
                <span>{line}</span>
              </span>
            ))}
          </h3>
          <p className={s.role} data-meta>
            {x.role}
          </p>
          <ul className={s.tags} data-meta>
            {x.tags.map((t) => (
              <li key={t} className="aa-micro">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className={s.body}>
          <p className={s.lead}>{x.standfirst}</p>

          <div className={s.details}>
            {x.stat && (
              <p className={s.stat}>
                <strong>{x.stat.value}</strong>
                <span>{x.stat.label}</span>
              </p>
            )}
            {x.missions.length > 0 && (
              <ol className={s.missions}>
                {x.missions.map((mi, k) => (
                  <li key={mi}>
                    <span className="aa-micro">{pad(k + 1)}</span>
                    <span>{mi}</span>
                  </li>
                ))}
              </ol>
            )}
            {(x.tools || x.keywords) && (
              <p className={`${s.chips} aa-micro`}>
                <span>{x.tools ? "Outils" : "Mots-clés"}</span>
                {(x.tools ?? x.keywords)!.map((c) => (
                  <span key={c} className={s.chip}>
                    {c}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
