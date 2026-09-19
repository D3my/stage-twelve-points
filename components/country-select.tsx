"use client"

import { useState } from "react"
import { CountryBadge } from "@/components/country-badge"
import {
  MAX_ROSTER,
  MIN_ROSTER,
  getSeasonTitle,
  type Country,
  type Song,
  type Withdrawal,
} from "@/lib/game"

export function CountrySelect({
  year,
  title,
  subtitle,
  participants,
  songs,
  withdrawals,
  initial = [],
  confirmLabel,
  onConfirm,
}: {
  year: number
  title: string
  subtitle: string
  participants: Country[]
  songs: Record<string, Song>
  withdrawals: Withdrawal[]
  initial?: string[]
  confirmLabel: string
  onConfirm: (ids: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(initial)

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_ROSTER) return prev
      return [...prev, id]
    })
  }

  const canConfirm = selected.length >= MIN_ROSTER && selected.length <= MAX_ROSTER

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/80">
        {getSeasonTitle(year, host)} • {participants.length} countries competing
        </div>
        <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-[12px] leading-snug text-white/50">{subtitle}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: MAX_ROSTER }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-8 rounded-full transition-colors"
            style={{
              backgroundColor: i < selected.length ? "#f472b6" : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
        <span className="ml-2 text-[11px] font-medium text-white/50">
          {selected.length}/{MAX_ROSTER}
        </span>
      </div>

      <div className="grid max-h-[240px] grid-cols-1 gap-2 overflow-y-auto pr-1">
        {participants.map((c) => {
          const isSel = selected.includes(c.id)
          const disabled = !isSel && selected.length >= MAX_ROSTER
          const song = songs[c.id]
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              disabled={disabled}
              aria-pressed={isSel}
              className="flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all disabled:opacity-30"
              style={{
                borderColor: isSel ? "#f472b6" : "rgba(255,255,255,0.1)",
                backgroundColor: isSel ? "rgba(244,114,182,0.14)" : "rgba(255,255,255,0.03)",
              }}
            >
              <CountryBadge country={c} size={32} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[12px] font-semibold text-white">{c.name}</span>
                  {song ? (
                    <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/60">
                      {song.genre.name}
                    </span>
                  ) : null}
                </span>
                {song ? (
                  <span className="block truncate text-[10px] text-white/45">
                    &ldquo;{song.title}&rdquo; — {song.artist}
                  </span>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>

      {withdrawals.length > 0 ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Not competing in {year}
          </div>
          <ul className="flex flex-col gap-1">
            {withdrawals.map((w) => (
              <li key={w.country.id} className="flex items-start gap-2 text-[10px] leading-snug">
                <CountryBadge country={w.country} size={16} />
                <span className="text-white/55">
                  <span className="font-semibold text-white/75">{w.country.name}</span> {w.reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        disabled={!canConfirm}
        onClick={() => onConfirm(selected)}
        className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-opacity disabled:opacity-30"
      >
        {confirmLabel}
      </button>
    </div>
  )
}
