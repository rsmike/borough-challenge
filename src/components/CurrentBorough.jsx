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
 *   (TransportBadge, BoroughInfo). This is React's main abstraction —
 *   building complex UIs from smaller, reusable pieces.
 *
 * - Callback props: onComplete is a function passed from the parent (App).
 *   When the user taps "Got the photo!", we call onComplete(step.order)
 *   which tells the parent to update its state. Data flows down via props,
 *   events flow up via callbacks.
 *
 * - Conditional rendering: {step.meal && <div>...</div>}
 *   Only shows the meal section if this step has a meal marker.
 */

import TransportBadge from './TransportBadge'
import BoroughInfo from './BoroughInfo'

export default function CurrentBorough({ step, onComplete }) {
  /*
   * Build the Google Maps URL.
   * Using the "search" endpoint with lat/lng coordinates.
   * On mobile, this URL opens the Google Maps app if installed,
   * or falls back to the browser version.
   */
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${step.coordinates.lat},${step.coordinates.lng}`

  // Meal emoji based on meal type
  const mealEmoji = step.meal === 'breakfast' ? '🍳' : step.meal === 'lunch' ? '🍔' : '🍽️'

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
          * Station name — the most important piece of info in this section.
          * Displayed prominently with a small "maps" button inline next to it.
          * The maps link uses target="_blank" to open Google Maps app on mobile.
          */}
        {step.station && (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              📍 {step.station}
            </h3>
            {/* Tiny inline maps button next to the station name */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Open in Google Maps"
            >
              🗺️ Map
            </a>
          </div>
        )}

        {/* TfL-coloured transport badge */}
        <TransportBadge transport={step.transport} />

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
        📸 Got the photo!
      </button>
    </div>
  )
}
