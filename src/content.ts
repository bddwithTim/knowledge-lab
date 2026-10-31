export type Topic = 'Fundamentals' | 'Strings' | 'Arrays' | 'Objects'
export type Kyu = '8 kyu' | '7 kyu' | '6 kyu' | '5 kyu'

export type Lesson = {
  id: string
  order: number
  title: string
  topic: Topic
  summary: string
  sections: { title: string; body: string[]; code?: string }[]
  starterCode: string
}

export type Challenge = {
  id: string
  kyu: Kyu
  topic: Topic
  title: string
  description: string
  starterCode: string
  functionName: string
  cases: { label: string; args: unknown[]; expected: unknown }[]
  hint: string
}

export const lessons: Lesson[] = [
  {
    id: 'values',
    order: 1,
    topic: 'Fundamentals',
    title: 'Values, let, and const',
    summary: 'Understand what variables are, how let and const differ, how scope works, and when to choose each declaration.',
    sections: [
      {
        title: 'What is a value?',
        body: [
          'Every piece of data in JavaScript is a `value`. A value can be a number like `42`, text like `"hello"`, a boolean like `true`, or a more complex structure like an `array` or `object`. Values exist in memory; your program reads and transforms them.',
          'When you write code, you rarely want to repeat the same literal everywhere. Instead, you give a value a name so you can refer to it later. That named reference is what people mean when they say "variable," even though technically the variable is the name and the value is what it points to.',
        ],
        code: '42\n"hello"\ntrue\n[1, 2, 3]\n{ name: "Mina" }',
      },
      {
        title: 'Declaring a variable',
        body: [
          'A declaration introduces a name into the current scope. In modern JavaScript you declare variables with `let` or `const`, followed by the name, optionally followed by `=` and an initial value.',
          'Declaration and assignment are related but not the same thing. `const name = "Mina"` both declares the name and assigns a value in one step. `let score;` declares the name without assigning — `score` starts as `undefined` until you assign later.',
          'You cannot use a name before it is declared in its scope. Doing so throws a `ReferenceError`. This is stricter and safer than older JavaScript behavior with `var`.',
        ],
        code: 'const playerName = "Mina";\nlet score;\nscore = 10;',
      },
      {
        title: 'const: bind once, read many times',
        body: [
          '`const` is short for "constant binding." It means the variable name cannot be reassigned to a different value after the initial assignment. If you try, JavaScript throws a `TypeError`.',
          'This does not mean the value itself is frozen. `const` only protects the binding — the link between the name and whatever it currently refers to. If that value is an array or object, you can still change its contents.',
          'Use `const` as your default. When a reader sees `const`, they know the name will always refer to the same value for the rest of that scope. That makes code easier to reason about and reduces accidental reassignment bugs.',
        ],
        code: 'const colors = ["red", "blue"];\ncolors.push("green"); // allowed — mutating the array\n// colors = [];         // TypeError — rebinding is not allowed\n\nconst player = { name: "Mina", score: 0 };\nplayer.score = 5; // allowed — mutating the object',
      },
      {
        title: 'let: when the binding itself must change',
        body: [
          '`let` allows reassignment. The name can point to a new value later in the same scope. Use `let` when the variable itself is meant to change — a counter, an accumulator, a loop variable, or a value that gets updated step by step.',
          '`let` does not mean "this value might change someday." If you never reassign, use `const` instead. Reserve `let` for cases where reassignment is part of the logic, not a vague future possibility.',
          'Both `let` and `const` are block-scoped and subject to the temporal dead zone (see below). They replaced `var` as the standard way to declare variables in modern code.',
        ],
        code: 'let total = 0;\nfor (const price of [4, 7, 3]) {\n  total = total + price; // reassignment is the point\n}\nconsole.log(total); // 14',
      },
      {
        title: 'let vs const vs var',
        body: [
          '`const` and `let` share block scope and do not hoist in a usable way. `var` is function-scoped (or global-scoped) and is hoisted with an initial value of `undefined`, which can cause subtle bugs.',
          'Do not use `var` in new code. It exists only for backward compatibility with very old scripts. When you see `var` in tutorials or legacy code, mentally translate it to `let` or `const` based on whether reassignment happens.',
          'Quick rule: default to `const`. Switch to `let` only when you reassign. Never use `var` unless you are maintaining old code and have a specific reason.',
        ],
        code: '// Prefer:\nconst name = "Ari";\nlet attempts = 0;\n\n// Avoid in modern code:\n// var oldStyle = "legacy";',
      },
      {
        title: 'Block scope',
        body: [
          'Block scope means a variable declared inside a pair of braces `{ }` — such as an `if` block, a loop body, or a standalone block — is visible only inside those braces and any blocks nested within them.',
          'This prevents temporary names from leaking into the rest of your program. A variable created inside an `if` statement should not accidentally shadow or collide with names outside it.',
          'Each block creates its own scope. You can declare a `const` with the same name in two separate blocks without conflict, because each block is independent.',
        ],
        code: 'const outer = "I live outside";\n\nif (true) {\n  const inner = "I live inside the if block";\n  console.log(outer); // fine — outer is visible here\n  console.log(inner); // fine\n}\n\nconsole.log(outer); // fine\n// console.log(inner); // ReferenceError — inner does not exist here',
      },
      {
        title: 'Lexical scope',
        body: [
          'JavaScript uses lexical scope (also called static scope). That means a function can access variables from the scope where the function was written, not where it was called.',
          'When an inner function references a variable from an outer scope, that outer variable is called a `closure`. The inner function "closes over" the outer binding. This is one of the most important ideas in JavaScript.',
          'Lexical scope works outward: inner scopes can read outer scopes, but outer scopes cannot read variables declared only in an inner scope. Search for a name starts in the current scope and walks outward until it finds a match or runs out of scopes.',
        ],
        code: 'function makeGreeter(greeting) {\n  // greeting is in the outer scope\n  return function greet(name) {\n    // greet can read greeting because of lexical scope\n    return `${greeting}, ${name}!`;\n  };\n}\n\nconst sayHello = makeGreeter("Hello");\nconsole.log(sayHello("Mina")); // "Hello, Mina!"',
      },
      {
        title: 'The temporal dead zone (TDZ)',
        body: [
          'Variables declared with `let` or `const` exist in their scope from the start of the block, but they cannot be accessed until the declaration line runs. The period between entering the scope and reaching the declaration is called the temporal dead zone.',
          'Accessing a `let` or `const` variable in the TDZ throws a `ReferenceError`, even though a `var` declaration in the same place would have returned `undefined`. This catches mistakes early instead of silently giving you `undefined`.',
          'This is why you should declare variables at the top of the block where they are used, before any code that reads them. It keeps behavior predictable and avoids TDZ errors.',
        ],
        code: '{\n  // console.log(score); // ReferenceError — TDZ\n  let score = 10;\n  console.log(score); // 10\n}',
      },
      {
        title: 'When to use const',
        body: [
          'Use `const` for function parameters, loop variables that are not reassigned (`for...of` gives you a new `const` each iteration), imported bindings, configuration objects, DOM references, and any value that stays the same for the life of the scope.',
          'Use `const` even when the object or array contents will change, as long as you are not replacing the whole object or array. `const player = { score: 0 }` followed by `player.score = 5` is idiomatic.',
          'If you need a truly immutable data structure, `const` alone is not enough. Use `Object.freeze` for shallow immutability, or copy data with spread syntax before changing it.',
        ],
      },
      {
        title: 'When to use let',
        body: [
          'Use `let` for accumulators (`let total = 0`), counters (`let i = 0` in a traditional `for` loop), flags that flip (`let found = false`), and any variable that is intentionally reassigned in place.',
          'Use `let` when you need to declare a variable now but assign it later inside conditional branches, where only one branch runs but all branches need the same name afterward.',
          'Do not use `let` "just in case." Unnecessary `let` signals to readers that reassignment happens when it does not, which adds mental overhead.',
        ],
        code: 'let message;\nif (score >= 10) {\n  message = "Great job!";\n} else {\n  message = "Keep going.";\n}\nconsole.log(message);',
      },
      {
        title: 'When not to use let or const',
        body: [
          'Do not redeclare the same name in the same scope. `const x = 1; const x = 2;` is a `SyntaxError`. `let` has the same restriction within a block.',
          'Do not rely on undeclared variables (assigning to a name without `let`, `const`, or `var`). In strict mode, which modules use by default, that throws a `ReferenceError`. Always declare explicitly.',
          'Avoid creating variables you never read. If a value is used once inline, a named variable may not help readability. Good names clarify intent; pointless names add noise.',
        ],
      },
      {
        title: 'Naming variables well',
        body: [
          'Choose names that describe what the value represents: `playerName`, `totalPrice`, `isActive`. Avoid single letters except in very short loops or math formulas where the convention is clear.',
          'Use `camelCase` for variable names in JavaScript. Constants that are truly fixed configuration values are sometimes written in `SCREAMING_SNAKE_CASE`, but ordinary `const` variables still use `camelCase`.',
          'A name should answer "what is this?" not "how did I compute it?" Prefer `activeUsers` over `filteredArrayResult` when the meaning is a list of active users.',
        ],
      },
    ],
    starterCode: 'const name = "Mina";\nlet score = 3;\n\nscore = score + 1;\nconsole.log(name);\nconsole.log(score);',
  },
  {
    id: 'functions',
    order: 2,
    topic: 'Fundamentals',
    title: 'Functions and return values',
    summary: 'Define reusable behavior with clear inputs and outputs, and understand the difference between returning and logging.',
    sections: [
      {
        title: 'What is a function?',
        body: [
          'A function is a named block of code that performs a specific task. You define it once and call it whenever you need that behavior. Functions are values in JavaScript — you can store them in variables, pass them as arguments, and `return` them from other functions.',
          'Functions reduce duplication. Instead of writing the same calculation in three places, write it once in a function and call it three times. When the logic changes, you update one place.',
          'Every function has a name (or is anonymous), a parameter list, and a body. The body contains the statements that run when the function is called.',
        ],
        code: 'function double(number) {\n  return number * 2;\n}',
      },
      {
        title: 'Parameters and arguments',
        body: [
          'Parameters are the named placeholders in a function definition. When you call the function, you supply arguments — the actual values that fill those placeholders.',
          'The number of arguments does not have to match the number of parameters. Extra arguments are ignored (but still accessible via rest syntax in advanced code). Missing arguments become `undefined` inside the function.',
          'Name parameters after the meaning of the data, not its type: `price`, `name`, `items` — not `num`, `str`, `arr`. Clear parameter names make call sites self-documenting.',
        ],
        code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\ngreet("Mina");  // name becomes "Mina"\ngreet("Kai");   // name becomes "Kai"',
      },
      {
        title: 'return sends a value back',
        body: [
          'The `return` keyword ends function execution and sends a value back to the caller. The caller can store that value, pass it to another function, or use it in an expression.',
          'A function without `return` (or with `return;` and no value) implicitly returns `undefined`. That is valid, but most functions you write in exercises should `return` something concrete.',
          'Only one `return` value is sent per call. If you need to `return` multiple pieces of data, `return` an object or array that groups them.',
        ],
        code: 'function add(a, b) {\n  return a + b;\n}\n\nconst sum = add(3, 4); // sum is 7\nconst doubled = add(3, 4) * 2; // 14',
      },
      {
        title: 'return is not console.log',
        body: [
          '`console.log` prints a value to the console for debugging. It does not send a value back to the code that called the function. A function that only logs and never `return`s produces `undefined` as its result.',
          'This distinction matters in tests, calculations, and UI code. If `double(4)` logs `8` but `return`s `undefined`, then `double(4) + 1` is `NaN`, not `9`.',
          'Use `console.log` while exploring and debugging. Use `return` when the function is supposed to produce a value that other code depends on.',
        ],
        code: 'function badDouble(n) {\n  console.log(n * 2); // displays 8, returns undefined\n}\n\nfunction goodDouble(n) {\n  return n * 2; // returns 8 to the caller\n}\n\nconsole.log(goodDouble(4) + 1); // 9',
      },
      {
        title: 'Early return',
        body: [
          'You can `return` as soon as a condition is met, before reaching the end of the function. This is called an early `return` and often makes functions easier to read than deeply nested `if` blocks.',
          'Handle invalid inputs, edge cases, or simple branches first with early `return`s. The main logic at the bottom then reads as the "normal path" without extra indentation.',
          'Code after a `return` statement in the same branch does not execute. The function has already exited.',
        ],
        code: 'function absoluteValue(number) {\n  if (number < 0) {\n    return -number;\n  }\n  return number;\n}',
      },
      {
        title: 'Function declarations vs arrow functions',
        body: [
          'A function declaration (`function name() { }`) is hoisted — you can call it before its line in the source file. An arrow function assigned to `const` is not hoisted; you must define it before calling it.',
          'Arrow functions have a concise syntax, especially for one-line expressions: `const double = (n) => n * 2`. Use block braces and an explicit `return` when the body has multiple statements.',
          'For the exercises in this lab, either style works. Pick one and stay consistent within a file. Arrow functions are common in modern React and array method callbacks.',
        ],
        code: 'function multiply(a, b) {\n  return a * b;\n}\n\nconst divide = (a, b) => a / b;\n\nconst formatName = (first, last) => {\n  const full = `${first} ${last}`;\n  return full.trim();\n};',
      },
      {
        title: 'Pure functions and side effects',
        body: [
          'A pure function always `return`s the same output for the same input and does not modify external state or perform I/O. `add(2, 3)` is pure; `Math.random()` is not.',
          'Pure functions are easy to test because you only need to check inputs and outputs. Most Codewars-style exercises expect pure functions.',
          'Side effects — logging, mutating global variables, changing DOM elements — are sometimes necessary in real apps, but keep them out of small calculation functions when possible.',
        ],
      },
      {
        title: 'One job per function',
        body: [
          'A well-named function does one thing. `formatCurrency`, `isEven`, and `calculateTotal` are clear. `doStuff` or `handleData` are vague and usually hide multiple responsibilities.',
          'If a function needs "and" in its description ("validates and saves and sends email"), consider splitting it. Smaller functions are easier to name, test, and reuse.',
          'Avoid hidden dependencies on variables outside the function when the value could be a parameter. Explicit inputs make behavior predictable and portable.',
        ],
      },
    ],
    starterCode: 'function double(number) {\n  return number * 2;\n}\n\nconsole.log(double(4));',
  },
  {
    id: 'conditionals',
    order: 3,
    topic: 'Fundamentals',
    title: 'Booleans and conditionals',
    summary: 'Express true/false logic, compare values safely, and branch your code with if, else if, and else.',
    sections: [
      {
        title: 'Booleans: true and false',
        body: [
          'A boolean has exactly two values: `true` or `false`. Booleans represent yes/no decisions — is the user logged in, is the score high enough, does the list contain this item.',
          'Comparisons produce booleans. `score >= 10` is `true` or `false`. `name === "Mina"` is `true` or `false`. These expressions can be stored in variables or used directly in conditionals.',
        ],
        code: 'const hasPassed = score >= 10;\nconst isOwner = userId === ownerId;\nconsole.log(hasPassed); // true or false',
      },
      {
        title: 'Comparison operators',
        body: [
          '`===` checks strict equality: same value and same type. `!==` checks strict inequality. Always prefer these in modern JavaScript.',
          '`==` and `!=` perform type coercion before comparing, which leads to surprises like `0 == false` being `true` and `"" == false` being `true`. Avoid them unless you have a very specific reason.',
          'Relational operators (`<`, `>`, `<=`, `>=`) compare numbers and strings (strings compare lexicographically by Unicode code point, which can surprise you with mixed case — normalize first when needed).',
        ],
        code: '5 === 5;    // true\n5 === "5";  // false — different types\n5 == "5";   // true — coercion (avoid)\n\n"a" < "b";  // true\n"10" < "2"; // true — string comparison, not numeric',
      },
      {
        title: 'if, else if, and else',
        body: [
          '`if (condition)` runs its block only when condition is `true`. `else if` adds another test when the previous conditions were `false`. `else` runs when none of the above matched.',
          'Only one branch executes. Once a condition is `true`, the remaining `else if` and `else` branches are skipped entirely.',
          'Order matters. Put the most specific checks first and general fallbacks last. Checking `score >= 90` before `score >= 50` ensures high scores get the right label.',
        ],
        code: 'function grade(score) {\n  if (score >= 90) {\n    return "A";\n  } else if (score >= 80) {\n    return "B";\n  } else if (score >= 70) {\n    return "C";\n  } else {\n    return "F";\n  }\n}',
      },
      {
        title: 'Truthy and falsy values',
        body: [
          'JavaScript treats values in boolean context as truthy or falsy. Falsy values are: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else is truthy — including `[]`, `{}`, and `"0"`.',
          'You can write `if (name)` to check whether `name` is a non-empty string, or `if (items.length)` to check for a non-empty array. This is idiomatic for optional values.',
          'Truthy/falsy checks are shortcuts, not replacements for precise comparisons. They fail when `0` or `""` are valid meaningful values.',
        ],
        code: 'if (name) {\n  console.log(`Hello, ${name}`);\n}\n\nif (count) { // beware: count of 0 is falsy\n  console.log(count);\n}',
      },
      {
        title: 'When not to rely on truthiness',
        body: [
          'Do not use `if (score)` when a score of `0` is valid and should be handled explicitly. Use `if (score !== null)` or `if (score !== undefined)` when you need to distinguish "missing" from "zero."',
          'Do not use `== null` as a blanket check unless you understand it matches both `null` and `undefined`. Prefer explicit `=== null` or `=== undefined` when the distinction matters.',
          'For booleans that are already `true` or `false`, write `if (isActive)` rather than `if (isActive === true)`. The extra comparison adds noise without clarity.',
        ],
      },
      {
        title: 'Logical operators: &&, ||, and !',
        body: [
          '`&&` (and) returns the first falsy value, or the last value if all are truthy. `||` (or) returns the first truthy value, or the last value if all are falsy. `!` (not) inverts a boolean.',
          '`&&` and `||` are often used for short-circuit evaluation: `condition && doSomething()` runs `doSomething` only if `condition` is `true`.',
          'The nullish coalescing operator `??` returns the right side only when the left is `null` or `undefined` — not when it is `0` or `""`. Use `??` for default values when `0` and `""` are valid.',
        ],
        code: 'const displayName = nickname || "Guest";\nconst safeCount = count ?? 0; // 0 is kept if count is 0\n\nif (user && user.active) {\n  sendEmail(user);\n}',
      },
      {
        title: 'Readable conditions',
        body: [
          'Long conditions are hard to parse inline. Extract them into well-named boolean variables: `const isEligible = age >= 18 && hasAccount; if (isEligible) { ... }`.',
          'Avoid negated conditions when a positive name is clearer. Prefer `if (isEmpty)` over `if (!hasItems)` when you can name the positive case naturally.',
          'Ternary operator (`condition ? a : b`) works for simple either/or values. Avoid chaining nested ternaries — use `if/else` for multi-branch logic.',
        ],
        code: 'const isEven = number % 2 === 0;\nconst label = isEven ? "even" : "odd";',
      },
      {
        title: 'switch as an alternative',
        body: [
          '`switch` compares one expression against multiple `case` values. It is useful when you test the same variable against many exact matches, especially strings or numbers.',
          'Every `case` should usually end with `break` (or `return`) to prevent fall-through into the next `case`. Omitting `break` causes the next `case` to run unintentionally.',
          'For simple two-way or range-based logic, `if/else` is often clearer. Use `switch` when you have many discrete equal-to cases.',
        ],
        code: 'function dayType(day) {\n  switch (day) {\n    case "Saturday":\n    case "Sunday":\n      return "weekend";\n    default:\n      return "weekday";\n  }\n}',
      },
    ],
    starterCode: 'function label(score) {\n  if (score >= 10) return "high";\n  return "low";\n}\n\nconsole.log(label(12));',
  },
  {
    id: 'string-basics',
    order: 4,
    topic: 'Strings',
    title: 'Strings and template literals',
    summary: 'Work with text values, combine strings safely, and use common string methods without mutating the original.',
    sections: [
      {
        title: 'What is a string?',
        body: [
          'A string is an ordered sequence of characters — letters, digits, spaces, punctuation, emoji, and more. Strings represent human-readable text in your program.',
          'You create strings with single quotes, double quotes, or backticks. Single and double quotes behave the same for plain text. Backticks enable template literals with embedded expressions.',
          'Strings in JavaScript are zero-indexed like arrays: the first character is at index 0, the last at length - 1.',
        ],
        code: 'const a = "hello";\nconst b = \'world\';\nconst c = `hello world`; // template literal',
      },
      {
        title: 'Strings are immutable',
        body: [
          'You cannot change a character inside a string in place. Methods like toUpperCase(), trim(), and replace() return a new string; the original is unchanged.',
          'If you need a transformed version, assign the result: const loud = text.toUpperCase(). Always capture the return value — calling a method without using its result does nothing useful.',
          'Immutability makes strings safe to pass around. You do not worry about another function silently changing your text.',
        ],
        code: 'const word = "hello";\nconst loud = word.toUpperCase();\n\nconsole.log(word); // still "hello"\nconsole.log(loud); // "HELLO"',
      },
      {
        title: 'Concatenation and template literals',
        body: [
          'The + operator joins strings: "Hello, " + name + "!". It works but becomes hard to read with many values or mixed quotes.',
          'Template literals use backticks and ${expression} to embed values: `Hello, ${name}!`. Anything inside ${} is evaluated as JavaScript — variables, arithmetic, or even function calls.',
          'Prefer template literals for messages, labels, and URLs with dynamic parts. Reserve + for adding a number to a string when you intentionally want coercion, or for very short joins.',
        ],
        code: 'const name = "Ari";\nconst score = 12;\n\nconst old = name + " scored " + score;\nconst modern = `${name} scored ${score} points`;',
      },
      {
        title: 'Length, indexing, and slice',
        body: [
          'text.length returns the number of characters (technically UTF-16 code units — for most ASCII and common text this matches character count).',
          'text[0] reads the first character. text[text.length - 1] reads the last. Out-of-range indexes return undefined, not an error.',
          'slice(start, end) extracts a portion without changing the original. end is exclusive: "hello".slice(1, 4) is "ell". Negative indexes count from the end.',
        ],
        code: 'const text = "JavaScript";\nconsole.log(text.length);  // 10\nconsole.log(text[0]);      // "J"\nconsole.log(text.slice(0, 4)); // "Java"',
      },
      {
        title: 'Common string methods',
        body: [
          '`includes(substring)` checks whether the text contains a piece. `startsWith` and `endsWith` check prefixes and suffixes. All `return` booleans.',
          '`toLowerCase` and `toUpperCase` return new strings with changed casing. Use them to compare user input case-insensitively: `a.toLowerCase() === b.toLowerCase()`.',
          '`trim` removes whitespace from both ends. `trimStart` and `trimEnd` target one side. `replace` finds a match and returns a new string with that match substituted (only the first match unless you use a global regex).',
        ],
        code: 'const email = "  USER@MAIL.COM  ";\nconst normalized = email.trim().toLowerCase();\n\n"hello".includes("ell"); // true\n"file.txt".endsWith(".txt"); // true',
      },
      {
        title: 'Escape sequences and special characters',
        body: [
          'Use \\n for newline, \\t for tab, \\" for a literal quote inside a quoted string, and \\\\ for a literal backslash.',
          'Template literals can span multiple lines without \\n. They also make embedding quotes easier: `She said "hello"`.',
          'Unicode escapes like \\u{1F600} work in strings. For emoji and international text, write them directly in source when your editor supports UTF-8.',
        ],
        code: 'const multiline = `Line one\nLine two`;\nconst quoted = "She said \\"hello\\"";',
      },
      {
        title: 'When strings beat other types',
        body: [
          'Use strings for identifiers, messages, labels, and serialized data. Do not use strings as a substitute for numbers — "12" + 3 is "123", not 15.',
          'Convert explicitly when needed: Number("12") or parseInt("12", 10) for parsing, String(42) or (42).toString() for formatting.',
          'Phone numbers, zip codes, and IDs with leading zeros should stay strings, not numbers, because numeric conversion loses leading zeros and precision.',
        ],
      },
    ],
    starterCode: 'const name = "Ari";\nconst message = `${name} says hello`;\n\nconsole.log(message);\nconsole.log(message.toUpperCase());',
  },
  {
    id: 'string-methods',
    order: 5,
    topic: 'Strings',
    title: 'Splitting and joining text',
    summary: 'Convert between strings and arrays of parts, and know when direct string methods are the better tool.',
    sections: [
      {
        title: 'Why split and join exist',
        body: [
          'Many text tasks involve treating a string as a list of pieces: words in a sentence, fields in a CSV row, or characters for reversal. `split` turns a string into an array; `join` turns an array back into a string.',
          'Together they form a pipeline: `split` to break apart, transform with `map` or `filter`, `join` to reassemble. This pattern appears constantly in string exercises.',
        ],
        code: 'const sentence = "learn by doing";\nconst words = sentence.split(" ");\n// ["learn", "by", "doing"]',
      },
      {
        title: 'split(separator)',
        body: [
          '`split` divides a string wherever the separator appears. `split(" ")` splits on spaces. `split(",")` splits on commas. `split("")` splits into individual characters.',
          'Consecutive separators can produce empty strings: `"a,,b".split(",")` gives `["a", "", "b"]`. Leading or trailing separators can produce empty first or last elements.',
          'When input is messy (multiple spaces, mixed punctuation), `trim` first or use a regular expression separator for more control. For controlled exercise input, a simple separator is usually enough.',
        ],
        code: '"a-b-c".split("-");     // ["a", "b", "c"]\n"hello".split("");      // ["h","e","l","l","o"]\n"one  two".split(" ");  // ["one", "", "two"]',
      },
      {
        title: 'join(separator)',
        body: [
          '`join` combines array elements into one string, placing the separator between items — not before the first or after the last.',
          '`join("")` concatenates with no separator. `join(" ")` builds a sentence from words. `join("-")` builds kebab-case from parts.',
          '`join` only works on arrays. If you have a string already, you do not need `join`. If you have an array of pieces, `join` is the standard way to build the final string.',
        ],
        code: '["Learn", "by", "doing"].join(" "); // "Learn by doing"\n["a", "b", "c"].join("");           // "abc"',
      },
      {
        title: 'The split → transform → join pattern',
        body: [
          'A typical word-processing function splits input, maps each piece (capitalize, reverse, filter), then joins the result.',
          'Each step has one job. Splitting is parsing, `map`/`filter` is transformation, joining is formatting. Keeping them separate makes bugs easier to locate.',
          'Store intermediate arrays in named variables when chains get long. Readable steps beat clever one-liners while you are learning.',
        ],
        code: 'const loud = "learn by doing"\n  .split(" ")\n  .map((word) => word.toUpperCase())\n  .join(" ");\n// "LEARN BY DOING"',
      },
      {
        title: 'When not to split',
        body: [
          'If `includes`, `startsWith`, `endsWith`, `replace`, or `trim` express the intent directly, use them. Splitting into an array just to check membership adds unnecessary steps.',
          'Do not split a string into characters unless the task truly needs per-character work. For simple checks, string methods on the whole text are faster to write and read.',
          'Natural language is messy. Real-world tokenization handles contractions, punctuation, and unicode. Exercise inputs are simplified — match your function to the stated input format.',
        ],
      },
      {
        title: 'Character-level operations',
        body: [
          '`split("")` gives an array of characters for reversal, counting, or per-letter transforms. After processing, `join("")` rebuilds the string.',
          'Alternatively, `[...text]` spreads a string into a character array with better unicode handling for some edge cases.',
          'For counting or checking duplicates, a `Set` built from characters (often lowercased) is a common pattern in 6 kyu and 7 kyu exercises.',
        ],
        code: 'function reverse(text) {\n  return text.split("").reverse().join("");\n}\n\nreverse("hello"); // "olleh"',
      },
    ],
    starterCode: 'const words = "learn by doing".split(" ");\nconst loudWords = words.map((word) => word.toUpperCase());\n\nconsole.log(loudWords.join(" "));',
  },
  {
    id: 'array-basics',
    order: 6,
    topic: 'Arrays',
    title: 'Arrays and indexing',
    summary: 'Store ordered collections, access items by index, and know which methods mutate the original array.',
    sections: [
      {
        title: 'What is an array?',
        body: [
          'An array is an ordered list of values. Order matters: `["gold", "silver", "bronze"]` is different from `["bronze", "silver", "gold"]`.',
          'Arrays can hold mixed types, though in practice you usually keep items of the same shape (all numbers, all strings, or all similar objects).',
          'Arrays are zero-indexed. The first item is at index `0`. The last item is at index `length - 1`.',
        ],
        code: 'const colors = ["red", "blue", "green"];\nconst mixed = [1, "two", true, null];',
      },
      {
        title: 'Creating and reading arrays',
        body: [
          'Use array literals: `const items = [1, 2, 3]`. Use `items[0]` to read the first element. `items.length` tells you how many elements exist.',
          'Accessing an out-of-range index returns `undefined` — no error is thrown. Always check `length` or use optional chaining when data may be missing.',
          'Arrays are objects under the hood. `typeof []` is `"object"`. Use `Array.isArray(value)` when you need to confirm something is an array.',
        ],
        code: 'const scores = [10, 20, 30];\nconsole.log(scores[0]);              // 10\nconsole.log(scores[scores.length - 1]); // 30\nconsole.log(scores[99]);             // undefined',
      },
      {
        title: 'Mutating vs non-mutating methods',
        body: [
          'Mutating methods change the original array: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`. Callers holding a reference see the change.',
          'Non-mutating methods return a new value without changing the original: `slice`, `map`, `filter`, `concat`, `toSorted`, `toReversed` (newer non-mutating variants of `sort`/`reverse`).',
          'In exercises that say "return a new array," use non-mutating methods. Mutating the input parameter often violates the spec and breaks tests.',
        ],
        code: 'const original = [3, 1, 2];\nconst copy = original.slice(); // shallow copy\nconst sorted = [...original].sort(); // sort mutates — copy first',
      },
      {
        title: 'Adding and removing items',
        body: [
          '`push` adds to the end; `pop` removes from the end. `shift` removes from the front; `unshift` adds to the front. All four mutate.',
          '`splice(start, deleteCount, ...items)` removes and/or inserts at an index. It mutates and returns removed elements.',
          '`concat` merges arrays without mutating: `a.concat(b)`. Spread syntax `[...a, ...b]` is the modern equivalent.',
        ],
        code: 'const queue = ["a", "b"];\nqueue.push("c");   // ["a", "b", "c"]\nqueue.shift();     // removes "a"',
      },
      {
        title: 'Searching arrays',
        body: [
          '`includes(value)` returns `true` if the array contains that value (using `===`). `indexOf` returns the first index or `-1`. `find` returns the first matching element; `findIndex` returns its index.',
          '`some` tests whether any item passes a condition; `every` tests whether all do. These take callback functions and are useful before you need `filter` or `map`.',
          'For objects in arrays, `includes` checks reference equality, not deep equality. Use `find` with a property check instead: `users.find(u => u.id === targetId)`.',
        ],
        code: 'const nums = [3, 8, 1];\nnums.includes(8);        // true\nnums.indexOf(1);       // 2\nnums.find((n) => n > 5); // 8',
      },
      {
        title: 'Arrays vs objects',
        body: [
          'Use an array when you have an ordered collection of similar items: a list of scores, tags, or product names.',
          'Use an object when each value has a distinct named meaning: a user with `name`, `email`, and `age`. Objects are keyed by property names, not numeric position.',
          'Do not use an array as a map with arbitrary string keys like `arr["name"]`. An object or `Map` expresses that intent clearly.',
        ],
      },
      {
        title: 'Spread and destructuring basics',
        body: [
          'Spread syntax `...array` copies elements: `const copy = [...original]`. Use it to clone before mutating or to merge arrays.',
          'Destructuring pulls items out: `const [first, second] = colors`. Rest collects remaining items: `const [head, ...tail] = items`.',
          'These features appear often alongside `map` and `filter`. They keep code concise without hiding what is happening.',
        ],
        code: 'const [first, ...rest] = [10, 20, 30];\nconsole.log(first); // 10\nconsole.log(rest);  // [20, 30]',
      },
    ],
    starterCode: 'const colors = ["red", "blue", "green"];\n\nconsole.log(colors[0]);\nconsole.log(colors.length);',
  },
  {
    id: 'array-transform',
    order: 7,
    topic: 'Arrays',
    title: 'Transform with map()',
    summary: 'Produce a new array by applying the same transformation to every element.',
    sections: [
      {
        title: 'What map does',
        body: [
          '`Array.map(callback)` calls your callback once for each element, in order, from index `0` to `length - 1`. It collects each `return` value into a new array and returns that array.',
          'The output array always has the same length as the input. One input element produces exactly one output element — even if the output is `undefined` because you forgot to `return`.',
          '`map` does not change the original array. It is a non-mutating transformation.',
        ],
        code: 'const numbers = [1, 2, 3];\nconst doubled = numbers.map((n) => n * 2);\n// doubled: [2, 4, 6]\n// numbers unchanged: [1, 2, 3]',
      },
      {
        title: 'The callback signature',
        body: [
          'The callback receives `(element, index, array)`. Most of the time you only need `element`. Use `index` when position matters — numbering items, alternating patterns, or skipping edges.',
          'The third parameter (the full array) is rarely needed but available if your transformation depends on neighboring context via manual index math.',
          'Name the element parameter after what it represents: `price`, `user`, `word` — not `x` or `e` unless the scope is trivially small.',
        ],
        code: 'const labels = ["a", "b", "c"].map((letter, index) => `${index}: ${letter}`);',
      },
      {
        title: 'Arrow functions and return',
        body: [
          'Concise arrow syntax `(n) => n * 2` implicitly `return`s the expression. Block syntax needs an explicit `return` statement.',
          'Forgetting `return` in a block-bodied callback gives `undefined` for every element. This is a common beginner bug.',
          'Multi-step transformations belong in a block body with clear intermediate `const` variables.',
        ],
        code: 'const simple = [1, 2].map((n) => n * 2);\n\nconst detailed = [1, 2].map((n) => {\n  const squared = n * n;\n  return squared + 1;\n});',
      },
      {
        title: 'When map is the right tool',
        body: [
          'Use `map` when every input item should become exactly one output item: format names, apply tax to prices, extract a property from each object, convert strings to numbers.',
          'The output type can differ from the input type: numbers to strings, objects to booleans, strings to lengths.',
          '`map` expresses "transform each" clearly. A manual `for` loop with `push` works but hides the intent.',
        ],
        code: 'const prices = [10, 20];\nconst withTax = prices.map((p) => p * 1.12);\n\nconst users = [{ name: "Ari" }, { name: "Bea" }];\nconst names = users.map((u) => u.name);',
      },
      {
        title: 'When map is the wrong tool',
        body: [
          'Do not use `map` for side effects only — logging, mutating external state, or pushing into another array without using the `return` value. Use `forEach` or `for...of` for side effects.',
          'Do not use `map` to filter. If some items should be removed, use `filter` first, then `map` if needed.',
          'Do not use `map` when you need a single aggregated value (`sum`, `max`, `count`). Use `reduce` or a simple loop.',
        ],
      },
      {
        title: 'map with objects',
        body: [
          'To update objects immutably, `return` a new object from `map`: `users.map(u => ({ ...u, active: true }))`. Spread copies enumerable own properties into a new object.',
          '`map` always returns an array. If you need one object keyed by `id`, use `reduce` or a loop — not `map` alone.',
          'Pluck patterns (extract one field) are a perfect `map` use case: `records.map(r => r.email)`.',
        ],
        code: 'const updated = users.map((user) => ({\n  ...user,\n  score: user.score + 10,\n}));',
      },
    ],
    starterCode: 'const prices = [8, 12, 5];\nconst withTax = prices.map((price) => price * 1.12);\n\nconsole.log(withTax);\nconsole.log(prices);',
  },
  {
    id: 'array-filter',
    order: 8,
    topic: 'Arrays',
    title: 'Select with filter()',
    summary: 'Build a new array containing only the elements that pass a test.',
    sections: [
      {
        title: 'What filter does',
        body: [
          '`Array.filter(callback)` tests each element with your callback. If the callback returns `true`, the element is included in the new array. If `false`, it is skipped.',
          'The callback is called a predicate — a function that answers yes or no for each item. `filter` returns a new array; the original is unchanged.',
          'The result length can be anything from `0` to the original length. Unlike `map`, `filter` can shorten the array.',
        ],
        code: 'const numbers = [3, 8, 1, 6];\nconst evens = numbers.filter((n) => n % 2 === 0);\n// [8, 6]',
      },
      {
        title: 'Writing clear predicates',
        body: [
          'A good predicate reads like a question about one item: Is it even? Is the user active? Does the word include the query?',
          'Keep the callback short. For complex rules, extract a named function: `const isEligible = (user) => user.age >= 18 && user.verified; items.filter(isEligible)`.',
          'Always `return` a boolean. Returning a truthy object or number works accidentally but is misleading — use explicit `===` comparisons.',
        ],
        code: 'const adults = users.filter((user) => user.age >= 18);\nconst longWords = words.filter((word) => word.length > 5);',
      },
      {
        title: 'filter vs find',
        body: [
          '`find` returns the first matching element (or `undefined`). `filter` returns all matches as an array.',
          'Use `find` when you expect at most one result and want the item itself. Use `filter` when you need every match.',
          '`findIndex` returns the index of the first match; `filter` gives you all matching items.',
        ],
        code: 'const firstEven = numbers.find((n) => n % 2 === 0); // 8\nconst allEvens = numbers.filter((n) => n % 2 === 0); // [8, 6]',
      },
      {
        title: 'Common pitfalls',
        body: [
          'Case-sensitive string matching: `filter(w => w.includes(query))` misses matches when casing differs. Normalize with `toLowerCase` on both sides.',
          'Checking for property truthiness when `0` or `""` are valid: `filter(u => u.score)` removes users with a score of `0`. Be explicit: `u.score !== undefined`.',
          'Mutating items inside `filter` is possible but confusing. `filter` selects; `map` transforms. Keep those roles separate.',
        ],
      },
      {
        title: 'filter then map',
        body: [
          'A very common pipeline: `filter` to keep the records you want, then `map` to extract or reshape them. Order matters — `filter` first when later steps should not see removed items.',
          'Example: `active user names = users.filter(u => u.active).map(u => u.name)`. Each step reads left to right.',
          'Long chains are fine, but a named intermediate variable improves readability when debugging: `const active = users.filter(...); const names = active.map(...)`.',
        ],
        code: 'const activeNames = users\n  .filter((user) => user.active)\n  .map((user) => user.name);',
      },
      {
        title: 'filter vs other selection tools',
        body: [
          '`includes` checks one value in a flat array. `filter` applies arbitrary logic per element.',
          '`slice` selects by index range without a condition. `filter` selects by predicate.',
          '`reduce` can filter and transform in one pass, but `filter` + `map` is clearer until you are comfortable with `reduce`.',
        ],
      },
    ],
    starterCode: 'const numbers = [3, 8, 1, 6];\nconst evenNumbers = numbers.filter((number) => number % 2 === 0);\n\nconsole.log(evenNumbers);',
  },
  {
    id: 'objects',
    order: 9,
    topic: 'Objects',
    title: 'Objects and properties',
    summary: 'Group related values under named keys, access properties safely, and copy objects without accidental mutation.',
    sections: [
      {
        title: 'What is an object?',
        body: [
          'An object stores key-value pairs (properties). Each key is a string (or `Symbol`) naming a slot; each value can be any JavaScript type.',
          'Objects model entities: a player has `name`, `score`, and `active` status. The keys give meaning that array indexes cannot express.',
          'Objects are unordered collections of properties — though modern engines preserve insertion order for string keys, do not rely on order as semantic data unless you are using an array.',
        ],
        code: 'const player = {\n  name: "Mina",\n  score: 12,\n  active: true,\n};',
      },
      {
        title: 'Creating and reading properties',
        body: [
          'Object literals use `{ key: value }` syntax. Keys without quotes must be valid identifiers. Quoted keys allow spaces and special characters: `{ "full name": "Mina Santos" }`.',
          'Dot notation reads a known property: `player.name`. Bracket notation reads a dynamic property: `player[key]` where `key` is a variable holding the property name.',
          'Accessing a missing property returns `undefined` — no error. Distinguish "missing" from "present but `undefined`" only when you use `hasOwn` or similar checks.',
        ],
        code: 'console.log(player.name);   // "Mina"\nconst field = "score";\nconsole.log(player[field]); // 12',
      },
      {
        title: 'Dot vs bracket notation',
        body: [
          'Use dot when the property name is fixed and known at write time. Use brackets when the name is computed, stored in a variable, or not a valid identifier.',
          '`player.key` looks for a property literally named `"key"`. `player[key]` uses the value of variable `key` — often `"score"` or `"name"`.',
          'Bracket notation also accepts expressions: `obj["score" + suffix]` or `obj[someVariable]`.',
        ],
        code: 'const key = "score";\nplayer.score;  // 12\nplayer[key];   // 12\nplayer.key;    // undefined — wrong property',
      },
      {
        title: 'Adding, updating, and deleting',
        body: [
          'Assign to add or update: `player.level = 5` or `player["level"] = 5`. `delete player.bonus` removes a property (returns `true` if deleted or if it did not exist).',
          'Updating nested data requires knowing whether you are replacing a whole nested object or mutating inside it. Spread helps with immutable updates at the top level.',
          '`Object.assign(target, source)` copies properties onto target (mutating target). Spread `{ ...source }` creates a new object — preferred for immutable patterns.',
        ],
        code: 'const updated = { ...player, score: player.score + 1 };',
      },
      {
        title: 'Reference vs copy',
        body: [
          'Objects are assigned by reference. `const b = a` means both names point to the same object. Changing `b.score` also changes `a.score`.',
          'Shallow copy with spread or `Object.assign` creates a new top-level object, but nested objects are still shared. Deep cloning requires `structuredClone` (modern) or libraries for complex trees.',
          'Functions that "return a modified object" in exercises usually expect a new object, not mutation of the argument.',
        ],
        code: 'const a = { score: 1 };\nconst b = a;\nb.score = 99;\nconsole.log(a.score); // 99 — same object\n\nconst c = { ...a, score: 0 }; // new object',
      },
      {
        title: 'Useful object utilities',
        body: [
          '`Object.keys(obj)` returns an array of own property names. `Object.values(obj)` returns values. `Object.entries(obj)` returns `[key, value]` pairs.',
          '`Object.hasOwn(obj, key)` checks whether the object has its own property (not inherited). Prefer this over `obj.hasOwnProperty` in modern code.',
          '`for...in` loops over enumerable properties including inherited ones — usually avoid for plain data objects; prefer `Object.keys`.',
        ],
        code: 'Object.keys(player);           // ["name", "score", "active"]\nObject.hasOwn(player, "name"); // true',
      },
      {
        title: 'When to use objects vs arrays vs Maps',
        body: [
          'Objects fit fixed-shape records with named fields. Arrays fit ordered lists. Maps fit dynamic key-value lookups with non-string keys or frequent add/remove of keys.',
          'Do not represent a list of items as an object with numeric string keys unless you have a specific reason. Use an array.',
          '`JSON.stringify` and `JSON.parse` work naturally with plain objects and arrays — another reason objects are the default for structured data in APIs.',
        ],
      },
    ],
    starterCode: 'const player = { name: "Mina", score: 12 };\n\nconsole.log(player.name);\nconsole.log(`${player.name}: ${player.score}`);',
  },
  {
    id: 'object-arrays',
    order: 10,
    topic: 'Objects',
    title: 'Arrays of objects',
    summary: 'Process collections of structured records with filter, map, and defensive checks for missing data.',
    sections: [
      {
        title: 'The array-of-objects shape',
        body: [
          'Real data is often a list of similar records: API results, shopping cart items, quiz scores, or user profiles. Each array element is an object with the same general properties.',
          'TypeScript (later in your journey) can describe this shape explicitly. In plain JavaScript, consistent property names across items are a convention you maintain.',
          'Empty arrays are valid. Always decide what your function returns for `[]` before writing the happy path.',
        ],
        code: 'const users = [\n  { name: "Ari", active: true, score: 10 },\n  { name: "Bea", active: false, score: 7 },\n  { name: "Cal", active: true, score: 15 },\n];',
      },
      {
        title: 'Reading properties in callbacks',
        body: [
          'Inside `map` or `filter`, each element is one object. Access fields with dot or bracket notation: `user.name`, `user.active`, `record[key]`.',
          'The callback parameter should be named after what it represents: `user`, `product`, `score` — not `item` or `x` unless the list is generic.',
          'Optional chaining `user?.email` safely reads `email` when `user` might be nullish. For arrays of objects, the elements are usually defined; optional chaining helps more with nested lookups.',
        ],
        code: 'const names = users.map((user) => user.name);\nconst actives = users.filter((user) => user.active);',
      },
      {
        title: 'filter → map pipeline',
        body: [
          'Select a subset with `filter`, then reshape with `map`. Example: `names of active users = users.filter(u => u.active).map(u => u.name)`.',
          'Reversing the order rarely makes sense — mapping first would transform items you might intend to discard.',
          'You can chain further steps (`sort`, `slice`) when the task requires ordering or limiting results.',
        ],
        code: 'const activeNames = users\n  .filter((user) => user.active)\n  .map((user) => user.name);\n// ["Ari", "Cal"]',
      },
      {
        title: 'Aggregating collections',
        body: [
          '`reduce` accumulates a single result: sum of scores, count of active users, or an object keyed by `id`. It is the general tool when `filter` and `map` alone are not enough.',
          'A simple loop with `let total = 0` is equally valid and sometimes clearer for sums and counts while you are learning.',
          'Building a lookup object from an array: start with `{}`, then for each record, `result[record.id] = record`.',
        ],
        code: 'const totalScore = users.reduce((sum, user) => sum + user.score, 0);',
      },
      {
        title: 'Handling missing or partial data',
        body: [
          'Not every object in a list guarantees every property. API responses omit fields, forms leave blanks, and tests include edge cases.',
          'Use fallback values when reading: `user.nickname || user.name || "Guest"`. Use nullish coalescing when `0` or `""` are valid: `user.score ?? 0`.',
          '`filter` can remove invalid records before `map`: `users.filter(u => u.name).map(u => u.name)`.',
        ],
      },
      {
        title: 'Immutability in transformations',
        body: [
          'When returning updated records, `map` to new objects: `users.map(u => ({ ...u, score: u.score + 1 }))`. The source array and its objects stay unchanged.',
          'Mutating objects inside an input array affects the caller\'s data. Unless the task says to mutate in place, treat inputs as read-only.',
          'Spread copies one level deep. Nested objects inside a record still share references after spread — update nested fields with an inner spread if needed.',
        ],
        code: 'const bumped = users.map((user) => ({\n  ...user,\n  score: user.score + 1,\n}));',
      },
      {
        title: 'Common exercise patterns',
        body: [
          'Pluck: map to one property. Filter by flag: filter on boolean field. Sort by number field: copy array first, then sort with (a, b) => a.score - b.score.',
          'Index by id: reduce or loop into { [id]: record }. Group by category: loop and bucket into an object of arrays.',
          'These patterns appear from 7 kyu through 5 kyu in this lab. Recognizing the shape of the problem speeds up choosing the right tools.',
        ],
      },
    ],
    starterCode: 'const users = [{ name: "Ari", active: true }, { name: "Bea", active: false }];\nconst activeNames = users.filter((user) => user.active).map((user) => user.name);\n\nconsole.log(activeNames);',
  },
]

function exercise(id: string, kyu: Kyu, topic: Topic, title: string, description: string, functionName: string, starterCode: string, cases: Challenge['cases'], hint: string): Challenge {
  return { id, kyu, topic, title, description, functionName, starterCode, cases, hint }
}

export const challenges: Challenge[] = [
  // 8 kyu — first wins
  exercise('greet', '8 kyu', 'Fundamentals', 'Greeting', 'Return a greeting for the supplied name. For example, greet("Mina") returns "Hello, Mina!".', 'greet', 'function greet(name) {\n  // Write your solution here.\n}', [{ label: 'greets a name', args: ['Mina'], expected: 'Hello, Mina!' }, { label: 'keeps the supplied casing', args: ['Kai'], expected: 'Hello, Kai!' }], 'Use a template literal to put a value inside a string.'),
  exercise('opposite', '8 kyu', 'Fundamentals', 'Opposite number', 'Return the number with its sign reversed.', 'opposite', 'function opposite(number) {\n  // Write your solution here.\n}', [{ label: 'reverses a positive number', args: [14], expected: -14 }, { label: 'reverses a negative number', args: [-3], expected: 3 }, { label: 'keeps zero at zero', args: [0], expected: 0 }], 'Multiply the number by -1, or use unary negation.'),
  exercise('boolean-word', '8 kyu', 'Fundamentals', 'Boolean to word', 'Return "Yes" when the value is true and "No" when it is false.', 'booleanToWord', 'function booleanToWord(value) {\n  // Write your solution here.\n}', [{ label: 'returns Yes for true', args: [true], expected: 'Yes' }, { label: 'returns No for false', args: [false], expected: 'No' }], 'An if statement can return a different value for each boolean.'),
  exercise('repeat', '8 kyu', 'Strings', 'Repeat a string', 'Return the given string repeated count times.', 'repeatString', 'function repeatString(count, text) {\n  // Write your solution here.\n}', [{ label: 'repeats text three times', args: [3, 'ha'], expected: 'hahaha' }, { label: 'returns empty for zero repeats', args: [0, 'go'], expected: '' }], 'Strings have a repeat() method.'),
  exercise('reverse', '8 kyu', 'Strings', 'Reverse a string', 'Return the supplied text with its characters in reverse order.', 'reverseString', 'function reverseString(text) {\n  // Write your solution here.\n}', [{ label: 'reverses a word', args: ['hello'], expected: 'olleh' }, { label: 'handles one character', args: ['a'], expected: 'a' }, { label: 'handles empty text', args: [''], expected: '' }], 'Turn the string into an array, reverse it, then join it.'),
  exercise('first-letter', '8 kyu', 'Strings', 'First character', 'Return the first character of a string. Return an empty string when the input is empty.', 'firstCharacter', 'function firstCharacter(text) {\n  // Write your solution here.\n}', [{ label: 'returns the first letter', args: ['code'], expected: 'c' }, { label: 'handles empty text', args: [''], expected: '' }], 'The first index in a string is 0.'),
  exercise('remove-spaces', '8 kyu', 'Strings', 'Remove spaces', 'Return the text without any space characters.', 'removeSpaces', 'function removeSpaces(text) {\n  // Write your solution here.\n}', [{ label: 'removes spaces between words', args: ['a b c'], expected: 'abc' }, { label: 'removes leading and trailing spaces', args: ['  ready  '], expected: 'ready' }], 'split(" ").join("") removes every ordinary space.'),
  exercise('sum-two', '8 kyu', 'Arrays', 'Sum an array', 'Return the total of all numbers in an array. An empty array has a total of 0.', 'sumArray', 'function sumArray(numbers) {\n  // Write your solution here.\n}', [{ label: 'adds several numbers', args: [[1, 2, 3]], expected: 6 }, { label: 'handles negative numbers', args: [[-2, 5]], expected: 3 }, { label: 'handles an empty array', args: [[]], expected: 0 }], 'Start a running total at 0 and loop through the numbers.'),
  exercise('array-text', '8 kyu', 'Arrays', 'Array to sentence', 'Join an array of words with a single space between each word.', 'arrayToSentence', 'function arrayToSentence(words) {\n  // Write your solution here.\n}', [{ label: 'joins several words', args: [['learn', 'by', 'doing']], expected: 'learn by doing' }, { label: 'joins an empty array', args: [[]], expected: '' }], 'Array.join accepts the separator to use.'),
  exercise('has-item', '8 kyu', 'Arrays', 'Contains an item', 'Return true when an array contains the supplied value, otherwise return false.', 'hasItem', 'function hasItem(items, target) {\n  // Write your solution here.\n}', [{ label: 'finds an existing item', args: [['red', 'blue'], 'blue'], expected: true }, { label: 'rejects a missing item', args: [['red', 'blue'], 'green'], expected: false }], 'Array.includes returns a boolean.'),
  exercise('get-name', '8 kyu', 'Objects', 'Get a property', 'Return the name property from a person object.', 'getName', 'function getName(person) {\n  // Write your solution here.\n}', [{ label: 'gets the name', args: [{ name: 'Mina', age: 20 }], expected: 'Mina' }, { label: 'works with another object', args: [{ name: 'Kai' }], expected: 'Kai' }], 'Use dot notation: person.name.'),
  exercise('has-key', '8 kyu', 'Objects', 'Has a key', 'Return true when an object has the requested own property.', 'hasKey', 'function hasKey(object, key) {\n  // Write your solution here.\n}', [{ label: 'finds an existing key', args: [{ color: 'red' }, 'color'], expected: true }, { label: 'rejects an absent key', args: [{ color: 'red' }, 'size'], expected: false }], 'Object.hasOwn(object, key) checks an own property.'),

  // 7 kyu — combine the first tools
  exercise('positive-sum', '7 kyu', 'Arrays', 'Sum only positive values', 'Return the sum of only the positive numbers in an array.', 'positiveSum', 'function positiveSum(numbers) {\n  // Write your solution here.\n}', [{ label: 'adds positive values only', args: [[1, -4, 7, 12]], expected: 20 }, { label: 'returns zero when none are positive', args: [[-1, -2, 0]], expected: 0 }], 'filter positive numbers before summing them.'),
  exercise('vowel-count', '7 kyu', 'Strings', 'Count vowels', 'Return how many vowels appear in a string. Treat a, e, i, o, and u as vowels.', 'countVowels', 'function countVowels(text) {\n  // Write your solution here.\n}', [{ label: 'counts lowercase vowels', args: ['education'], expected: 5 }, { label: 'handles no vowels', args: ['rhythms'], expected: 0 }, { label: 'handles uppercase vowels', args: ['AEI'], expected: 3 }], 'Convert to lowercase, then test whether "aeiou" includes each letter.'),
  exercise('shortest-word', '7 kyu', 'Strings', 'Shortest word length', 'Return the length of the shortest word in a sentence.', 'shortestWordLength', 'function shortestWordLength(sentence) {\n  // Write your solution here.\n}', [{ label: 'finds the shortest word', args: ['code every single day'], expected: 3 }, { label: 'handles one word', args: ['focus'], expected: 5 }], 'Split into words, then compare their lengths.'),
  exercise('capitalize', '7 kyu', 'Strings', 'Capitalize words', 'Return a sentence with the first letter of every word capitalized and the rest lowercase.', 'capitalizeWords', 'function capitalizeWords(sentence) {\n  // Write your solution here.\n}', [{ label: 'formats mixed casing', args: ['hello WORLD'], expected: 'Hello World' }, { label: 'formats one word', args: ['jAVaScRiPt'], expected: 'Javascript' }], 'For each word, use word[0].toUpperCase() and word.slice(1).toLowerCase().'),
  exercise('even-values', '7 kyu', 'Arrays', 'Keep even numbers', 'Return a new array containing only the even values from the input array.', 'evenValues', 'function evenValues(numbers) {\n  // Write your solution here.\n}', [{ label: 'keeps even values', args: [[1, 2, 3, 4, 5]], expected: [2, 4] }, { label: 'returns empty when none are even', args: [[1, 3, 5]], expected: [] }], 'A number is even when number % 2 === 0.'),
  exercise('square-values', '7 kyu', 'Arrays', 'Square every number', 'Return a new array where every value has been multiplied by itself.', 'squareValues', 'function squareValues(numbers) {\n  // Write your solution here.\n}', [{ label: 'squares several values', args: [[2, 3, 4]], expected: [4, 9, 16] }, { label: 'handles negative values', args: [[-2, 0]], expected: [4, 0] }], 'map() is made for transforming every item.'),
  exercise('smallest', '7 kyu', 'Arrays', 'Find the smallest number', 'Return the smallest number in a non-empty array.', 'findSmallest', 'function findSmallest(numbers) {\n  // Write your solution here.\n}', [{ label: 'finds a middle value', args: [[9, 2, 7]], expected: 2 }, { label: 'handles negative values', args: [[-1, -8, 4]], expected: -8 }], 'Math.min can accept an array when you spread it: Math.min(...numbers).'),
  exercise('initials', '7 kyu', 'Strings', 'Get initials', 'Return the uppercase initials of a first and last name, separated by a period.', 'initials', 'function initials(firstName, lastName) {\n  // Write your solution here.\n}', [{ label: 'formats initials', args: ['mina', 'santos'], expected: 'M.S.' }, { label: 'uses uppercase initials', args: ['Kai', 'Lee'], expected: 'K.L.' }], 'Take index 0 from each name and convert it to uppercase.'),
  exercise('pick', '7 kyu', 'Objects', 'Pick properties', 'Return a new object containing only the requested keys that exist in the source object.', 'pick', 'function pick(object, keys) {\n  // Write your solution here.\n}', [{ label: 'picks requested properties', args: [{ name: 'Mina', age: 20, city: 'Manila' }, ['name', 'city']], expected: { name: 'Mina', city: 'Manila' } }, { label: 'ignores missing keys', args: [{ name: 'Kai' }, ['name', 'age']], expected: { name: 'Kai' } }], 'Start with {}, then loop through keys and copy only existing ones.'),
  exercise('object-keys', '7 kyu', 'Objects', 'List object keys', 'Return an array with all of an object’s own keys.', 'listKeys', 'function listKeys(object) {\n  // Write your solution here.\n}', [{ label: 'lists several keys', args: [{ name: 'Mina', score: 12 }], expected: ['name', 'score'] }, { label: 'handles an empty object', args: [{}], expected: [] }], 'Object.keys(object) does exactly this.'),

  // 6 kyu — multi-step transformations
  exercise('unique-values', '6 kyu', 'Arrays', 'Keep unique values', 'Return a new array containing each value once while preserving first-seen order.', 'uniqueValues', 'function uniqueValues(values) {\n  // Write your solution here.\n}', [{ label: 'removes repeated values', args: [['red', 'blue', 'red']], expected: ['red', 'blue'] }, { label: 'keeps the original order', args: [['b', 'a', 'b', 'c', 'a']], expected: ['b', 'a', 'c'] }, { label: 'handles an empty array', args: [[]], expected: [] }], 'A Set stores each value once and remembers insertion order.'),
  exercise('isogram', '6 kyu', 'Strings', 'Isogram check', 'Return true if a word has no repeating letters, ignoring letter case.', 'isIsogram', 'function isIsogram(word) {\n  // Write your solution here.\n}', [{ label: 'accepts unique letters', args: ['Dermatoglyphics'], expected: true }, { label: 'rejects repeated letters', args: ['aba'], expected: false }, { label: 'accepts empty text', args: [''], expected: true }], 'Compare the length of a lowercased word with the size of a Set made from it.'),
  exercise('longest-word', '6 kyu', 'Strings', 'Find the longest word', 'Return the first longest word in a sentence.', 'longestWord', 'function longestWord(sentence) {\n  // Write your solution here.\n}', [{ label: 'finds a longest word', args: ['write small useful functions'], expected: 'functions' }, { label: 'keeps the first tie', args: ['code with care'], expected: 'code' }], 'Keep a current best word and replace it only when you find a longer one.'),
  exercise('word-count', '6 kyu', 'Strings', 'Count words', 'Return an object mapping each lowercase word to the number of times it occurs. Words are separated by spaces.', 'wordCount', 'function wordCount(sentence) {\n  // Write your solution here.\n}', [{ label: 'counts repeated words', args: ['code code learn'], expected: { code: 2, learn: 1 } }, { label: 'normalizes casing', args: ['Go go GO'], expected: { go: 3 } }], 'Use an object as a counter: counts[word] = (counts[word] || 0) + 1.'),
  exercise('move-zeroes', '6 kyu', 'Arrays', 'Move zeroes to the end', 'Return a new array with every zero moved to the end. Keep the order of all other values.', 'moveZeroes', 'function moveZeroes(numbers) {\n  // Write your solution here.\n}', [{ label: 'moves zeroes to the end', args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] }, { label: 'keeps an array without zeroes', args: [[4, 2]], expected: [4, 2] }], 'Filter non-zero values and zero values separately, then combine them.'),
  exercise('chunk', '6 kyu', 'Arrays', 'Chunk an array', 'Split an array into smaller arrays of the requested size. The final chunk may be shorter.', 'chunk', 'function chunk(values, size) {\n  // Write your solution here.\n}', [{ label: 'splits into even chunks', args: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] }, { label: 'keeps a final short chunk', args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] }], 'Loop forward by size and use slice(index, index + size).'),
  exercise('difference', '6 kyu', 'Arrays', 'Array difference', 'Return values from the first array that do not appear in the second array.', 'arrayDifference', 'function arrayDifference(first, second) {\n  // Write your solution here.\n}', [{ label: 'removes matching values', args: [[1, 2, 2, 3], [2]], expected: [1, 3] }, { label: 'keeps all when second is empty', args: [[1, 2], []], expected: [1, 2] }], 'filter the first array using !second.includes(value).'),
  exercise('pluck', '6 kyu', 'Objects', 'Pluck a property', 'Return an array of a property value from every object. Use undefined when an object does not have that property.', 'pluck', 'function pluck(items, key) {\n  // Write your solution here.\n}', [{ label: 'collects names', args: [[{ name: 'Mina' }, { name: 'Kai' }], 'name'], expected: ['Mina', 'Kai'] }, { label: 'returns undefined for a missing property', args: [[{ name: 'Mina' }, {}], 'name'], expected: ['Mina', undefined] }], 'Map each object to object[key].'),
  exercise('rename-key', '6 kyu', 'Objects', 'Rename an object key', 'Return a new object with oldKey renamed to newKey. Do not change the original object.', 'renameKey', 'function renameKey(object, oldKey, newKey) {\n  // Write your solution here.\n}', [{ label: 'renames a property', args: [{ firstName: 'Mina', age: 20 }, 'firstName', 'name'], expected: { name: 'Mina', age: 20 } }, { label: 'keeps object when key is absent', args: [{ age: 20 }, 'name', 'firstName'], expected: { age: 20 } }], 'Make a copy with spread syntax, then add and remove properties on the copy.'),
  exercise('active-names', '6 kyu', 'Objects', 'Active user names', 'Given users with name and active properties, return the names of only active users.', 'activeUserNames', 'function activeUserNames(users) {\n  // Write your solution here.\n}', [{ label: 'filters then maps users', args: [[{ name: 'Mina', active: true }, { name: 'Kai', active: false }, { name: 'Ari', active: true }]], expected: ['Mina', 'Ari'] }, { label: 'handles no active users', args: [[{ name: 'Kai', active: false }]], expected: [] }], 'First filter on user.active, then map to user.name.'),

  // 5 kyu — useful data operations
  exercise('frequency-map', '5 kyu', 'Arrays', 'Build a frequency map', 'Return an object that counts how often each value appears in an array of strings.', 'frequencyMap', 'function frequencyMap(values) {\n  // Write your solution here.\n}', [{ label: 'counts several values', args: [['red', 'blue', 'red', 'green', 'blue', 'red']], expected: { red: 3, blue: 2, green: 1 } }, { label: 'handles an empty array', args: [[]], expected: {} }], 'Use an object accumulator and increase the count for every value.'),
  exercise('most-frequent', '5 kyu', 'Arrays', 'Most frequent value', 'Return the first value with the highest frequency in a non-empty array of strings.', 'mostFrequent', 'function mostFrequent(values) {\n  // Write your solution here.\n}', [{ label: 'finds the common value', args: [['a', 'b', 'a', 'c', 'a', 'b']], expected: 'a' }, { label: 'keeps the first value in a tie', args: [['red', 'blue', 'red', 'blue']], expected: 'red' }], 'Build counts first, then walk the original array to keep tie behavior predictable.'),
  exercise('rotate', '5 kyu', 'Arrays', 'Rotate an array', 'Return a new array rotated right by steps. A step of 1 moves the last item to the front.', 'rotateRight', 'function rotateRight(values, steps) {\n  // Write your solution here.\n}', [{ label: 'rotates once', args: [[1, 2, 3, 4], 1], expected: [4, 1, 2, 3] }, { label: 'rotates several times', args: [['a', 'b', 'c'], 2], expected: ['b', 'c', 'a'] }, { label: 'wraps large step counts', args: [[1, 2, 3], 4], expected: [3, 1, 2] }], 'Use steps % values.length, then combine two slices.'),
  exercise('flatten-one', '5 kyu', 'Arrays', 'Flatten one level', 'Return a new array that flattens exactly one level of nested arrays.', 'flattenOne', 'function flattenOne(values) {\n  // Write your solution here.\n}', [{ label: 'flattens nested arrays once', args: [[1, [2, 3], [4], 5]], expected: [1, 2, 3, 4, 5] }, { label: 'keeps deeper nesting', args: [[[1, [2]]]], expected: [1, [2]] }], 'Array.flat(1) flattens one level.'),
  exercise('group-by-length', '5 kyu', 'Strings', 'Group words by length', 'Return an object where each key is a word length and each value is an array of words with that length, in input order.', 'groupByLength', 'function groupByLength(words) {\n  // Write your solution here.\n}', [{ label: 'groups words by character count', args: [['a', 'to', 'cat', 'go', 'dog']], expected: { 1: ['a'], 2: ['to', 'go'], 3: ['cat', 'dog'] } }, { label: 'handles no words', args: [[]], expected: {} }], 'Use word.length as the property key and create each bucket when needed.'),
  exercise('inventory-total', '5 kyu', 'Objects', 'Inventory total', 'Return the total value of an inventory: each item has price and quantity properties.', 'inventoryTotal', 'function inventoryTotal(items) {\n  // Write your solution here.\n}', [{ label: 'adds each item value', args: [[{ price: 5, quantity: 2 }, { price: 3, quantity: 4 }]], expected: 22 }, { label: 'handles empty inventory', args: [[]], expected: 0 }], 'For every item, add item.price * item.quantity to a running total.'),
  exercise('score-summary', '5 kyu', 'Objects', 'Score summary', 'Return an object with count, total, and average for an array of score objects with a value property. The average of an empty array is 0.', 'scoreSummary', 'function scoreSummary(scores) {\n  // Write your solution here.\n}', [{ label: 'summarizes scores', args: [[{ value: 10 }, { value: 20 }, { value: 15 }]], expected: { count: 3, total: 45, average: 15 } }, { label: 'handles no scores', args: [[]], expected: { count: 0, total: 0, average: 0 } }], 'Calculate the total first, then average is total / count when count is not zero.'),
  exercise('index-by-id', '5 kyu', 'Objects', 'Index records by id', 'Return an object keyed by id from an array of records. Each input record has an id property.', 'indexById', 'function indexById(records) {\n  // Write your solution here.\n}', [{ label: 'creates an id lookup', args: [[{ id: 'a1', name: 'Mina' }, { id: 'b2', name: 'Kai' }]], expected: { a1: { id: 'a1', name: 'Mina' }, b2: { id: 'b2', name: 'Kai' } } }, { label: 'handles empty records', args: [[]], expected: {} }], 'Create an empty object and assign result[record.id] = record for every record.'),
]
