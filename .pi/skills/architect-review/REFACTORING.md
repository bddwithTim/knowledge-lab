# Refactoring Guidelines — knowledge-lab

## Evaluation Checklist (run after every change)

```
npx tsc --noEmit     # TypeScript errors?
npx vite build       # Build errors?
```

For visual changes: screenshot via `browser-tools` skill before and after.

## Extraction Test

| Criterion | Action |
|---|---|
| Used in 3+ places? | Extract |
| Pure function, zero React deps? | Extract to `src/utils.ts` |
| Self-contained component >100 lines? | Extract to `src/components/` |
| None of the above? | Leave in App.tsx |

## File Size Limits

| File type | Max lines | Action if exceeded |
|---|---|---|
| Any `.tsx`/`.ts` (non-data) | 300 | Extract smallest self-contained unit |
| Component (single function) | 200 | Extract sub-components or hooks |
| Function/hook | 50 | Split into smaller functions |
| `styles.css` | 2000 | Consider `@layer` split, but prefer single file |
| Data files (`content.ts`, etc.) | No hard limit | Split by topic if >2000 lines |

## Project Structure

```
src/
  App.tsx              ← Routing + top-level state. View components co-located.
  types.ts             ← Shared types (View, NavEntry, etc.)
  utils.ts             ← Pure functions: storage, execution, display
  components/          ← Reusable UI only (used in 3+ places OR >100 lines)
  hooks/               ← Custom hooks (used in 3+ places OR >30 lines of logic)
  content.ts           ← JS lesson data
  ts-content.ts        ← TS lesson data
  algorithm-scenarios.ts ← Algorithm visualization data
  debugger.tsx         ← Step-through debugger
  editor.tsx           ← CodeMirror editor wrapper
  styles.css           ← All styles
```

## What to Co-locate (keep in App.tsx)

- View-level components used once → co-located with routing
- State logic tightly coupled to a single component → same file
- Inline event handlers under 5 lines → keep inline
- Types under 20 lines used only in one file → keep in that file

## What Always Gets Extracted

- Pure utility functions (no React imports)
- Reusable UI components (buttons, cards, inputs)
- Custom hooks encapsulating a complete piece of state logic (useLocalStorage, etc.)
- Shared types used across 3+ files

## Refactoring Process

1. Audit: `wc -l src/*.ts src/*.tsx`
2. Identify files over 300 lines
3. Apply extraction test to each candidate
4. Extract one piece at a time, verifying build after each
5. Run browser verification for any component extraction
