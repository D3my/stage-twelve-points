import type { Country } from "@/lib/game"

export function CountryBadge({
  country,
  size = 44,
}: {
  country: Country
  size?: number
}) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${country.colors[0]} 0%, ${country.colors[0]} 50%, ${country.colors[1]} 50%, ${country.colors[1]} 100%)`,
      }}
      aria-hidden="true"
    >
      <span
        className="font-semibold tracking-tight text-white drop-shadow"
        style={{ fontSize: size * 0.34 }}
      >
        {country.code}
      </span>
    </div>
  )
}
