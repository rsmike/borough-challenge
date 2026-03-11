/*
 * CompletedItem.jsx — A single completed borough in the list.
 *
 * REACT CONCEPTS:
 *
 * - Pure/presentational component: This component receives data via props
 *   and just renders it. No state, no side effects. It's a pure function
 *   of its inputs. These are the simplest React components.
 *
 * - Template literals in JSX: {`${step.order}. ${step.borough}`}
 *   JavaScript template literals work inside JSX curly braces.
 */

export default function CompletedItem({ step }) {
  return (
    <div className="flex items-center gap-2 py-1 px-3 opacity-50 text-sm text-gray-500 dark:text-gray-500">
      {/* Checkmark icon */}
      <span className="text-green-600 dark:text-green-500">✓</span>
      {/* Step number and borough name */}
      <span>{step.order}. {step.borough}</span>
    </div>
  )
}
