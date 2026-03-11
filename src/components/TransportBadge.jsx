/*
 * TransportBadge.jsx — A coloured pill showing the transport mode for a step.
 *
 * REACT CONCEPTS:
 *
 * - Inline styles: Sometimes you need dynamic styles that depend on data.
 *   Tailwind classes are great for static styles, but when the background
 *   colour comes from a variable (which TfL line?), inline styles make sense.
 *   In React, inline styles are objects: style={{ backgroundColor: '#00A4A7' }}
 *   Note: CSS property names are camelCase (backgroundColor, not background-color).
 *
 * - Object lookup maps: A common pattern to map data values to UI values.
 *   Instead of a giant if/else chain, we use a plain JavaScript object:
 *   const map = { dlr: '🚈', tube: '🚇' }
 *   Then: map[mode] gives us the right emoji.
 */

/*
 * Map transport mode → emoji icon.
 * These appear before the line name in the badge.
 */
const MODE_EMOJI = {
  start: '🏠',
  dlr: '🚈',
  tube: '🚇',
  walk: '🚶',
  bus: '🚌',
  tram: '🚊',
  overground: '🚆',
  national_rail: '🚂',
}

/*
 * Map transport line names → TfL hex colours.
 * The line name comes from route.json's transport.line field.
 * We match against lowercased line names for resilience.
 *
 * When a line isn't found here, we fall back to a mode-based colour.
 */
const LINE_COLOURS = {
  'dlr': '#00A4A7',
  'elizabeth line': '#7156A5',
  'victoria line': '#0098D4',
  'metropolitan line': '#9B0056',
  'metropolitan/piccadilly line': '#9B0056',
  'piccadilly line': '#003688',
  'piccadilly/district line': '#003688',
  'district line': '#00782A',
  'northern line': '#000000',
  'northern/bakerloo line': '#000000',
  'bakerloo line': '#B36305',
  'jubilee line': '#A0A5A9',
  'croydon tramlink': '#84B817',
  'overground (mildmay line)': '#437EC1',
  'overground / victoria line': '#0098D4',
  'overground / southern': '#EE7C0E',
  'greater anglia': '#E21836',
  'south western railway': '#E21836',
  'southern': '#E21836',
  'southern / thameslink': '#E21836',
  'train to waterloo east, then walk': '#E21836',
  '189': '#DC241F',
}

/*
 * Fallback colours by transport mode (when line name isn't in the map above).
 */
const MODE_COLOURS = {
  start: '#666666',
  dlr: '#00A4A7',
  tube: '#0019A8',
  walk: '#666666',
  bus: '#DC241F',
  tram: '#84B817',
  overground: '#EE7C0E',
  national_rail: '#E21836',
}

/**
 * Get the background colour for a transport badge.
 * Tries line name first, then falls back to mode colour.
 */
function getBadgeColour(mode, lineName) {
  if (lineName) {
    const key = lineName.toLowerCase()
    if (LINE_COLOURS[key]) return LINE_COLOURS[key]
  }
  return MODE_COLOURS[mode] || '#666666'
}

export default function TransportBadge({ transport }) {
  const { mode, line, direction } = transport
  const emoji = MODE_EMOJI[mode] || '📍'
  const bgColour = getBadgeColour(mode, line)

  // For walking steps, show a simpler badge
  if (mode === 'walk') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: bgColour }}
        >
          {emoji} Walk
        </span>
        {direction && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{direction}</span>
        )}
      </div>
    )
  }

  // For start step
  if (mode === 'start') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
        style={{ backgroundColor: bgColour }}
      >
        {emoji} Start
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/*
        * The badge pill: emoji + line name on a coloured background.
        * Inline style is used for backgroundColor because it's data-driven.
        * Tailwind handles everything else (padding, rounded corners, text colour).
        */}
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
        style={{ backgroundColor: bgColour }}
      >
        {emoji} {line}
      </span>

      {/* Direction text (e.g. "Eastbound to Shenfield") shown beside the pill */}
      {direction && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{direction}</span>
      )}
    </div>
  )
}
