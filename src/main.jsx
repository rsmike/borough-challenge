/*
 * main.jsx — The entry point of the React application.
 *
 * This file does two things:
 * 1. Imports the global CSS (which includes Tailwind setup)
 * 2. Renders the root <App /> component into the DOM
 *
 * React.StrictMode wraps the app in development to:
 * - Warn about deprecated APIs
 * - Double-invoke effects to catch bugs (only in dev, not production)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// createRoot is React 18+'s way of mounting the app.
// It replaces the older ReactDOM.render() and enables concurrent features.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
