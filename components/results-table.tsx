"use client"

import { CountryBadge } from "@/components/country-badge"
import {
  getCountry,
  ordinal,
  placementFlavor,
  type Entry,
} from "@/lib/game"
import { translations, type Language } from "@/lib/i18n"

function Row({
  entry,
  language,
}: {
  entry: Entry
  language: Language
}) {
  const country = getCountry(entry.countryId)
  const t = translations[language]

  return (
    <div
      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
      style={{
        backgroundColor: entry.managed
          ? "rgba(244,114,182,0.14)"
          : "transparent",
        outline: entry.managed
          ? "1px solid rgba(244,114,182,0.4)"
          : "none",
      }}
    >
      <span
        className="w-5 shrink-0 text-center text-[12px] font-bold tabular-nums"
        style={{
          color:
            entry.position === 1
              ? "#fbbf24"
              : entry.position <= 3
                ? "#e2e8f0"
                : "rgba(255,255,255,0.4)",
        }}
      >
        {entry.position}
      </span>

      <CountryBadge country={country} size={24} />

      <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-white">
        {country.name}

        {entry.managed ? (
          <span className="ml-1 text-[10px] text-fuchsia-300">
            ({t.results.you})
          </span>
        ) : null}
      </span>

      <span className="shrink-0 text-[12px] font-bold tabular-nums text-cyan-300">
        {entry.points}
      </span>
    </div>
  )
}

export function ResultsTable({
  entries,
  year,
  onContinue,
  language = "en",
}: {
  entries: Entry[]
  year: number
  onContinue: () => void
  language?: Language
}) {
  const t = translations[language]

  const finalists = entries
    .filter((e) => e.qualified)
    .sort((a, b) => a.position - b.position)

  const managed = entries
    .filter((e) => e.managed)
    .sort((a, b) => {
      if (a.qualified !== b.qualified) {
        return a.qualified ? -1 : 1
      }

      return a.position - b.position
    })

  const top = finalists.slice(0, 10)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">
          {t.results.grandFinal} {year}
        </div>

        <h2 className="mt-1 text-xl font-bold text-white">
          {t.results.resultsAreIn}
        </h2>

        <p className="mt-1 text-[11px] text-white/45">
          {entries.length} {t.results.countries} • {finalists.length}{" "}
          {t.results.inGrandFinal}
        </p>
      </div>

      {/* Your countries' outcomes — qualification first, then placement */}
      <div className="flex flex-col gap-2">
        {managed.map((e) => {
          const country = getCountry(e.countryId)

          return (
            <div
              key={e.countryId}
              className="rounded-xl border p-3"
              style={{
                borderColor: e.qualified
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(248,113,113,0.35)",
                backgroundColor: e.qualified
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(248,113,113,0.08)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <CountryBadge country={country} size={32} />

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-white">
                    {country.name}
                  </div>

                  <div className="truncate text-[10px] text-white/45">
                    &ldquo;{e.song.title}&rdquo; • {e.song.genre.name}
                  </div>
                </div>

                {e.qualified ? (
                  <span className="shrink-0 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {e.autoQualified
                      ? t.results.autoFinal
                      : t.results.qualified}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-red-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
                    {t.results.eliminated}
                  </span>
                )}
              </div>

              {e.qualified ? (
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className="text-[15px] font-black tabular-nums"
                    style={{
                      color:
                        e.position === 1 ? "#fbbf24" : "#e2e8f0",
                    }}
                  >
                    {e.position}
                    {ordinal(e.position)}
                  </span>

                  <span className="text-[11px] text-white/50">
                    {t.results.inTheGrandFinal}
                  </span>

                  <span className="ml-auto text-[15px] font-black tabular-nums text-cyan-300">
                    {e.points}

                    <span className="ml-1 text-[10px] font-medium text-white/40">
                      {t.results.pts}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-[11px] font-semibold text-red-300">
                  {t.results.didNotQualify}
                </div>
              )}

              {e.event ? (
                <p className="mt-2 text-[11px] leading-snug text-white/50">
                  <span className="text-white/70">
                    {t.results.twist}
                  </span>{" "}
                  {e.event.text}
                </p>
              ) : null}

              <p className="mt-1 text-[11px] leading-snug text-fuchsia-200/80">
                {placementFlavor(e, finalists.length)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Aggregate scoreboard */}
      <div className="rounded-xl border border-white/10 bg-black/20 p-2">
        <div className="mb-1 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {t.results.scoreboard}
          </span>

          <span className="text-[10px] font-medium text-white/30">
            {t.results.pts}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {top.map((e) => (
            <Row
              key={e.countryId}
              entry={e}
              language={language}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
      >
        {t.results.endOfSeason}
      </button>
    </div>
  )
}