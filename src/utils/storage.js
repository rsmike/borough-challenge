/*
 * storage.js — localStorage helpers for persisting challenge progress.
 *
 * We store an array of completed step order numbers in localStorage.
 * This way, refreshing the page or closing the browser doesn't lose progress.
 *
 * localStorage only stores strings, so we JSON.stringify/parse the array.
 */

// The key used in localStorage. Namespaced to avoid collisions.
const STORAGE_KEY = 'borough-challenge-progress'

/**
 * Load completed step numbers from localStorage.
 * Returns an array of integers, e.g. [1, 2, 3].
 * Returns empty array if nothing is saved or if data is corrupted.
 */
export function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []

    const parsed = JSON.parse(saved)

    // Sanity check: make sure it's actually an array of numbers
    if (Array.isArray(parsed) && parsed.every(n => typeof n === 'number')) {
      return parsed
    }
    return []
  } catch {
    // If JSON.parse fails (corrupted data), start fresh
    return []
  }
}

/**
 * Save completed step numbers to localStorage.
 * @param {number[]} completedSteps — array of order numbers that are done
 */
export function saveProgress(completedSteps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps))
}

/**
 * Clear all saved progress. Used by the hidden reset feature.
 */
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
