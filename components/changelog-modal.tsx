"use client"

import { useState } from "react"

export const APP_VERSION = "0.3.0"

const CHANGELOG = [
  {
    version: "0.3.0",
    date: "2026-09-19",
    changes: [
      "Added host city system with 95% capital / 5% alternative city selection.",
      "Added special host city exception for Eurovision 2027 in Burgas.",
      "Updated country capitals and alternative cities.",
      "Improved artist history and returning artist system.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-09-18",
    changes: [
      "Added multiple participating countries.",
      "Added song and artist generation.",
      "Added staging decisions and contest progression.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-09-17",
    changes: [
      "Initial playable version.",
      "Created the Eurovision Stage Director game.",
    ],
  },
]

export function ChangelogModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-white/40 transition-colors hover:text-white/70 hover:underline underline-offset-4"
      >
        v{APP_VERSION} · Changelog
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Changelog"
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
                  What&apos;s new
                </p>

                <h2 className="text-xl font-black text-white">
                  Changelog
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-5">
              {CHANGELOG.map((release) => (
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
                          <span className="text-fuchsia-300">•</span>
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