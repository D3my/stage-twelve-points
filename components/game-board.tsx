"use client"

import { useMemo, useState } from "react"
import { CountryBadge } from "@/components/country-badge"
import { CountrySelect } from "@/components/country-select"
import { DecisionCard } from "@/components/decision-card"
import { ResultsTable } from "@/components/results-table"
import { StatBars } from "@/components/stat-bars"
import {
  applyEffect,
  DECISIONS,
  generateSong,
  getCountry,
  getSeason,
  runContest,
  seedStats,
  shuffle,
  START_HOST,
  START_YEAR,
  type Decision,
  type Entry,
  type Song,
  type Stats,
} from "@/lib/game"

type Phase = "intro" | "select" | "questions" | "results"

type ActState = {
  countryId: string
  song: Song
  stats: Stats
  decision: Decision
}

type Trophy = { year: number; countryId: string; position: number }

export function GameBoard() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [year, setYear] = useState(START_YEAR)
  const [host, setHost] = useState(START_HOST)
  const [pendingHost, setPendingHost] = useState<string | null>(null)
  const [roster, setRoster] = useState<string[]>([])
  const [acts, setActs] = useState<ActState[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [trophies, setTrophies] = useState<Trophy[]>([])

  const wins = trophies.filter((t) => t.position === 1).length

  // This year's line-up + each country's song, stable for the whole season.
  const season = useMemo(() => {
    const { participants, withdrawals } = getSeason(year, host)
    const songs: Record<string, Song> = {}
    for (const c of participants) songs[c.id] = generateSong(c.id, year)
    return { participants, withdrawals, songs }
  }, [year, host])

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
      const choice = side === "left" ? act.decision.left : act.decision.right
      next[qIndex] = { ...act, stats: applyEffect(act.stats, choice.effects) }
      return next
    })

    if (qIndex + 1 < acts.length) {
      setQIndex((i) => i + 1)
    } else {
      // Slight delay so the last card's stat change is committed.
      setTimeout(() => resolveContest(), 0)
    }
  }

  function resolveContest() {
    setActs((current) => {
      const result = runContest({
        participants: season.participants,
        songs: season.songs,
        managed: current.map((a) => ({ countryId: a.countryId, stats: a.stats })),
        hostId: host,
      })
      setEntries(result)
      setTrophies((prev) => [
        ...prev,
        ...result
          .filter((e) => e.managed)
          .map((e) => ({ year, countryId: e.countryId, position: e.qualified ? e.position : 0 })),
      ])
      const winner = result.find((e) => e.position === 1)
      setPendingHost(winner ? winner.countryId : host)
      setPhase("results")
      return current
    })
  }

  function nextSeason() {
    if (pendingHost) setHost(pendingHost)
    setPendingHost(null)
    setYear((y) => y + 1)
    setPhase("select")
  }

  // ---------- Intro ----------
  if (phase === "intro") {
    return (
      <div className="flex w-full flex-col items-center gap-5 text-center">
        <div className="flex -space-x-2">
          {["se", "it", "ua", "fi"].map((id) => (
            <CountryBadge key={id} country={getCountry(id)} size={40} />
          ))}
        </div>
        <div>
          <h1 className="text-2xl font-black leading-tight text-white">Twelve Points</h1>
          <p className="mt-1 text-[12px] leading-snug text-white/55">
            You are the stage director behind Europe&apos;s greatest song contest. Run 1 to 4
            countries each season. You can&apos;t pick the song &mdash; but you can reshape it and
            its staging with one make-or-break call per act, then survive the semi-final and the
            Grand Final scoreboard.
          </p>
        </div>
        <ul className="w-full space-y-1.5 text-left text-[11px] text-white/60">
          <li className="flex gap-2">
            <span className="text-fuchsia-300">1.</span> Pick 1&ndash;4 competing countries &mdash;
            each already has a song chosen.
          </li>
          <li className="flex gap-2">
            <span className="text-fuchsia-300">2.</span> Make one call per act: tweak the song or
            the staging.
          </li>
          <li className="flex gap-2">
            <span className="text-fuchsia-300">3.</span> Qualify through the semi-final, then all
            countries vote 12&ndash;1.
          </li>
          <li className="flex gap-2">
            <span className="text-fuchsia-300">4.</span> Win to host next year, then swap countries
            and go again.
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setPhase("select")}
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
        >
          Start Season {START_YEAR}
        </button>
      </div>
    )
  }

  // ---------- Country selection ----------
  if (phase === "select") {
    const isFirst = roster.length === 0
    const stillIn = roster.filter((id) => season.participants.some((c) => c.id === id))
    return (
      <CountrySelect
        year={year}
        title={isFirst ? "Choose Your Countries" : "Next Season"}
        subtitle={
          isFirst
            ? "Select 1 to 4 countries to direct into this year's contest."
            : "Keep your roster or swap in new countries for the coming year."
        }
        participants={season.participants}
        songs={season.songs}
        withdrawals={season.withdrawals}
        initial={stillIn}
        confirmLabel="Enter the Rehearsals"
        onConfirm={beginSeason}
      />
    )
  }

  // ---------- Questions ----------
  if (phase === "questions") {
    const act = acts[qIndex]
    if (!act) return null
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">
            Season {year}
          </span>
          <span className="text-[11px] font-medium text-white/40">
            {wins} {wins === 1 ? "win" : "wins"}
          </span>
        </div>
        <DecisionCard
          key={`${act.countryId}-${qIndex}`}
          country={getCountry(act.countryId)}
          song={act.song}
          decision={act.decision}
          index={qIndex}
          total={acts.length}
          onChoose={answer}
        />
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Current entry
          </div>
          <StatBars stats={act.stats} compact />
        </div>
      </div>
    )
  }

  // ---------- Results ----------
  if (phase === "results") {
    return <ResultsTable entries={entries} year={year} onContinue={nextSeason} />
  }

  return null
}
