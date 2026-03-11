/*
 * FutureItem.jsx — A single upcoming borough in the list.
 *
 * Similar to CompletedItem but shows the estimated time instead of a checkmark.
 * Slightly less faded than completed items to show they're still relevant.
 */

export default function FutureItem({ step }) {
  return (
    <div className="flex items-center justify-between py-1 px-3 opacity-60 text-sm text-gray-500 dark:text-gray-400">
      {/* Step number and borough name */}
      <span>{step.order}. {step.borough}</span>
      {/* Estimated minutes for this step */}
      <span className="text-xs text-gray-400 dark:text-gray-500">
        {step.estimated_minutes} min
      </span>
    </div>
  )
}
