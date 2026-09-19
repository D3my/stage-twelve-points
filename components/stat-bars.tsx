import { STAT_META, STAT_ORDER, type Stats } from "@/lib/game"
import { type Language } from "@/lib/i18n"

export function StatBars({
  stats,
  compact = false,
  language = "en",
}: {
  stats: Stats
  compact?: boolean
  language?: Language
}) {
  const labels =
    language === "es"
      ? {
          song: "CANCIÓN",
          stage: "PUESTA EN ESCENA",
        }
      : {
          song: "SONG",
          stage: "STAGE",
        }

  return (
    <div
      className={
        compact
          ? "flex flex-col gap-1.5"
          : "flex flex-col gap-2.5"
      }
    >
      {STAT_ORDER.map((key) => {
        const meta = STAT_META[key]
        const value = stats[key]

        const label =
          key === "song"
            ? labels.song
            : labels.stage

        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-28 shrink-0 text-[10px] font-semibold tracking-wider"
              style={{ color: meta.color }}
            >
              {label}
            </span>

            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${value}%`,
                  backgroundColor: meta.color,
                }}
              />
            </div>

            <span className="w-6 shrink-0 text-right text-[10px] font-semibold tabular-nums text-white/70">
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}