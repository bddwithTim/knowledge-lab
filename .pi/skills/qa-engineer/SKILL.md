---
name: qa-engineer
description: QA Engineer specializing in edge cases, type safety, state transitions, regression risks, and correctness validation. Use when verifying features work correctly, investigating bugs, or checking for unexpected behavior under realistic conditions.
---

# QA Engineer

## Core Expertise

Edge cases, boundary values, type mismatches, state persistence, regression risks,
error states, data consistency, assumption validation.

## Bug Patterns — Type Field Mismatches

When data types have similar-but-different identifier fields, code that assumes
the wrong field name compiles but fails at runtime.

### Example: `order` vs `id`

```tsx
// Lesson has: { order: number, ... }
// Challenge has: { id: string, ... }  ← NO 'order' field!

// ❌ BUG: Assumes Challenge has .order like Lesson
const entry = { lo: lesson.order, co: challenge.order }
//                                   ^^^^^ TypeScript error:
// Property 'order' does not exist on type 'Challenge'
```

**Detection:** Always verify the actual type definition before using a field.
Run `grep -n 'type Challenge\|interface Challenge' src/content.ts` and check
which fields exist.

### Checklist for data model changes

- [ ] Do all related types share the same identifier field, or do they differ?
- [ ] If they differ, does every reference use the correct field?
- [ ] Are numeric IDs treated as numbers (not strings) and vice versa?

## Bug Patterns — State Reset on Refresh

Browser refresh should restore the current page, not dump the user at the
landing page.

### Example: history.pushState without restore

```tsx
// ❌ BUG: Always seeds with 'learn' on mount, even after refresh
useEffect(() => {
  history.replaceState({ v: 'learn' }, '', '')
}, [])
```

**Fix:** Check existing state first:
```tsx
useEffect(() => {
  if (history.state?.v) {
    // restore from existing state
  } else {
    history.replaceState({ v: 'learn' }, '', '')
  }
}, [])
```

And when restoring, reset ALL derived state (code, output, error, results) —
not just the active lesson/challenge reference.

### Checklist for navigation/spa routing

- [ ] Does browser refresh restore the correct page?
- [ ] Does back/forward navigation work through all page types?
- [ ] Is starter code, output, and error state reset when restoring a lesson?
- [ ] Are assertions/results reset when restoring a challenge?

## Bug Patterns — Boundary Values

### "Works with X but fails with Y"

The most common QA finding: a feature works with one value but breaks with
another that should be equivalent.

```tsx
// Works fine:
console.log(double(4))  // outputs "8"

// Should also work but... does it?
console.log(double(10)) // outputs "20" — verify!
```

**Detection:** Always test with at least two different input values. If the
feature involves user-editable code, verify that changing a value doesn't
trigger a stale-closure or editor-sync bug.

### Checklist for boundary testing

- [ ] Test with the default/example value AND a different value
- [ ] Test with zero, empty string, empty array where applicable
- [ ] Test with large values (e.g., `double(999999)`)
- [ ] If the feature strips type annotations (like `runTS`), test with and
      without annotations, with generics, with complex types

## Bug Patterns — Type Coercion and Runtime Type Errors

### Example: `setOutput('')` vs `setOutput([])`

```tsx
// ❌ Runtime crash: output.map is not a function
const [output, setOutput] = useState<string[]>([])
setOutput('') // TypeScript might not catch this if types are loose
```

**Detection:** Check that state setters receive values matching the declared
type. Pay special attention to reset/clear operations.

### Checklist for type safety

- [ ] Do all `setState` calls pass values matching the declared generic type?
- [ ] Are empty/reset states type-consistent (e.g., `[]` not `''` for arrays)?
- [ ] Do functions returning union types handle all branches?

## Bug Patterns — Missing State Reset

When navigating between items (lessons, challenges), all derived state must
reset.

### Checklist for navigation

- [ ] Is `output` cleared when opening a new lesson?
- [ ] Is `error` cleared?
- [ ] Is `results` cleared when opening a new challenge?
- [ ] Is `showHint` reset?
- [ ] Does the editor show the correct starter code (not stale code from
      the previous item)?

## Review Checklist

Before approving a feature, verify:
- [ ] Works correctly with at least two different input values
- [ ] Browser refresh restores the correct page and state
- [ ] Back/forward navigation works through all relevant page types
- [ ] All state is properly reset when navigating between items
- [ ] No type field mismatches (check actual type definitions, not assumptions)
- [ ] Edge cases: empty inputs, boundary values, error states
- [ ] No runtime type errors from mismatched state types
