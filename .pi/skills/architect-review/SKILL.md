---
name: architect-review
description: Senior Architect code review and refactoring. Applies clean code, SOLID, KISS, AHA, and Rule of Three principles. Use before major refactors, when code organization needs improvement, or when components grow too large (>200 lines). This is NOT for cosmetic changes — use when structure, separation of concerns, or abstraction boundaries need review.
---

# Senior Architect — Code Review & Refactoring

## Core Principles (in priority order)

### 1. KISS — Keep It Simple, Stupid
- Prefer plain functions over classes, factories, or patterns unless the pattern earns its keep
- If a concept can be explained in one sentence, it should be one function or component
- Avoid indirection: a reader should never have to jump through 3 files to understand one behavior
- **Anti-pattern**: Wrapping a single `fetch` call in a `createApiClient` class

### 2. AHA — Avoid Hasty Abstractions  
- Do NOT abstract on the first occurrence. Wait until you have at least 2-3 concrete examples before extracting shared logic
- Prefer duplication over the wrong abstraction. A wrong abstraction is harder to undo than duplicated code
- When you do abstract, name the abstraction after WHAT it does, not HOW it does it

### 3. Rule of Three
- First time: write it inline
- Second time: copy-paste (yes, duplicate)
- Third time: extract into a shared function/component/hook
- **Exception**: Extract immediately if the duplicated code is non-trivial AND the abstraction is obvious (e.g., a `useLocalStorage` hook)

### 4. SOLID (applied pragmatically)
- **S**ingle Responsibility: Every function/component does ONE thing. If the description needs "and", split it
- **O**pen/Closed: Extend behavior through props/composition, not by editing existing components
- **L**iskov: Substituted components must honor the same prop contract
- **I**nterface Segregation: Components should not accept props they don't use
- **D**ependency Inversion: High-level policy (what to do) should not depend on low-level details (how to do it)

### 5. Clean Code
- Files < 300 lines. If a file crosses 300 lines, extract something
- Functions < 50 lines. If a function crosses 50 lines, it's doing too much
- Components < 200 lines of JSX. Extract sub-components for repeated or complex markup
- No magic numbers or strings: extract to named constants
- Comments explain WHY, not WHAT. Code should be self-documenting

## Refactoring Decision Tree

```
File/component > 300 lines?
  ├─ YES → Extract. What can stand alone?
  │   ├─ Pure data (types, constants) → new file in same dir
  │   ├─ Reusable UI (buttons, cards, inputs) → src/components/
  │   ├─ Page-level or view routing → remain in App but extract sub-components
  │   ├─ Business logic (hooks, utilities) → src/hooks/ or src/utils/
  │   └─ Styling → already in styles.css (do not split CSS unless >2000 lines)
  │
  └─ NO → Leave it. Only extract if Rule of Three applies.

Component has > 3 props?
  ├─ YES → Can they be grouped into a config object? Or is the component doing too much?
  └─ NO → Fine.

Function has > 3 parameters?
  ├─ YES → Group into an options object with a named type
  └─ NO → Fine.

Same pattern appears in 3+ places?
  ├─ YES → Extract. But name it well.
  └─ NO → Leave duplicated. Wait for the third occurrence.

Component is used in only one place?
  ├─ YES → Keep it in the same file (co-location). Only extract if the file is too large.
  └─ NO → Extract to src/components/
```

## Project-Specific Conventions

### File organization
```
src/
  App.tsx              ← routing + top-level state ONLY
  components/           ← reusable UI components
  hooks/                ← custom hooks
  utils/                ← pure utility functions
  content.ts            ← JS lesson data
  ts-content.ts         ← TS lesson data  
  algorithm-scenarios.ts ← algorithm data
  debugger.tsx          ← step-through debugger component
  editor.tsx            ← CodeMirror editor component
  styles.css            ← all styles (CSS custom properties)
```

### When to extract from App.tsx
- Any component used by multiple views → `src/components/`
- Any piece of state logic with >10 lines → `src/hooks/useSomething.ts`
- Any pure function not tied to React → `src/utils/something.ts`
- View-level components (LearnIndex, LessonPage, etc.) → keep in App.tsx but keep each under 200 lines
- Types used across files → extract to a `src/types.ts` if >20 lines

### When NOT to extract
- One-off components used in a single view → keep in App.tsx
- Simple inline event handlers (< 5 lines) → keep inline
- CSS → keep in styles.css (single file, CSS custom properties, @layer organization)
- Data files (content.ts, ts-content.ts, algorithm-scenarios.ts) → already separated, leave as-is

## Review Checklist

Before approving any refactor, verify:
- [ ] Does the change make the code easier to understand on first read?
- [ ] Are new abstractions named after WHAT they do (not HOW)?
- [ ] Is the Rule of Three satisfied for any new extracted component?
- [ ] Are any files still over 300 lines? If yes, what else can be extracted?
- [ ] Are new components co-located with their only consumer, or properly extracted?
- [ ] Do new hooks encapsulate a complete piece of state logic?
- [ ] Are there any magic strings or numbers that should be constants?
- [ ] Would a junior developer understand the new structure in under 5 minutes?
