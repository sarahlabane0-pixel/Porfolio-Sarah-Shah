import Link from "next/link";
import { cv } from "@/content/allaccess";
import { experiences } from "@/content/experiences";
import s from "./AfterEntry.module.css";

/**
 * End of the hero prototype. Deliberately calm: it continues the ivory page
 * the hero reframed into, says what comes next, and stops. The chapters
 * themselves will be designed once the entrance is approved.
 */
export function AfterEntry() {
  return (
    <section className={s.after} aria-labelledby="after-title">
      <div className={s.rule} aria-hidden="true" />
      <p className={`${s.kicker} aa-micro`}>Chapitre 00 — Entrée · fin du prototype</p>

      <h2 id="after-title" className={s.title}>
        La suite <em>se construit.</em>
      </h2>

      <div className={s.grid}>
        <div className={s.next}>
          <p className="aa-micro">Prochaine scène — 01 Work</p>
          <ol>
            {experiences.map((e, i) => (
              <li key={e.id}>
                <span className="aa-micro">{String(i + 1).padStart(2, "0")}</span>
                {e.company}
              </li>
            ))}
          </ol>
        </div>

        <div className={s.links}>
          <a href={cv.href} target="_blank" rel="noopener" className={s.link} data-cursor="cv" data-cursor-label="Open">
            <span className="aa-micro">PDF</span>
            {cv.longLabel} <span aria-hidden="true">↗</span>
          </a>
          <Link href="/v1" className={s.link} data-cursor="archive" data-cursor-label="Archive">
            <span className="aa-micro">Archive</span>
            Version précédente du portfolio <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
