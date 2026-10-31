# knowledge-lab

A local refresher app for JavaScript, TypeScript, and algorithm fundamentals.

- Files under `sources/` are read-only reference material.

## Skill Routing

Before taking action on any user request, first determine whether a
specialist skill would materially improve the result.

Most requests do not require a specialist. If no specialist is needed,
proceed directly.

Use the minimum number of specialist skills necessary. Do not load a
skill merely because it exists.

| Skill | Use when |
|---|---|
| `architect-review` | Restructuring, extracting responsibilities, introducing abstractions, changing component/module boundaries, or evaluating architecture |
| `senior-frontend-engineer` | Frontend implementation, debugging, and review; especially React, TypeScript, hooks/effects, closures, browser APIs, UI behavior, and CodeMirror |
| `qa-engineer` | Behavioral validation and quality analysis; especially edge cases, type mismatches, state transitions, regression risks, input validation, and test coverage |

### Routing examples

- General questions or explanations → no skill
- Simple edits or file operations → no skill
- Architectural refactoring → `architect-review`
- React/TypeScript implementation or debugging → `senior-frontend-engineer`
- Bug investigation → `senior-frontend-engineer` and/or `qa-engineer`
- Feature validation after implementation → `qa-engineer`
- Cross-cutting refactoring → `architect-review` and `senior-frontend-engineer`
- Significant feature implementation → choose specialists based on the
  actual change; use `architect-review` for structural decisions,
  `senior-frontend-engineer` for implementation complexity, and
  `qa-engineer` when behavioral validation is warranted

## Skill Timing

Use specialist skills at the point where their expertise is useful.

- **Before implementation:** `architect-review` for structural decisions, `senior-frontend-engineer` for complex frontend decisions.
- **During debugging:** `senior-frontend-engineer` for technical diagnosis, `qa-engineer` when validating behavior or identifying missing cases.
- **After significant changes:** `qa-engineer` when regression or edge-case validation would provide value.

Do not invoke a specialist simply to perform a redundant review.

## After every code change

```
npx tsc --noEmit && npx vite build
```
