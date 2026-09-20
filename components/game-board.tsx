"use client"

import { useMemo, useState } from "react"
import { CountryBadge } from "@/components/country-badge"
import { CountrySelect } from "@/components/country-select"
import { DecisionCard } from "@/components/decision-card"
import { ResultsTable } from "@/components/results-table"
import { StatBars } from "@/components/stat-bars"
import { ChangelogModal } from "@/components/changelog-modal"
import {
  applyEffect,
  DECISIONS,
  COUNTRIES,
  generateSong,
  getCountry,
  getHostCity,
  getSeasonTitle,
  getSeason,
  runContest,
  seedStats,
  shuffle,
  START_HOST,
  START_YEAR,
  type Decision,
  type Entry,
  type Artist,
  type Song,
  type Stats,
} from "@/lib/game"
import {
  getCountryName,
  getTranslatedSeasonTitle,
} from "@/lib/game-i18n"
import { translations, type Language } from "@/lib/i18n"

type Phase = "intro" | "select" | "questions" | "results"

type ActState = {
  countryId: string
  song: Song
  stats: Stats
  decision: Decision
}

type Trophy = {
  year: number
  countryId: string
  position: number
}

type SeasonHistory = {
  year: number
  hostId: string
  hostCity: string
  entries: Entry[]
}

function HistoryModal({
  seasons,
  onClose,
  onOpenPalmares,
  t,
  language,
}: {
  seasons: SeasonHistory[]
  onClose: () => void
  onOpenPalmares: () => void
  t: (typeof translations)[Language]
  language: Language
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.historyModal.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#160a20] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-300">
              {t.historyModal.archive}
            </p>

            <h2 className="text-xl font-black text-white">
              {t.historyModal.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white"
          >
            {t.close}
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenPalmares}
          className="mb-5 w-full rounded-lg border border-yellow-300/40 bg-yellow-400/10 px-3 py-2 text-xs font-semibold text-yellow-100 transition hover:border-yellow-200 hover:bg-yellow-400/20 hover:text-white"
        >
          🏆 {language === "es" ? "Palmarés" : "Hall of Fame"}
        </button>

        <div className="space-y-5">
          {seasons.map((season) => {
            const host = getCountry(season.hostId)

            const seasonTitle =
              language === "en"
                ? `${season.hostCity} (${host.name}) ${season.year}`
                : getTranslatedSeasonTitle(
                    season.year,
                    getCountryName(
                      host.id,
                      host.name,
                      language,
                    ),
                    season.hostCity,
                    language,
                  )

            return (
              <section key={season.year}>
                <h3 className="mb-2 text-sm font-bold text-white">
                  {seasonTitle}
                </h3>

                <div className="space-y-2">
                  {season.entries.map((entry) => {
                    const country = getCountry(entry.countryId)
                    const winner = entry.position === 1
                    const score = entry.qualified
                      ? entry.points
                      : entry.semiPoints

                    const placement = entry.qualified
                      ? "#" + entry.position
                      : "SF #" + entry.semiPosition

                    const countryName = getCountryName(
                      country.id,
                      country.name,
                      language,
                    )

                    return (
                      <div
                        key={entry.countryId}
                        className={
                          winner
                            ? "rounded-xl border border-amber-300/70 bg-amber-400/15 p-3"
                            : "rounded-xl border border-white/10 bg-white/[0.03] p-3"
                        }
                      >
                        <div className="flex items-start gap-3">
                          <CountryBadge
                            country={country}
                            size={32}
                          />

                          <div className="min-w-0 flex-1">
                            <div
                              className={
                                winner
                                  ? "font-bold text-amber-200"
                                  : "font-bold text-white"
                              }
                            >
                              {winner ? "🏆 " : ""}
                              {countryName}
                            </div>

                            <div className="truncate text-xs text-white/70">
                              {entry.song.artist.name}
                              {" · “"}
                              {entry.song.title}
                              {"”"}
                            </div>
                          </div>

                          <div className="text-right text-xs">
                            <div
                              className={
                                winner
                                  ? "font-black text-amber-200"
                                  : "font-bold text-white"
                              }
                            >
                              {placement}
                            </div>

                            <div className="text-white/55">
                              {score} {t.results.pts}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PalmaresModal({
  gameWins,
  onClose,
  language,
}: {
  gameWins: Record<string, number>
  onClose: () => void
  language: Language
}) {
  const countries = COUNTRIES.map((country) => {
    const realWins = getRealEurovisionWins(country.id)
    const gameWinsCount = gameWins[country.id] ?? 0

    return {
      ...country,
      realWins,
      gameWins: gameWinsCount,
      totalWins: realWins + gameWinsCount,
    }
  }).sort(
    (a, b) =>
      b.totalWins - a.totalWins ||
      b.realWins - a.realWins ||
      a.name.localeCompare(b.name),
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === "es" ? "Palmarés" : "Hall of Fame"}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <h2 className="text-xl font-bold text-white">
              🏆 {language === "es" ? "Palmarés" : "Hall of Fame"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {language === "es"
                ? "Victorias reales de Eurovisión y victorias conseguidas en el juego."
                : "Real Eurovision victories and victories achieved in the game."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>
              {language === "es" ? "País" : "Country"}
            </span>

            <span className="text-center">
              {language === "es" ? "Reales" : "Real"}
            </span>

            <span className="text-center">
              {language === "es" ? "Juego" : "Game"}
            </span>

            <span className="text-center">
              {language === "es" ? "Total" : "Total"}
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {countries.map((country) => (
              <div
                key={country.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <CountryBadge countryId={country.id} />

                  <span className="text-sm font-medium text-white">
                    {getCountryName(country.id, language)}
                  </span>
                </div>

                <span className="min-w-8 text-center text-sm text-slate-300">
                  {country.realWins}
                </span>

                <span className="min-w-8 text-center text-sm text-fuchsia-300">
                  {country.gameWins}
                </span>

                <span className="min-w-8 text-center text-sm font-bold text-yellow-300">
                  {country.totalWins}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LanguageModal({
  language,
  setLanguage,
  onClose,
  t,
}: {
  language: Language
  setLanguage: (language: Language) => void
  onClose: () => void
  t: (typeof translations)[Language]
}) {
  const isEnglish = language === "en"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEnglish ? "Language" : "Idioma"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#160a20] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-300">
              {isEnglish ? "Language" : "Idioma"}
            </p>

            <h2 className="text-xl font-black text-white">
              {isEnglish
                ? "Select language"
                : "Selecciona el idioma"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white"
          >
            {t.close}
          </button>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setLanguage("en")
              onClose()
            }}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
              language === "en"
                ? "border-fuchsia-300/60 bg-fuchsia-400/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
            }`}
          >
            <span className="text-xl">🇬🇧</span>
            <span className="font-semibold">English</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage("es")
              onClose()
            }}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
              language === "es"
                ? "border-fuchsia-300/60 bg-fuchsia-400/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
            }`}
          >
            <span className="text-xl">🇪🇸</span>
            <span className="font-semibold">Español</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function GameBoard() {
  const [language, setLanguage] = useState<Language>("en")
  const [languageOpen, setLanguageOpen] = useState(false)

  const t = translations[language]

  const [phase, setPhase] = useState<Phase>("intro")
  const [year, setYear] = useState(START_YEAR)
  const [host, setHost] = useState(START_HOST)
  const [pendingHost, setPendingHost] = useState<string | null>(null)
  const [roster, setRoster] = useState<string[]>([])
  const [acts, setActs] = useState<ActState[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [history, setHistory] = useState<SeasonHistory[]>([])
  const [artistHistory, setArtistHistory] = useState<Record<string, Artist[]>>({})
  const [historyOpen, setHistoryOpen] = useState(false)
  const [palmaresOpen, setPalmaresOpen] = useState(false)
  const [gameWins, setGameWins] = useState<Record<string, number>>({})

  const wins = trophies.filter(
    (trophy) => trophy.position === 1,
  ).length

  const season = useMemo(() => {
    const { participants, withdrawals } = getSeason(year, host)
    const songs: Record<string, Song> = {}
  
    const usedArtists = new Set<string>()
  
    for (const country of participants) {
      const returningArtists =
        artistHistory[country.id] ?? []
  
      const song = generateSong(
        country.id,
        year,
        usedArtists,
        returningArtists,
      )
  
      songs[country.id] = song
  
      // Los veteranos ya existen, así que no los volvemos
      // a registrar como artistas nuevos.
      if (!song.veteran) {
        usedArtists.add(song.artist.id)
      }
    }
  
    return {
      participants,
      withdrawals,
      songs,
    }
  }, [year, host, artistHistory])

  function beginSeason(ids: string[]) {
    const deck = shuffle(DECISIONS)

    const newActs: ActState[] = ids.map((id, i) => {
      const song = season.songs[id]

      return {
        countryId: id,
        song,
        stats: seedStats(getCountry(id), song),
        decision: deck[i % deck.length],
      }
    })

    setRoster(ids)
    setActs(newActs)
    setQIndex(0)
    setPhase("questions")
  }

  function answer(side: "left" | "right") {
    setActs((prev) => {
      const next = [...prev]
      const act = next[qIndex]

      const choice =
        side === "left"
          ? act.decision.left
          : act.decision.right

      next[qIndex] = {
        ...act,
        stats: applyEffect(act.stats, choice.effects),
      }

      return next
    })

    if (qIndex + 1 < acts.length) {
      setQIndex((i) => i + 1)
    } else {
      setTimeout(() => resolveContest(), 0)
    }
  }

  function resolveContest() {
    setActs((current) => {
      const result = runContest({
        participants: season.participants,
        songs: season.songs,
        managed: current.map((a) => ({
          countryId: a.countryId,
          stats: a.stats,
        })),
        hostId: host,
      })

      const managedEntries = result.filter(
        (entry) => entry.managed,
      )

      setArtistHistory((previous) => {
        const next = { ...previous }
      
        for (const country of season.participants) {
          const song = season.songs[country.id]
      
          if (!song) continue
      
          const existing = next[country.id] ?? []
      
          if (!existing.some((artist) => artist.id === song.artist.id)) {
            next[country.id] = [
              ...existing,
              song.artist,
            ]
          }
        }
      
        return next
      })

      setEntries(result)

      setHistory((previous) => [
        ...previous,
        {
          year,
          hostId: host,
          hostCity: getHostCity(host, year),
          entries: managedEntries,
        },
      ])

      setTrophies((prev) => [
        ...prev,
        ...managedEntries.map((entry) => ({
          year,
          countryId: entry.countryId,
          position: entry.qualified
            ? entry.position
            : 0,
        })),
      ])

      const winner = result.find(
        (entry) => entry.position === 1,
      )

      if (winner) {
        setGameWins((previous) => ({
          ...previous,
          [winner.countryId]:
            (previous[winner.countryId] ?? 0) + 1,
        }))
      }

      setPendingHost(
        winner ? winner.countryId : host,
      )
      setPhase("results")

      return current
    })
  }

  function nextSeason() {
    if (pendingHost) {
      setHost(pendingHost)
    }

    setPendingHost(null)
    setYear((value) => value + 1)
    setPhase("select")
  }

  function exitGame() {
    setPhase("intro")
    setYear(START_YEAR)
    setHost(START_HOST)
    setPendingHost(null)
    setRoster([])
    setActs([])
    setQIndex(0)
    setEntries([])
    setTrophies([])
    setHistory([])
    setGameWins({})
    setArtistHistory({})
    setHistoryOpen(false)
    setLanguageOpen(false)
  }

  const exitButton = (
    <button
      type="button"
      onClick={exitGame}
      className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
    >
      {t.exitGame}
    </button>
  )

  const historyButton = (
    <button
      type="button"
      onClick={() => setHistoryOpen(true)}
      className="rounded-lg border border-fuchsia-300/40 px-3 py-1.5 text-xs font-semibold text-fuchsia-100 transition hover:border-fuchsia-200 hover:text-white"
    >
      {t.history}
    </button>
  )

  // El selector de idioma solo se muestra en la pantalla inicial.
  const languageButton = (
    <button
      type="button"
      onClick={() => setLanguageOpen(true)}
      className="rounded-lg border border-fuchsia-300/40 px-3 py-1.5 text-xs font-semibold text-fuchsia-100 transition hover:border-fuchsia-200 hover:text-white"
    >
      🌐 {language === "en" ? "English" : "Español"}
    </button>
  )

  const historyModal = historyOpen ? (
    <HistoryModal
      seasons={history}
      onClose={() => setHistoryOpen(false)}
      onOpenPalmares={() => setPalmaresOpen(true)}
      t={t}
      language={language}
    />
  ) : null

  const palmaresModal = palmaresOpen ? (
    <PalmaresModal
      gameWins={gameWins}
      onClose={() => setPalmaresOpen(false)}
      t={t}
      language={language}
    />
  ) : null

  const languageModal = languageOpen ? (
    <LanguageModal
      language={language}
      setLanguage={setLanguage}
      onClose={() => setLanguageOpen(false)}
      t={t}
    />
  ) : null

  const changelog = (
    <ChangelogModal language={language} />
  )

  if (phase === "intro") {
    return (
      <div className="flex w-full flex-col items-center gap-5 text-center">
        <div className="flex w-full justify-end">
          {languageButton}
        </div>

        <div className="flex -space-x-2">
          {["se", "it", "ua", "fi"].map((id) => (
            <CountryBadge
              key={id}
              country={getCountry(id)}
              size={40}
            />
          ))}
        </div>

        <div>
          <h1 className="text-2xl font-black leading-tight text-white">
            {t.game.title}
          </h1>

          <p className="mt-1 text-[12px] leading-snug text-white/55">
            {t.game.description}
          </p>
        </div>

        <ul className="w-full space-y-1.5 text-left text-[11px] text-white/60">
          <li className="flex gap-2">
            <span className="text-fuchsia-300">1.</span>
            {t.game.steps.one}
          </li>

          <li className="flex gap-2">
            <span className="text-fuchsia-300">2.</span>
            {t.game.steps.two}
          </li>

          <li className="flex gap-2">
            <span className="text-fuchsia-300">3.</span>
            {t.game.steps.three}
          </li>

          <li className="flex gap-2">
            <span className="text-fuchsia-300">4.</span>
            {t.game.steps.four}
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setPhase("select")}
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
        >
          {t.startSeason} {START_YEAR}
        </button>

        <div className="pt-1">
          {changelog}
        </div>

        {languageModal}
      </div>
    )
  }

  if (phase === "select") {
    const isFirst = roster.length === 0

    const stillIn = roster.filter((id) =>
      season.participants.some(
        (country) => country.id === id,
      ),
    )

    return (
      <div className="flex w-full flex-col gap-3">
        <div className="flex justify-end gap-2">
          {historyButton}
          {exitButton}
        </div>

        <CountrySelect
          year={year}
          host={host}
          title={
            isFirst
              ? t.chooseCountries
              : t.nextSeason
          }
          subtitle={
            isFirst
              ? t.countrySelect.chooseSubtitle
              : t.countrySelect.nextSubtitle
          }
          participants={season.participants}
          songs={season.songs}
          withdrawals={season.withdrawals}
          initial={stillIn}
          confirmLabel={t.countrySelect.enterRehearsals}
          onConfirm={beginSeason}
          language={language}
        />

        {historyModal}
        {palmaresModal}
      </div>
    )
  }

  if (phase === "questions") {
    const act = acts[qIndex]

    if (!act) {
      return null
    }

    const hostCountry = getCountry(host)
    const hostCity = getHostCity(host, year)

    const seasonTitle =
      language === "en"
        ? getSeasonTitle(year, host)
        : getTranslatedSeasonTitle(
            year,
            getCountryName(
              hostCountry.id,
              hostCountry.name,
              language,
            ),
            hostCity,
            language,
          )

    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">
            {seasonTitle}
          </span>

          <span className="text-[11px] font-medium text-white/40">
            {wins}{" "}
            {wins === 1
              ? t.wins.one
              : t.wins.other}
          </span>

          <div className="flex gap-2">
            {historyButton}
            {exitButton}
          </div>
        </div>

        <DecisionCard
          key={act.countryId + "-" + qIndex}
          country={getCountry(act.countryId)}
          song={act.song}
          decision={act.decision}
          index={qIndex}
          total={acts.length}
          onChoose={answer}
          language={language}
        />

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {t.currentEntry}
          </div>

          <StatBars
            stats={act.stats}
            compact
            language={language}
          />
        </div>

        {historyModal}
        {palmaresModal}
      </div>
    )
  }

  if (phase === "results") {
    return (
      <div className="flex w-full flex-col gap-3">
        <div className="flex justify-end gap-2">
          {historyButton}
          {exitButton}
        </div>

        <ResultsTable
          entries={entries}
          year={year}
          onContinue={nextSeason}
          language={language}
        />

        {historyModal}
        {palmaresModal}
      </div>
    )
  }

  return null
}