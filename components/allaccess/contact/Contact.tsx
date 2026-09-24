"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenisRef } from "@/lib/SmoothScrollProvider";
import { contact, cv, finale, identity } from "@/content/allaccess";
import { media } from "@/content/media";
import { Photo } from "../Photo";
import s from "./Contact.module.css";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const lenisRef = useLenisRef();

  // ── Scroll: the last scene lights up ──────────────────────────────
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = (sel: string) => stage.querySelectorAll<HTMLElement>(sel);
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.fromTo(q(`.${s.led}`), { autoAlpha: 0.05 }, { autoAlpha: 0.32, duration: 3 }, 0)
        .fromTo(q(`.${s.beamL}`), { rotation: -38, autoAlpha: 0 }, { rotation: -14, autoAlpha: 0.55, duration: 3, ease: "power2.out" }, 0)
        .fromTo(q(`.${s.beamR}`), { rotation: 38, autoAlpha: 0 }, { rotation: 14, autoAlpha: 0.55, duration: 3, ease: "power2.out" }, 0)
        .fromTo(q(`.${s.word}`), { yPercent: 115, rotation: 3 }, { yPercent: 0, rotation: 0, duration: 0.9, stagger: 0.28, ease: "power3.out" }, 0.4)
        .fromTo(q(`.${s.period}`), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(3)" }, 2.6)
        .fromTo(q("[data-detail]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 2.8)
        .fromTo(rigRef.current, { yPercent: -120 }, { yPercent: 0, duration: 1.2, ease: "power3.out" }, 2.2)
        .to({}, { duration: 1 });

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        animation: tl,
      });
      return () => {
        st.kill();
        tl.kill();
      };
    });
    return () => mm.revert();
  }, []);

  // ── The pass: a pendulum you can grab, throw, or brush past ──────
  useEffect(() => {
    const rig = rigRef.current;
    const swing = swingRef.current;
    if (!rig || !swing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let theta = 0.18; // rad
    let omega = 0;
    let held = false;
    let lastTheta = 0;
    let lastT = performance.now();
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(rig);

    const pivot = () => {
      const r = rig.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top };
    };
    const angleTo = (x: number, y: number) => {
      const p = pivot();
      return Math.atan2(-(x - p.x), y - p.y);
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      if (!visible) return;
      if (!held) {
        // Pendulum: gravity, damping, and a faint draught.
        const g = 9.6;
        const L = 1.1;
        omega += (-(g / L) * Math.sin(theta) - 0.9 * omega + Math.sin(now / 1300) * 0.08) * dt;
        theta += omega * dt;
      }
      swing.style.transform = `rotate(${(-theta * 180) / Math.PI}deg)`;
    };
    gsap.ticker.add(tick);

    const onDown = (e: PointerEvent) => {
      held = true;
      swing.setPointerCapture(e.pointerId);
      lastTheta = theta;
      rig.dataset.held = "true";
    };
    const onMove = (e: PointerEvent) => {
      if (held) {
        const a = gsap.utils.clamp(-1.3, 1.3, angleTo(e.clientX, e.clientY));
        omega = (a - lastTheta) / Math.max(1 / 60, 0.016);
        lastTheta = theta = a;
        return;
      }
      // Brushing past gives it a push, proportional to the cursor's speed.
      if (e.pointerType === "mouse") {
        const r = swing.getBoundingClientRect();
        const near = e.clientX > r.left - 40 && e.clientX < r.right + 40 && e.clientY > r.top - 40 && e.clientY < r.bottom + 40;
        if (near) omega += gsap.utils.clamp(-2, 2, -e.movementX * 0.02);
      }
    };
    const onUp = () => {
      held = false;
      rig.dataset.held = "false";
    };
    swing.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      swing.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const toTop = () => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { duration: 2.4 });
    else window.scrollTo({ top: 0 });
  };

  return (
    <section ref={root} id="contact" className={s.contact} data-chapter="06" data-theme-zone="dark" aria-labelledby="contact-title">
      <div ref={stageRef} className={s.stage}>
        <div className={s.led} aria-hidden="true" />
        <span className={`${s.beam} ${s.beamL}`} aria-hidden="true" />
        <span className={`${s.beam} ${s.beamR}`} aria-hidden="true" />

        <p className={`${s.kicker} aa-micro`}>06 — {finale.kicker}</p>

        <h2 id="contact-title" className={s.title}>
          {finale.lines.map((line, i) => (
            <span key={line} className={s.line}>
              {line.split(" ").map((w, k) => (
                <span key={`${w}-${k}`} className={s.clip}>
                  <span className={`${s.word} ${i === 2 ? s.serif : ""}`}>{w}</span>
                </span>
              ))}
              {i === finale.lines.length - 1 && <span className={s.period}>.</span>}
            </span>
          ))}
        </h2>

        <div className={s.details}>
          <div className={s.mailRow} data-detail>
            <a href={`mailto:${contact.email}`} className={s.mail} data-cursor="mail" data-cursor-label="Write">
              {contact.email}
            </a>
            <button type="button" className={`${s.copy} aa-micro`} onClick={copy} aria-live="polite">
              {copied ? finale.copied : finale.copy}
            </button>
          </div>
          <dl className={s.meta} data-detail>
            <div>
              <dt className="aa-micro">Téléphone</dt>
              <dd>
                <a href={`tel:${contact.phoneHref}`}>{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="aa-micro">Basée à</dt>
              <dd>{contact.location}</dd>
            </div>
            <div>
              <dt className="aa-micro">CV</dt>
              <dd>
                <a href={cv.href} target="_blank" rel="noopener">
                  {cv.longLabel} <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
          </dl>
          <p className={s.sub} data-detail>
            {contact.subtitle}
          </p>
        </div>

        <div ref={rigRef} className={s.rig} data-held="false">
          <div ref={swingRef} className={s.swing} data-cursor="pass" data-cursor-label="Grab">
            <span className={s.lanyard} aria-hidden="true" />
            <div className={s.pass}>
              <span className={s.slot} aria-hidden="true" />
              <p className={s.passTitle}>
                {finale.pass.title} <i />
              </p>
              <div className={s.passPhoto}>
                <Photo media={media.portrait} sizes="10rem" />
              </div>
              <p className={s.passName}>
                {identity.firstName} {identity.lastName}
              </p>
              <p className={`${s.passLine} aa-micro`}>{finale.pass.role}</p>
              <p className={`${s.passLine} aa-micro`}>
                {finale.pass.zone} — {identity.city}
              </p>
              <span className={s.barcode} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <footer className={s.foot}>
        <p className="aa-micro">
          © 2026 {identity.firstName} {identity.lastName} — {identity.edition}
        </p>
        <button type="button" className="aa-micro" onClick={toTop}>
          {finale.back} ↑
        </button>
        <Link href="/v1" className="aa-micro">
          {finale.archive}
        </Link>
      </footer>
    </section>
  );
}
