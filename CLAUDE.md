# Borough Challenge — Project Guidelines

## What is this?
A single-page React PWA to track progress visiting all 33 London boroughs in one day.
Data lives in `src/data/route.json`.

## Tech Stack
- **Vite + React 19** with JSX
- **Tailwind CSS v4.2** — CSS-first config in `src/index.css` (no tailwind.config.js)
- **vite-plugin-pwa** — service worker and manifest configured in `vite.config.js`
- Deployed to **GitHub Pages** via `.github/workflows/deploy.yml`

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint check

## Key Architecture
- `src/data/route.json` is the single source of truth for all route data
- State: `completedSteps` (array of `{order, checkedAt}` objects) persisted to localStorage
- Current borough = first step not in completedSteps
- Hidden reset: triple-tap the header title

## Styling
- All custom colours defined as `@theme` tokens in `src/index.css`
- TfL line colours available as `bg-tfl-victoria`, `text-tfl-dlr`, etc.
- Dark mode: uses `prefers-color-scheme` via Tailwind's `dark:` variant
- Transport badge colours use inline styles (dynamic per-step)

## Code Style
- Verbose comments explaining React concepts (learning project)
- Components in `src/components/`, utilities in `src/utils/`
- No TypeScript, no external UI library
