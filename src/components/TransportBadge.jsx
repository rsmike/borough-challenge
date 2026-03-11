/*
 * TransportBadge.jsx — A small coloured pill showing the TfL line/mode.
 *
 * REACT CONCEPTS:
 *
 * - Inline styles: When the background colour comes from a variable
 *   (which TfL line?), we use inline styles rather than Tailwind classes.
 *   In React, inline styles are objects: style={{ backgroundColor: '#00A4A7' }}
 *   Note: CSS property names are camelCase (backgroundColor, not background-color).
 *
 * - Object lookup maps: A common pattern to map data values to UI values.
 *   Instead of a giant if/else chain, we use a plain JavaScript object.
 */

/*
 * Map transport mode → emoji icon.
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
 * Map transport line names (lowercased) → TfL hex colours.
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
 * Fallback colours by transport mode.
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

/*
 * Short display names for lines — drops redundant words like "line".
 * If not in this map, we use the raw line name.
 */
const LINE_SHORT_NAMES = {
  'elizabeth line': 'Elizabeth',
  'victoria line': 'Victoria',
  'metropolitan line': 'Metropolitan',
  'metropolitan/piccadilly line': 'Met / Picc',
  'piccadilly line': 'Piccadilly',
  'piccadilly/district line': 'Picc / District',
  'district line': 'District',
  'northern line': 'Northern',
  'northern/bakerloo line': 'Northern / Bakerloo',
  'bakerloo line': 'Bakerloo',
  'jubilee line': 'Jubilee',
  'croydon tramlink': 'Tramlink',
  'overground (mildmay line)': 'Mildmay',
  'overground / victoria line': 'Victoria',
  'overground / southern': 'Overground',
  'greater anglia': 'Gr. Anglia',
  'south western railway': 'SWR',
  'southern': 'Southern',
  'southern / thameslink': 'Southern',
  'train to waterloo east, then walk': 'National Rail',
}

/**
 * Get the background colour for a line/mode.
 */
function getBadgeColour(mode, lineName) {
  if (lineName) {
    const key = lineName.toLowerCase()
    if (LINE_COLOURS[key]) return LINE_COLOURS[key]
  }
  return MODE_COLOURS[mode] || '#666666'
}

/**
 * Get a short display name for a line.
 */
function getShortName(lineName) {
  if (!lineName) return null
  const key = lineName.toLowerCase()
  return LINE_SHORT_NAMES[key] || lineName
}

/**
 * LinePill — A tiny coloured pill showing a TfL line name with emoji.
 * Used inline next to station names and in the transport direction line.
 *
 * Exported so CurrentBorough can use it directly next to the destination name.
 */
export function LinePill({ mode, line }) {
  const emoji = MODE_EMOJI[mode] || '📍'
  const bgColour = getBadgeColour(mode, line)
  const shortName = getShortName(line)

  // For walk steps, show a simple walking pill
  if (mode === 'walk') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: bgColour }}
      >
        {emoji} Walk
      </span>
    )
  }

  // For start step
  if (mode === 'start') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: bgColour }}
      >
        {emoji} Start
      </span>
    )
  }

  // For bus, show the route number
  if (mode === 'bus') {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: bgColour }}
      >
        {emoji} Bus {line}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap"
      style={{ backgroundColor: bgColour }}
    >
      {emoji} {shortName}
    </span>
  )
}

/**
 * TransportBadge — Full transport display: pill + direction text.
 * This is the default export used when you want the complete badge with direction.
 */
export default function TransportBadge({ transport }) {
  const { mode, line, direction } = transport

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <LinePill mode={mode} line={line} />
      {direction && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{direction}</span>
      )}
    </div>
  )
}
