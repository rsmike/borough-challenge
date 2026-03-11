/*
 * CurrentBorough.jsx — The expanded card for the borough you're currently chasing.
 *
 * This is the most complex component in the app. It shows:
 * - Step number and borough name
 * - Transport information (how to get there)
 * - Detailed directions
 * - Where to find the street sign
 * - Meal information (if applicable)
 * - A button to open Google Maps
 * - Collapsible borough history/trivia
 * - A big "Got the photo!" button to mark it done
 *
 * REACT CONCEPTS:
 *
 * - Component composition: This component uses other components inside it
 *   (LinePill, BoroughInfo). This is React's main abstraction —
 *   building complex UIs from smaller, reusable pieces.
 *
 * - Named imports: { LinePill } imports a specific export from TransportBadge.
 *   A module can have both a "default" export and named exports.
 *   import X from './file'      → imports the default export
 *   import { Y } from './file'  → imports a named export
 *
 * - Callback props: onComplete is a function passed from the parent (App).
 *   When the user taps "Got the photo!", we call onComplete(step.order)
 *   which tells the parent to update its state. Data flows down via props,
 *   events flow up via callbacks.
 *
 * - Conditional rendering: {step.meal && <div>...</div>}
 *   Only shows the meal section if this step has a meal marker.
 */

import { LinePill } from './TransportBadge'
import BoroughInfo from './BoroughInfo'

export default function CurrentBorough({ step, onComplete }) {
  /*
   * Build the Google Maps URL.
   * Using the "search" endpoint with lat/lng coordinates.
   * On mobile, this URL opens the Google Maps app if installed,
   * or falls back to the browser version.
   */
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${step.coordinates.lat},${step.coordinates.lng}`

  /*
   * Citymapper deep link — opens the Citymapper app if installed,
   * otherwise falls back to the web version. Uses endcoord for the
   * destination and endname for a human-readable label.
   */
  const cityMapperUrl = `https://citymapper.com/directions?endcoord=${step.coordinates.lat},${step.coordinates.lng}&endname=${encodeURIComponent(step.station || step.borough)}`

  // Meal emoji based on meal type
  const mealEmoji = step.meal === 'breakfast' ? '🍳' : step.meal === 'lunch' ? '🍔' : '🍽️'

  // Shorthand for transport fields
  const { mode, line, direction, from_station } = step.transport

  return (
    /*
     * The card container:
     * - White background (dark: dark grey) with rounded corners and shadow
     * - ring-1 adds a subtle border, more visible in dark mode
     * - p-4 adds padding on all sides
     */
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-none ring-1 ring-gray-200 dark:ring-gray-700 p-4 space-y-4">

      {/* === HEADER: Step number badge + borough name + estimate === */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/*
            * Step number in a blue circle.
            * "w-8 h-8" sets fixed width/height.
            * "rounded-full" makes it circular.
            * "flex items-center justify-center" centres the number.
            */}
          <span className="w-8 h-8 rounded-full bg-tfl-blue text-white text-sm font-bold flex items-center justify-center shrink-0">
            {step.order}
          </span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {step.borough}
          </h2>
        </div>

        {/* Time estimate badge */}
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md whitespace-nowrap">
          ~{step.estimated_minutes} min
        </span>
      </div>

      {/* === TRANSPORT: How to get there === */}
      <div className="space-y-2">
        {/*
          * "Go to:" line — the destination station name (most important info)
          * with a tiny maps button. Line pill is deliberately omitted here —
          * the transport line is already shown on the "From" line below,
          * and in most cases the destination is on the same line anyway.
          *
          * Example: "Go to: Romford [Map]"
          */}
        {step.station && (
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-gray-500 dark:text-gray-400 font-normal">Go to:</span>{' '}
              {step.station}
            </h3>
            {/* Tiny maps button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Open in Google Maps"
            >
              🗺️ Map
            </a>
            {/* Citymapper button */}
            <a
              href={cityMapperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
              title="Open in Citymapper"
            >
              🧭 City
            </a>
          </div>
        )}

        {/*
          * Compact direction line — combines from_station, line pill, and direction
          * on a single line. Format:
          * "From Canary Wharf [Elizabeth]: Eastbound to Shenfield"
          *
          * - from_station is emphasised (bold)
          * - line is a coloured pill
          * - direction text uses italic for the travel direction
          *
          * For walk steps, this section is skipped (walk badge shown instead).
          * For start steps, just shows the start badge.
          */}
        {mode === 'walk' && (
          <div className="flex items-center gap-2">
            <LinePill mode={mode} line={line} />
            {direction && (
              <span className="text-sm text-gray-600 dark:text-gray-400">{direction}</span>
            )}
          </div>
        )}

        {mode === 'start' && (
          <LinePill mode={mode} line={line} />
        )}

        {/*
          * Compact direction line for non-walk/non-start transport modes.
          * Pill comes first so you immediately see the mode of transport.
          * Format: "[Elizabeth] From Canary Wharf: Eastbound to Shenfield"
          */}
        {mode !== 'walk' && mode !== 'start' && from_station && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {/* LinePill first — mode of transport is the first thing you see */}
            <LinePill mode={mode} line={line} />
            {' '}From{' '}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{from_station}</span>
            {direction && (
              <>
                {': '}
                <em>{direction}</em>
              </>
            )}
          </p>
        )}

        {/* Fallback: no from_station but has direction */}
        {mode !== 'walk' && mode !== 'start' && !from_station && direction && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <LinePill mode={mode} line={line} />
            {' '}
            <em>{direction}</em>
          </p>
        )}

        {/* Detailed directions prose */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {step.directions}
        </p>
      </div>

      {/* === SIGN TIP: Where to find the borough street sign === */}
      {step.sign_tip && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            📸 <span className="font-medium">Sign tip:</span> {step.sign_tip}
          </p>
        </div>
      )}

      {/* === MEAL: Breakfast or lunch stop === */}
      {step.meal && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {mealEmoji} <span className="font-medium capitalize">{step.meal} stop</span>
            {step.meal_note && (
              <span className="block mt-1 text-blue-600 dark:text-blue-300">{step.meal_note}</span>
            )}
          </p>
        </div>
      )}

      {/* === BOROUGH INFO: Collapsible etymology/history/trivia === */}
      <BoroughInfo info={step.borough_info} />

      {/* === GOT THE PHOTO BUTTON === */}
      {/*
        * This is the main action button. When tapped:
        * 1. Calls onComplete(step.order) — tells App this step is done
        * 2. App updates state → this component unmounts → next step shows
        *
        * "min-h-[44px]" ensures the button meets Apple's minimum touch target
        * size of 44x44 points for accessibility.
        */}
      <button
        onClick={() => onComplete(step.order)}
        className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold rounded-xl text-lg transition-colors min-h-[44px] shadow-sm"
      >
        📸 Got {step.borough}!
      </button>
    </div>
  )
}
