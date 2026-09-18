import { GameBoard } from "@/components/game-board"

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0410] px-4 py-6">
      {/* stage lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 20% 0%, rgba(244,114,182,0.25), transparent 70%), radial-gradient(55% 45% at 85% 10%, rgba(34,211,238,0.22), transparent 70%), radial-gradient(70% 60% at 50% 110%, rgba(167,139,250,0.18), transparent 70%)",
        }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <GameBoard />
      </div>
    </main>
  )
}
