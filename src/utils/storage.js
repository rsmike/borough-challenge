/*
 * storage.js — localStorage helpers for persisting challenge progress.
 *
 * We store an array of check-in records in localStorage. Each record has:
 *   { order: number, checkedAt: number }
 * where checkedAt is a Unix timestamp (Date.now()).
 *
 * BACKWARD COMPATIBILITY:
 * Earlier versions stored just an array of numbers [1, 2, 3].
 * loadProgress() detects this old format and migrates it automatically
 * (using null for the unknown check-in times).
 *
 * localStorage only stores strings, so we JSON.stringify/parse.
 */

// The key used in localStorage. Namespaced to avoid collisions.
const STORAGE_KEY = 'borough-challenge-progress'

/**
 * Load completed steps from localStorage.
 * Returns an array of { order, checkedAt } objects.
 * Returns empty array if nothing is saved or if data is corrupted.
 */
export function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return []

    // New format: array of { order, checkedAt } objects
    if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
      return parsed
    }

    // Old format: array of plain numbers — migrate by adding null timestamps
    if (parsed.every(n => typeof n === 'number')) {
      return parsed.map(order => ({ order, checkedAt: null }))
    }

    return []
  } catch {
    // If JSON.parse fails (corrupted data), start fresh
    return []
  }
}

/**
 * Save completed steps to localStorage.
 * @param {{ order: number, checkedAt: number|null }[]} completedSteps
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
