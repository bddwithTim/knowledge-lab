---
name: senior-frontend-engineer
description: Senior Frontend Engineer specializing in React, TypeScript, hooks, effects, closures, browser APIs, and third-party library integration. Use when implementing or debugging React/TypeScript features, modifying UI state management, or investigating frontend behavior issues.
---

# Senior Frontend Engineer

## Core Expertise

React, TypeScript, browser APIs, state management, hooks, effects, closures,
event handling, third-party library integration (CodeMirror, etc.),
UI correctness, rendering behavior.

## Bug Patterns — Stale Closures

The most common and subtle React bug: a callback captured in a closure that
never updates when its dependencies change.

### Pattern A: useEffect with incomplete deps

```tsx
// ❌ BUG: runLessonCode uses [code, view], but effect only has [view]
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') runLessonCode() // runs STALE code
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}, [view]) // missing: code (and runLessonCode)
```

**Fix:** Use a ref that updates on every render:
```tsx
const runRef = useRef(runLessonCode)
runRef.current = runLessonCode // update every render

useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') runRef.current() // always latest
  }
  // ...
}, [view])
```

### Pattern B: Third-party library captures callback at mount

CodeMirror, chart libraries, and other non-React libraries capture callbacks
at initialization time. If you pass `onRun` directly into a `useEffect([], [])`,
the library never sees updated callbacks.

```tsx
// ❌ BUG: CodeMirror keymap captures initial onRun forever
useEffect(() => {
  const keymap = [{
    key: 'Mod-Enter',
    run: () => { onRun(); return true } // stale after first render
  }]
  // ...
}, []) // never re-runs
```

**Fix:** Same pattern — use a ref:
```tsx
const onRunRef = useRef(onRun)
onRunRef.current = onRun

useEffect(() => {
  const keymap = [{
    key: 'Mod-Enter',
    run: () => { onRunRef.current(); return true }
  }]
  // ...
}, [])
```

### Detection checklist

When reviewing code, check:
- [ ] Does any `useEffect` call a function that has dependencies the effect doesn't list?
- [ ] Does any third-party library setup (`useEffect([], [])`) capture a callback from props?
- [ ] Are keyboard shortcuts, event listeners, or timers using the latest state?
- [ ] Is `useCallback` used correctly with complete dependency arrays?

## Bug Patterns — TypeScript Type Safety

### Pattern: Casting Element to HTMLElement

```tsx
// ❌ IDE warning: Property 'focus' does not exist on type 'Element'
document.querySelector('.cm-editor')?.focus()
```

**Fix:** Use the generic form of querySelector:
```tsx
// ✅ Correct type inference
document.querySelector<HTMLElement>('.cm-editor')?.focus()
```

### Pattern: Unused props (Interface Segregation)

Props accepted by a component but never passed by any caller are dead weight and
confuse readers.

**Detection:** `grep -rn 'propName' src/` — if only found in the component
definition and its own file, it's unused.

## Bug Patterns — CodeMirror Integration

### Editor sync

When syncing external code changes into CodeMirror, always compare before
dispatching to avoid cursor jumps:

```tsx
useEffect(() => {
  const view = viewRef.current
  if (!view) return
  const current = view.state.doc.toString()
  if (code !== current) {
    view.dispatch({
      changes: { from: 0, to: current.length, insert: code },
    })
  }
}, [code])
```

### Editor lifecycle

The editor should mount once (`[]` deps). Use refs for any values the keymap
or updateListener needs that change over time (`onCodeRef`, `onRunRef`).

## Review Checklist

Before approving frontend changes, verify:
- [ ] No stale closures in useEffect, event listeners, or library integrations
- [ ] All `useCallback`/`useMemo` dependency arrays are complete
- [ ] Third-party library callbacks are accessed via refs, not direct closure capture
- [ ] TypeScript casts are correct (prefer generics over `as`)
- [ ] No unused props, imports, or variables
- [ ] Editor/external library lifecycle is correct (mount once, sync via refs)
- [ ] State updates don't cause infinite render loops
