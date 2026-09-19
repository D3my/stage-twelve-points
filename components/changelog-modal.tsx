"use client"

import { useState } from "react"

export const APP_VERSION = "1.0.1"

const CHANGELOG = [
  {
    version: "1.0.1",
    date: "2026-09-19",
    changes: [
      "Added host city system with 95% capital / 5% alternative city selection.",
      "Added special host city exception for Eurovision 2027 in Burgas.",
      "Updated country capitals and alternative cities.",
      "Added staging decisions and contest progression.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-09-18",
    changes: [
      "Initial playable version.",
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
            className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
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
                className="text-xl text-muted-foreground hover:text-foreground"
                aria-label="Close changelog"
              >
                ×
              </button>
            </div>

            <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
              {CHANGELOG.map((release) => (
                <div key={release.version}>
                  <div className="mb-2 flex items-baseline gap-2">
                    <h3 className="font-semibold">
                      v{release.version}
                    </h3>

                    <span className="text-xs text-muted-foreground">
                      {release.date}
                    </span>
                  </div>

                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {release.changes.map((change) => (
                      <li key={change} className="flex gap-2">
                        <span>•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}