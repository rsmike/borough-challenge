/*
 * CompletedItem.jsx — A completed borough in the list, expandable to show details.
 *
 * REACT CONCEPTS:
 *
 * - useState for toggle: A boolean state controls expand/collapse.
 *   Clicking the row toggles it: setExpanded(prev => !prev).
 *
 * - Conditional rendering: {expanded && <div>...</div>}
 *   Only renders the detail section when expanded is true.
 *
 * - Date formatting: new Date(timestamp).toLocaleTimeString() converts
 *   a Unix timestamp to a human-readable time string using the browser's locale.
 */

import { useState } from 'react'
import { LinePill } from './TransportBadge'
import BoroughInfo from './BoroughInfo'

export default function CompletedItem({ step, onUndo }) {
  // State to track whether this item's details are visible
  const [expanded, setExpanded] = useState(false)

  /*
   * Format the check-in timestamp for display.
   * step.checkedAt is a Date.now() value (milliseconds) or null if migrated
   * from the old format. toLocaleTimeString gives e.g. "14:32" in 24h locales.
   */
  const checkedAtStr = step.checkedAt
    ? new Date(step.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  // Shorthand for transport fields
  const { mode, line, direction, from_station } = step.transport

  // Google Maps URL for this step
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${step.coordinates.lat},${step.coordinates.lng}`
  // Citymapper deep link
  const cityMapperUrl = `https://citymapper.com/directions?endcoord=${step.coordinates.lat},${step.coordinates.lng}&endname=${encodeURIComponent(step.station || step.borough)}`

  return (
    <div>
      {/*
       * Collapsed row — always visible.
       * Clicking toggles the expanded details below.
       * "cursor-pointer" shows a hand icon on hover.
       */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center justify-between w-full gap-2 py-1.5 px-3 opacity-60 text-sm text-gray-600 dark:text-gray-400 hover:opacity-80 transition-opacity text-left"
      >
        <div className="flex items-center gap-2">
          {/* Green checkmark */}
          <span className="text-green-600 dark:text-green-500">✓</span>
          {/* Step number and borough name */}
          <span>{step.order}. {step.borough}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Check-in time, if available */}
          {checkedAtStr && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {checkedAtStr}
            </span>
          )}
          {/* Expand/collapse chevron */}
          <span className={`text-xs opacity-15 transition-transform duration-200 ${expanded ? 'rotate-90' : 'rotate-0'}`}>
            ▶
          </span>
        </div>
      </button>

      {/* === EXPANDED DETAILS === */}
      {/*
       * Only rendered when expanded is true. Shows the same info as
       * CurrentBorough but without the "Got the photo!" button.
       */}
      {expanded && (
        <div className="mx-3 mb-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 text-sm opacity-70">

          {/* Station and map link */}
          {step.station && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {step.station}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Open in Google Maps"
              >
                🗺️ Map
              </a>
              <a
                href={cityMapperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
                title="Open in Citymapper"
              >
                🧭 City
              </a>
            </div>
          )}

          {/* Transport info — same logic as CurrentBorough */}
          {mode === 'walk' && (
            <div className="flex items-center gap-2">
              <LinePill mode={mode} line={line} />
              {direction && (
                <span className="text-gray-600 dark:text-gray-400">{direction}</span>
              )}
            </div>
          )}

          {mode === 'start' && (
            <LinePill mode={mode} line={line} />
          )}

          {mode !== 'walk' && mode !== 'start' && from_station && (
            <p className="text-gray-600 dark:text-gray-400">
              <LinePill mode={mode} line={line} />{' '}
              From <span className="font-semibold text-gray-800 dark:text-gray-200">{from_station}</span>
              {direction && <>{': '}<em>{direction}</em></>}
            </p>
          )}

          {mode !== 'walk' && mode !== 'start' && !from_station && direction && (
            <p className="text-gray-600 dark:text-gray-400">
              <LinePill mode={mode} line={line} />{' '}
              <em>{direction}</em>
            </p>
          )}

          {/* Directions prose */}
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {step.directions}
          </p>

          {/* Sign tip */}
          {step.sign_tip && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-2">
              <p className="text-amber-800 dark:text-amber-200">
                📸 <span className="font-medium">Sign tip:</span> {step.sign_tip}
              </p>
            </div>
          )}

          {/* Meal info */}
          {step.meal && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
              <p className="text-blue-800 dark:text-blue-200">
                {step.meal === 'breakfast' ? '🍳' : step.meal === 'lunch' ? '🍔' : '🍽️'}{' '}
                <span className="font-medium capitalize">{step.meal} stop</span>
                {step.meal_note && (
                  <span className="block mt-1 text-blue-600 dark:text-blue-300">{step.meal_note}</span>
                )}
              </p>
            </div>
          )}

          {/* Borough info (collapsible within the expanded section) */}
          <BoroughInfo info={step.borough_info} />

          {/* Undo button — marks this borough as not completed */}
          <button
            onClick={() => onUndo(step.order)}
            className="text-xs text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Undo check-in
          </button>
        </div>
      )}
    </div>
  )
}
