export type ZodExercise =
  | { kind: 'convert-js-ts'; question: string; jsCode: string; tsCode: string; explanation: string }
  | { kind: 'fix-type'; question: string; brokenCode: string; fixedCode: string; errorDescription: string; explanation: string }
  | { kind: 'predict-type'; question: string; code: string; answer: string; explanation: string }
  | { kind: 'model-it'; question: string; data: string; interface: string; explanation: string }
  | { kind: 'fill-blank'; question: string; code: string; blanks: { label: string; answer: string }[]; explanation: string }
  | { kind: 'choose-best'; question: string; options: { label: string; code: string; isCorrect: boolean }[]; explanation: string }

export type ZodLesson = {
  id: string
  order: number
  title: string
  block: string
  summary: string
  sections: { title: string; body: string[]; code?: string }[]
  starterCode: string
  exercises: ZodExercise[]
}

export const zodLessons: ZodLesson[] = [
  {
    id: 'zod-intro',
    order: 1,
    title: 'What is Zod?',
    block: 'foundations',
    summary: 'Zod is a TypeScript-first schema validation library. You define the shape of your data once with a fluent, composable API. Zod validates real data at runtime and automatically generates TypeScript types — your schema is the single source of truth.',
    sections: [
      {
        title: 'What Zod is — and why it exists',
        body: [
          'Zod is a **runtime validation library** designed for TypeScript. You write schemas (descriptions of what valid data looks like) using a chainable API: `z.string().email()`, `z.object({ name: z.string() })`. It is not a TypeScript superset — it is a companion that fills the gap TypeScript leaves behind at runtime.',
          'TypeScript checks your types at compile time, then erases them. Zod keeps a runtime copy of those rules and enforces them as data flows through your program.',
        ],
        code: 'type User = { name: string; age: number }\n\nfunction greet(user: User) {\n  console.log(user.name.toUpperCase())\n}\n\n// TypeScript says this is fine. It compiles.\n// But at runtime, name is a number.\ngreet(JSON.parse(\'{"name": 42}\'))\n// 💥 Cannot read properties of undefined',
      },
      {
        title: 'The gap Zod fills: runtime enforcement',
        body: [
          'Zod keeps a **runtime copy** of your type rules. Instead of types that disappear, you define schemas that live in your code and check data as it flows in.',
          'The same example with Zod — the bad data never reaches your function. Zod stops it at the door with the exact field and reason.',
        ],
        code: 'import { z } from \'zod\'\nconst User = z.object({ name: z.string(), age: z.number() })\n\nfunction greet(user: z.infer<typeof User>) {\n  console.log(user.name.toUpperCase())\n}\n\nconst raw = JSON.parse(\'{"name": 42}\')\ngreet(User.parse(raw))\n// ❌ ZodError: Expected string, received number at "name"',
      },
      {
        title: '.parse() vs .safeParse()',
        body: [
          '**`.parse(data)`** — validates and returns the data. Throws if invalid. Use when invalid data means the program should stop.',
          '**`.safeParse(data)`** — never throws. Returns `{ success: true, data }` or `{ success: false, error }`. Use for user input, API responses, or anywhere you want to handle errors gracefully.',
        ],
        code: '// .parse() — throws on failure\nconst name = z.string().parse("Mina")  // ✅ "Mina"\nz.string().parse(42)  // ❌ throws ZodError\n\n// .safeParse() — never throws, inspect result\nconst result = z.string().safeParse(42)\nif (!result.success) {\n  console.log(result.error.issues[0].message)\n  // "Expected string, received number"\n}',
      },
      {
        title: '👎 Without Zod: silent bug',
        body: [
          'An API returns `{ "user": { "name": "Mina", "age": "25" } }`. The `age` field is a **string**, not a number. `fetch()` returns `any`, so TypeScript lets you treat it as a number.',
          'No crash — just silently wrong results. `"25" + 1` becomes `"251"` (string concatenation), not `26`. This bug could live in production for weeks.',
        ],
        code: 'const res = await fetch("/api/user")\nconst data = await res.json()\n// data is `any` — TypeScript trusts whatever you do\n\nconsole.log(data.user.age + 1)\n// "251" — not 26! String concatenation, not addition.',
      },
      {
        title: '✅ With Zod: caught at the boundary',
        body: [
          'Add one Zod schema. The bad data never enters your app logic. The error tells you the exact path — `user.age` — and what went wrong.',
          'Parse at the boundary, trust everywhere else. No more defensive `typeof` checks scattered through your code.',
        ],
        code: 'const User = z.object({\n  user: z.object({ name: z.string(), age: z.number() })\n})\n\nconst res = await fetch("/api/user")\nUser.parse(await res.json())\n// ❌ Expected number, received string at "user.age"',
      },
      {
        title: '💡 The advantages, in one place',
        body: [
          '**1. Runtime validation** — TypeScript types disappear after compile. Zod schemas live in your running code and check data as it arrives.',
          '**2. Boundary defense** — API responses, form inputs, localStorage, URL params — all untrusted. Zod validates at the entry point so the rest of your code trusts the types.',
          '**3. Single source of truth** — `z.infer<typeof MySchema>` gives you the TypeScript type for free. Change the schema, the type updates. No drift.',
          '**4. Rich validation** — `.email()`, `.url()`, `.min(5)`, `.refine(v => v > 0)`. TypeScript cannot express these. Zod can.',
          '**5. Clear error messages** — "Expected string, received number at user.age" beats "Cannot read properties of undefined" every time.',
        ],
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst User = z.object({ name: z.string(), age: z.number() })\nconsole.log(User.safeParse({ name: "Mina", age: 25 }))',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What does z.string().safeParse(42) return?',
        code: 'import { z } from \'zod\'\nconst result = z.string().safeParse(42)',
        answer: '{ success: false, error: ZodError } — safeParse never throws, it returns a result object.',
        explanation: '`.safeParse()` always returns `{ success, data }` or `{ success, error }`. On failure, `result.success` is `false`.',
      },
      {
        kind: 'fill-blank',
        question: 'Fill in the blanks to safely parse a number:',
        code: 'const result = z.______().______("25")\nif (result.______) {\n  console.log(result.______)\n}',
        blanks: [
          { label: 'type', answer: 'number' },
          { label: 'method', answer: 'safeParse' },
          { label: 'check', answer: 'success' },
          { label: 'access', answer: 'data' },
        ],
        explanation: '`z.number().safeParse(...)` returns a result. Check `result.success`, access `result.data`.',
      },
    ],
  },

  {
    id: 'zod-primitives',
    order: 2,
    title: 'Strings, numbers, and built-in rules',
    block: 'foundations',
    summary: 'z.string(), z.number(), z.boolean() come with chainable methods for common validations — min, max, email, url, and more. No regex needed.',
    sections: [
      {
        title: 'Mental model: A form with rules',
        body: [
          'A sign-up form has rules: username at least 3 characters, age 0-150, email looks like an email. These are types WITH constraints.',
          'Zod primitives come with chainable methods: `z.string().min(3).max(20)`, `z.number().positive()`, `z.string().email()`. Each method adds one rule. Chain them left to right — read it like a sentence.',
        ],
        code: 'import { z } from \'zod\'\n\nz.string().min(3).max(20)        // 3-20 characters\nz.string().email()                 // must be email format\nz.string().url()                    // must be URL format\nz.string().startsWith("user_")    // must start with prefix\nz.string().regex(/^[a-z]+$/)      // custom regex\n\nz.number().min(0).max(150)        // 0-150\nz.number().int()                   // integer only\nz.number().positive()            // > 0\nz.number().multipleOf(5)         // divisible by 5',
      },
      {
        title: '.coerce() — convert before validating',
        body: [
          'Form inputs and query parameters arrive as strings. `"25"` is a string, not a number. Use `z.coerce.number()` to auto-convert before validating.',
          'Coercion tries to convert first: `z.coerce.number()` turns `"25"` into `25`, then validates. If conversion fails (`"hello"`), it gracefully fails validation.',
          'Available: `z.coerce.string()`, `z.coerce.number()`, `z.coerce.boolean()`, `z.coerce.date()`.',
        ],
        code: '// Without coercion — fails\nz.number().parse("25")  // ❌ Expected number, received string\n\n// With coercion — works\nz.coerce.number().parse("25")    // ✅ 25\nz.coerce.number().parse("hello") // ❌ fails\nz.coerce.boolean().parse("true") // ✅ true',
      },
      {
        title: '👎 See it fail: Coercion surprises',
        body: [
          '`z.coerce.number().parse("")` returns `0` — an empty string coerces to zero. `z.coerce.boolean().parse("false")` returns `true` — non-empty strings coerce to true. These are JavaScript coercion rules, not Zod bugs.',
          'To avoid surprises, validate BEFORE coercion: `z.string().min(1).transform(Number)` or use `.refine()` to check the input format first.',
        ],
        code: '// Surprise: empty string → 0\nz.coerce.number().parse("")  // ✅ 0 (probably not what you want)\n\n// Safer: validate string first, then convert\nz.string().min(1).transform(Number).pipe(z.number())\n\n// Surprise: "false" → true\nz.coerce.boolean().parse("false")  // ✅ true (non-empty string)',
      },
      {
        title: '💡 When to coerce, when to validate',
        body: [
          'Use `.coerce` for form data and query strings where everything arrives as a string. Use direct validation for JSON APIs where types should already be correct.',
          '`.pipe()` lets you chain a transformation into another schema: `z.string().transform(Number).pipe(z.number().positive())`. The output of transform becomes input to the next schema.',
        ],
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst Form = z.object({\n  username: z.string().min(3).max(20),\n  age: z.coerce.number().min(0).max(150),\n  email: z.string().email()\n})\n\nconsole.log(Form.safeParse({ username: "mi", age: "25", email: "bad" }))',
    exercises: [
      {
        kind: 'convert-js-ts',
        question: 'Convert this manual validation to a Zod schema:',
        jsCode: 'function validateAge(input) {\n  const age = Number(input)\n  if (isNaN(age)) throw new Error("Not a number")\n  if (age < 0 || age > 150) throw new Error("Out of range")\n  return age\n}',
        tsCode: 'import { z } from \'zod\'\nconst Age = z.coerce.number().min(0).max(150)',
        explanation: '`z.coerce.number()` converts the string to number, then `.min(0).max(150)` validates the range. One chain replaces the whole function.',
      },
      {
        kind: 'fix-type',
        question: 'This schema allows empty usernames. Fix it:',
        brokenCode: 'const Username = z.string().max(20)',
        fixedCode: 'const Username = z.string().min(1).max(20)',
        errorDescription: 'Empty string passes validation',
        explanation: 'Add `.min(1)`. Without a minimum, `""` passes. Order does not matter here but `.min().max()` is the convention.',
      },
    ],
  },

  {
    id: 'zod-objects',
    order: 3,
    title: 'Objects, nesting, and optional fields',
    block: 'foundations',
    summary: 'z.object({}) describes the shape of an object. Optional fields, defaults, nested objects, extending schemas — Zod handles real-world data shapes cleanly.',
    sections: [
      {
        title: 'Mental model: A passport form',
        body: [
          'A passport has required fields (name, date of birth, photo) and optional ones (middle name). If a required field is missing or wrong, you are stopped at the gate.',
          '`z.object({ name: z.string(), age: z.number() })` says: "I expect an object with a string `name` and a number `age`. Nothing else matters." Missing keys, extra keys, wrong types — all caught.',
        ],
        code: 'import { z } from \'zod\'\n\nconst User = z.object({\n  name: z.string(),\n  age: z.number(),\n})\n\n// ✅ valid\nUser.parse({ name: "Mina", age: 25 })\n\n// ❌ missing age\nUser.parse({ name: "Mina" })\n// ZodError: Required at "age"\n\n// ❌ age is string, not number\nUser.parse({ name: "Mina", age: "25" })\n// ZodError: Expected number, received string at "age"',
      },
      {
        title: 'Optional, default, nullish, and nullable',
        body: [
          '**`.optional()`** — the key can be missing. Parses to `Type | undefined`.',
          '**`.default(value)`** — if missing, fills in the default. No `undefined` in the output.',
          '**`.nullable()`** — accepts `null` as a valid value. The key must exist but can be null. For APIs that return BOTH missing keys AND null values, use .nullish() instead.',
        ],
        code: 'const Profile = z.object({\n  name: z.string(),\n  bio: z.string().optional(),          // key can be missing\n  role: z.string().default("user"),    // fills "user" if missing\n  deletedAt: z.date().nullable(),      // null or Date (key must exist)\n  avatar: z.string().url().nullish()   // missing, null, or url — all OK\n})',
      },
      {
        title: 'Composing: .extend(), .merge(), .pick(), .omit(), .partial()',
        body: [
          '**.extend({ ... })** — add fields to an existing schema. The original is unchanged.',
          '**.merge(other)** — combine two schemas with DISJOINT keys. If fields overlap, TypeScript flags an error — use .extend() to add fields instead.',
          '**.pick({ a: true })** — create a schema with only the listed fields. Perfect for API response shapes.',
          '**.omit({ a: true })** — remove listed fields. Strip passwords: \`User.omit({ password: true })\`.',
          '**.partial()** — make ALL fields optional. Ideal for PATCH / update endpoints.',
          '**.required()** — make ALL fields required. The reverse of .partial().',
        ],
        code: 'const User = z.object({\n  id: z.string(),\n  name: z.string(),\n  email: z.string().email(),\n  password: z.string()\n})\n\n// .extend() — add fields\nconst Admin = User.extend({ role: z.literal("admin") })\n\n// .merge() — combine disjoint schemas\nconst Timestamps = z.object({ createdAt: z.string(), updatedAt: z.string() })\nconst UserWithMeta = User.merge(Timestamps)\n\n// .pick() — select fields for a response\nconst PublicUser = User.pick({ id: true, name: true })\n\n// .omit() — remove sensitive fields\nconst SafeUser = User.omit({ password: true })\n\n// .partial() — all optional (PATCH endpoint)\nconst UpdateUser = User.partial()',
      },
      {
        title: '👎 See it fail: Nested API response',
        body: [
          'An API returns deeply nested data: `{ user: { profile: { address: { city: "NYC" } } } }`. Without Zod, you check each level manually — one missed check and you get "cannot read property of undefined."',
          'Zod checks the entire tree at once: `z.object({ user: z.object({ profile: z.object({ address: z.object({ city: z.string() }) }) }) })`. One parse, full validation. Errors tell you the exact path: `user.profile.address.city`.',
        ],
      },
      {
        title: '💡 .passthrough(), .strict(), .describe(), z.nativeEnum()',
        body: [
          'By default, Zod strips unknown keys. `User.parse({ name: "Mina", age: 25, hacker: true })` returns `{ name: "Mina", age: 25 }` — `hacker` is silently dropped.',
          '**`.passthrough()`** — keep unknown keys. **`.strict()`** — reject unknown keys. Use `.strict()` for APIs where unexpected fields are a bug.',
          '**`.describe("text")`** — attach human-readable metadata. Does not affect validation — used by documentation generators like zod-to-json-schema.',
          '**`z.nativeEnum(MyEnum)`** — create a schema from a TypeScript enum. Unlike `z.enum([...])`, reads values from the runtime enum object at startup.'
        ],
        code: 'const User = z.object({ name: z.string() })\n\n// Default — strips unknown\nUser.parse({ name: "Mina", extra: 1 })  // { name: "Mina" }\n\n// Strict — rejects unknown\nUser.strict().parse({ name: "Mina", extra: 1 })\n// ❌ Unrecognized key: "extra"',
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst User = z.object({\n  name: z.string(),\n  age: z.number(),\n  email: z.string().email().optional(),\n  role: z.string().default("user")\n})\n\nconsole.log(User.parse({ name: "Mina", age: 25 }))',
    exercises: [
      {
        kind: 'model-it',
        question: 'Write a Zod schema for this API response:',
        data: '{\n  "id": "usr_123",\n  "profile": {\n    "displayName": "Mina",\n    "avatar": "https://example.com/ava.jpg"\n  },\n  "createdAt": "2024-01-01"\n}',
        interface: 'const ApiUser = z.object({\n  id: z.string(),\n  profile: z.object({\n    displayName: z.string(),\n    avatar: z.string().url().optional()\n  }),\n  createdAt: z.string()\n})',
        explanation: 'Nested `z.object()` for profile. Avatar is optional (might be null/missing). CreatedAt is a string (ISO format — could also use `z.coerce.date()`).',
      },
      {
        kind: 'choose-best',
        question: 'You want a field to be optional with a fallback. Which?',
        options: [
          { label: 'A', code: 'z.string().optional()', isCorrect: false },
          { label: 'B', code: 'z.string().default("guest")', isCorrect: true },
          { label: 'C', code: 'z.string().nullable()', isCorrect: false },
        ],
        explanation: '`.default("guest")` makes it optional AND provides a fallback. `.optional()` leaves it `undefined`. `.nullable()` allows `null` but the key must still exist.',
      },
    ],
  },

  {
    id: 'zod-collections',
    order: 4,
    title: 'Arrays, unions, and discriminated unions',
    block: 'foundations',
    summary: 'z.array() for lists. z.union() for "this OR that." z.discriminatedUnion() for objects that vary by a type field. Together they cover every API response shape.',
    sections: [
      {
        title: 'Mental model: A notification system',
        body: [
          'Your app sends three kinds of notifications: email (with subject and body), SMS (with phone number and body), and push (with device token and title). Same concept — different shapes.',
          'A discriminated union uses a `type` field to tell variants apart: `{ type: "email", subject, body }` vs `{ type: "sms", phone, body }`. Zod checks the discriminator, then validates the matching variant.',
        ],
        code: 'import { z } from \'zod\'\n\nconst Notification = z.discriminatedUnion("type", [\n  z.object({ type: z.literal("email"), subject: z.string(), body: z.string() }),\n  z.object({ type: z.literal("sms"), phone: z.string(), body: z.string() }),\n  z.object({ type: z.literal("push"), token: z.string(), title: z.string() }),\n])\n\n// ✅ Works\nNotification.parse({ type: "email", subject: "Hi", body: "Hello!" })\n\n// ❌ email variant missing subject\nNotification.parse({ type: "email", body: "Hello!" })\n// ZodError: Required at "subject"',
      },
      {
        title: 'Array, tuple, record, union, and enum',
        body: [
          '**`z.array(schema)`** — a list where every element matches. `z.array(z.string())` → `string[]`.',
          '**`z.tuple([a, b])`** — a fixed-length array where each position has its own type. `z.tuple([z.string(), z.number()])` → `[string, number]`. For coordinates, CSV rows, key-value pairs.',
          '**`z.record(key, value)`** — an object with dynamic keys. `z.record(z.string(), z.number())` → `{ [key: string]: number }`. For dictionaries, headers, query params.',
          '**`z.union([a, b])`** — the value must match at least one of the schemas. `z.union([z.string(), z.number()])` is `string | number`.',
          '**`z.enum(["a", "b"])`** — the value must be exactly one of the listed strings. Simpler than `z.union([z.literal("a"), z.literal("b")])`.',
        ],
        code: '// Array — list of one type\nz.array(z.string()).parse(["a", "b", "c"])  // ✅\nz.array(z.number()).min(1).max(10)  // 1-10 elements\n\n// Union — this OR that\nz.union([z.string(), z.number()]).parse(42)  // ✅\nz.union([z.string(), z.number()]).parse(true)  // ❌\n\n// Enum — fixed choices\nz.enum(["small", "medium", "large"]).parse("small")  // ✅\nz.enum(["small", "medium", "large"]).parse("tiny")   // ❌',
      },
      {
        title: '👎 See it fail: Wrong variant',
        body: [
          'Without discriminatedUnion, you would use a plain union: `z.union([Email, Sms, Push])`. If you pass `{ type: "email" }` (missing subject), Zod tries all three and says "no schema matched" — not helpful. You do not know WHICH variant was expected.',
          'With `.discriminatedUnion("type", [...])`, Zod looks at `type: "email"`, picks the email variant, and says "Required at subject" — precise and actionable.',
        ],
        code: '// Plain union — bad error\nz.union([Email, Sms]).parse({ type: "email" })\n// ❌ "Invalid input" — which one failed? Unknown.\n\n// Discriminated union — good error\nz.discriminatedUnion("type", [Email, Sms]).parse({ type: "email" })\n// ❌ "Required at \'subject\'" — clear!',
      },
      {
        title: '💡 z.literal() for exact values',
        body: [
          '**`z.literal("admin")`** matches exactly the string `"admin"`. Combined with discriminated unions, it pins down the variant type precisely.',
          'Can also be used standalone: `z.literal("hello")` only accepts the exact value `"hello"`. Useful for status fields, role types, and feature flags.',
        ],
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst Item = z.object({\n  name: z.string(),\n  price: z.number().positive(),\n  category: z.enum(["food", "drink", "dessert"])\n})\n\nconst Menu = z.array(Item)\n\nconsole.log(Menu.safeParse([\n  { name: "Salad", price: 8, category: "food" },\n  { name: "Soda", price: 3, category: "drink" }\n]))',
    exercises: [
      {
        kind: 'model-it',
        question: 'Model a shopping cart item that is either physical (has weight) or digital (has fileSize):',
        data: 'Physical: { type: "physical", name: "Book", price: 10, weight: 2.5 }\nDigital: { type: "digital", name: "PDF", price: 5, fileSize: 150 }',
        interface: 'const CartItem = z.discriminatedUnion("type", [\n  z.object({ type: z.literal("physical"), name: z.string(), price: z.number(), weight: z.number() }),\n  z.object({ type: z.literal("digital"), name: z.string(), price: z.number(), fileSize: z.number() })\n])',
        explanation: 'The `type` field discriminates. Each variant defines its own fields. Zod checks the discriminator first, then validates the matching shape.',
      },
      {
        kind: 'predict-type',
        question: 'What TypeScript type does Zod infer for this?',
        code: 'const Size = z.enum(["small", "medium", "large"])',
        answer: '"small" | "medium" | "large" — a union of string literals.',
        explanation: '`z.enum()` creates a union of the exact string literals. TypeScript enforces that only those three strings are valid.',
      },
    ],
  },

  {
    id: 'zod-refine',
    order: 5,
    title: 'Custom validation with .refine()',
    block: 'foundations',
    summary: '.refine() adds custom rules beyond built-in methods. .superRefine() reports multiple issues. .transform() changes the output after validation passes.',
    sections: [
      {
        title: 'Mental model: A bouncer with a checklist',
        body: [
          'Built-in methods check the obvious: is it a string? Is it an email? But what about "password must contain uppercase AND a number" or "end date must be after start date"?',
          '`.refine(fn, message)` is the bouncer. Zod checks the basic rules, then the bouncer checks your custom rule. You write the rule as a function that returns `true` (allowed) or `false` (rejected).',
        ],
        code: 'import { z } from \'zod\'\n\n// Single-field custom rule\nconst Password = z.string().refine(\n  (pw) => /[A-Z]/.test(pw) && /[0-9]/.test(pw),\n  { message: "Password needs at least one uppercase letter and one number" }\n)\n\n// Cross-field validation\nconst Booking = z.object({\n  checkIn: z.string(),\n  checkOut: z.string()\n}).refine(\n  (data) => data.checkOut > data.checkIn,\n  { message: "Check-out must be after check-in", path: ["checkOut"] }\n)',
      },
      {
        title: '.superRefine() — report all problems at once',
        body: [
          '`.refine()` stops at the first failure. `.superRefine()` lets you collect ALL issues before failing. The callback receives the value AND a context (`ctx`) with an `addIssue()` method.',
          'Use `.superRefine()` for forms where showing all errors at once is better than one-at-a-time.',
        ],
        code: 'const Signup = z.object({\n  username: z.string(),\n  password: z.string()\n}).superRefine((data, ctx) => {\n  if (data.username.length < 3) {\n    ctx.addIssue({ code: "custom", message: "Username too short", path: ["username"] })\n  }\n  if (data.password.length < 8) {\n    ctx.addIssue({ code: "custom", message: "Password too short", path: ["password"] })\n  }\n  if (data.password.includes(data.username)) {\n    ctx.addIssue({ code: "custom", message: "Password cannot contain username", path: ["password"] })\n  }\n})\n// All three issues reported at once!',
      },
      {
        title: '.transform() — change the output',
        body: [
          '`.transform(fn)` runs AFTER validation passes. It takes the validated value and returns a new value. Common: trimming, lowercasing, parsing dates, converting units.',
          'The transformed type flows through to the parsed result. If you transform `string → Date`, the parsed output is typed as `Date`.',
        ],
        code: '// Parse a date string into a Date object\nconst DateString = z.string().transform((s) => new Date(s))\n\n// Clean and validate an email in one chain\nconst CleanEmail = z.string().trim().toLowerCase().email()\n\nCleanEmail.parse("  MINA@Example.COM  ")  // ✅ "mina@example.com"\n\n// Combine transform with pipe\nconst NumericId = z.string()\n  .transform(Number)\n  .pipe(z.number().int().positive())',
      },
      {
        title: '👎 See it fail: Custom message',
        body: [
          '`z.string().refine(s => s.includes("@"), "Not an email").parse("hello")` — Zod reports "Not an email" exactly as you specified. The error message is YOURS, not a generic Zod message.',
          'Compare: without Zod, you write `if (!email.includes("@")) throw new Error("Not an email")`. Zod integrates it into the same pipeline — one `.parse()` call validates built-in AND custom rules.',
        ],
      },
      {
        title: '💡 .catch() — fallback on failure',
        body: [
          '**`.catch(fallback)`** — if validation fails, return a safe default instead of throwing. `z.number().catch(0)` makes parsing resilient. The callback form `z.string().catch((ctx) => { console.warn(ctx.error); return "fallback" })` lets you inspect what went wrong.',
          '**`.refine(fn, msg)`** — one pass/fail check. Simple, readable.',
          '**`.superRefine(fn)`** — report multiple issues. Best for forms.',
          '**`.transform(fn)`** — change the value after validation. Does NOT validate — use `.pipe()` to re-validate the transformed output.',
          '**`.preprocess(fn)`** — runs BEFORE any validation. Use to clean input that might be in the wrong format entirely.',
        ],
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst Signup = z.object({\n  username: z.string().min(3),\n  password: z.string().refine(\n    (pw) => /[A-Z]/.test(pw) && /[0-9]/.test(pw),\n    "Password needs uppercase + number"\n  )\n})\n\nconsole.log(Signup.safeParse({ username: "mi", password: "hello" }))',
    exercises: [
      {
        kind: 'fix-type',
        question: 'Fix this schema to reject usernames with spaces:',
        brokenCode: 'const Username = z.string().min(3)',
        fixedCode: 'const Username = z.string().min(3).refine(\n  (val) => !val.includes(" "),\n  { message: "No spaces allowed" }\n)',
        errorDescription: 'Usernames with spaces pass validation',
        explanation: '`.refine()` adds a custom check. Return `true` for valid, `false` for invalid. The second argument is the error message.',
      },
      {
        kind: 'choose-best',
        question: 'You need to trim whitespace AND validate an email. Best approach?',
        options: [
          { label: 'A', code: 'z.string().email().trim()', isCorrect: false },
          { label: 'B', code: 'z.string().trim().email()', isCorrect: true },
          { label: 'C', code: 'z.string().refine(s => s.includes("@"))', isCorrect: false },
        ],
        explanation: 'Trim FIRST, then validate. `.trim().email()` removes whitespace before checking email format. Reversed order would validate untrimmed input.',
      },
    ],
  },

  {
    id: 'zod-api-testing',
    order: 6,
    title: 'Zod for API testing',
    block: 'testing',
    summary: 'Validate API responses with Zod in your tests. Catch broken contracts before users do. Works with fetch, Axios, Playwright — any HTTP client.',
    sections: [
      {
        title: 'Mental model: A contract checker',
        body: [
          'An API is a contract: "POST /users returns `{ id: string, name: string }`". When the backend changes the shape, your frontend breaks. Unless you validate the contract.',
          'Zod is the contract checker. After every API call in your tests, parse the response with a Zod schema. If the shape changed, the test fails with a clear message — before any user sees the bug.',
        ],
        code: 'import { z } from \'zod\'\n\n// Define the expected response shape\nconst UserSchema = z.object({\n  id: z.string(),\n  name: z.string(),\n  email: z.string().email(),\n  createdAt: z.string()\n})\n\n// In your test:\nconst res = await fetch("/api/users/1")\nconst data = await res.json()\nconst user = UserSchema.parse(data)  // validates the shape\n\n// If the API returns { id: 1, name: "Mina" } instead of { id: "1", name: "Mina" }\n// ❌ Test fails: Expected string, received number at "id"',
      },
      {
        title: 'Extract the inferred type',
        body: [
          '`z.infer<typeof UserSchema>` gives you the TypeScript type from the Zod schema. No need to write the type twice.',
          'This is the "single source of truth" pattern: the Zod schema IS the type. If you change the schema, the TypeScript type updates automatically.',
        ],
        code: 'import { z } from \'zod\'\n\nconst UserSchema = z.object({\n  id: z.string(),\n  name: z.string(),\n  email: z.string().email()\n})\n\ntype User = z.infer<typeof UserSchema>\n// User = { id: string; name: string; email: string }\n\nasync function getUser(id: string): Promise<User> {\n  const res = await fetch(`/api/users/${id}`)\n  return UserSchema.parse(await res.json())  // validates + typed\n}',
      },
      {
        title: 'Testing arrays and pagination',
        body: [
          'API list endpoints return arrays with metadata. Validate the wrapper AND the items: `z.object({ data: z.array(UserSchema), total: z.number(), page: z.number() })`.',
          'This catches common API bugs: items missing required fields, pagination numbers coming as strings, null instead of empty arrays.',
        ],
        code: 'const ListResponse = z.object({\n  data: z.array(UserSchema),\n  total: z.number(),\n  page: z.number(),\n  pageSize: z.number()\n})\n\nasync function listUsers(page: number) {\n  const res = await fetch(`/api/users?page=${page}`)\n  return ListResponse.parse(await res.json())\n}\n\n// Catches:\n// - "total" returned as "100" (string) instead of 100 (number)\n// - null instead of [] for empty results\n// - Missing "pageSize" field',
      },
      {
        title: '👎 See it fail: Silent API change',
        body: [
          'Backend team renames `userName` to `username` in the API. Without Zod, your code silently gets `undefined` for `user.userName`. Everything "works" but displays empty names.',
          'With Zod, `UserSchema.parse(response)` immediately fails: "Unrecognized key: userName." You know exactly what changed and where to fix it.',
        ],
      },
      {
        title: '💡 Wrap fetch with Zod for type-safe API calls',
        body: [
          'Create a typed fetch wrapper: `async function api<T>(url: string, schema: z.ZodSchema<T>): Promise<T>`. Every API call parses through Zod. One utility, every endpoint validated.',
        ],
        code: 'import { z } from \'zod\'\n\nasync function api<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {\n  const res = await fetch(url)\n  if (!res.ok) throw new Error(`HTTP ${res.status}`)\n  return schema.parse(await res.json())\n}\n\n// Usage — one line, fully validated\nconst user = await api("/users/1", UserSchema)',
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst PostSchema = z.object({\n  id: z.number(),\n  title: z.string(),\n  body: z.string()\n})\n\n// Simulate an API call\nasync function getPost(id: number) {\n  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)\n  return PostSchema.parse(await res.json())\n}\n\ngetPost(1).then(console.log).catch(console.error)',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What does z.infer<typeof UserSchema> give you?',
        code: 'const UserSchema = z.object({ id: z.string(), name: z.string() })\ntype User = z.infer<typeof UserSchema>',
        answer: 'User = { id: string; name: string } — the TypeScript type extracted from the Zod schema.',
        explanation: '`z.infer` reads the Zod schema and produces the matching TypeScript type. No need to write interfaces separately.',
      },
      {
        kind: 'model-it',
        question: 'Write a Zod schema for a paginated API response:',
        data: '{\n  "items": [{ "id": 1, "title": "Hello" }],\n  "total": 42,\n  "hasMore": true\n}',
        interface: 'const Response = z.object({\n  items: z.array(z.object({ id: z.number(), title: z.string() })),\n  total: z.number(),\n  hasMore: z.boolean()\n})',
        explanation: 'Nest `z.array(z.object({...}))` for the items. Each field validated: total is number (not string "42"), hasMore is boolean.',
      },
    ],
  },

  {
    id: 'zod-playwright',
    order: 7,
    title: 'Zod with Playwright',
    block: 'testing',
    summary: 'Validate page data, API responses, and test fixtures with Zod in Playwright tests. Catch broken contracts at every layer — UI, API, and test data.',
    sections: [
      {
        title: 'Mental model: Testing every layer',
        body: [
          'Playwright tests interact with a real browser. Your app fetches data from an API, renders it to the DOM, and the user sees HTML. Three layers: API → app state → DOM.',
          'Zod can validate ALL three: the API response shape, the data passed to components, and even the text extracted from the page. Each layer gets a schema.',
        ],
        code: 'import { test, expect } from \'@playwright/test\'\nimport { z } from \'zod\'\n\n// Schema for the API response we expect\nconst UserSchema = z.object({\n  id: z.number(),\n  name: z.string(),\n  email: z.string().email()\n})\n\ntest("user page loads correctly", async ({ page }) => {\n  await page.goto("/users/1")\n\n  // Validate the DOM\n  const name = await page.textContent("[data-testid=user-name]")\n  expect(name).toBeTruthy()\n\n  // Validate the API (intercept the network request)\n  const response = await page.waitForResponse("**/api/users/1")\n  const user = UserSchema.parse(await response.json())\n  expect(user.name).toBe("Mina")\n})',
      },
      {
        title: 'Validating page.extract() with Zod',
        body: [
          'Playwright can extract structured data from a page: `page.$$eval()` or `locator.evaluateAll()`. But the extracted data is `any` — no type safety.',
          'Wrap extractions with Zod: define the expected shape, parse the result. If the page structure changed, the test fails with a schema error instead of an obscure `undefined` assertion.',
        ],
        code: 'import { test } from \'@playwright/test\'\nimport { z } from \'zod\'\n\nconst ProductCardSchema = z.object({\n  title: z.string().min(1),\n  price: z.string().regex(/^\\$\\d+\\.\\d{2}$/),  // "$19.99"\n  inStock: z.boolean()\n})\n\ntest("product list has valid cards", async ({ page }) => {\n  await page.goto("/products")\n\n  const cards = await page.$$eval("[data-testid=product-card]", (els) =>\n    els.map((el) => ({\n      title: el.querySelector(".title")?.textContent ?? "",\n      price: el.querySelector(".price")?.textContent ?? "",\n      inStock: !el.classList.contains("out-of-stock")\n    }))\n  )\n\n  // Validate every card matches the schema\n  for (const card of cards) {\n    ProductCardSchema.parse(card)\n  }\n})',
      },
      {
        title: 'Test fixture validation',
        body: [
          'Playwright fixtures are `any` by default. Create typed fixtures by wrapping them with Zod: `const user = UserSchema.parse(await createTestUser(page))`.',
          'This catches fixture bugs early — if the test user creation returns the wrong shape, the fixture itself fails, not the test assertion.',
        ],
        code: 'import { test as base } from \'@playwright/test\'\nimport { z } from \'zod\'\n\nconst UserSchema = z.object({\n  id: z.string(),\n  email: z.string().email(),\n  name: z.string()\n})\n\n// Typed fixture\ntype User = z.infer<typeof UserSchema>\n\nconst test = base.extend<{ testUser: User }>({\n  testUser: async ({ page }, use) => {\n    await page.goto("/signup")\n    await page.fill("[name=email]", "test@example.com")\n    await page.click("[type=submit]")\n    await page.waitForURL("/dashboard")\n\n    const userData = await page.evaluate(() =>\n      JSON.parse(localStorage.getItem("user") ?? "{}")\n    )\n    // ✅ Fixture validates the runtime shape\n    use(UserSchema.parse(userData))\n  }\n})',
      },
      {
        title: 'Validating dynamic arrays from API responses',
        body: [
          'Most APIs return **arrays of items** — products, users, orders. Each item has a known shape, but the actual values (IDs, names, prices) change every time you run the test.',
          'The pattern: define the schema for ONE item, then wrap it in `z.array()`. Parse the full response array — Zod validates every single element. If ANY item in a list of 500 products has a missing field or wrong type, the parse fails with the exact index and field.',
          'For dynamic fields (IDs you cannot predict), validate the TYPE, not the value: `z.string()` not `z.literal("prod_123")`. For optional fields that change between runs, use `.optional()` or `.passthrough()`.',
        ],
        code: 'import { test, expect } from \'@playwright/test\'\nimport { z } from \'zod\'\n\n// Schema for ONE product — validate TYPE, not exact values\nconst ProductSchema = z.object({\n  id: z.string(),                   // any string ID is fine\n  name: z.string().min(1),          // must have a name\n  price: z.number().positive(),     // any positive number\n  inStock: z.boolean(),\n  category: z.string(),\n  tags: z.array(z.string()),        // array of strings\n  image: z.string().url().nullable() // url OR null\n})\n\n// The full API response shape\nconst ProductsResponse = z.object({\n  data: z.array(ProductSchema),     // ← validates EVERY product\n  total: z.number(),\n  page: z.number()\n})\n\ntest("products API returns valid data", async ({ page }) => {\n  // Intercept the API call\n  const responsePromise = page.waitForResponse(\n    (res) => res.url().includes("/api/products") && res.status() === 200\n  )\n\n  await page.goto("/products")\n\n  // Validate the response\n  const response = await responsePromise\n  const json = await response.json()\n  const parsed = ProductsResponse.parse(json)\n\n  // Now parsed.data is typed as Product[] — use it in assertions\n  expect(parsed.data.length).toBeGreaterThan(0)\n  expect(parsed.total).toBeGreaterThanOrEqual(parsed.data.length)\n\n  // Optional: make additional assertions on the validated data\n  const inStockProducts = parsed.data.filter((p) => p.inStock)\n  expect(inStockProducts.length).toBeGreaterThan(0)\n\n  // All prices should be numbers (Zod already guaranteed this)\n  for (const product of parsed.data) {\n    expect(typeof product.price).toBe("number")\n  }\n})',
      },
      {
        title: '👎 See it fail: DOM change breaks extraction',
        body: [
          'Frontend changes `.product-name` to `.product-title`. Your Playwright extraction returns empty strings for all titles. Tests pass (empty strings are falsy but not caught) — silently broken.',
          'With Zod schema requiring `.min(1)`, the test FAILS: "String must contain at least 1 character at title." You know immediately that the extraction selector is stale.',
        ],
      },
      {
        title: '💡 .passthrough() for partial validation',
        body: [
          'Do not validate every DOM field every time — it makes tests brittle. Use `.passthrough()` to validate only the fields you care about while ignoring the rest.',
          '`ProductCardSchema.passthrough().parse(card)` — validates title, price, inStock. Any extra fields extracted from the DOM pass through silently. Focused and maintainable.',
        ],
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\n// Schema for data extracted from the page\nconst ArticleSchema = z.object({\n  title: z.string().min(1),\n  author: z.string(),\n  wordCount: z.number().positive()\n})\n\n// Simulate extracted page data\nconst extracted = {\n  title: "TypeScript Tips",\n  author: "Mina",\n  wordCount: 850\n}\n\nconsole.log(ArticleSchema.parse(extracted))',
    exercises: [
      {
        kind: 'fill-blank',
        question: 'Fill in the blanks to validate extracted page data:',
        code: 'const CardSchema = z.______({\n  title: z.string().______(1),\n  price: z.string().regex(/^\\\\$\\\\d+\\\\.\\\\d{2}$/)\n})\n\nconst cards = await page.$$______("[data-testid=card]", (els) =>\n  els.map(el => ({\n    title: el.querySelector(".title")?.______ ?? ""\n  }))\n)\n\nCardSchema.______(cards[0])',
        blanks: [
          { label: 'object', answer: 'object' },
          { label: 'min', answer: 'min' },
          { label: 'eval', answer: 'eval' },
          { label: 'text', answer: 'textContent' },
          { label: 'parse', answer: 'parse' },
        ],
        explanation: '`z.object({...})` defines the shape. `.$$eval` extracts page data. `.parse()` validates it against the schema.',
      },
      {
        kind: 'choose-best',
        question: 'You are extracting product cards from a page. The schema should validate title and price but ignore other fields. Which approach?',
        options: [
          { label: 'A', code: 'CardSchema.parse(card)', isCorrect: false },
          { label: 'B', code: 'CardSchema.passthrough().parse(card)', isCorrect: true },
          { label: 'C', code: 'CardSchema.strict().parse(card)', isCorrect: false },
        ],
        explanation: '`.passthrough()` validates known fields and keeps unknown ones. `.strict()` would reject unknown fields (too brittle). Default strips them.',
      },
      {
        kind: 'model-it',
        question: 'Write a Zod schema for a product list API response. The response has a `data` array of products (each with id, name, price, and optional `discount`), plus a `total` count:',
        data: '{\n  "data": [\n    { "id": "p1", "name": "Widget", "price": 9.99 },\n    { "id": "p2", "name": "Gadget", "price": 24.99, "discount": 5 }\n  ],\n  "total": 42\n}',
        interface: 'const ProductSchema = z.object({\n  id: z.string(),\n  name: z.string().min(1),\n  price: z.number().positive(),\n  discount: z.number().optional()\n})\n\nconst ProductsResponse = z.object({\n  data: z.array(ProductSchema),\n  total: z.number()\n})',
        explanation: 'Define the schema for ONE product first, then wrap with `z.array()`. The `discount` field is optional — some products have it, some do not. `z.array(ProductSchema)` validates EVERY element in the array.',
      },
    ],
  },

  {
    id: 'zod-patterns',
    order: 8,
    title: 'Real-world Zod patterns',
    block: 'testing',
    summary: 'Environment variables, config files, form validation, branded types. Practical patterns that appear in every production codebase.',
    sections: [
      {
        title: 'Mental model: Defense in layers',
        body: [
          'A production app has data entering from many places: CLI arguments, `.env` files, JSON configs, form inputs, WebSocket messages, localStorage.',
          'Each entry point is a boundary. Each boundary needs a Zod schema. Once validated, your app code trusts the types. No scattered `if` checks — the schemas are the single source of truth.',
        ],
        code: 'import { z } from \'zod\'\n\n// Environment variables\nconst Env = z.object({\n  PORT: z.coerce.number().default(3000),\n  DATABASE_URL: z.string().url(),\n  NODE_ENV: z.enum(["development", "production", "test"]).default("development")\n})\n\nexport const env = Env.parse(process.env)\n// env.PORT is number, env.DATABASE_URL is string, env.NODE_ENV is union',
      },
      {
        title: 'Config file validation',
        body: [
          'JSON config files have no type checking. A typo like `"port": "3000"` (string) instead of `"port": 3000` (number) silently causes bugs.',
          'Parse your config with Zod at startup. If the config is invalid, the app fails fast with a clear message — rather than crashing mysteriously 20 minutes later.',
        ],
        code: 'import { z } from \'zod\'\nimport config from \'./config.json\' with { type: "json" }\n\nconst Config = z.object({\n  server: z.object({\n    port: z.number().min(1024).max(65535),\n    host: z.string().min(1)\n  }),\n  features: z.object({\n    darkMode: z.boolean().default(false),\n    betaFeatures: z.array(z.string()).default([])\n  })\n})\n\nexport const appConfig = Config.parse(config)\n// If config.json has port: "3000" → fails immediately with clear error',
      },
      {
        title: 'Branded types for domain values',
        body: [
          'A `string` is any string. But a `UserId` should only be a string that passes specific validation. Branded types attach a "brand" to a type so TypeScript distinguishes `UserId` from plain `string`.',
          '`z.string().brand<"UserId">()` creates a `UserId` type. You cannot accidentally pass a plain string where a UserId is expected — TypeScript catches it.',
        ],
        code: 'import { z } from \'zod\'\n\nconst UserId = z.string().uuid().brand<"UserId">()\ntype UserId = z.infer<typeof UserId>\n\nconst Email = z.string().email().brand<"Email">()\ntype Email = z.infer<typeof Email>\n\nfunction sendEmail(to: Email, from: Email, subject: string) { /* ... */ }\n\nconst userId = UserId.parse("550e8400-e29b-41d4-a716-446655440000")\nsendEmail(userId, "from@test.com", "Hi")  // ❌ TypeScript error: UserId is not Email',
      },
      {
        title: '👎 See it fail: Config typo',
        body: [
          '`config.json` has `"retryCount": "3"` (string). Code does `config.retryCount + 1` → `"31"`. No crash, wrong behavior. Hours of debugging.',
          'With Zod: `z.number().parse(config.retryCount)` → immediate error at startup. "Expected number, received string at retryCount." Fixed in 10 seconds.',
        ],
      },
      {
        title: '💡 Schema as the source of truth',
        body: [
          'Put your Zod schemas in a shared file (`schemas.ts`). Export both the schema AND the inferred type. Every file that touches that data imports from schemas.ts.',
          'One schema file → one source of truth → auto-updating types → validated at boundaries. This pattern alone eliminates an entire class of runtime bugs.',
        ],
        code: '// schemas.ts — the single source of truth\nexport const UserSchema = z.object({\n  id: z.string().uuid(),\n  email: z.string().email(),\n  createdAt: z.coerce.date()\n})\nexport type User = z.infer<typeof UserSchema>\n\n// Everywhere else:\nimport { UserSchema, type User } from "./schemas"\n// Schema for validation, Type for TypeScript — always in sync.',
      },
    ],
    starterCode: 'import { z } from \'zod\'\n\nconst Env = z.object({\n  PORT: z.coerce.number().default(3000),\n  HOST: z.string().default("localhost"),\n  DEBUG: z.coerce.boolean().default(false)\n})\n\n// Simulate process.env\nconst fakeEnv = { PORT: "3000", HOST: "0.0.0.0", DEBUG: "true" }\nconsole.log(Env.parse(fakeEnv))',
    exercises: [
      {
        kind: 'model-it',
        question: 'Write a Zod schema for app config with server, database, and feature flags:',
        data: '{\n  "server": { "port": 8080, "host": "0.0.0.0" },\n  "database": { "url": "postgres://...", "poolSize": 10 },\n  "features": { "signup": true, "beta": false }\n}',
        interface: 'const Config = z.object({\n  server: z.object({ port: z.number(), host: z.string() }),\n  database: z.object({ url: z.string().url(), poolSize: z.number().min(1) }),\n  features: z.object({ signup: z.boolean(), beta: z.boolean() })\n})',
        explanation: 'Nested `z.object()` for each section. `poolSize` needs `.min(1)`. Database URL uses `.url()`. Parse at startup for immediate config validation.',
      },
      {
        kind: 'fix-type',
        question: 'There is a typo in config. The port is a string. Fix the schema to coerce it:',
        brokenCode: 'const Config = z.object({ port: z.number() })',
        fixedCode: 'const Config = z.object({ port: z.coerce.number() })',
        errorDescription: 'Port "3000" is a string in config, but schema expects number',
        explanation: '`z.coerce.number()` converts string "3000" to number 3000 before validation. Safer for config files where numbers might be quoted.',
      },
    ],
  },
]
