# knowledge-lab

A local refresher app for JavaScript, TypeScript, and algorithm fundamentals.

- Files under `sources/` are read-only reference material.

## Approval Gate (MANDATORY)

Before making ANY code change — edits, writes, new files, bash commands that
modify files — you MUST:

1. Present a concise plan of what you intend to change.
2. Wait for explicit approval: "go ahead", "implement", "yes", "proceed",
   or similar unambiguous confirmation.
3. Only then make the change.

Discussion, suggestions, brainstorming, and questions are NOT approval.
If the user asks "how would you approach X?" or "what do you think?",
answer with analysis — do NOT implement.

## Skill Routing (MANDATORY FIRST STEP)

For EVERY request, your very first response must begin with one of:
- `SKILL: none` followed by a one-line reason ("straightforward edit", "explanation only", etc.)
- `SKILL: <name>` followed by a one-line reason

Only after declaring the routing decision may you proceed with the
actual work. Do not plan, analyze, or write code before this step.

---

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
npm run typecheck && npm run build
```
