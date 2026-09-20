"use client"

import { useState } from "react"
import { translations, type Language } from "@/lib/i18n"

export const APP_VERSION = "1.0.1"

const CHANGELOG = {
  en: [
    {
      version: "1.0.2",
      date: "2026-09-20",
      changes: [
        "Game balancing to prevent the same countries from always winning.",
        "Improved randomness and artist repetition handling.",
        "Added bands and duos, with a chance for the band name to be in the country's official language.",
        "Semi-final correction. There are now two semi-finals instead of one featuring all countries that are not automatically qualified.",
      ],
    
    },
    {
      version: "1.0.1",
      date: "2026-09-19",
      changes: [
        "Added language selection.",
        "Added host city system with 95% capital / 5% alternative city selection.",
        "Added special host city exception for Eurovision 2027 in Burgas.",
        "Updated country capitals and alternative cities.",
        "Added staging decisions and contest progression.",
      ],
    },
    {
      version: "1.0.0",
      date: "2026-09-18",
      changes: ["Initial playable version."],
    },
  ],
  es: [
    {
      version: "1.0.2",
      date: "2026-09-20",
      changes: [
        "Balanceo del juego para que no ganen siempre los mismos.",
        "Corrección en la aleatoriedad y repetición de artistas.",
        "Añadidas bandas y duos, existe una probabilidad de que el nombre de la banda sea en el idioma oficial del país.",
        "Corrección semifinales. Ahora existen dos semifinales en vez de una con todos los paises no clasificados automáticamente.",
      ],
    },
    {
      version: "1.0.1",
      date: "2026-09-19",
      changes: [
        "Añadida la selección de idioma.",
        "Añadido el sistema de ciudades anfitrionas con un 95 % de probabilidad para la capital y un 5 % para una ciudad alternativa.",
        "Añadida una excepción especial para que Burgas sea la ciudad anfitriona de Eurovisión 2027.",
        "Actualizadas las capitales de los países y sus ciudades alternativas.",
        "Añadidas las decisiones de puesta en escena y la progresión del concurso.",
      ],
    },
    {
      version: "1.0.0",
      date: "2026-09-18",
      changes: ["Primera versión jugable."],
    },
  ],
} as const

export function ChangelogModal({
  language = "en",
}: {
  language?: Language
}) {
  const [open, setOpen] = useState(false)

  const isSpanish = language === "es"

  const t = isSpanish
    ? translations.es
    : translations.en

  const releases = isSpanish
    ? CHANGELOG.es
    : CHANGELOG.en

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-white/40 transition-colors hover:text-white/70 hover:underline underline-offset-4"
      >
        v{APP_VERSION} · {t.changelog}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.changelog}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#160a20] p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-300">
                  {isSpanish ? "Novedades" : "What's new"}
                </p>

                <h2 className="text-xl font-black text-white">
                  {t.changelog}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                {t.close}
              </button>
            </div>

            <div className="space-y-5">
              {releases.map((release) => (
                <section key={release.version}>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">
                      v{release.version}
                    </h3>

                    <span className="text-[11px] text-white/40">
                      {release.date}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <ul className="space-y-2">
                      {release.changes.map((change) => (
                        <li
                          key={change}
                          className="flex gap-2 text-xs text-white/70"
                        >
                          <span className="text-fuchsia-300">
                            •
                          </span>

                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}