/*
 * App.jsx — The root component of the Borough Challenge app.
 *
 * REACT CONCEPTS USED HERE:
 *
 * - useState: creates a piece of state that, when changed, re-renders the component.
 *   Syntax: const [value, setValue] = useState(initialValue)
 *   When you call setValue(newValue), React re-renders this component with the new value.
 *
 * - useEffect: runs side effects after render. Think of it as "do this thing when
 *   something changes". The second argument is a dependency array — the effect only
 *   re-runs when those values change.
 *   useEffect(() => { doSomething() }, [dependency])
 *
 * - useCallback: memoises a function so it doesn't get recreated on every render.
 *   Useful when passing functions to child components — prevents unnecessary re-renders.
 *
 * - useMemo: memoises a computed value. Only recalculates when its dependencies change.
 *   Like a cached calculation.
 *
 * - useRef: creates a mutable reference that persists across renders without causing
 *   re-renders when changed. Often used to reference DOM elements or store mutable values.
 *
 * DATA FLOW:
 * This component owns the main state (which boroughs are completed) and passes
 * data + callbacks down to child components via props. This is React's "unidirectional
 * data flow" — data flows down, events flow up.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// Static import of route data — gets baked into the build for offline support
import routeData from './data/route.json'

// Child components (each handles one piece of the UI)
import Header from './components/Header'
import BoroughList from './components/BoroughList'

// localStorage helpers
import { loadProgress, saveProgress, resetProgress } from './utils/storage'

export default function App() {
  /*
   * STATE: completedSteps
   *
   * An array of step order numbers that have been completed, e.g. [1, 2, 3].
   * Initialised lazily from localStorage (the function form of useState
   * runs only once on first render, not on every re-render).
   */
  const [completedSteps, setCompletedSteps] = useState(() => loadProgress())

  /*
   * EFFECT: Persist to localStorage whenever completedSteps changes.
   *
   * useEffect runs AFTER the render, so the UI updates immediately and
   * the save happens asynchronously. The [completedSteps] dependency array
   * means this only runs when completedSteps actually changes.
   */
  useEffect(() => {
    saveProgress(completedSteps)
  }, [completedSteps])

  /*
   * DERIVED STATE with useMemo:
   * Instead of storing these separately, we compute them from the source data
   * and the completed steps. useMemo caches the result and only recalculates
   * when completedSteps changes.
   */
  const { completed, current, future, remainingMinutes } = useMemo(() => {
    // Convert to a Set for O(1) lookups
    const doneSet = new Set(completedSteps)

    const completedItems = []
    const futureItems = []
    let currentItem = null

    // Walk through all steps in order and categorise each one
    for (const step of routeData.steps) {
      if (doneSet.has(step.order)) {
        completedItems.push(step)
      } else if (!currentItem) {
        // First non-completed step is the current one
        currentItem = step
      } else {
        futureItems.push(step)
      }
    }

    // Sum up estimated minutes for all uncompleted steps (current + future)
    const remaining = [currentItem, ...futureItems]
      .filter(Boolean)  // filter out null if everything is done
      .reduce((sum, step) => sum + step.estimated_minutes, 0)

    return {
      completed: completedItems,
      current: currentItem,    // null when ALL boroughs are done!
      future: futureItems,
      remainingMinutes: remaining,
    }
  }, [completedSteps])

  /*
   * CALLBACK: Mark a step as completed.
   *
   * useCallback memoises this function — it won't be recreated on every render.
   * The function form of setCompletedSteps (prev => ...) ensures we always
   * work with the latest state, avoiding stale closure bugs.
   */
  const markCompleted = useCallback((orderNumber) => {
    setCompletedSteps(prev => {
      // Don't add duplicates
      if (prev.includes(orderNumber)) return prev
      return [...prev, orderNumber]
    })
  }, [])

  /*
   * CALLBACK: Reset all progress (hidden feature).
   * Called from the Header component when user triple-taps the title.
   */
  const handleReset = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetProgress()
      setCompletedSteps([])
    }
  }, [])

  /*
   * REF: Used to scroll the current borough card into view after completing a step.
   * useRef creates a persistent reference that doesn't trigger re-renders.
   */
  const currentRef = useRef(null)

  // Scroll to the current borough card whenever it changes
  useEffect(() => {
    if (currentRef.current) {
      // smooth scroll with a small delay so the DOM has updated
      setTimeout(() => {
        currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [current?.order])  // re-run when the current step changes

  /*
   * RENDER:
   * In React, the return value of a component is JSX — a syntax that looks like
   * HTML but is actually JavaScript. Each <Component prop={value} /> renders
   * that component and passes data to it via "props".
   */
  return (
    <div className="min-h-screen pb-8">
      {/* Header: fixed at top, shows progress and remaining time */}
      <Header
        totalSteps={routeData.steps.length}
        completedCount={completedSteps.length}
        remainingMinutes={remainingMinutes}
        onReset={handleReset}
      />

      {/* Main content: the borough list, below the fixed header */}
      {/* pt-28 adds padding-top to push content below the fixed header */}
      <main className="max-w-2xl mx-auto px-4 pt-28">
        <BoroughList
          completed={completed}
          current={current}
          future={future}
          onComplete={markCompleted}
          currentRef={currentRef}
        />

        {/* Victory message when all boroughs are completed */}
        {!current && completedSteps.length === routeData.steps.length && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">
              All 33 boroughs done!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You absolute legend. Time for a well-earned pint.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
