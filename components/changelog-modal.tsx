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
        className="text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground hover:underline underline-offset-4"
      >
        v{APP_VERSION} · Changelog
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-background/95 shadow-2xl backdrop-blur"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">
                  Changelog
                </h2>

                <p className="text-sm text-muted-foreground">
                  Eurovision Stage Director
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="Close changelog"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                {CHANGELOG.map((release) => (
                  <section key={release.version}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm font-semibold">
                        v{release.version}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {release.date}
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {release.changes.map((change) => (
                          <li
                            key={change}
                            className="flex gap-2"
                          >
                            <span className="text-foreground/60">
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
        </div>
      )}
    </>
  )
}