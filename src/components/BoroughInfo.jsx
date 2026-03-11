/*
 * BoroughInfo.jsx — Collapsible section showing borough history and trivia.
 *
 * REACT CONCEPTS:
 *
 * - useState for toggle: A boolean state controls whether the section is
 *   expanded or collapsed. Clicking toggles it: setOpen(prev => !prev)
 *   The "prev =>" form is called a "functional update" — it guarantees
 *   you're working with the latest state value.
 *
 * - Conditional rendering with ternary: {isOpen ? <Full /> : <Preview />}
 *   Unlike && which shows or hides, ternary shows one of two options.
 *
 * - Event handlers: onClick={() => setOpen(prev => !prev)}
 *   In React, event handlers are camelCase (onClick, not onclick) and
 *   take a function reference, not a string.
 */

import { useState } from 'react'

export default function BoroughInfo({ info }) {
  // State to track whether this section is expanded
  const [isOpen, setIsOpen] = useState(false)

  // Guard: if no info data is available, render nothing
  if (!info) return null

  return (
    <div className="mt-3">
      {/*
        * Toggle button: clicking anywhere on this div expands/collapses.
        * The arrow character rotates when open (via conditional class).
        */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors w-full text-left"
      >
        {/*
          * Rotation animation on the chevron:
          * "rotate-90" is applied when open, "rotate-0" when closed.
          * "transition-transform" animates the rotation smoothly.
          */}
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
          ▶
        </span>
        Borough info
      </button>

      {/* Collapsible content: only rendered when isOpen is true */}
      {isOpen && (
        <div className="mt-2 pl-5 space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {/* Etymology: where the borough name comes from */}
          {info.etymology && (
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                Name origin
              </p>
              <p>{info.etymology}</p>
            </div>
          )}

          {/* History paragraph */}
          {info.history && (
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                History
              </p>
              <p>{info.history}</p>
            </div>
          )}

          {/* Trivia: bullet list of fun facts */}
          {info.trivia && info.trivia.length > 0 && (
            <div>
              <p className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                Trivia
              </p>
              {/*
                * Rendering a list: .map() creates one <li> per trivia item.
                * The "key" prop uses the array index here — normally you'd
                * use a unique ID, but trivia items don't have one and the
                * list is static (never reordered), so index is fine.
                */}
              <ul className="list-disc pl-4 space-y-1">
                {info.trivia.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
