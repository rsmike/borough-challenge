/*
 * Header.jsx — Fixed header bar at the top of the screen.
 *
 * REACT CONCEPTS:
 *
 * - Props: Data passed from a parent component. This component receives
 *   totalSteps, completedCount, remainingMinutes, and onReset as props.
 *   Props are read-only — a child component can't modify its own props.
 *
 * - useRef + useCallback: Used here for the triple-tap reset feature.
 *   We track click timestamps in a ref (not state) because we don't want
 *   clicks to trigger re-renders.
 *
 * - Destructuring: { totalSteps, completedCount } = props
 *   A JavaScript feature (not React-specific) that extracts values from objects.
 */

import { useRef, useCallback } from 'react'

export default function Header({ totalSteps, completedCount, remainingMinutes, onReset }) {
  /*
   * TRIPLE-TAP RESET:
   * We store the timestamps of recent clicks. If 3 clicks happen within
   * 1 second, we trigger the reset. Using useRef instead of useState
   * because we don't want click tracking to cause re-renders.
   */
  const clickTimestamps = useRef([])

  const handleTitleClick = useCallback(() => {
    const now = Date.now()
    // Add current click, keep only last 3
    clickTimestamps.current = [...clickTimestamps.current.slice(-2), now]

    // Check if we have 3 clicks and the first was less than 1 second ago
    if (
      clickTimestamps.current.length === 3 &&
      now - clickTimestamps.current[0] < 1000
    ) {
      clickTimestamps.current = [] // reset click tracking
      onReset() // trigger the reset callback passed from App
    }
  }, [onReset])

  /*
   * Format remaining minutes as "Xh Ym".
   * e.g. 636 minutes → "10h 36m"
   */
  const hours = Math.floor(remainingMinutes / 60)
  const mins = remainingMinutes % 60
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  // Progress as a percentage for the progress bar width
  const progressPercent = totalSteps > 0
    ? (completedCount / totalSteps) * 100
    : 0

  return (
    /*
     * "fixed top-0 ... z-50" makes the header stick to the top of the viewport.
     * z-50 ensures it sits above scrolling content.
     * The dark: variants are ignored here because we want the header to always
     * be TfL blue regardless of colour scheme.
     */
    <header className="fixed top-0 left-0 right-0 z-50 bg-tfl-blue text-white safe-top">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Flex container: title on left, stats on right */}
        <div className="flex items-center justify-between">
          {/*
            * Title — clickable for the hidden triple-tap reset.
            * "select-none" prevents text selection on rapid tapping.
            * "cursor-default" hides that it's clickable (it's a hidden feature).
            */}
          <h1
            className="text-lg font-bold select-none cursor-default"
            onClick={handleTitleClick}
          >
            33 Boroughs
          </h1>

          {/* Stats: counter and remaining time */}
          <div className="flex items-center gap-4 text-sm">
            {/* Borough counter: "12/33" */}
            <span className="font-mono">
              {completedCount}/{totalSteps}
            </span>

            {/* Remaining time estimate */}
            {remainingMinutes > 0 && (
              <span className="opacity-80">
                {timeDisplay} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/*
        * Progress bar: a thin line at the bottom of the header.
        * The inner div's width is set dynamically via inline style.
        * "transition-all duration-500" animates width changes smoothly.
        */}
      <div className="h-1 bg-white/20">
        <div
          className="h-full bg-white/70 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  )
}
