"use client"

import { useState } from "react"
import { CountryBadge } from "@/components/country-badge"
import {
  STAT_META,
  STAT_ORDER,
  type Country,
  type Decision,
  type Effect,
  type Song,
} from "@/lib/game"
import { translations, type Language } from "@/lib/i18n"

function EffectHint({ effect }: { effect: Effect }) {
  const parts = STAT_ORDER.filter((k) => effect[k] !== undefined)

  if (parts.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {parts.map((k) => {
        const v = effect[k] as number
        const meta = STAT_META[k]

        return (
          <span
            key={k}
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums"
            style={{
              color: meta.color,
              backgroundColor: `${meta.color}22`,
            }}
          >
            {meta.short} {v > 0 ? `+${v}` : v}
          </span>
        )
      })}
    </div>
  )
}

export function DecisionCard({
  country,
  song,
  decision,
  index,
  total,
  onChoose,
  language = "en",
}: {
  country: Country
  song: Song
  decision: Decision
  index: number
  total: number
  onChoose: (side: "left" | "right") => void
  language?: Language
}) {
  const [drag, setDrag] = useState(0)
  const [start, setStart] = useState<number | null>(null)
  const [hint, setHint] = useState<"left" | "right" | null>(null)

  const t = translations[language]

  const rotation = drag / 22
  const tilt = Math.max(-1, Math.min(1, drag / 120))

  function commit(side: "left" | "right") {
    onChoose(side)
    setDrag(0)
    setStart(null)
    setHint(null)
  }

  function onPointerDown(e: React.PointerEvent) {
    setStart(e.clientX)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (start === null) return

    const d = e.clientX - start

    setDrag(d)
    setHint(d > 24 ? "right" : d < -24 ? "left" : null)
  }

  function onPointerUp() {
    if (Math.abs(drag) > 90) {
      commit(drag > 0 ? "right" : "left")
    } else {
      setDrag(0)
      setStart(null)
      setHint(null)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-[11px] font-medium text-white/50">
        <span>{country.name}</span>

        <span className="text-white/25">•</span>

        <span>
          {t.decisionCard.act} {index + 1} {language === "en" ? "of" : "de"}{" "}
          {total}
        </span>
      </div>

      <div
        className="relative w-full select-none"
        style={{ perspective: 1000 }}
      >
        {/* choice hint overlays */}
        <div
          className="pointer-events-none absolute left-3 top-3 z-10 rotate-[-8deg] rounded-md border-2 px-2 py-1 text-xs font-bold uppercase tracking-wider transition-opacity"
          style={{
            color: "#f472b6",
            borderColor: "#f472b6",
            opacity: hint === "left" ? 1 : 0,
          }}
        >
          {decision.left.label}
        </div>

        <div
          className="pointer-events-none absolute right-3 top-3 z-10 rotate-[8deg] rounded-md border-2 px-2 py-1 text-xs font-bold uppercase tracking-wider transition-opacity"
          style={{
            color: "#22d3ee",
            borderColor: "#22d3ee",
            opacity: hint === "right" ? 1 : 0,
          }}
        >
          {decision.right.label}
        </div>

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex touch-none flex-col items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-5 shadow-2xl"
          style={{
            transform: `translateX(${drag}px) rotate(${rotation}deg)`,
            transition:
              start === null ? "transform 0.25s ease-out" : "none",
            cursor: start === null ? "grab" : "grabbing",
          }}
        >
          <CountryBadge country={country} size={52} />

          {/* the entry the director is shaping */}
          <div className="text-center">
            <div className="text-[13px] font-bold text-white">
              &ldquo;{song.title}&rdquo;

              {song.native ? (
                <span
                  className="ml-1 align-middle text-[9px] font-medium text-white/40"
                  title={t.decisionCard.native}
                >
                  {t.decisionCard.native}
                </span>
              ) : null}
            </div>

            <div className="text-[10px] text-white/45">
              {song.artist}

              {song.veteran ? (
                <span
                  className="ml-0.5 text-amber-300"
                  title={t.decisionCard.returningArtist}
                >
                  ★
                </span>
              ) : null}{" "}
              • {song.genre.name}
            </div>
          </div>

          <div className="text-center text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300/80">
            {decision.role}
          </div>

          <p className="min-h-[72px] text-balance text-center text-[15px] leading-snug text-white">
            {decision.prompt}
          </p>
        </div>

        {/* directional glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              tilt > 0.1
                ? `inset 0 0 40px -10px #22d3ee`
                : tilt < -0.1
                  ? `inset 0 0 40px -10px #f472b6`
                  : "none",
          }}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => commit("left")}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-2.5 text-center transition-colors hover:bg-fuchsia-500/20"
        >
          <span className="text-[13px] font-semibold text-white">
            {decision.left.label}
          </span>

          <EffectHint effect={decision.left.effects} />
        </button>

        <button
          type="button"
          onClick={() => commit("right")}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2.5 text-center transition-colors hover:bg-cyan-500/20"
        >
          <span className="text-[13px] font-semibold text-white">
            {decision.right.label}
          </span>

          <EffectHint effect={decision.right.effects} />
        </button>
      </div>

      <p className="text-center text-[10px] text-white/30">
        {t.decisionCard.swipeHint}
      </p>
    </div>
  )
}