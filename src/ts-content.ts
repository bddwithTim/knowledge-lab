export type TKyu = '8 kyu' | '7 kyu' | '6 kyu' | '5 kyu'

export type TSExercise =
  | { kind: 'convert-js-ts'; question: string; jsCode: string; tsCode: string; explanation: string }
  | { kind: 'fix-type'; question: string; brokenCode: string; fixedCode: string; errorDescription: string; explanation: string }
  | { kind: 'predict-type'; question: string; code: string; answer: string; explanation: string }
  | { kind: 'model-it'; question: string; data: string; interface: string; explanation: string }
  | { kind: 'fill-blank'; question: string; code: string; blanks: { label: string; answer: string }[]; explanation: string }
  | { kind: 'choose-best'; question: string; options: { label: string; code: string; isCorrect: boolean }[]; explanation: string }

export type TSLesson = {
  id: string
  order: number
  title: string
  block: string
  summary: string
  sections: { title: string; body: string[]; code?: string; table?: { head: string[]; rows: string[][] } }[]
  starterCode: string
  exercises: TSExercise[]
}

export const tsLessons: TSLesson[] = [
  /* ── Block 1: Foundations (lessons 1-5) ────────── */
  {
    id: 'ts-primitives',
    order: 1,
    title: 'What are types?',
    block: 'foundations',
    summary: 'Every value in JavaScript already has a type — string, number, boolean. TypeScript just checks those types before your code runs, catching mistakes early.',
    sections: [
      {
        title: 'Mental model: Types are already there',
        body: [
          'Imagine you have three boxes. One has a word written on a card (`"Mina"`), one has a number (`42`), and one has a yes/no switch (`true`). These are different KINDS of things. A word, a number, and a switch.',
          'JavaScript already knows these are different. Try calling `.toFixed(2)` on the word `"hello"` and JavaScript throws an error — because `.toFixed` only makes sense for numbers, not words.',
          '**TypeScript just checks this BEFORE your code runs.** Instead of finding out at runtime that you tried to round a word, TypeScript tells you while you are still typing. It is like a spell-checker for your program logic.',
        ],
        code: '// JavaScript lets this crash at runtime\nconst price = "19.99"\nconsole.log(price.toFixed(2))\n// 💥 TypeError: price.toFixed is not a function\n\n// TypeScript catches it while you type\nconst price: number = "19.99"\n// ❌ Type \'string\' is not assignable to type \'number\'',
      },
      {
        title: 'The three basic types',
        body: [
          '**`string`** — text. Anything in quotes: `"hello"`, `\'Mina\'`, `` `template` ``.',
          '**`number`** — a number. `42`, `3.14`, `-7`. No separate int/float — it is all just `number`.',
          '**`boolean`** — true or false. Only two possible values: `true` and `false`.',
          'These are called **primitive types**. They are the building blocks everything else is made from.',
        ],
        code: 'const playerName = "Mina"   // this is a string\nconst score = 100           // this is a number\nconst isLoggedIn = true     // this is a boolean',
      },
      {
        title: '👎 See it fail',
        body: [
          'JavaScript silently does weird things when you mix types. `"5" + 2` gives you `"52"` (a string!) because JavaScript converts the number to a string and glues them together.',
          'TypeScript catches these mix-ups. If you try to add a `string` and a `number` where it does not make sense, TypeScript warns you before anything runs.',
        ],
        code: '// JavaScript — confusing, no warning\n"5" + 2        // "52" — probably not what you wanted\n"5" - 2        // 3 — wait, that IS what you wanted? Confusing!\n\n// TypeScript — caught early\nconst a: number = "5"  // ❌ string is not a number\nconst b: number = "5" + 2  // ❌ type mismatch',
      },
      {
        title: '💡 When to care about types',
        body: [
          '**Always.** Types are not an extra feature you opt into — they describe what your code actually does. Every time you write a function, you are making assumptions about what kind of data comes in.',
          'TypeScript makes those assumptions visible. Instead of guessing "this should be a number," you write `: number` and the computer verifies it for you.',
        ],
      },
    ],
    starterCode: '// Try changing these values.\n// What happens if you swap the types?\nconst playerName = "Mina"\nconst score = 100\nconst isActive = true\n\nconsole.log(playerName, score, isActive)',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What type does TypeScript infer for `total`?',
        code: 'const total = 42',
        answer: 'number — TypeScript sees `42` and knows it is a number',
        explanation: 'TypeScript looks at the value `42` and infers `number`. You do not need to write `: number` — these are just the basic building blocks that everything else is made of.',
      },
      {
        kind: 'choose-best',
        question: 'Which of these will crash at runtime?',
        options: [
          { label: 'A', code: 'console.log("hello".length)', isCorrect: false },
          { label: 'B', code: 'console.log("hello".toFixed(2))', isCorrect: true },
          { label: 'C', code: 'console.log(42.toString())', isCorrect: false },
        ],
        explanation: '`.toFixed(2)` is a number method — it rounds a number to 2 decimal places. Calling it on a string `"hello"` crashes because strings do not have a `toFixed` method. TypeScript catches this mistake before you even run the code.',
      },
    ],
  },
  {
    id: 'ts-annotations',
    order: 2,
    title: 'Type annotations',
    block: 'foundations',
    summary: 'Learn the colon syntax for telling TypeScript exactly what type you expect. Use annotations where types are not obvious — especially function parameters.',
    sections: [
      {
        title: 'Mental model: The colon is a label',
        body: [
          'Think of a variable as a box. You can put things in the box, and later take them out. A **type annotation** is a label you stick on the box that says what is allowed inside.',
          '`const score: number = 0` — the `: number` is the label. It says: "This box only holds numbers." If you try to put a `string` in there, TypeScript stops you.',
          'The pattern is always `name: type`. You can label variables, function parameters, and function return values.',
        ],
        code: '// Annotating variables\nconst playerName: string = "Mina"\nconst score: number = 0\nconst isActive: boolean = true\n\n// Annotating a function\nfunction greet(name: string): string {\n  return `Hello, ${name}`\n}',
      },
      {
        title: '👎 See it fail',
        body: [
          'Type annotations catch mismatches. If you label a box `number` but put a `string` inside, TypeScript immediately tells you.',
        ],
        code: 'const price: number = "19.99"\n// ❌ Type \'string\' is not assignable to type \'number\'\n\nlet score: number = 0\nscore = "ten"\n// ❌ Type \'string\' is not assignable to type \'number\'',
      },
      {
        title: '💡 When to annotate vs when to skip',
        body: [
          '**Annotate when it is not obvious.** Function parameters always get annotations — TypeScript cannot guess what type a caller will pass. Return types on functions that other code depends on should also be annotated.',
          '**Skip when it IS obvious.** `const name = "Mina"` — TypeScript can see it is a string. Adding `: string` here is just noise. Let TypeScript use **inference** (next lesson) in these cases.',
        ],
      },
    ],
    starterCode: '// Add type annotations to fix this code\nconst playerName = "Mina"\nlet score = 0\n\n// Try changing the values to the wrong type.\n// What error does TypeScript show?\n\nconsole.log(playerName, score)',
    exercises: [
      {
        kind: 'fix-type',
        question: 'This code has a type mismatch. Fix the annotation or the value.',
        brokenCode: 'const age: number = "twenty-five"',
        fixedCode: 'const age: number = 25',
        errorDescription: "Type 'string' is not assignable to type 'number'",
        explanation: 'The label says `number` but the value is a `string`. Either change the label to `string` or change the value to a number like `25`.',
      },
      {
        kind: 'choose-best',
        question: 'Which version would you normally write? (Think: is the annotation helpful here?)',
        options: [
          { label: 'A', code: 'const name: string = "Mina"', isCorrect: false },
          { label: 'B', code: 'const name = "Mina"', isCorrect: true },
        ],
        explanation: 'TypeScript can see `"Mina"` is a string — the annotation is redundant. Reserve annotations for places where the type is NOT obvious, like function parameters or uninitialized variables.',
      },
    ],
  },
  {
    id: 'ts-inference',
    order: 3,
    title: 'Type inference',
    block: 'foundations',
    summary: 'TypeScript is smart enough to figure out most types on its own. Learn when to let it, and when to step in with an explicit annotation.',
    sections: [
      {
        title: 'Mental model: A helpful assistant',
        body: [
          'TypeScript watches what you do and learns from it. When you write `const name = "Mina"`, it sees the quotes and thinks: "That is a `string`." When you write `const items = [1, 2, 3]`, it sees the numbers and thinks: "That is `number[]`."',
          'This is called **type inference**. TypeScript infers (figures out) the type from the value you assign. You do not need to label everything — TypeScript is paying attention.',
        ],
        code: '// Inference in action — no annotations needed\nconst name = "Mina"            // inferred as string\nconst score = 42               // inferred as number\nconst items = [1, 2, 3]       // inferred as number[]\nconst user = { name: "Mina", age: 28 }\n// inferred as { name: string; age: number }',
      },
      {
        title: '👎 See it fail — when inference cannot help',
        body: [
          'Inference only works when TypeScript has something to look at. If you declare a variable without a value, or write a function parameter, there is nothing to infer from.',
        ],
        code: 'let score             // inferred as any — TypeScript has no clue!\nscore = 100            // fine\nscore = "hello"        // also fine — any accepts anything\n\n// Better: annotate when there is no initial value\nlet score: number      // TypeScript now knows\nscore = 100            // ✓\n// score = "hello"     // ❌ would be an error',
      },
      {
        title: '💡 The golden rule',
        body: [
          '**Annotate function parameters and public return types. Let inference handle everything else.**',
          'Function parameters are the boundary between your code and the outside world — TypeScript cannot guess what callers will pass. Variables inside your code, though? TypeScript can see exactly what you assign to them.',
        ],
        code: '// Annotate the boundaries\nfunction add(a: number, b: number): number {\n  return a + b\n}\n\n// Let inference handle the inside\nconst result = add(3, 4)  // TypeScript knows result is number\nconst doubled = result * 2  // still number',
      },
    ],
    starterCode: '// TypeScript infers all of these.\n// Try hovering over each variable to see its type.\nconst name = "Mina"\nconst items = [1, 2, 3]\nconst doubled = items.map((n) => n * 2)\n\nconsole.log(name, doubled)',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What type does TypeScript infer for `result`?',
        code: 'const result = [1, 2, 3].map((n) => n * 2)',
        answer: 'number[] — map multiplies each number by 2, the result is still an array of numbers',
        explanation: 'TypeScript sees `[1, 2, 3]` (a `number[]`), then `.map()` with a callback that returns `n * 2` (a `number`). It infers the result is `number[]`.',
      },
      {
        kind: 'choose-best',
        question: 'You need a variable that starts empty but will later hold a number. Which is better?',
        options: [
          { label: 'A', code: 'let score', isCorrect: false },
          { label: 'B', code: 'let score: number', isCorrect: true },
        ],
        explanation: 'Without an annotation, `let score` infers `any` — TypeScript has nothing to go on. Adding `: number` tells TypeScript what to expect, catching mistakes if you accidentally assign a string later.',
      },
    ],
  },
  {
    id: 'ts-arrays',
    order: 4,
    title: 'Arrays',
    block: 'foundations',
    summary: 'Annotate arrays with the element type in square brackets. Mixed arrays need a union type. Understand when inference handles it for you.',
    sections: [
      {
        title: 'Mental model: What is inside the list?',
        body: [
          'An array is a list of things. When you declare an array, TypeScript wants to know: "What kind of things are in this list?"',
          '`string[]` means "an array where every item is a `string`." `number[]` means "every item is a `number`." The brackets `[]` after the type mean "array of."',
          'TypeScript will stop you from putting the wrong kind of item in. If you have a `string[]` and try to push a `number`, it flags the mistake.',
        ],
        code: 'const names: string[] = ["Alice", "Bob", "Carol"]\nconst scores: number[] = [95, 87, 91]\n\n// TypeScript infers arrays when the elements are obvious\nconst items = [1, 2, 3]     // inferred as number[]\nconst words = ["a", "b"]    // inferred as string[]',
      },
      {
        title: '👎 See it fail — wrong element type',
        body: [
          'If you label an array as `string[]`, every element must be a string. TypeScript catches the violation immediately.',
        ],
        code: 'const names: string[] = ["Alice", "Bob"]\nnames.push(42)\n// ❌ Argument of type \'number\' is not assignable to parameter of type \'string\'',
      },
      {
        title: 'Mixed arrays',
        body: [
          'What if your array really does contain strings AND numbers? Use a **union type**: `(string | number)[]`. The `|` means "or" — each element can be a string OR a number.',
          'But be careful: if you later try to use a string-only method on an element, TypeScript will make you narrow it first (we cover narrowing in a later lesson).',
        ],
        code: 'const mixed: (string | number)[] = ["Alice", 42, "Bob", 99]\n// ✓ all elements are either string or number\n\n// ⚠️ Cannot use string methods without checking first\nelement.toUpperCase()\n// ❌ Property does not exist on type \'string | number\'',
      },
    ],
    starterCode: '// Try adding a number to this string array.\n// What error do you get?\nconst colors: string[] = ["red", "green", "blue"]\ncolors.push("yellow")  // this works\n// colors.push(42)     // ❌ uncomment to see the error\n\nconsole.log(colors)',
    exercises: [
      {
        kind: 'fix-type',
        question: 'This array is supposed to hold both names and scores. Fix the type annotation.',
        brokenCode: "const data: string[] = ['Alice', 95, 'Bob', 87]",
        fixedCode: "const data: (string | number)[] = ['Alice', 95, 'Bob', 87]",
        errorDescription: "Type 'number' is not assignable to type 'string'",
        explanation: '`string[]` means every element must be a string. For mixed types, use `(string | number)[]` — the `|` means "or."',
      },
      {
        kind: 'choose-best',
        question: 'You have a list of product prices. Which type should you use?',
        options: [
          { label: 'A', code: 'const prices: any[] = [9.99, 19.99]', isCorrect: false },
          { label: 'B', code: 'const prices: number[] = [9.99, 19.99]', isCorrect: true },
          { label: 'C', code: 'const prices = [9.99, 19.99]', isCorrect: false },
        ],
        explanation: 'B and C are both valid, but B makes the intent explicit — especially if the array starts empty. `any[]` disables type checking entirely, which defeats the purpose of TypeScript.',
      },
    ],
  },
  {
    id: 'ts-tuples',
    order: 5,
    title: 'Tuples',
    block: 'foundations',
    summary: 'A tuple is an array with a fixed length where each position has a specific type. Unlike regular arrays, the order matters and the length is locked.',
    sections: [
      {
        title: 'Mental model: A recipe, not a grocery list',
        body: [
          'A regular array is like a grocery list — you can have any number of items, all the same kind. A **tuple** is like a recipe — exactly 2 eggs, then 1 cup of flour. The position and the count are part of the deal.',
          '`[string, number]` means: "Position 0 is always a `string`, position 1 is always a `number`. Exactly 2 items, in that order."',
        ],
        code: '// A tuple — fixed length, typed per position\nconst entry: [string, number] = ["Alice", 95]\n\n// entry[0] is string ✓\n// entry[1] is number ✓\n// entry[2] — ❌ does not exist!',
      },
      {
        title: "👎 Don't confuse tuples with mixed arrays",
        body: [
          'A mixed array `(string | number)[]` can have ANY number of items, in ANY order. `["a", 1, "b", 2, "c"]` is fine.',
          'A tuple `[string, number]` has EXACTLY 2 items. Position 0 must be `string`, position 1 must be `number`. Wrong order? Wrong length? TypeScript catches it.',
        ],
        code: '// Mixed array — any length, any order\nconst mixed: (string | number)[] = ["a", 1, "b", 2, "c"]  // ✓\n\n// Tuple — exactly 2 items, fixed order\nconst pair: [string, number] = ["Alice", 95]  // ✓\n// const pair: [string, number] = [95, "Alice"]  // ❌ wrong order\n// const pair: [string, number] = ["Alice"]      // ❌ missing item\n// const pair: [string, number] = ["A", 1, "B"]  // ❌ too many items',
      },
      {
        title: '💡 When to use tuples',
        body: [
          '**Use tuples when the position carries meaning.** Common examples: coordinates `[number, number]`, name-and-score pairs `[string, number]`, or React\'s `useState` return `[value, setter]`.',
          '**Use regular arrays** when you have a variable-length list of the same kind of thing. Most of the time, you want arrays — tuples are for specific, fixed-shape data.',
        ],
      },
    ],
    starterCode: '// A tuple holds exactly two items:\n// first a name (string), then a score (number)\nconst entry: [string, number] = ["Mina", 100]\n\nconsole.log(entry[0].toUpperCase())  // MINA\nconsole.log(entry[1].toFixed(2))     // 100.00\n\n// Try changing the order or removing an item.\n// What error does TypeScript show?',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What is the type of `pair` without any annotation? (Think: inference)',
        code: 'const pair = ["Alice", 95]',
        answer: '(string | number)[] — TypeScript infers a regular array, not a tuple',
        explanation: 'Without an explicit tuple annotation, TypeScript infers the most general type: a mixed array. To get a tuple, you must write `: [string, number]` or use `as const`.',
      },
      {
        kind: 'choose-best',
        question: 'You need to store an (x, y) coordinate. Which type is best?',
        options: [
          { label: 'A', code: 'const point: number[] = [10, 20]', isCorrect: false },
          { label: 'B', code: 'const point: [number, number] = [10, 20]', isCorrect: true },
          { label: 'C', code: 'const point = [10, 20]', isCorrect: false },
        ],
        explanation: 'A tuple `[number, number]` locks the length to exactly 2. A regular `number[]` would allow `[10, 20, 30]` or `[10]` — neither makes sense for a coordinate. The tuple prevents mistakes.',
      },
    ],
  },

  /* ── Block 2: Objects & Unions (lessons 6-9) ───── */
  {
    id: 'ts-objects-interfaces',
    order: 6,
    title: 'Objects & interfaces',
    block: 'foundations',
    summary: 'Describe the shape of objects with interfaces. Learn when to use interfaces vs type aliases, optional properties, and readonly.',
    sections: [
      {
        title: 'Mental model: A form you fill out',
        body: [
          'An object is like a form — it has fields with specific kinds of information. `{ name: "Mina", score: 42 }` has a name field (text) and a score field (number).',
          'An **interface** is the blank version of that form. It describes what fields exist, what type each field is, and which ones are required vs optional. TypeScript checks every object against its interface — missing a required field? Caught. Wrong type? Caught.',
        ],
        code: 'interface Player {\n  name: string\n  score: number\n  email?: string     // the ? means optional\n}\n\nconst player: Player = {\n  name: "Mina",\n  score: 42,\n  // email is optional — can omit it\n}',
      },
      {
        title: '👎 See it fail — missing or wrong fields',
        body: [
          'TypeScript checks every property against the interface. Missing a required field or using the wrong type — both caught at compile time.',
        ],
        code: 'interface Player {\n  name: string\n  score: number\n}\n\nconst p1: Player = { name: "Mina" }\n// ❌ Property \'score\' is missing\n\nconst p2: Player = { name: "Mina", score: "high" }\n// ❌ Type \'string\' is not assignable to type \'number\'',
      },
      {
        title: '💡 Interface vs type',
        body: [
          '**Use `interface` for object shapes** — especially ones that might be extended later. Interfaces are open (you can add to them by declaring the same interface again).',
          '**Use `type` for everything else** — unions, intersections, primitives aliases. `type` is more flexible but cannot be reopened.',
        ],
        code: '// Interface — best for object shapes\ninterface User { name: string }\n\n// Type — can hold unions, tuples, etc.\ntype Status = "active" | "inactive"',
      },
    ],
    starterCode: 'interface Player {\n  name: string\n  score: number\n}\n\nconst player: Player = { name: "Mina", score: 42 }\n// Try removing \'score\' from the object.\n// What error do you get?\n\nconsole.log(player.name)',
    exercises: [
      {
        kind: 'fix-type',
        question: 'Fix the missing required property.',
        brokenCode: 'interface Config { url: string; timeout: number }\nconst cfg: Config = { url: "https://api.example.com" }',
        fixedCode: 'interface Config { url: string; timeout: number }\nconst cfg: Config = { url: "https://api.example.com", timeout: 5000 }',
        errorDescription: "Property 'timeout' is missing in type",
        explanation: 'The `Config` interface requires both `url` and `timeout`. Either add `timeout` or mark it as optional with `timeout?: number`.',
      },
      {
        kind: 'choose-best',
        question: 'You need to represent a user that might not have an email. Which is best?',
        options: [
          { label: 'A', code: 'interface User { name: string; email: string }', isCorrect: false },
          { label: 'B', code: 'interface User { name: string; email?: string }', isCorrect: true },
          { label: 'C', code: 'interface User { name: string; email: string | null }', isCorrect: false },
        ],
        explanation: '`email?` makes the property optional — you can omit it entirely. `email: string | null` requires you to ALWAYS provide the property, even if the value is `null`. Optional is cleaner for "might not exist."',
      },
    ],
  },
  {
    id: 'ts-unions-intersections',
    order: 7,
    title: 'Union & intersection types',
    block: 'foundations',
    summary: 'Combine types with | (this OR that) and & (this AND that). Narrow unions with type guards before accessing properties.',
    sections: [
      {
        title: 'Mental model: This door OR that door',
        body: [
          'A **union type** (`|`) means a value can be one of several types. `string | number` means "this could be a string OR a number." Before you call any method, you need to figure out which one it actually is.',
          'An **intersection type** (`&`) means a value must satisfy ALL of several types. `A & B` means "this has all properties of A AND all properties of B."',
        ],
        code: '// Union — this OR that\nfunction printId(id: string | number) {\n  if (typeof id === "string") {\n    console.log(id.toUpperCase())  // narrowed to string\n  } else {\n    console.log(id.toFixed(2))     // narrowed to number\n  }\n}\n\n// Intersection — this AND that\ntype Named = { name: string }\ntype Scored = { score: number }\ntype Player = Named & Scored\n// Player has both name AND score',
      },
      {
        title: '👎 See it fail — using a method before narrowing',
        body: [
          'You cannot call `.toUpperCase()` on `string | number` because `number` does not have that method. You must narrow the type first — prove it is a string before using string methods.',
        ],
        code: 'function shout(value: string | number) {\n  value.toUpperCase()\n  // ❌ Property \'toUpperCase\' does not exist on type \'string | number\'\n}',
      },
      {
        title: '💡 Union = OR, Intersection = AND',
        body: [
          '`|` = OR (more flexible, need to narrow later). `&` = AND (more restrictive, everything is available immediately).',
          'Students often confuse which is which. Remember: a `Student & Athlete` has ALL the traits of both. A `Student | Athlete` might be either, so you have to check first.',
        ],
      },
    ],
    starterCode: 'function padLeft(value: string | number) {\n  if (typeof value === "string") {\n    return value.padStart(5, " ")\n  }\n  return value.toFixed(2)\n}\n\nconsole.log(padLeft("hi"))\nconsole.log(padLeft(42))',
    exercises: [
      {
        kind: 'fix-type',
        question: 'Calling a method on a union fails. Add narrowing to fix it.',
        brokenCode: 'function printId(id: string | number) {\n  console.log(id.toUpperCase())\n}',
        fixedCode: 'function printId(id: string | number) {\n  if (typeof id === "string") {\n    console.log(id.toUpperCase())\n  } else {\n    console.log(id.toString())\n  }\n}',
        errorDescription: "Property 'toUpperCase' does not exist on type 'string | number'",
        explanation: 'Before calling `.toUpperCase()`, narrow the union with `typeof id === "string"`. The else branch handles the number case safely.',
      },
      {
        kind: 'choose-best',
        question: 'You need a type that represents either a success OR an error — never both at the same time. Which pattern fits?',
        options: [
          { label: 'A', code: 'type Result = Success & Error', isCorrect: false },
          { label: 'B', code: 'type Result = Success | Error', isCorrect: true },
          { label: 'C', code: 'type Result = Success[] | Error[]', isCorrect: false },
        ],
        explanation: '`|` (union) means the value is EITHER `Success` OR `Error`. `&` (intersection) would mean it must be BOTH at once — impossible. For "this or that" scenarios, use `|`.',
      },
    ],
  },
  {
    id: 'ts-literals-as-const',
    order: 8,
    title: 'Literal types & as const',
    block: 'foundations',
    summary: "Narrow types to specific values. Use as const to freeze arrays and objects to their exact literal shapes — useful for configuration and discriminated unions.",
    sections: [
      {
        title: 'Mental model: "Large" vs size 42',
        body: [
          '`string` means any string. `"Mina"` means EXACTLY `"Mina"`. A **literal type** is a type narrowed to one specific value.',
          'Literal types combined with unions create precise allowed values: `"GET" | "POST" | "DELETE"` means only those three strings are valid. Misspell one and TypeScript catches it.',
        ],
        code: '// Literal types restrict to specific values\ntype Method = "GET" | "POST" | "DELETE"\n\nfunction request(method: Method) {\n  // method can ONLY be one of those three strings\n}\n\nrequest("GET")     // ✓\n// request("PATCH")  // ❌ not in the union',
      },
      {
        title: 'as const — freeze it',
        body: [
          '`const` only prevents reassignment — it does not lock the type. `const name = "Mina"` still infers `string`, not `"Mina"`.',
          '`as const` freezes EVERYTHING to its literal value. Arrays become readonly tuples, objects get readonly properties with literal types.',
        ],
        code: '// Without as const — types are widened\nconst roles = ["admin", "user"]\n// roles is string[] — literals are lost\n\n// With as const — everything is locked\nconst roles = ["admin", "user"] as const\n// roles is readonly ["admin", "user"]\n// roles[0] is exactly "admin"',
      },
      {
        title: '💡 as const for configuration',
        body: [
          '`as const` is perfect for configuration objects, route definitions, and discriminated unions. It gives you maximum type safety without writing any types manually.',
        ],
      },
    ],
    starterCode: 'const colors = ["red", "green", "blue"] as const\nconst first: typeof colors[number] = "red"\n\nconsole.log(first)',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What type does `direction` have?',
        code: 'const direction = "north"',
        answer: 'string — const prevents reassignment but does not prevent type widening',
        explanation: 'Without `as const`, the type widens to `string`. To get the literal `"north"`, use `const direction = "north" as const`.',
      },
      {
        kind: 'choose-best',
        question: 'You have a config object that should never change. Which approach locks it completely?',
        options: [
          { label: 'A', code: 'const config = { api: "...", timeout: 5000 }', isCorrect: false },
          { label: 'B', code: 'const config: { api: string; timeout: number } = { ... }', isCorrect: false },
          { label: 'C', code: 'const config = { api: "...", timeout: 5000 } as const', isCorrect: true },
        ],
        explanation: '`as const` makes the object deeply readonly AND preserves literal types. A regular annotation widens types. `as const` is the strongest lock you can put on a value.',
      },
    ],
  },
  {
    id: 'ts-functions',
    order: 9,
    title: 'Functions — params, return types & overloads',
    block: 'foundations',
    summary: 'Annotate function signatures fully. Learn optional params, default values, rest params, overloads, and the difference between void and undefined.',
    sections: [
      {
        title: 'Mental model: A vending machine',
        body: [
          'A function is like a vending machine. You put something in (parameters), it does something, and something comes out (return value). Type annotations tell you exactly what to put in and what you get back.',
          '`function add(a: number, b: number): number` — put in two numbers, get back a number. TypeScript verifies the machine works as advertised.',
        ],
        code: 'function add(a: number, b: number): number {\n  return a + b\n}\n\nfunction greet(name: string, title?: string): string {\n  return title ? `${title} ${name}` : name\n}',
      },
      {
        title: '👎 See it fail',
        body: [
          'Missing arguments, wrong types, and missing returns — TypeScript catches all of them.',
        ],
        code: 'function repeat(msg: string, times: number): string {\n  return msg.repeat(times)\n}\n\nrepeat("hi")       // ❌ expected 2 arguments\nrepeat("hi", "3")  // ❌ "3" is a string, not number',
      },
      {
        title: '💡 void vs undefined',
        body: [
          '`void` means "ignore the return value" — the function does its job and you should not use what comes back. `undefined` means "the value is literally `undefined`."',
          'Use `void` for functions that do something (log, save, send) but do not produce a meaningful result.',
        ],
      },
    ],
    starterCode: 'function greet(name: string, age?: number): string {\n  return age ? `${name} (${age})` : name\n}\n\nconsole.log(greet("Mina", 28))\nconsole.log(greet("Alex"))',
    exercises: [
      {
        kind: 'fix-type',
        question: 'This function has a missing required parameter at the call site. Fix it.',
        brokenCode: 'function repeat(message: string, times: number): string {\n  return message.repeat(times)\n}\n\nrepeat("hi")',
        fixedCode: 'function repeat(message: string, times: number = 1): string {\n  return message.repeat(times)\n}\n\nrepeat("hi")  // works — times defaults to 1',
        errorDescription: 'Expected 2 arguments, but got 1',
        explanation: 'Give `times` a default value of `1` so callers can omit it. Or call `repeat("hi", 1)`. Default parameters make functions more flexible.',
      },
      {
        kind: 'choose-best',
        question: 'A function that logs a message to the console. What return type should it have?',
        options: [
          { label: 'A', code: 'function log(msg: string): undefined', isCorrect: false },
          { label: 'B', code: 'function log(msg: string): void', isCorrect: true },
          { label: 'C', code: 'function log(msg: string): never', isCorrect: false },
        ],
        explanation: '`void` means "nothing useful comes back." `undefined` means the return value IS undefined. `never` means the function never returns at all (it throws or loops forever). For logging, `void` is correct.',
      },
    ],
  },

  /* ── Block 3: Narrowing (lessons 10-13) ───────── */
  {
    id: 'ts-narrowing',
    order: 10,
    title: 'Narrowing — typeof, instanceof & in',
    block: 'narrowing',
    summary: 'Prove what a value is before using it. TypeScript narrows union types inside if-checks — typeof for primitives, instanceof for classes, in for object properties.',
    sections: [
      {
        title: 'Mental model: Checking ID at the door',
        body: [
          'You have a bag that might contain a book OR a banana. Before you try to read it, you need to check: "Is this a book?" If yes, open it and read. If not, it is a banana — peel it.',
          'Type narrowing is exactly this. A union type `string | number` means "could be either." Inside an `if (typeof x === "string")` block, TypeScript KNOWS it is a string and lets you use string methods.',
        ],
        code: 'function process(value: string | number) {\n  if (typeof value === "string") {\n    return value.toUpperCase()  // narrowed to string\n  }\n  return value.toFixed(2)       // narrowed to number\n}',
      },
      {
        title: 'The three narrowing tools',
        body: [
          '**`typeof`** — narrows primitives: `"string"`, `"number"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`.',
          '**`instanceof`** — narrows classes: `value instanceof Date`, `value instanceof Error`. Does NOT work with interfaces (they do not exist at runtime).',
          '**`in`** — checks if a property exists: `"length" in value`. Useful for narrowing between object shapes.',
        ],
        code: '// instanceof — works with classes\nfunction handle(err: Error | string) {\n  if (err instanceof Error) return err.message\n  return err.toUpperCase()\n}\n\n// in — checks property existence\ntype Cat = { meow: () => void }\ntype Dog = { bark: () => void }\nfunction speak(a: Cat | Dog) {\n  if ("meow" in a) a.meow()\n  else a.bark()\n}',
      },
      {
        title: '👎 See it fail',
        body: [
          '`instanceof` only works with classes. Interfaces are erased at compile time — there is nothing to check at runtime.',
        ],
        code: 'interface User { name: string }\nfunction get(v: User | null) {\n  if (v instanceof User) {}  // ❌ User only refers to a type\n}',
      },
    ],
    starterCode: 'function print(value: string | number | boolean) {\n  if (typeof value === "string") {\n    console.log("STRING:", value.toUpperCase())\n  } else if (typeof value === "number") {\n    console.log("NUMBER:", value.toFixed(2))\n  } else {\n    console.log("BOOLEAN:", value)\n  }\n}\n\nprint("hello")\nprint(42)\nprint(true)',
    exercises: [
      {
        kind: 'fix-type',
        question: 'Instanceof does not work with interfaces. Fix this using a null check instead.',
        brokenCode: 'interface User { name: string }\nfunction get(v: User | null) {\n  if (v instanceof User) return v.name\n  return "none"\n}',
        fixedCode: 'interface User { name: string }\nfunction get(v: User | null) {\n  if (v !== null) return v.name\n  return "none"\n}',
        errorDescription: "'User' only refers to a type, but is being used as a value here",
        explanation: '`instanceof` checks the prototype chain at runtime. Interfaces are erased during compilation — use `v !== null` instead.',
      },
      {
        kind: 'predict-type',
        question: 'What type is `value` at position B?',
        code: 'function handler(value: string | number | boolean) {\n  if (typeof value === "string" || typeof value === "number") {\n    console.log(value)  // (A)\n  } else {\n    console.log(value)  // (B)\n  }\n}',
        answer: 'boolean — the true branch takes string | number, leaving boolean for else',
        explanation: 'The if condition checks for `string` OR `number`. The else branch gets whatever is left in the union: `boolean`.',
      },
    ],
  },
  {
    id: 'ts-type-guards',
    order: 11,
    title: 'Custom type guards',
    block: 'narrowing',
    summary: 'Write your own type guard functions with `is` return types. Go beyond built-in narrowing — validate object shapes, filter arrays, and assert types with custom predicates.',
    sections: [
      {
        title: 'Mental model: You become the bouncer',
        body: [
          'Built-in narrowing uses `typeof` and `instanceof`. But what if you need to check something custom — like "does this object have a name AND an age?" You write a **custom type guard**.',
          'A type guard is a function that returns `value is SomeType`. When it returns `true`, TypeScript narrows the argument to that type. You are the bouncer — you decide who gets in.',
        ],
        code: 'function isString(value: unknown): value is string {\n  return typeof value === "string"\n}\n\nfunction print(value: unknown) {\n  if (isString(value)) {\n    console.log(value.toUpperCase())  // value is string\n  }\n}',
      },
      {
        title: 'Filter arrays with type guards',
        body: [
          'Pass a type guard to `.filter()` and the resulting array gets the narrowed type. This is one of the most practical uses of custom guards.',
        ],
        code: 'const mixed: (string | null | undefined)[] = ["a", null, "b", undefined]\n\n// Type guard filters out null/undefined\nconst valid = mixed.filter((v): v is string => v != null)\n// valid is string[] — not (string | null | undefined)[]',
      },
      {
        title: 'Assertion functions',
        body: [
          'An assertion function uses `asserts value is Type` instead of `value is Type`. It THROWS if the check fails rather than returning `false`. Use it at API boundaries — validate once, use safely everywhere after.',
        ],
        code: 'function assertString(value: unknown): asserts value is string {\n  if (typeof value !== "string") {\n    throw new Error(`Expected string, got ${typeof value}`)\n  }\n}\n\nfunction handle(data: unknown) {\n  assertString(data)\n  // data is string from here on\n  console.log(data.toUpperCase())\n}',
      },
    ],
    starterCode: 'function isNumber(value: unknown): value is number {\n  return typeof value === "number"\n}\n\nconst data: unknown = 42\nif (isNumber(data)) {\n  console.log(data.toFixed(2))\n}',
    exercises: [
      {
        kind: 'fix-type',
        question: 'This type guard always returns true — it does not validate anything. Fix it.',
        brokenCode: 'interface Point { x: number; y: number }\nfunction isPoint(v: unknown): v is Point { return true }',
        fixedCode: 'interface Point { x: number; y: number }\nfunction isPoint(v: unknown): v is Point {\n  return typeof v === "object" && v !== null &&\n    "x" in v && "y" in v &&\n    typeof (v as Point).x === "number" &&\n    typeof (v as Point).y === "number"\n}',
        errorDescription: 'The guard always returns true — any value passes',
        explanation: 'TypeScript trusts the predicate. If the function returns `true`, it narrows regardless. Always implement actual runtime checks matching the type shape.',
      },
      {
        kind: 'choose-best',
        question: 'You have `(string | null)[]` and want only the strings. Which filter is correct?',
        options: [
          { label: 'A', code: 'arr.filter(v => v != null)', isCorrect: false },
          { label: 'B', code: 'arr.filter((v): v is string => v != null)', isCorrect: true },
          { label: 'C', code: 'arr.filter(v => typeof v === "string")', isCorrect: false },
        ],
        explanation: 'Without the type predicate `v is string`, `.filter()` still returns `(string | null)[]`. The predicate tells TypeScript the result is `string[]`. Both B and C work, but B uses the predicate pattern.',
      },
    ],
  },
  {
    id: 'ts-never',
    order: 12,
    title: 'never & exhaustiveness',
    block: 'narrowing',
    summary: 'The never type represents values that should never exist. Use it for exhaustiveness checking — TypeScript catches missing cases in switch statements at compile time.',
    sections: [
      {
        title: 'Mental model: The safety net at the bottom',
        body: [
          'Imagine a light switch with three positions: ON, OFF, and DIMMED. You write code to handle each position. What if someone adds a fourth position later — FLASHING? Your code silently ignores it.',
          '`never` is a safety net. Add a final check that says: "If we reach here, the value should be `never` — prove that all cases were handled." If someone adds a new position, TypeScript catches the unhandled case.',
        ],
        code: 'type Light = "on" | "off" | "dimmed"\n\nfunction handle(light: Light) {\n  switch (light) {\n    case "on": return "bright"\n    case "off": return "dark"\n    case "dimmed": return "soft"\n    default:\n      const _check: never = light\n      return _check\n  }\n}',
      },
      {
        title: '👎 See it work — add a case and it breaks',
        body: [
          'Add `"flashing"` to the `Light` union and TypeScript immediately flags the default branch: "`\'flashing\'` is not assignable to type `\'never\'`." The safety net caught the new case.',
        ],
        code: '// If we add "flashing":\n// type Light = "on" | "off" | "dimmed" | "flashing"\n//\n// Error in default branch:\n// Type \'"flashing"\' is not assignable to type \'never\'',
      },
      {
        title: '💡 never is absorbed in unions',
        body: [
          '`never` disappears in unions: `string | never` = `string`. This property makes it useful for filtering types in conditional types — anything mapped to `never` gets removed.',
        ],
      },
    ],
    starterCode: 'type Direction = "north" | "south" | "east" | "west"\n\nfunction move(dir: Direction): string {\n  switch (dir) {\n    case "north": return "↑"\n    case "south": return "↓"\n    case "east": return "→"\n    case "west": return "←"\n    default:\n      const _check: never = dir\n      return _check\n  }\n}\n\nconsole.log(move("north"))',
    exercises: [
      {
        kind: 'predict-type',
        question: 'If "northeast" is added to Direction, what compile error occurs?',
        code: 'type Direction = "north" | "south" | "east" | "west" | "northeast"\nfunction move(dir: Direction) {\n  switch (dir) {\n    case "north": return "↑"\n    case "south": return "↓"\n    case "east": return "→"\n    case "west": return "←"\n    default: const _: never = dir; return _\n  }\n}',
        answer: '"northeast" is not assignable to never — the switch is no longer exhaustive',
        explanation: 'The default branch expects `never` but receives `"northeast"`. TypeScript reports a type error, forcing you to handle the new direction. This is exhaustiveness checking.',
      },
      {
        kind: 'choose-best',
        question: 'What does `string | never | number` simplify to?',
        options: [
          { label: 'A', code: 'string | never | number', isCorrect: false },
          { label: 'B', code: 'string | number', isCorrect: true },
          { label: 'C', code: 'never', isCorrect: false },
        ],
        explanation: '`never` is absorbed in unions. It represents an impossible state, so `string | never` is just `string`. The final type is `string | number`.',
      },
    ],
  },
  {
    id: 'ts-discriminated-unions',
    order: 13,
    title: 'Discriminated unions',
    block: 'narrowing',
    summary: 'Model states that cannot overlap using a shared literal property. Switch on the discriminant and TypeScript narrows each case automatically — the most powerful pattern in TypeScript.',
    sections: [
      {
        title: 'Mental model: Color-coded boxes',
        body: [
          'You have three kinds of packages: red boxes contain documents, blue boxes contain tools, green boxes contain food. You open the box, check the color, and you immediately know what is inside.',
          'A **discriminated union** uses a shared property (the "discriminant") to tell each variant apart. Usually `kind`, `type`, or `status`. Switch on it and each branch knows exactly which properties exist.',
        ],
        code: 'type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "rectangle"; width: number; height: number }\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case "circle":\n      return Math.PI * shape.radius ** 2\n    case "rectangle":\n      return shape.width * shape.height\n  }\n}',
      },
      {
        title: '👎 See it fail — accessing the wrong property',
        body: [
          'Without narrowing on the discriminant, TypeScript will NOT let you access `radius` — because the shape might be a rectangle. The discriminant proves which variant you have.',
        ],
        code: 'function getRadius(shape: Shape) {\n  return shape.radius\n  // ❌ Property \'radius\' does not exist on type \'Shape\'\n  // (It only exists on the circle variant)\n}',
      },
      {
        title: '💡 The most powerful TS pattern',
        body: [
          'Discriminated unions are the TypeScript pattern for state machines, API responses, and any data that comes in distinct variants. Combined with exhaustiveness checking (`never`), you get compile-time guarantees that every case is handled.',
        ],
      },
    ],
    starterCode: 'type Result =\n  | { status: "ok"; data: string }\n  | { status: "error"; message: string }\n\nfunction handle(r: Result) {\n  switch (r.status) {\n    case "ok":\n      return r.data.toUpperCase()\n    case "error":\n      return r.message\n  }\n}\n\nconsole.log(handle({ status: "ok", data: "success" }))',
    exercises: [
      {
        kind: 'fix-type',
        question: 'This function tries to access .message without narrowing. Fix it.',
        brokenCode: 'type Resp = { status: "ok"; data: string } | { status: "error"; message: string }\nfunction handle(r: Resp) { return r.message }',
        fixedCode: 'type Resp = { status: "ok"; data: string } | { status: "error"; message: string }\nfunction handle(r: Resp) {\n  if (r.status === "error") return r.message\n  return r.data\n}',
        errorDescription: "Property 'message' does not exist on type 'Resp'",
        explanation: 'Narrow on the discriminant `r.status` first. After checking `r.status === "error"`, TypeScript knows `r.message` exists.',
      },
      {
        kind: 'choose-best',
        question: 'You need to model an API call that is loading, succeeded, or failed. Which pattern?',
        options: [
          { label: 'A', code: 'type State = { loading: boolean; data?: Data; error?: Error }', isCorrect: false },
          { label: 'B', code: "type State = { status: 'loading' } | { status: 'ok'; data: Data } | { status: 'error'; error: Error }", isCorrect: true },
        ],
        explanation: 'The discriminated union (B) makes impossible states impossible. With pattern A, you could have `{ loading: true, data: ..., error: ... }` — a nonsense state. B guarantees exactly one state at a time.',
      },
    ],
  },

  /* ── Block 4: Generics (lessons 14-21) ─────────── */
  {
    id: 'ts-generics-basics',
    order: 14,
    title: 'Generics — basics',
    block: 'generics',
    summary: 'Write functions that work with any type while preserving that type. Think of type parameters as variables for types — they capture whatever type flows in and carry it through.',
    sections: [
      {
        title: 'Mental model: A label maker',
        body: [
          'You have a machine that takes something, wraps it in a box, and hands it back. The machine works with ANYTHING — a book, a banana, a key. But you want to know what is inside the box when you get it back.',
          'A **generic** is like a label that sticks to the value. `<T>` says: "Whatever type goes in, remember it and use the same type on the way out."',
        ],
        code: '// Without generics — type is lost\nfunction first(arr: any[]): any { return arr[0] }\nconst a = first([1, 2, 3])  // type: any — useless!\n\n// With generics — type is preserved\nfunction first<T>(arr: T[]): T | undefined { return arr[0] }\nconst b = first([1, 2, 3])  // type: number — useful!',
      },
      {
        title: 'Generic syntax',
        body: [
          '`<T>` goes after the function name. `T` is a **type parameter** — a placeholder. When you call the function, TypeScript fills in the actual type from the argument.',
          'You can use any name: `<T>`, `<Item>`, `<Key, Value>`. Conventions: `T` for a single type, `K` for key, `V` for value, `E` for element.',
        ],
        code: 'function identity<T>(value: T): T { return value }\nfunction pair<T, U>(a: T, b: U): [T, U] { return [a, b] }\n\nconst p = pair("hello", 42)  // [string, number]',
      },
      {
        title: 'Generic interfaces',
        body: [
          'Interfaces and types can also be generic. This is how built-in types like `Array<T>`, `Promise<T>`, and `Map<K, V>` work.',
        ],
        code: 'interface ApiResponse<T> {\n  data: T\n  status: number\n}\n\nconst userResp: ApiResponse<{ name: string }> = {\n  data: { name: "Mina" },\n  status: 200,\n}',
      },
    ],
    starterCode: 'function wrap<T>(value: T): { data: T } {\n  return { data: value }\n}\n\nconst result = wrap("hello")\nconsole.log(result.data.toUpperCase())',
    exercises: [
      {
        kind: 'convert-js-ts',
        question: 'Make this function generic so it preserves the element type.',
        jsCode: 'function last(arr) {\n  return arr[arr.length - 1]\n}',
        tsCode: 'function last<T>(arr: T[]): T | undefined {\n  return arr[arr.length - 1]\n}',
        explanation: 'Add `<T>` after the function name and annotate `arr` as `T[]`. The return type becomes `T | undefined` because the array might be empty.',
      },
      {
        kind: 'choose-best',
        question: 'You wrote a function that always returns the same type it receives. Which signature is correct?',
        options: [
          { label: 'A', code: 'function identity(value: any): any', isCorrect: false },
          { label: 'B', code: 'function identity<T>(value: T): T', isCorrect: true },
          { label: 'C', code: 'function identity(value: unknown): unknown', isCorrect: false },
        ],
        explanation: '`<T>(value: T): T` preserves the exact type. `any` loses it. `unknown` requires the caller to cast the result. Generics capture and preserve — the best choice.',
      },
    ],
  },
  {
    id: 'ts-generics-constraints',
    order: 15,
    title: 'Generics — constraints & defaults',
    block: 'generics',
    summary: 'Constrain type parameters with extends to unlock property access. Add defaults so generics work without explicit type arguments.',
    sections: [
      {
        title: 'Mental model: "Must have..."',
        body: [
          'A bare `<T>` tells TypeScript nothing about the type. You cannot access `.length` on `T` because it might be a number (which has no length).',
          '`T extends { length: number }` means: "T must be a type that HAS a `length` property." Now TypeScript knows `.length` exists and you can use it.',
        ],
        code: '// Without constraint — cannot access .length\nfunction len<T>(value: T) {\n  // value.length  ❌ Property does not exist on T\n}\n\n// With constraint — .length is available\nfunction len<T extends { length: number }>(value: T) {\n  console.log(value.length)  // ✓\n}\n\nlen("hello")   // strings have length\nlen([1, 2, 3])  // arrays have length',
      },
      {
        title: 'Constraining with keyof',
        body: [
          '`K extends keyof T` means "K must be one of the keys of T." This creates type-safe property access — no more typos in property names.',
        ],
        code: 'function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key]\n}\n\nconst user = { name: "Mina", age: 28 }\nget(user, "name")  // ✓ returns string\nget(user, "age")   // ✓ returns number\n// get(user, "email")  // ❌ not a key of user',
      },
      {
        title: 'Default type parameters',
        body: [
          '`<T = string>` gives T a fallback type. If the caller does not provide or infer T, it defaults to `string`. Like default function parameters, but for types.',
        ],
        code: 'function createMap<K, V = string>(): Map<K, V> {\n  return new Map()\n}\n\nconst m = createMap<number>()  // Map<number, string>',
      },
    ],
    starterCode: 'function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key]\n}\n\nconst user = { name: "Mina", age: 28 }\nconst val = get(user, "age")\nconsole.log(val)',
    exercises: [
      {
        kind: 'fix-type',
        question: 'T is unconstrained, so .name is not accessible. Add the proper constraint.',
        brokenCode: 'function greet<T>(entity: T): string {\n  return `Hello, ${entity.name}`\n}',
        fixedCode: 'function greet<T extends { name: string }>(entity: T): string {\n  return `Hello, ${entity.name}`\n}',
        errorDescription: "Property 'name' does not exist on type 'T'",
        explanation: 'Adding `extends { name: string }` tells TypeScript that any T passed to greet MUST have a `name` property of type string.',
      },
      {
        kind: 'choose-best',
        question: 'Which constraint should you use for a function that only works with arrays?',
        options: [
          { label: 'A', code: 'function f<T>(items: T)', isCorrect: false },
          { label: 'B', code: 'function f<T extends any[]>(items: T)', isCorrect: true },
          { label: 'C', code: 'function f<T extends string>(items: T)', isCorrect: false },
        ],
        explanation: '`T extends any[]` means T must be an array type. `T extends string` would only accept strings. The constraint communicates intent and unlocks array methods.',
      },
    ],
  },
  {
    id: 'ts-keyof',
    order: 16,
    title: 'keyof & indexed access',
    block: 'generics',
    summary: 'keyof extracts an object\'s keys as a union. T[K] looks up a property\'s type. Together they create type-safe property access without stringly-typed code.',
    sections: [
      {
        title: 'Mental model: The master key list',
        body: [
          'Every object has a set of keys. `{ name: string; age: number }` has keys `"name"` and `"age"`. `keyof` gives you that list as a type — a union of string literals.',
          'Once you have a key, `T[K]` tells you the type of that property. Like looking up a word in a dictionary — give it the key, get back the definition.',
        ],
        code: 'interface User { name: string; age: number; email: string }\ntype UserKeys = keyof User\n// "name" | "age" | "email"\n\ntype NameType = User["name"]  // string\ntype AllTypes = User[keyof User]  // string | number',
      },
      {
        title: 'Type-safe pluck',
        body: [
          'Combine `keyof`, generics, and constraints to write functions that extract values from objects with full type safety.',
        ],
        code: 'function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {\n  return items.map((item) => item[key])\n}\n\nconst users = [{ name: "Mina", age: 28 }, { name: "Alex", age: 32 }]\nconst names = pluck(users, "name")  // string[]',
      },
    ],
    starterCode: 'const config = { api: "https://api.example.com", timeout: 5000 }\ntype ConfigKeys = keyof typeof config\n\nfunction getConfig(key: ConfigKeys) {\n  return config[key]\n}\n\nconsole.log(getConfig("api"))',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What is the type of `ConfigKeys`?',
        code: 'const config = { api: "https://api.example.com", timeout: 5000 }\ntype ConfigKeys = keyof typeof config',
        answer: '"api" | "timeout" — a union of string literal types, not just string',
        explanation: '`typeof config` gets the object type. `keyof` extracts its keys as a union of literals. This means only `"api"` and `"timeout"` are valid — typos are caught.',
      },
      {
        kind: 'choose-best',
        question: 'You need a type that represents any key of User. Which is correct?',
        options: [
          { label: 'A', code: 'type K = string', isCorrect: false },
          { label: 'B', code: 'type K = keyof User', isCorrect: true },
          { label: 'C', code: 'type K = User.keys', isCorrect: false },
        ],
        explanation: '`keyof User` gives you a union of the actual keys. `string` is too broad — it would allow any string, including typos. `keyof` is precise and type-safe.',
      },
    ],
  },
  {
    id: 'ts-mapped-types',
    order: 17,
    title: 'Mapped types',
    block: 'generics',
    summary: 'Transform types by iterating over keys. Build Partial, Required, Readonly from scratch — it is Array.map(), but for type properties.',
    sections: [
      {
        title: 'Mental model: A copy machine with filters',
        body: [
          'Take an existing type, iterate over every property, and produce a new type. `{ [K in keyof T]: T[K] }` — for each key K in T, keep the same value type. Add `?` and every property becomes optional. Add `readonly` and they become immutable.',
        ],
        code: 'interface User { name: string; age: number }\n\n// Make every property optional\ntype PartialUser = { [K in keyof User]?: User[K] }\n// { name?: string; age?: number }\n\n// Make every property readonly\ntype ReadonlyUser = { readonly [K in keyof User]: User[K] }\n// { readonly name: string; readonly age: number }',
      },
      {
        title: 'Built-in mapped types',
        body: [
          'TypeScript ships with `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, and `Record<K, V>`. All are implemented as mapped types.',
        ],
        code: 'interface User { name: string; age: number; email?: string }\ntype PartialUser = Partial<User>\ntype RequiredUser = Required<User>\ntype JustName = Pick<User, "name">\ntype NoEmail = Omit<User, "email">',
      },
    ],
    starterCode: 'type Readonly<T> = { readonly [K in keyof T]: T[K] }\n\ninterface User { name: string; age: number }\ntype RO = Readonly<User>\n// { readonly name: string; readonly age: number }',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What does `NullableUser` look like?',
        code: 'interface User { name: string; age: number }\ntype NullableUser = { [K in keyof User]: User[K] | null }',
        answer: '{ name: string | null; age: number | null } — every property can also be null',
        explanation: 'The mapped type iterates each key and adds `| null`. Every property now accepts `null` alongside its original type.',
      },
      {
        kind: 'choose-best',
        question: 'You need a type that has all of User\'s properties but they are all optional. Which is simplest?',
        options: [
          { label: 'A', code: 'type OptUser = { [K in keyof User]?: User[K] }', isCorrect: false },
          { label: 'B', code: 'type OptUser = Partial<User>', isCorrect: true },
          { label: 'C', code: 'type OptUser = User & {}', isCorrect: false },
        ],
        explanation: '`Partial<User>` IS the mapped type from A — it is just the built-in version. Both work, but `Partial` is the standard way.',
      },
    ],
  },
  {
    id: 'ts-conditional-types',
    order: 18,
    title: 'Conditional types & infer',
    block: 'generics',
    summary: 'Make types that branch with ternary syntax. Use infer to extract types from within other types — unwrap promises, extract array elements, capture return types.',
    sections: [
      {
        title: 'Mental model: Type-level if/else',
        body: [
          '`T extends U ? X : Y` — if T is assignable to U, the type is X; otherwise, Y. This is type-level branching. Combined with `infer`, you can extract pieces of complex types.',
        ],
        code: 'type IsString<T> = T extends string ? "yes" : "no"\ntype A = IsString<string>   // "yes"\ntype B = IsString<number>   // "no"',
      },
      {
        title: 'Distributive conditionals',
        body: [
          'When you feed a union to a conditional type, it distributes: `Condition<A | B>` becomes `Condition<A> | Condition<B>`. This is how `Exclude` and `Extract` filter unions.',
        ],
        code: 'type Exclude<T, U> = T extends U ? never : T\ntype Result = Exclude<"a" | "b" | "c", "a" | "b">\n// "c" — "a" and "b" excluded',
      },
      {
        title: 'infer — capture from within',
        body: [
          '`infer R` captures a type from a pattern match. `T extends Promise<infer R> ? R : T` — if T is a Promise, extract the resolved type R; otherwise, return T unchanged.',
        ],
        code: '// Unwrap a Promise\ntype Awaited<T> = T extends Promise<infer R> ? R : T\ntype A = Awaited<Promise<string>>  // string\n\n// Extract function return type\ntype ReturnType<T> = T extends (...args: any[]) => infer R ? R : never',
      },
    ],
    starterCode: 'type ElementType<T> = T extends (infer E)[] ? E : never\ntype A = ElementType<string[]>  // string\ntype B = ElementType<number>   // never',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What does `Result` resolve to?',
        code: 'type ExtractString<T> = T extends string ? T : never\ntype Result = ExtractString<string | number | boolean>',
        answer: 'string — the conditional distributes over the union, filtering out non-strings',
        explanation: 'Distribution: `string → string`, `number → never`, `boolean → never`. Result: `string | never | never` = `string`.',
      },
      {
        kind: 'choose-best',
        question: 'You need to extract the return type of a function. Which approach?',
        options: [
          { label: 'A', code: 'type R = typeof myFn', isCorrect: false },
          { label: 'B', code: 'type R = ReturnType<typeof myFn>', isCorrect: true },
          { label: 'C', code: 'type R = myFn.returnType', isCorrect: false },
        ],
        explanation: '`ReturnType<T>` uses `infer` to extract the return type from a function signature. `typeof myFn` gives you the function type, but `ReturnType<typeof myFn>` gives you just the return.',
      },
    ],
  },
  {
    id: 'ts-template-literals',
    order: 19,
    title: 'Template literal types',
    block: 'generics',
    summary: 'Manipulate string literal types with backtick syntax. Generate event names, CSS classes, message patterns, and parse strings — all at compile time.',
    sections: [
      {
        title: 'Mental model: String concatenation for types',
        body: [
          'Just like JavaScript template literals build strings at runtime, TypeScript template literal types build string types at compile time. Interpolate a union and it distributes — producing every combination.',
        ],
        code: 'type Event = "click" | "focus"\ntype Handler = `on${Capitalize<Event>}`\n// "onClick" | "onFocus"\n\ntype Status = "ok" | "error"\ntype Msg = `${Status}:message`\n// "ok:message" | "error:message"',
      },
      {
        title: 'Pattern matching with infer',
        body: [
          'Combine template literal types with `infer` to parse strings: extract prefixes, validate formats, and build type-safe parsers.',
        ],
        code: 'type BeforeDash<T> = T extends `${infer Prefix}-${string}` ? Prefix : T\ntype A = BeforeDash<"user-123">  // "user"\ntype B = BeforeDash<"plain">     // "plain"',
      },
    ],
    starterCode: 'type Prefix = "app" | "api"\ntype Suffix = "Request" | "Response"\ntype Message = `${Prefix}_${Suffix}`\n// "app_Request" | "app_Response" | "api_Request" | "api_Response"',
    exercises: [
      {
        kind: 'predict-type',
        question: 'What does `Messages` resolve to?',
        code: 'type Channel = "chat" | "system"\ntype Messages = `${Channel}:message`',
        answer: '"chat:message" | "system:message" — the union distributes',
        explanation: 'Template literal types distribute over unions. Each member of `Channel` is plugged into `${Channel}:message`, producing two string literal types.',
      },
      {
        kind: 'fill-blank',
        question: 'Fill in the blanks to create a type that prefixes all keys of T with "on".',
        code: 'type OnProps<T> = {\n  [K in keyof T as `___${Capitalize<___ & string>}`]: T[K]\n}',
        blanks: [
          { label: 'Prefix', answer: 'on' },
          { label: 'Key type', answer: 'K' },
        ],
        explanation: '`K` iterates over each key. The `as` clause remaps by prepending `"on"` and capitalizing: `click` → `onClick`, `change` → `onChange`.',
      },
    ],
  },
  {
    id: 'ts-satisfies',
    order: 20,
    title: 'satisfies operator',
    block: 'generics',
    summary: 'Validate a value against a type WITHOUT widening it. Keep literal types and narrow inferences while still getting full type checking — the best of both worlds.',
    sections: [
      {
        title: 'Mental model: The quality inspector who does not change your product',
        body: [
          '`const x: Type = value` — the `: Type` annotation widens the value to Type. `const y = value as Type` — the assertion lies to TypeScript (no validation).',
          '`const z = value satisfies Type` — TypeScript checks the value matches Type, but keeps the original, narrower type. Like a quality inspector who verifies your product meets standards without repackaging it.',
        ],
        code: 'const x: Record<string, number> = { a: 1 }  // x.a is number (widened)\nconst y = { a: 1 } as Record<string, number>   // no validation\nconst z = { a: 1 } satisfies Record<string, number>  // validates + preserves\n// z.a is 1 (literal, preserved)',
      },
      {
        title: '👎 Annotation widens, assertion lies',
        body: [
          'Annotations widen: `x.a` becomes `number`, losing `1`. Assertions skip checking: TypeScript trusts you even if the value is wrong. `satisfies` does both: validates AND preserves.',
        ],
      },
      {
        title: '💡 Use with as const for maximum safety',
        body: [
          '`const routes = [...] as const satisfies Route[]` — the array is readonly, each element is validated as a Route, and literal types are preserved. Maximum type safety with zero type annotations.',
        ],
      },
    ],
    starterCode: 'const palette = { red: "#ff0000", blue: "#0000ff" } satisfies Record<string, `#${string}`>\nconsole.log(palette.red.toUpperCase())',
    exercises: [
      {
        kind: 'choose-best',
        question: 'You want to validate a config object but keep the literal types. Which is best?',
        options: [
          { label: 'A', code: 'const cfg: Config = { ... }', isCorrect: false },
          { label: 'B', code: 'const cfg = { ... } as Config', isCorrect: false },
          { label: 'C', code: 'const cfg = { ... } satisfies Config', isCorrect: true },
        ],
        explanation: '`satisfies` validates against `Config` but does not widen the types. `: Config` loses literals. `as Config` skips validation entirely.',
      },
      {
        kind: 'fix-type',
        question: 'This annotation widens the types. Fix it using satisfies.',
        brokenCode: 'const colors: Record<string, string> = { primary: "#ff0000", secondary: "#00ff00" }',
        fixedCode: 'const colors = { primary: "#ff0000", secondary: "#00ff00" } satisfies Record<string, string>',
        errorDescription: 'Type annotation widens property types to string',
        explanation: 'Replace `: Record<string, string>` with `satisfies Record<string, string>`. The shape is validated but each property keeps its literal type.',
      },
    ],
  },
]

