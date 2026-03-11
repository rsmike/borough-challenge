/*
 * BoroughList.jsx — Renders the three sections of the borough list.
 *
 * REACT CONCEPTS:
 *
 * - Conditional rendering: {condition && <Component />}
 *   In JSX, if the left side of && is falsy, nothing renders.
 *   This is how we show/hide sections based on data.
 *
 * - .map(): The standard way to render a list of items in React.
 *   array.map(item => <Component key={item.id} />) creates one component per item.
 *
 * - key prop: React needs a unique "key" on each item in a list so it can
 *   efficiently update the DOM when items are added/removed/reordered.
 *   Using the step's order number as the key since it's unique and stable.
 *
 * - Fragments: <> ... </> (shorthand for <React.Fragment>) lets you group
 *   multiple elements without adding an extra DOM node.
 */

import CompletedItem from './CompletedItem'
import CurrentBorough from './CurrentBorough'
import FutureItem from './FutureItem'

export default function BoroughList({ completed, current, future, onComplete, onUndo, currentRef }) {
  return (
    <div className="space-y-1">
      {/* === COMPLETED BOROUGHS === */}
      {/* Only show this section if there are completed steps */}
      {completed.length > 0 && (
        <div className="space-y-0.5 mb-4">
          {completed.map(step => (
            <CompletedItem key={step.order} step={step} onUndo={onUndo} />
          ))}
        </div>
      )}

      {/* === CURRENT BOROUGH === */}
      {/* The expanded card for the borough you're currently chasing */}
      {current && (
        <div ref={currentRef} className="scroll-mt-28">
          {/*
           * scroll-mt-28: when scrollIntoView is called, this adds margin
           * at the top so the card doesn't hide behind the fixed header.
           * The value (28 = 7rem) should match the header height + padding.
           */}
          <CurrentBorough step={current} onComplete={onComplete} />
        </div>
      )}

      {/* === FUTURE BOROUGHS === */}
      {future.length > 0 && (
        <div className="space-y-0.5 mt-4">
          {future.map(step => (
            <FutureItem key={step.order} step={step} />
          ))}
        </div>
      )}
    </div>
  )
}
