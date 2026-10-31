export type Topic = 'Fundamentals' | 'Strings' | 'Arrays' | 'Objects' | 'Modern JS'
export type Kyu = '8 kyu' | '7 kyu' | '6 kyu' | '5 kyu'

export type Lesson = {
  id: string
  order: number
  title: string
  topic: Topic
  summary: string
  sections: { title: string; body: string[]; code?: string; table?: { head: string[]; rows: string[][] } }[]
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
    title: 'Variables, Scope, and Hoisting',
    summary: 'Understand what variables are, how let and const differ, how scope works, and when to choose each declaration.',
    sections: [
      {
        title: 'Mental model: a box with a label',
        body: [
          'A variable is a named box that holds a value. You create it once, then write its name anywhere you need the value inside. Stick a new label on the same box and you lose the old label — but the value inside stays until you replace it.',
          'Every variable has three moments: declaration (creating the box), assignment (putting a value in), and read (looking inside). Understanding these moments separately makes scope and hoisting intuitive.',
        ],
        code: 'let score;          // declaration\nscore = 10;         // assignment\nconsole.log(score); // read',
      },
      {
        title: 'let: bind once, reassign freely',
        body: [
          '`let` creates a variable whose binding can be updated. You declare it once in a scope but can reassign as many times as you need.',
          '`let` is block-scoped. The variable only exists inside the nearest `{ }` block — an if body, a for loop, or a raw block you write yourself.',
          'You cannot redeclare a `let` variable in the same scope. `let x = 1; let x = 2;` is a SyntaxError. This catches accidental overwrites.',
        ],
        code: 'let count = 0;\ncount = count + 1;\nconsole.log(count); // 1',
      },
      {
        title: 'const: bind once, never reassign',
        body: [
          '`const` creates a variable whose binding cannot change. Once a value is assigned, you cannot point the name at a different value.',
          '`const` is NOT about immutability. A `const` object or array can still have its contents changed. The binding is locked; the value is not frozen.',
          'Use `const` by default. It signals "this binding will not change" and prevents accidental reassignment. Only reach for `let` when the binding itself must change.',
        ],
        code: 'const name = "Mina";\n// name = "Kai"; // Error\n\nconst scores = [1, 2, 3];\nscores.push(4); // allowed — value mutated, not reassigned',
      },
      {
        title: 'let vs const: which one when?',
        body: [],
        table: {
          head: ['', 'let', 'const'],
          rows: [
            ['Reassignable?', 'Yes', 'No'],
            ['Block-scoped?', 'Yes', 'Yes'],
            ['Can redeclare?', 'No', 'No'],
            ['Value mutable?', 'Yes', 'Yes'],
            ['Best for...', 'Counters, flags, accumulators', 'Values that should not be rebound'],
          ],
        },
      },
      {
        title: 'Block scope',
        body: [
          'A block is code between `{ }`. Variables declared with `let` and `const` are visible only inside their block — not outside. This is block scope.',
          'Before `let` and `const`, JavaScript only had function scope via `var`. Today, block scope is the standard behavior — treat it as the default.',
          'Each `{ }` pair creates a new scope. A variable declared inside an `if` block does not leak out. `for` loop counters declared with `let` are scoped to the loop.',
        ],
        code: 'if (true) {\n  let x = 10;\n  console.log(x); // 10\n}\n// console.log(x); // ReferenceError — x is not defined here',
      },
      {
        title: 'Nested scope and the scope chain',
        body: [
          'Functions can nest inside other functions. Each function creates its own scope. An inner scope can read variables from all outer scopes — this is the scope chain.',
          'JavaScript looks up the chain to resolve names. If it reaches the global scope without finding the variable, you get a ReferenceError (in strict mode).',
          'The lookup goes outward, not inward. An outer scope cannot reach into an inner scope and read its variables.',
        ],
        code: 'function outer() {\n  const a = 1;\n  function inner() {\n    const b = 2;\n    console.log(a); // 1 — found in outer scope\n    console.log(b); // 2 — found in own scope\n  }\n  inner();\n  // console.log(b); // ReferenceError — outer cannot reach in\n}',
      },
      {
        title: 'Function scope',
        body: [
          'Every function creates a new scope. Parameters and variables declared inside the function are local to that function. They do not leak out and are not visible to the caller.',
          'Function scope predates block scope in JavaScript. With `let` and `const`, block scope is the finer-grained tool — function scope still applies, but most day-to-day scoping is now block-level.',
          'A function can access variables from its enclosing scopes (closure), but code outside the function cannot access variables inside it. Functions are one-way boundaries.',
        ],
        code: 'function greet(name) {\n  const greeting = `Hello, ${name}`;\n  return greeting;\n}\n\n// console.log(greeting); // ReferenceError — greeting is local to greet',
      },
      {
        title: 'Hoisting: declarations move to the top',
        body: [
          'JavaScript lifts declarations to the top of their scope before running any code. This is hoisting. `let` and `const` hoist too, but accessing them before their declaration line throws a ReferenceError.',
          'Hoisting explains why you can call a function declaration before its definition line. It also explains why `var` behaves strangely — `var` hoists and initializes to `undefined`.',
          'Key rule: declare variables at the top of their scope. The mental model "stuff moves up" is close enough for day-to-day work.',
        ],
        code: 'console.log(x); // undefined (var hoists + initializes)\nvar x = 5;\n\n// console.log(y); // ReferenceError (let hoists but does not initialize)\nlet y = 5;',
      },
      {
        title: 'The Temporal Dead Zone (TDZ)',
        body: [
          'The TDZ is the region between the start of a scope and the line where a `let`/`const` variable is declared. Accessing the variable in this zone throws a ReferenceError.',
          'The TDZ exists because `let` and `const` hoist but do not initialize. They are in an uninitialized state until the declaration line runs.',
          'Practical impact: always declare variables before use. If a function uses a `let` variable from an outer scope, make sure the declaration runs before the function is called.',
        ],
        code: 'function print() {\n  console.log(z); // ReferenceError if z is in TDZ\n}\nlet z = 5;\nprint(); // 5 — z is now initialized',
      },
      {
        title: 'Reassignment vs mutation',
        body: [
          'Reassignment changes what a variable points to: `x = 10`. Mutation changes the contents of the value itself: `arr.push(4)` or `obj.key = "new"`.',
          '`const` prevents reassignment but not mutation. `let` allows both. This distinction matters for objects and arrays.',
          'Immutable patterns (treating values as read-only, returning new copies) eliminate a class of bugs. Prefer them in exercises and test code.',
        ],
        code: 'const arr = [1, 2, 3];\narr.push(4);     // mutation — allowed\n// arr = [5, 6]; // Error — reassignment blocked by const\n\nlet x = 10;\nx = 20;          // reassignment — allowed by let',
      },
      {
        title: 'When you don\'t need a variable',
        body: [
          'Not every intermediate result needs a name. If a value is used once and the expression is clear, inline it. If it is used twice, or the expression is complex, name it.',
          'Naming is for the reader. `const total = items.reduce((sum, i) => sum + i.price, 0)` is worth naming. `const two = 2` is noise.',
          'Long chains of `.map().filter().join()` can be easier to debug when broken into intermediate constants. The cost of a named variable is low; the cost of unclear code is high.',
        ],
      },
    ],
    starterCode: 'const name = "Mina";\nlet score = 3;\n\nscore = score + 1;\nconsole.log(name);\nconsole.log(score);',
  },
  {
    id: 'functions',
    order: 2,
    topic: 'Fundamentals',
    title: 'Functions, Parameters, and Return Values',
    summary: 'Define reusable behavior with clear inputs and outputs. Learn function declarations, expressions, arrow functions, and the difference between returning and logging.',
    sections: [
      {
        title: 'What is a function?',
        body: [
          'A function is a named block of code that performs a specific task. You define it once and call it whenever you need that behavior. Functions are values in JavaScript — you can store them in variables, pass them as arguments, and `return` them from other functions.',
          'Functions reduce duplication. Instead of writing the same calculation in three places, write it once in a function and call it three times. When the logic changes, you update one place.',
        ],
        code: 'function double(number) {\n  return number * 2;\n}\n\n// Calling (invoking) the function:\ndouble(4);  // → 8\ndouble(10); // → 20',
      },
      {
        title: 'Parameters and arguments',
        body: [
          '**Parameters** are the named placeholders in a function definition. **Arguments** are the actual values you pass when calling the function. `function greet(name)` — `name` is the parameter. `greet("Tim")` — `"Tim"` is the argument.',
          'Missing arguments become `undefined`. Extra arguments are ignored (but still accessible via rest syntax in advanced code).',
          'A **default parameter** provides a fallback value when no argument is passed: `function greet(name = "Guest")`. If `greet()` is called with no argument, `name` defaults to `"Guest"`.',
          'Name parameters after the meaning of the data, not its type: `price`, `name`, `items` — not `num`, `str`, `arr`.',
        ],
        code: 'function greet(name = "Guest") {\n  return `Hello, ${name}!`;\n}\n\ngreet("Tim");   // "Hello, Tim!"\ngreet();        // "Hello, Guest!"',
      },
      {
        title: 'Return values',
        body: [
          'The `return` keyword ends function execution and sends a value back to the caller. The caller can store that value, pass it to another function, or use it in an expression.',
          'A function without `return` (or with `return;` and no value) implicitly returns `undefined`. If you need to return multiple values, `return` an object or array.',
        ],
        code: 'function add(a, b) {\n  return a + b;\n}\n\nconst sum = add(3, 4);   // 7\nconst doubled = add(3, 4) * 2; // 14',
      },
      {
        title: 'return is not console.log',
        body: [
          '`console.log` prints a value to the console for debugging. It does NOT send a value back to the caller. A function that only logs and never `return`s produces `undefined` as its result.',
          'This distinction matters in tests and calculations. If `double(4)` logs `8` but returns `undefined`, then `double(4) + 1` is `NaN`, not `9`.',
        ],
        code: 'function badDouble(n) {\n  console.log(n * 2); // displays 8, returns undefined\n}\n\nfunction goodDouble(n) {\n  return n * 2; // returns 8 to the caller\n}\n\nconsole.log(goodDouble(4) + 1); // 9',
      },
      {
        title: 'Early returns',
        body: [
          'You can `return` as soon as a condition is met, before reaching the end of the function. This is called an early return and often makes functions easier to read than deeply nested `if` blocks.',
          'Handle invalid inputs, edge cases, or simple branches first. The main logic at the bottom then reads as the "normal path" without extra indentation.',
        ],
        code: 'function absoluteValue(number) {\n  if (number < 0) {\n    return -number;\n  }\n  return number;\n}',
      },
      {
        title: 'Function declarations',
        body: [
          'A function declaration uses the `function` keyword followed by a name: `function add(a, b) { return a + b; }`. This is the most traditional way to define a function.',
          'Function declarations are **hoisted** — you can call them before their definition line in the source file. This is convenient but can be surprising if you are not expecting it.',
        ],
        code: '// This works — function declarations are hoisted\nconsole.log(add(3, 4)); // 7\n\nfunction add(a, b) {\n  return a + b;\n}',
      },
      {
        title: 'Function expressions',
        body: [
          'A function expression assigns a function to a variable: `const add = function(a, b) { return a + b; };`. The function itself has no name — it is anonymous — but the variable gives it a way to be called.',
          'Unlike declarations, function expressions are NOT hoisted. You must define them before calling them — the same rule as any other variable assigned with `const` or `let`.',
        ],
        code: 'const add = function(a, b) {\n  return a + b;\n};\n\nconsole.log(add(3, 4)); // 7\n// console.log(add(3, 4)); // Error if placed before the definition',
      },
      {
        title: 'Arrow functions',
        body: [
          'Arrow functions are a different function syntax that provides a concise way to write many functions: `(a, b) => a + b`. They are NOT hoisted — you must define them before calling, just like function expressions.',
          '**Implicit return:** when the body is a single expression without braces, the result is automatically returned. `(n) => n * 2` returns `n * 2` without needing the `return` keyword.',
          '**Explicit return:** when you use braces `{ }`, you must use `return` explicitly — just like a regular function. Use braces when the body has multiple statements.',
          '**Single parameter:** parentheses are optional when there is exactly one parameter: `n => n * 2`. Zero or multiple parameters always need parentheses: `() => 42`, `(a, b) => a + b`.',
          'Arrow functions do NOT have their own `this`, `arguments`, or `super` bindings. This matters in object methods and classes — more on that in a later lesson.',
        ],
        code: '// Implicit return — no braces, no return keyword\nconst double = (n) => n * 2;\n\n// Explicit return — braces + return keyword\nconst format = (first, last) => {\n  const full = `${first} ${last}`;\n  return full.trim();\n};\n\n// Single parameter — parentheses optional\nconst square = n => n * n;',
      },
      {
        title: 'Callbacks: passing functions as arguments',
        body: [
          'A **callback** is a function passed to another function as an argument. The receiving function can invoke it as part of its own behavior. Callbacks are everywhere — array methods, event handlers, async code, and Playwright.',
          'A callback can be a declaration, expression, or arrow function. What matters is the **role**: a function passed in to be called later.',
        ],
        code: '// A function that accepts a callback\nfunction runTwice(fn) {\n  fn();\n  fn();\n}\n\nrunTwice(() => console.log("Hello"));\n\n// Everyday example — map()\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);\n// n => n * 2 is the callback',
      },
      {
        title: 'Comparing function forms',
        body: [
          '**In modern JavaScript, arrow functions are very common, especially for short functions and callbacks. Function declarations are also common for named reusable functions. Function expressions are less common but important to recognize when you encounter them.',
        ],
        table: {
          head: ['Type', 'Example', 'Hoisted?', 'Common use'],
          rows: [
            ['Function declaration', '`function foo() {}`', 'Yes', 'Named reusable functions'],
            ['Function expression', '`const foo = function() {}`', 'No', 'Assigning functions to variables'],
            ['Arrow function', '`const foo = () => {}`', 'No', 'Concise functions and callbacks'],
          ],
        },
      },
    ],
    starterCode: 'function double(number) {\n  return number * 2;\n}\n\nconsole.log(double(4));',
  },
  {
    id: 'conditionals',
    order: 3,
    topic: 'Fundamentals',
    title: 'Boolean logic and control flow',
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
          'In an `if / else if / else` chain, only the first matching branch executes. Once a condition is `true`, the remaining branches are skipped entirely.',
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
          '`value == null` is the one widely-accepted use of loose equality — it matches both `null` and `undefined` in a single check. For all other comparisons, prefer strict equality (`===`, `!==`).',
          'For booleans that are already `true` or `false`, write `if (isActive)` rather than `if (isActive === true)`. The extra comparison adds noise without clarity.',
        ],
      },
      {
        title: 'Logical operators: &&, ||, and !',
        body: [
          '`&&` (and) returns the first falsy value, or the last value if all are truthy. `||` (or) returns the first truthy value, or the last value if all are falsy. `!` (not) inverts a boolean.',
          '`&&` and `||` are often used for short-circuit evaluation: `condition && doSomething()` runs `doSomething` only when `condition` is truthy.',
          
        ],
        code: '// && and || return operands, not always booleans\n"hello" && 123;   // 123\n"" && 123;          // ""\n"hello" || 123;   // "hello"\n"" || 123;          // 123\n\n// Practical short-circuit\ncondition && doSomething();\nconst displayName = nickname || "Guest";',
      },
      {
        title: 'Optional chaining: ?.',
        body: [
          '`?.` safely accesses nested properties without crashing when an intermediate value is `null` or `undefined`. If something in the chain is nullish, the whole expression short-circuits to `undefined`.',
          'Optional chaining pairs naturally with `??` to provide fallback values. `user?.profile?.name ?? "Anonymous"` accesses the name if the chain exists, and falls back to "Anonymous" if any link is missing.',
        ],
        code: 'const userName = user?.profile?.name;\n// undefined if user or profile is null/undefined\n\nconst display = user?.profile?.name ?? "Anonymous";\n// Safe access with fallback\n\n// Also works for method calls and array access\nconst first = items?.[0];\nconst result = obj?.method?.();',
      },
      {
        title: 'Nullish coalescing: ??',
        body: [
          '`??` returns the value on the right only when the value on the left is `null` or `undefined`. Unlike `||`, it does not treat `0`, `""`, or `false` as missing — only `null` and `undefined` trigger the fallback.',
          'This matters when valid values can be `0` or an empty string. `count ?? 10` keeps `0` as a valid count; `count || 10` would replace `0` with `10`.',
        ],
        code: 'const count = 0;\nconst bad = count || 10;   // 10 — 0 is falsy\nconst good = count ?? 10;  // 0 — ?? only cares about null/undefined\n\nconst name = "";\nconst display = name ?? "Guest"; // "" — empty string is not null/undefined',
      },
      {
        title: 'Readable conditions',
        body: [
          'Long conditions are hard to parse inline. Extract them into well-named boolean variables: `const isEligible = age >= 18 && hasAccount; if (isEligible) { ... }`.',
          'Avoid negated conditions when a positive name is clearer. Prefer `if (isEmpty)` over `if (!hasItems)` when you can name the positive case naturally.',
          '**Operator precedence:** `&&` binds tighter than `||`, so `a && b || c` is `(a && b) || c`. When mixing them, parentheses make intent explicit and prevent bugs.',
          'Ternary operator (`condition ? a : b`) works for simple either/or values. Avoid chaining nested ternaries — use `if/else` for multi-branch logic.',
        ],
        code: 'const isEven = number % 2 === 0;\nconst label = isEven ? "even" : "odd";',
      },
      {
        title: 'switch as an alternative',
        body: [
          '`switch` compares one expression against multiple `case` values. It is useful when you test the same variable against many exact matches, especially strings or numbers.',
          'Every `case` should usually end with `break` (or `return`) to prevent fall-through into the next `case`. Omitting `break` causes the next `case` to run unintentionally.',
          'For simple two-way or range-based logic, `if/else` is often clearer. Use `switch` when you have many discrete equal-to cases. Note: `switch` uses strict comparison (`===`) when matching `case` values.',
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
          'Strings in JavaScript are zero-indexed: the first character is at index 0, the last at length - 1.',
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
          '`trim` removes whitespace from both ends. `trimStart` and `trimEnd` target one side. `replace` returns a new string with the first match substituted. Use a regex with the `g` flag to replace all occurrences: `text.replace(/a/g, "X")`.',
        ],
        code: 'const email = "  USER@MAIL.COM  ";\nconst normalized = email.trim().toLowerCase();\n\n"hello".includes("ell");      // true\n"file.txt".endsWith(".txt"); // true\n"test".startsWith("te");     // true',
      },
      {
        title: 'Escape sequences and special characters',
        body: [
          'Use \\n for newline, \\t for tab, \\" for a literal quote inside a quoted string, and \\\\ for a literal backslash.',
          'Template literals can span multiple lines without \\n. They also make embedding quotes easier: `She said "hello"`.',
          'For emoji and international text, write characters directly in source when your editor supports UTF-8 — no escape sequences needed.',
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
        code: '// Strings for identifiers — not numbers\nconst zip = "90210";        // keep as string\nconst phone = "+1-555-0199"; // keep as string\n\n// Convert explicitly when needed\nconst n = Number("12");      // 12\nconst s = String(42);        // "42"',
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
        code: '// Case-sensitive trap\nconst items = ["Apple", "apple", "APPLE"];\nitems.filter(w => w.includes("apple")); // ["apple"] — misses "Apple", "APPLE"\n\n// Fix: normalize both sides\nitems.filter(w => w.toLowerCase().includes("apple".toLowerCase()));\n// ["Apple", "apple", "APPLE"]\n\n// Truthiness trap\nconst users = [{ name: "Ari", score: 0 }, { name: "Bea", score: 10 }];\nusers.filter(u => u.score); // [{ name: "Bea", score: 10 }] — Ari lost!\n\n// Fix: explicit check\nusers.filter(u => u.score !== undefined); // both users kept',
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
    id: 'array-query',
    order: 9,
    topic: 'Arrays',
    title: 'Find, some, and every',
    summary: 'Locate specific elements, test conditions across collections, and choose the right query method for the job.',
    sections: [
      {
        title: 'find(): locate one element',
        body: [
          '`find(callback)` returns the first element that satisfies the callback, or `undefined` if none match. It stops searching after the first match — unlike `filter`, which continues to find all matches.',
          'Use `find` when you expect at most one result: lookup by id, find a specific user, locate the first meeting a condition. Use `filter` when you need all matches.',
          'The callback receives `(element, index, array)` — same signature as `map` and `filter`. If you only need the index, use `findIndex` instead (returns `-1` on no match).',
        ],
        code: 'const users = [\n  { id: 1, name: "Ari" },\n  { id: 2, name: "Bea" },\n];\n\nconst bea = users.find(u => u.id === 2);\n// { id: 2, name: "Bea" }\n\nconst none = users.find(u => u.id === 99);\n// undefined',
      },
      {
        title: 'some(): does any element match?',
        body: [
          '`some(callback)` returns `true` if at least one element satisfies the callback. It short-circuits — stops and returns `true` on the first match, without checking remaining elements.',
          'Use `some` for existence checks: "is any user active?", "does this list contain an expired item?", "are there any errors in the response?".',
          '`some` on an empty array always returns `false`. This is logically consistent: an empty array has no element that could satisfy the condition.',
        ],
        code: 'const hasActive = users.some(u => u.active);\n// true if any user is active\n\nconst hasNegative = scores.some(s => s < 0);\n// true if any score is negative\n\n[].some(x => true); // false — empty arrays have no match',
      },
      {
        title: 'every(): do all elements match?',
        body: [
          '`every(callback)` returns `true` only if every element satisfies the callback. It short-circuits — stops and returns `false` on the first failure.',
          'Use `every` for validation checks: "are all scores positive?", "is every user verified?", "do all items have a valid price?".',
          '`every` on an empty array always returns `true` (vacuously true — there is no counterexample). This can surprise you when validating collections that might be empty.',
        ],
        code: 'const allActive = users.every(u => u.active);\n// true only if ALL users are active\n\nconst allValid = inputs.every(i => i.trim() !== "");\n// true if no input is blank\n\n[].every(x => false); // true — vacuous truth',
      },
      {
        title: 'Choosing between find, some, every, filter, includes',
        body: [],
        table: {
          head: ['Method', 'Returns', 'Use when'],
          rows: [
            ['`includes(val)`', 'boolean', 'Checking one exact value in a flat array'],
            ['`some(cb)`', 'boolean', 'Any element meets a condition'],
            ['`every(cb)`', 'boolean', 'All elements meet a condition'],
            ['`find(cb)`', 'element or undefined', 'You need the first matching element itself'],
            ['`filter(cb)`', 'array', 'You need all matching elements'],
          ],
        },
      },
      {
        title: 'Composing queries',
        body: [
          'Combine methods for multi-step checks: `users.filter(u => u.active).every(u => u.score > 10)` — "do all active users have a score above 10?".',
          '`some` and `every` can nest: `teams.every(team => team.members.some(m => m.active))` — "does every team have at least one active member?".',
          'For complex rules, extract named predicates: `const isHighScorer = u => u.score > 100; users.some(isHighScorer)`.',
        ],
        code: '// Do all active users have a score above 10?\nconst allActiveAbove10 = users\n  .filter(u => u.active)\n  .every(u => u.score > 10);\n\n// Does any team have all members active?\nconst anyFullActiveTeam = teams.some(\n  team => team.members.every(m => m.active)\n);',
      },
      {
        title: 'SDET-relevant patterns',
        body: [
          '**Test assertions:** `assert(items.every(i => i.status === "ok"))` validates an entire response array in one line.',
          '**Locator checks:** `locators.some(l => l.isVisible())` checks if any element on the page matches.',
          '**Response validation:** `responses.every(r => r.status === 200)` confirms all API calls succeeded.',
          '**Finding exceptions:** `results.find(r => r.error)` locates the first failed entry in a batch result.',
          '**Empty-state handling:** wrap `find` results in an `if` or use `??` for defaults: `const user = users.find(...) ?? defaultUser`.',
        ],
        code: '// Assert all responses are 200\nassert(responses.every(r => r.status === 200));\n\n// Find first failure for debugging\nconst firstFail = results.find(r => r.status !== 200);\nconsole.log(firstFail?.error);\n\n// Safe find with fallback\nconst config = settings.find(s => s.env === "prod") ?? defaultConfig;',
      },
    ],
    starterCode: 'const scores = [85, 92, 78, 64, 95];\nconst hasFailing = scores.some(s => s < 70);\nconst allPassing = scores.every(s => s >= 60);\nconst firstA = scores.find(s => s >= 90);\n\nconsole.log({ hasFailing, allPassing, firstA });',
  },
  {
    id: 'objects',
    order: 10,
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
    order: 11,
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
  {
    id: 'destructuring',
    order: 12,
    topic: 'Modern JS',
    title: 'Destructuring and spread/rest',
    summary: 'Unpack arrays and objects into variables, merge collections immutably, and capture remaining items with rest syntax.',
    sections: [
      {
        title: 'Array destructuring',
        body: [
          'Destructuring pulls values from an array into named variables in one line: `const [first, second] = [10, 20]`. Position matters — first variable gets index 0, second gets index 1.',
          'Skip elements with empty commas: `const [, second] = [10, 20]`. Useful when you only need certain positions.',
          'Destructuring works with any iterable, including strings and function return values: `const [head, ...tail] = "hello"`.',
        ],
        code: 'const colors = ["red", "green", "blue"];\nconst [primary, secondary] = colors;\n// primary: "red", secondary: "green"\n\nconst [, , third] = colors;\n// third: "blue"',
      },
      {
        title: 'Object destructuring',
        body: [
          'Object destructuring matches by property name, not position: `const { name, age } = user`. The variable names must match the property keys.',
          'Rename with `oldKey: newName`: `const { name: userName, age: userAge } = user`. Useful when the property name collides with an existing variable.',
          'Default values: `const { role = "guest" } = user`. The default only applies when the property is `undefined` — not `null`.',
        ],
        code: 'const user = { name: "Ari", age: 30, active: true };\nconst { name, age } = user;\n// name: "Ari", age: 30\n\nconst { name: userName, role = "guest" } = user;\n// userName: "Ari", role: "guest"',
      },
      {
        title: 'Nested destructuring',
        body: [
          'Destructure nested objects by mirroring the shape: `const { address: { city } } = user`. Intermediate paths are not bound to variables unless you ask for them.',
          'For deeply nested structures, destructure in stages or use optional chaining if any level might be nullish.',
          'Nested array destructuring: `const [[a, b], [c, d]] = [[1, 2], [3, 4]]`.',
        ],
        code: 'const data = {\n  user: {\n    profile: { name: "Ari", email: "a@test.com" }\n  }\n};\nconst { user: { profile: { name, email } } } = data;\n// name: "Ari", email: "a@test.com"',
      },
      {
        title: 'Rest syntax: capturing the remainder',
        body: [
          'Rest `...name` captures remaining items into a new array or object. Always put rest last in the destructuring pattern.',
          'Array rest: `const [head, ...tail] = [1, 2, 3]` → `head: 1, tail: [2, 3]`. Object rest: `const { active, ...details } = user` → picks off `active`, collects rest.',
          'Rest creates a shallow copy. Nested objects inside the rest result still share references with the original.',
        ],
        code: 'const [first, ...rest] = [10, 20, 30, 40];\n// first: 10, rest: [20, 30, 40]\n\nconst { score, ...meta } = { score: 99, name: "Ari", level: 5 };\n// score: 99, meta: { name: "Ari", level: 5 }',
      },
      {
        title: 'Spread: copying and merging',
        body: [
          'Spread expands an iterable: `[...arr]` creates a shallow copy, `{...obj}` creates a shallow copy of an object.',
          'Merge arrays: `[...a, ...b]`. Merge objects: `{...defaults, ...overrides}` — later properties override earlier ones.',
          'Spread replaces `concat`, `Object.assign`, and manual copy loops. Idiomatic in React, Redux, and modern JS.',
        ],
        code: 'const a = [1, 2];\nconst b = [3, 4];\nconst merged = [...a, ...b]; // [1, 2, 3, 4]\n\nconst defaults = { timeout: 5000, retries: 3 };\nconst config = { ...defaults, timeout: 10000 };\n// { timeout: 10000, retries: 3 }',
      },
      {
        title: 'Function parameter destructuring',
        body: [
          'Destructure directly in parameters: `function greet({ name, age })`. The caller passes an object; the function unpacks what it needs.',
          'Combine with defaults: `function fetch({ url, method = "GET" })`. Both the object and properties can have defaults.',
          'Playwright pattern: `test("name", async ({ page }) => { ... })` destructures the test context object.',
        ],
        code: '// Destructure in parameters\nfunction display({ name, age = 0 }) {\n  console.log(`${name} is ${age}`);\n}\n\ndisplay({ name: "Ari" }); // "Ari is 0"\n\n// Playwright pattern\ntest("example", async ({ page }) => {\n  await page.goto("/");\n});',
      },
      {
        title: 'Practical patterns',
        body: [
          '**Swap:** `[a, b] = [b, a]`. **Pick:** `const { name, email } = user`. **Omit:** `const { password, ...safe } = user`.',
          '**Immutable update:** `const updated = { ...user, score: user.score + 1 }`. **Copy before sort:** `const copy = [...items]`.',
          '**Function options:** `function run({ timeout = 5000, retries = 3 } = {})` — destructured parameters with defaults.',
        ],
        code: '// Swap\nlet a = 1, b = 2;\n[a, b] = [b, a];\n\n// Omit sensitive fields\nconst { password, ...publicUser } = user;\n\n// Immutable array add\nconst updated = [...items, newItem];',
      },
    ],
    starterCode: 'const user = { name: "Ari", score: 42, active: true };\nconst { name, score } = user;\nconst [first, ...rest] = [10, 20, 30];\n\nconsole.log({ name, score, first, rest });',

  },
  {
    id: 'reduce',
    order: 13,
    topic: 'Arrays',
    title: 'Reduce and aggregation',
    summary: 'Accumulate arrays into single values, build lookup objects, and know when a simple loop is the clearer choice.',
    sections: [
      {
        title: 'What reduce does',
        body: [
          '`reduce(callback, initialValue)` walks through an array and builds up a single accumulated result. Each iteration receives the running accumulator and the current element, and returns the updated accumulator.',
          'The accumulator can be any type: a number (sum, product), a string (concatenation), an object (index by id), or an array (filter + map in one pass).',
          '`reduce` does not mutate the original array. The accumulator is a separate value you build from scratch.',
        ],
        code: 'const numbers = [1, 2, 3, 4];\n\nconst total = numbers.reduce((sum, n) => sum + n, 0);\n// sum starts at 0, adds each n\n// Iterations: 0+1=1, 1+2=3, 3+3=6, 6+4=10\n// total: 10',
      },
      {
        title: 'The callback signature',
        body: [
          'The callback receives `(accumulator, element, index, array)`. The first two are essential; the last two are available when needed.',
          '`initialValue` sets the starting accumulator and the type of the result. Without it, `reduce` uses the first array element as the initial accumulator and starts iterating from index 1.',
          '**Always provide an initial value.** It makes the return type predictable. An empty array with no initial value throws a TypeError.',
        ],
        code: '// With initial value — safe\nconst sum = [].reduce((acc, n) => acc + n, 0); // 0\n\n// Without initial value — risky\n[1, 2].reduce((acc, n) => acc + n);    // 3 (first element = acc)\n[].reduce((acc, n) => acc + n);        // TypeError!',
      },
      {
        title: 'Sum, count, and numeric aggregation',
        body: [
          'Sum: `arr.reduce((sum, n) => sum + n, 0)`. Count matching: `arr.reduce((count, n) => n > 0 ? count + 1 : count, 0)`. Average: sum first, then divide by length.',
          'Max: `arr.reduce((max, n) => n > max ? n : max, -Infinity)`. Min: same pattern with `Infinity`. These work but `Math.max(...arr)` is simpler for flat arrays.',
          'For simple numeric aggregation, a `for...of` loop is often more readable than `reduce`. Use `reduce` when the pipeline benefits from staying in method-chaining style.',
        ],
        code: 'const scores = [85, 92, 78, 95];\n\nconst total = scores.reduce((sum, s) => sum + s, 0);\nconst average = total / scores.length;\n\nconst max = scores.reduce((max, s) => s > max ? s : max, -Infinity);',
      },
      {
        title: 'Building objects and lookup tables',
        body: [
          'Index by id: `records.reduce((obj, r) => ({ ...obj, [r.id]: r }), {})`. Each iteration returns a new object — immutable but creates many intermediate objects.',
          'For large arrays, mutate the accumulator for performance: `records.reduce((obj, r) => { obj[r.id] = r; return obj; }, {})`. Mutation inside `reduce` is acceptable when the accumulator is created fresh.',
          'Group by category: `items.reduce((groups, item) => { (groups[item.type] ??= []).push(item); return groups; }, {})`.',
        ],
        code: 'const users = [\n  { id: "a1", name: "Ari" },\n  { id: "b2", name: "Bea" },\n];\n\nconst byId = users.reduce((obj, u) => {\n  obj[u.id] = u;\n  return obj;\n}, {});\n// { a1: { id: "a1", name: "Ari" }, b2: { id: "b2", name: "Bea" } }',
      },
      {
        title: 'Flatten, filter+map, and combined operations',
        body: [
          'Flatten: `arrays.reduce((flat, arr) => flat.concat(arr), [])` — though `arrays.flat()` is the modern built-in.',
          'Filter + map in one pass: `arr.reduce((result, n) => n > 0 ? [...result, n * 2] : result, [])`. Works but `arr.filter(...).map(...)` is clearer unless performance demands one pass.',
          'Counting frequencies: `str.split("").reduce((freq, ch) => { freq[ch] = (freq[ch] ?? 0) + 1; return freq; }, {})`.',
        ],
        code: '// Frequency count\nconst chars = "hello".split("");\nconst freq = chars.reduce((counts, ch) => {\n  counts[ch] = (counts[ch] ?? 0) + 1;\n  return counts;\n}, {});\n// { h: 1, e: 1, l: 2, o: 1 }',
      },
      {
        title: 'When reduce is the right tool',
        body: [
          'Use `reduce` when the output shape differs from the input shape: array → object, array → number, array → Map.',
          'Use `reduce` when the transformation depends on accumulated state: running total, previous element, index-based grouping.',
          'Use `reduce` when you need to combine multiple operations into one pass for performance on large datasets.',
        ],
      },
      {
        title: 'When NOT to use reduce',
        body: [
          '**Use `map`** when transforming each element 1:1. `arr.reduce((a, n) => [...a, n * 2], [])` is a `map` in disguise — just use `arr.map(n => n * 2)`.',
          '**Use `filter`** when selecting elements. `reduce` with conditional push is `filter` in disguise.',
          '**Use `for...of`** when the logic has multiple branches or early exits. `reduce` runs for every element; you cannot `break` out.',
          'If a reviewer squints at your `reduce`, it is too clever. Clarity beats conciseness.',
        ],
      },
      {
        title: 'SDET-relevant patterns',
        body: [
          '**Aggregating test results:** `results.reduce((summary, r) => ({ passed: summary.passed + (r.status === "pass" ? 1 : 0), failed: summary.failed + (r.status === "fail" ? 1 : 0) }), { passed: 0, failed: 0 })`.',
          '**Building locator maps:** `locators.reduce((map, loc) => { map[loc.name] = loc; return map; }, {})` for quick lookup by test id.',
          '**Merging configs:** `overrides.reduce((merged, override) => ({ ...merged, ...override }), baseConfig)`. Though `Object.assign(baseConfig, ...overrides)` is simpler.',
        ],
        code: '// Summarize test run\nconst results = [\n  { name: "login", status: "pass" },\n  { name: "checkout", status: "fail" },\n  { name: "search", status: "pass" },\n];\n\nconst summary = results.reduce(\n  (acc, r) => ({\n    ...acc,\n    [r.status]: (acc[r.status] ?? 0) + 1,\n  }),\n  { pass: 0, fail: 0 }\n);\n// { pass: 2, fail: 1 }',
      },
    ],
    starterCode: 'const numbers = [1, 2, 3, 4, 5];\nconst total = numbers.reduce((sum, n) => sum + n, 0);\nconst evens = numbers.reduce((arr, n) => n % 2 === 0 ? [...arr, n] : arr, []);\n\nconsole.log({ total, evens });',
  },
  {
    id: 'closures',
    order: 14,
    topic: 'Modern JS',
    title: 'Closures and lexical scope',
    summary: 'Understand how functions capture variables from outer scopes, why this matters for callbacks and async code, and how to avoid stale closure bugs.',
    sections: [
      {
        title: 'What is a closure?',
        body: [
          'A closure is a function that remembers the variables from the scope where it was created, even after that scope has finished executing. Every function in JavaScript is a closure.',
          'When you define a function inside another function, the inner function captures references to the outer function\'s variables. Those variables live on as long as the inner function exists.',
          'Closures are not a feature you opt into — they are a fundamental property of how JavaScript functions work. Understanding them explains most "weird" behavior with callbacks and async code.',
        ],
        code: 'function createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n// count is "closed over" — only counter() can access it',
      },
      {
        title: 'Lexical scope: where you define matters',
        body: [
          'Lexical scope means a function\'s access to variables is determined by where it is *defined* in the source code, not where it is *called*. This is static — you can read the code and know what variables are available.',
          'Every scope can access variables from its enclosing scopes. The scope chain goes outward: inner function → outer function → global. It never goes inward.',
          'This is distinct from dynamic scope (used by some languages) where variable lookup depends on the call stack. JavaScript uses lexical scope exclusively.',
        ],
        code: 'const outer = "global";\n\nfunction makeFn() {\n  const outer = "local";\n  return function() {\n    return outer; // uses the "local" from makeFn\n  };\n}\n\nconst fn = makeFn();\nconsole.log(fn()); // "local" — definition site, not call site',
      },
      {
        title: 'Closures capture references, not values',
        body: [
          'A closure captures a reference to the variable, not a snapshot of its value at creation time. If the outer variable changes before the inner function runs, the inner function sees the latest value.',
          'This is the root cause of the classic `for` loop + `setTimeout` bug. Every callback captures the same `i` variable, and by the time they run, `i` is at its final value.',
          'The fix: use `let` in `for` loops (each iteration gets its own binding) or create a new scope per iteration with an IIFE or a separate function.',
        ],
        code: '// Bug: all callbacks see the final i\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 3, 3, 3\n\n// Fix: let creates a new binding per iteration\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 0, 1, 2',
      },
      {
        title: 'Stale closures in async code',
        body: [
          'A stale closure happens when an async callback captures a variable that has since changed. The callback runs later with an outdated value.',
          'Common pattern: you fetch data and set it in state, but a previously-scheduled callback still references the old state. This bites React developers and test authors alike.',
          'Fix: use the functional form of state updates (`setCount(prev => prev + 1)`), re-read values inside the callback, or cancel stale operations.',
        ],
        code: '// Stale closure example\nlet count = 0;\n\nasync function delayed() {\n  const captured = count; // snapshot at call time, not execution time\n  await sleep(1000);\n  console.log(captured); // might be stale if count changed\n}\n\n// Better: re-read when needed\nasync function fresh() {\n  await sleep(1000);\n  console.log(count); // reads current value\n}',
      },
      {
        title: 'Practical closure patterns',
        body: [
          '**Data privacy:** closures can create private variables. `createCounter()` returns an object with methods that access `count` — no external code can modify it directly.',
          '**Partial application:** `function multiply(a) { return (b) => a * b; }` — the inner function closes over `a`. `const double = multiply(2); double(5) === 10`.',
          '**Event handlers:** every `addEventListener` callback closes over the scope where it was registered. This is why you can reference local variables inside handlers.',
        ],
        code: '// Partial application with closures\nfunction multiply(a) {\n  return function(b) {\n    return a * b;\n  };\n}\n\nconst double = multiply(2);\nconst triple = multiply(3);\n\nconsole.log(double(5)); // 10\nconsole.log(triple(5)); // 15',
      },
      {
        title: 'SDET-relevant closure patterns',
        body: [
          '**Playwright fixtures:** test fixtures use closures to provide isolated state per test. Each test gets its own `page` because the fixture function creates a new closure.',
          '**Retry logic:** wrapping a flaky operation in a closure lets you capture the operation and its arguments for retry without repeating code.',
          '**Test data factories:** `function makeUser(overrides) { return { name: "default", ...overrides }; }` is a simple closure pattern for generating test data.',
        ],
        code: '// Retry wrapper using closures\nfunction withRetry(fn, maxRetries = 3) {\n  return async (...args) => {\n    for (let i = 0; i < maxRetries; i++) {\n      try {\n        return await fn(...args);\n      } catch (e) {\n        if (i === maxRetries - 1) throw e;\n      }\n    }\n  };\n}\n\nconst safeFetch = withRetry(fetch);\nawait safeFetch("/api/data");',
      },
      {
        title: 'When closures surprise you',
        body: [
          '**Loops with `var`:** the oldest closure trap. Use `let` or `forEach` to avoid it.',
          '**useEffect dependencies:** a missing dependency means the callback closes over a stale value. The lint rule `react-hooks/exhaustive-deps` catches this.',
          '**Large memory:** closures keep entire scopes alive. A closure that captures a massive array prevents garbage collection even if it only needs one element.',
          '**Testing:** if a mock function is defined inside a closure, you may be testing stale behavior. Always verify the closure sees the latest mock.',
        ],
      },
    ],
    starterCode: 'function createCounter(initial = 0) {\n  let count = initial;\n  return {\n    increment: () => { count++; return count; },\n    decrement: () => { count--; return count; },\n    getCount: () => count,\n  };\n}\n\nconst counter = createCounter(10);\nconsole.log(counter.increment()); // 11\nconsole.log(counter.getCount());  // 11',
  },
  {
    id: 'this-binding',
    order: 15,
    topic: 'Modern JS',
    title: 'this binding',
    summary: 'Understand how `this` is determined at call time, why arrow functions behave differently, and how to avoid the most common `this` bugs.',
    sections: [
      {
        title: 'What is `this`?',
        body: [
          '`this` is a special keyword that refers to the execution context of a function. Unlike variables resolved through lexical scope, `this` is determined by *how* a function is called, not where it is defined.',
          'The value of `this` depends on the call site: method call (`obj.method()`), standalone call (`fn()`), constructor call (`new Fn()`), or explicit binding (`.call`, `.apply`, `.bind`).',
          'In strict mode (`"use strict"`), standalone function calls have `this === undefined`. In sloppy mode, they default to the global object (`window` in browsers). Modern code should use strict mode.',
        ],
        code: '\'use strict\';\n\nfunction showThis() {\n  return this;\n}\n\nconst obj = {\n  name: \'Ari\',\n  showThis: showThis,\n};\n\nconsole.log(showThis());     // undefined (standalone)\nconsole.log(obj.showThis()); // { name: \'Ari\', showThis: [Function] } (method call)',
      },
      {
        title: 'Method calls: `this` is the object before the dot',
        body: [
          'When a function is called as `obj.method()`, `this` inside `method` refers to `obj`. The object before the `.` becomes `this`. This is the most common and intuitive case.',
          'A function can be a method of one object at one call site and another object\'s method at a different call site. `this` is bound fresh each time the function is called.',
          'If you extract a method and call it standalone, `this` is lost: `const fn = obj.method; fn()` — now `this` is `undefined` (strict) or `globalThis` (sloppy). This is a common bug.',
        ],
        code: 'const user = {\n  name: \'Ari\',\n  greet() {\n    return `Hello, ${this.name}`;\n  },\n};\n\nconsole.log(user.greet()); // "Hello, Ari"\n\nconst greet = user.greet;  // extracted method\n// greet();                // TypeError: Cannot read properties of undefined',
      },
      {
        title: 'Arrow functions do NOT have their own `this`',
        body: [
          'Arrow functions inherit `this` from their enclosing lexical scope. They do not get a new `this` based on how they are called. This makes them predictable for callbacks and nested functions.',
          'In a method defined as an arrow function, `this` comes from the scope where the object literal is defined — usually `undefined` or `globalThis`. Do NOT use arrow functions as object methods.',
          'Inside a `map`/`filter`/`setTimeout` callback, an arrow function keeps the outer `this`. A regular function would lose it (or get `undefined`/`globalThis`).',
        ],
        code: 'const user = {\n  name: \'Ari\',\n  // Arrow as method — BAD: this is from outer scope, not user\n  greetArrow: () => `Hello, ${this?.name}`,\n  // Regular method — GOOD: this = user\n  greet() {\n    // Arrow callback — GOOD: inherits this from greet\n    return [\'Hi\'].map(g => `${g}, ${this.name}`);\n  },\n};\n\nconsole.log(user.greetArrow()); // "Hello, undefined"\nconsole.log(user.greet());      // ["Hi, Ari"]',
      },
      {
        title: '.bind(), .call(), and .apply()',
        body: [
          '`fn.bind(thisArg)` returns a new function with `this` permanently set to `thisArg`. Once bound, `this` cannot be changed — not even with `.call` or as a method.',
          '`fn.call(thisArg, arg1, arg2)` invokes the function immediately with a specific `this` and arguments passed individually.',
          '`fn.apply(thisArg, [args])` is like `.call` but takes arguments as an array. In modern JS, `.call` with spread (`fn.call(obj, ...args)`) is more common.',
        ],
        code: 'function greet(greeting) {\n  return `${greeting}, ${this.name}`;\n}\n\nconst user = { name: \'Ari\' };\n\n// .call — invoke immediately with this\nconsole.log(greet.call(user, \'Hi\'));    // "Hi, Ari"\n\n// .bind — create a new function with fixed this\nconst greetAri = greet.bind(user);\nconsole.log(greetAri(\'Hello\'));          // "Hello, Ari"\n\n// .bind is permanent\nconst other = { name: \'Bea\' };\nconsole.log(greetAri.call(other, \'Hey\')); // "Hey, Ari" (not Bea!)',
      },
      {
        title: 'Class methods and `this`',
        body: [
          'In ES6 classes, methods use `this` to refer to the instance. But if a method is passed as a callback (e.g., to `addEventListener`), `this` is lost.',
          'Two common fixes: bind in the constructor (`this.handleClick = this.handleClick.bind(this)`) or use an arrow class field (`handleClick = () => { ... }`). Arrow fields are the modern preference.',
          'Playwright\'s `test` function uses arrow callbacks, so `this` is typically not an issue in test code. But understanding the binding rules helps when debugging framework behavior.',
        ],
        code: 'class Counter {\n  count = 0;\n\n  // Arrow field — this is always the instance\n  increment = () => {\n    this.count++;\n  };\n\n  // Regular method — this depends on call site\n  decrement() {\n    this.count--;\n  }\n}\n\nconst c = new Counter();\nconst dec = c.decrement;\n// dec(); // TypeError — this is undefined\nc.increment(); // works — arrow field',
      },
      {
        title: 'SDET-relevant `this` patterns',
        body: [
          '**Test context sharing:** if you pass `this` between test hooks in some frameworks, arrow vs regular functions determine whether `this` is shared correctly.',
          '**Page objects:** when using classes for page objects, arrow fields for locators and actions keep `this` bound to the instance.',
          '**Event listeners in browser tests:** `page.evaluate(() => this.innerWidth)` — arrow inside evaluate, `this` refers to the browser\'s `window`. Regular functions have no `this` binding.',
        ],
        code: '// Page object pattern with arrow fields\nclass LoginPage {\n  usernameInput = page.locator(\'#username\');\n  passwordInput = page.locator(\'#password\');\n  submitButton = page.locator(\'button[type="submit"]\');\n\n  // Arrow field keeps this bound\n  login = async (user: string, pass: string) => {\n    await this.usernameInput.fill(user);\n    await this.passwordInput.fill(pass);\n    await this.submitButton.click();\n  };\n}',
      },
      {
        title: 'Quick reference: what `this` is',
        body: [],
        table: {
          head: ['Call style', '`this` value (strict mode)', 'Example'],
          rows: [
            ['Standalone function', '`undefined`', '`fn()`'],
            ['Method call', 'Object before `.`', '`obj.method()`'],
            ['Arrow function', 'Enclosing scope\'s `this`', '`() => this`'],
            ['`.call`/`.apply`', 'First argument', '`fn.call(obj)`'],
            ['`.bind()`', 'Permanently bound value', '`fn.bind(obj)()`'],
            ['`new` constructor', 'New instance object', '`new Fn()`'],
          ],
        },
      },
    ],
    starterCode: 'const user = {\n  name: \'Ari\',\n  greet() {\n    return `Hello, ${this.name}`;\n  },\n};\n\nconsole.log(user.greet()); // "Hello, Ari"\nconst fn = user.greet;\nconsole.log(fn.call({ name: \'Bea\' })); // "Hello, Bea"',
  },
  {
    id: 'async',
    order: 16,
    topic: 'Modern JS',
    title: 'Async/await and Promises',
    summary: 'Handle asynchronous operations with Promises and async/await, understand the event loop, and avoid common async traps in tests.',
    sections: [
      {
        title: 'The problem: JavaScript is single-threaded',
        body: [
          'JavaScript runs one piece of code at a time on the main thread. A long-running operation (network request, file read, timer) would block everything if it ran synchronously.',
          'Async operations let JavaScript "pause" a function, do other work, and resume when the result is ready. This is not multi-threading \u2014 it is cooperative scheduling via the event loop.',
          'Three eras of async JavaScript: callbacks (pre-2015), Promises (ES2015), and async/await (ES2017). async/await is the modern standard; you still need to understand Promises because await works with them.',
        ],
        code: '// Synchronous \u2014 blocks until done\nconst data = fs.readFileSync("file.txt");\nconsole.log(data);\n\n// Asynchronous \u2014 non-blocking\nconst data = await fs.promises.readFile("file.txt");\nconsole.log(data);',
      },
      {
        title: 'Promises: a value that will arrive later',
        body: [
          'A Promise is an object representing a future value. It is in one of three states: pending (not done yet), fulfilled (success with a value), or rejected (failed with an error).',
          '`.then(callback)` registers a handler for when the Promise fulfills. `.catch(callback)` handles rejection. `.finally(callback)` runs regardless of outcome. All return new Promises, enabling chaining.',
          '`Promise.all([a, b])` waits for all to fulfill (or fails fast on first rejection). `Promise.allSettled` waits for all regardless. `Promise.race` resolves with the first to settle.',
        ],
        code: 'fetch("/api/data")\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error("Failed:", err))\n  .finally(() => console.log("Done"));\n\n// Parallel requests\nconst [users, posts] = await Promise.all([\n  fetch("/api/users").then(r => r.json()),\n  fetch("/api/posts").then(r => r.json()),\n]);',
      },
      {
        title: 'async/await: write async code like sync code',
        body: [
          '`async` marks a function as returning a Promise. Inside it, `await` pauses execution until a Promise settles, then unwraps its value. The function appears synchronous but does not block the thread.',
          '`await` can only be used inside `async` functions (or at the top level in ES modules). Forgetting `await` is a common bug \u2014 you get a Promise object instead of its resolved value.',
          'Error handling: wrap `await` in `try/catch`. Without it, a rejected Promise becomes an unhandled rejection. Every `await` that can fail should be inside a `try` block.',
        ],
        code: 'async function getUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    const data = await response.json();\n    return data;\n  } catch (err) {\n    console.error("Failed to fetch user:", err);\n    return null;\n  }\n}',
      },
      {
        title: 'The event loop and microtasks',
        body: [
          'The event loop continuously checks: is the call stack empty? If so, process one task from the microtask queue (Promises, queueMicrotask), then one from the macrotask queue (setTimeout, I/O).',
          'Promise callbacks (`.then`, `await` continuation) go to the microtask queue and run BEFORE the next macrotask. This is why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)`.',
          'Understanding this matters for test ordering: `await` yields to the microtask queue. Two `await`s in sequence run in microtask order, not immediately one after the other.',
        ],
        code: 'console.log("A");\n\nsetTimeout(() => console.log("B"), 0);\n\nPromise.resolve().then(() => console.log("C"));\n\nconsole.log("D");\n\n// Output: A, D, C, B\n// Microtasks (Promise) run before macrotasks (setTimeout)',
      },
      {
        title: 'Common async mistakes',
        body: [
          '**Forgetting `await`:** `const data = fetch(url)` gives you a Promise, not the response. Always `await` (or `.then`) async functions.',
          '**Sequential when parallel is possible:** `await a(); await b();` runs them one after another. If they are independent, use `const [ra, rb] = await Promise.all([a(), b()])`.',
          '**`forEach` with async:** `arr.forEach(async (x) => { await ... })` fires all callbacks but does not wait for them. Use `for...of` with `await` inside for sequential, or `Promise.all(arr.map(...))` for parallel.',
          '**Unhandled rejections:** a Promise that rejects without a `.catch` or `try/catch` crashes the process in Node.js. Always handle errors.',
        ],
        code: '// BAD: forEach does not wait\narr.forEach(async (item) => {\n  await save(item); // fires all saves simultaneously, does not wait\n});\n\n// GOOD: for...of with await (sequential)\nfor (const item of arr) {\n  await save(item); // runs one at a time\n}\n\n// GOOD: Promise.all with map (parallel)\nawait Promise.all(arr.map(item => save(item)));',
      },
      {
        title: 'SDET-relevant async patterns',
        body: [
          '**Playwright tests are async:** every Playwright action returns a Promise. `await page.goto(url)`, `await page.click(selector)`, `await expect(locator).toBeVisible()`.',
          '**Waiting for conditions:** `await page.waitForFunction(() => document.readyState === "complete")` pauses until a condition is true. The callback runs in the browser context.',
          '**API test helpers:** `async function createTestUser(data) { const res = await api.post("/users", data); return res.data; }` \u2014 wrappers that set up and tear down test state.',
          '**Retry with backoff:** `for (let i = 0; i < 3; i++) { try { return await flakyOperation(); } catch { await sleep(1000 * 2**i); } }` \u2014 exponential backoff pattern.',
        ],
        code: '// Playwright test pattern\ntest("user can log in", async ({ page }) => {\n  await page.goto("/login");\n  await page.fill(\'#username\', \'testuser\');\n  await page.fill(\'#password\', \'password\');\n  await page.click(\'button[type="submit"]\');\n  await expect(page.locator(\'.dashboard\')).toBeVisible();\n});',
      },
      {
        title: 'Quick reference',
        body: [],
        table: {
          head: ['Pattern', 'Syntax', 'When'],
          rows: [
            ['Promise chain', '`.then().catch()`', 'Simple sequential'],
            ['async/await', '`await fn()`', 'Readable sequential code'],
            ['Promise.all', '`await Promise.all([a, b])`', 'Independent parallel ops'],
            ['Promise.allSettled', '`await Promise.allSettled([a, b])`', 'All results, ignore failures'],
            ['Promise.race', '`await Promise.race([a, b])`', 'First to complete wins'],
            ['for...of + await', '`for (const x of arr) { await fn(x) }`', 'Sequential with loop'],
          ],
        },
      },
    ],
    starterCode: 'async function fetchUser(id) {\n  // Simulate an API call\n  return new Promise(resolve => {\n    setTimeout(() => resolve({ id, name: `User ${id}` }), 100);\n  });\n}\n\nasync function main() {\n  const user = await fetchUser(1);\n  console.log(user);\n}\n\nmain();',
  },
  {
    id: 'error-handling',
    order: 17,
    topic: 'Modern JS',
    title: 'Error handling',
    summary: 'Catch and handle errors gracefully with try/catch, create custom errors, and write resilient test code that fails with clear messages.',
    sections: [
      {
        title: 'try/catch: the safety net',
        body: [
          '`try { ... } catch (error) { ... }` wraps code that might throw. If an error is thrown inside `try`, execution jumps to `catch` with the error object. Code after the throw in the `try` block does not run.',
          '`finally { ... }` runs regardless of whether an error was thrown or caught. Use it for cleanup: closing connections, resetting state, hiding spinners.',
          'You can throw any value, but always `throw new Error("message")` \u2014 it captures a stack trace. String throws lose the stack.',
        ],
        code: 'function parseJSON(text) {\n  try {\n    return JSON.parse(text);\n  } catch (err) {\n    console.error("Invalid JSON:", err.message);\n    return null;\n  }\n}\n\nparseJSON(\'{"valid": true}\'); // { valid: true }\nparseJSON("not json");        // null (logs error)',
      },
      {
        title: 'The error object',
        body: [
          '`error.message` is a human-readable description. `error.name` is the error type ("Error", "TypeError", "SyntaxError", etc.). `error.stack` is the call stack trace as a string.',
          'Built-in error types: `Error`, `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`, `URIError`. Each is thrown by the runtime in specific situations.',
          'Custom errors: `class ValidationError extends Error { constructor(msg) { super(msg); this.name = "ValidationError"; } }`. Use custom errors to distinguish expected failures from unexpected ones.',
        ],
        code: 'class ValidationError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = "ValidationError";\n  }\n}\n\nfunction validate(user) {\n  if (!user.email) throw new ValidationError("Email is required");\n  if (user.age < 0) throw new ValidationError("Age cannot be negative");\n}\n\ntry {\n  validate({ email: "", age: -1 });\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log("Validation failed:", err.message);\n  } else {\n    throw err; // re-throw unexpected errors\n  }\n}',
      },
      {
        title: 'Re-throwing and selective catching',
        body: [
          'Only catch errors you can handle. If you catch an unexpected error, re-throw it: `catch (err) { if (err instanceof MyError) { ... } else { throw err; } }`.',
          'Catching everything with `catch (err) { }` (empty block) silently swallows errors. This makes bugs impossible to find. At minimum, log the error.',
          '`catch` without a type check catches EVERYTHING \u2014 including programming errors you want to crash on. Be selective.',
        ],
        code: 'async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new HttpError(res.status);\n    return await res.json();\n  } catch (err) {\n    if (err instanceof HttpError) {\n      return { error: err.message };\n    }\n    // Network errors, programming errors \u2014 let them propagate\n    throw err;\n  }\n}',
      },
      {
        title: 'Async error handling',
        body: [
          '`try/catch` works with `await`. If the awaited Promise rejects, the rejection becomes a thrown error caught by `catch`. This is the primary pattern for async error handling.',
          'Without `await`, Promise rejections must be caught with `.catch()`. An unhandled Promise rejection crashes the Node.js process (since Node 15) or shows as an uncaught error in browsers.',
          '`.catch()` on a Promise chain catches errors from any previous `.then()`. Place it at the end of the chain or after specific steps that can fail.',
        ],
        code: '// With await\nasync function load() {\n  try {\n    const data = await fetch("/api/data");\n    return await data.json();\n  } catch (err) {\n    return []; // fallback on any error\n  }\n}\n\n// With .catch()\nfetch("/api/data")\n  .then(res => res.json())\n  .catch(err => []) // fallback\n  .then(data => console.log(data));',
      },
      {
        title: 'Error handling in tests',
        body: [
          '**Assertions throw:** `expect(value).toBe(expected)` throws an AssertionError on failure. The test runner catches it and marks the test as failed.',
          '**Expected errors:** `await expect(asyncFn()).rejects.toThrow("message")` asserts that a Promise rejects with a specific error.',
          '**Cleanup in finally:** use `finally` (or `afterEach`/`afterAll` in test frameworks) to reset state even when a test fails. Without cleanup, one failing test can cascade.',
          '**Debugging failures:** log the full error object, not just `.message`. The `.stack` trace tells you exactly where the failure originated.',
        ],
        code: '// Test expecting an error\ntest("throws on invalid input", async () => {\n  await expect(() => divide(1, 0)).rejects.toThrow("Cannot divide by zero");\n});\n\n// Cleanup in finally\ntest("creates and deletes user", async () => {\n  let userId;\n  try {\n    userId = await createUser({ name: "Test" });\n    const user = await getUser(userId);\n    expect(user.name).toBe("Test");\n  } finally {\n    if (userId) await deleteUser(userId);\n  }\n});',
      },
      {
        title: 'SDET error handling patterns',
        body: [
          '**Retry on flaky operations:** wrap assertions in a retry loop instead of immediately failing. Playwright has built-in auto-waiting and retry for most assertions.',
          '**Graceful degradation:** if a non-critical API call fails, log a warning and continue. Do not crash the entire test suite for one optional check.',
          '**Error aggregation:** collect errors during a test run and report them all at the end. `const errors = []; try { ... } catch (e) { errors.push(e); }`.',
          '**Timeout wrapping:** `Promise.race([operation(), timeout(5000)])` fails if an operation takes too long. Many test frameworks provide this built-in.',
        ],
        code: '// Retry wrapper\nasync function retry(fn, maxAttempts = 3) {\n  for (let attempt = 1; attempt <= maxAttempts; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (attempt === maxAttempts) throw err;\n      await new Promise(r => setTimeout(r, 1000 * attempt));\n    }\n  }\n}\n\n// Usage\nconst result = await retry(() => fetchFlakyEndpoint());',
      },
    ],
    starterCode: 'function safeDivide(a, b) {\n  try {\n    if (b === 0) throw new Error("Cannot divide by zero");\n    return a / b;\n  } catch (err) {\n    console.error(err.message);\n    return null;\n  }\n}\n\nconsole.log(safeDivide(10, 2));  // 5\nconsole.log(safeDivide(10, 0));  // null',
  },
  {
    id: 'modules',
    order: 18,
    topic: 'Modern JS',
    title: 'Modules',
    summary: 'Organize code with import/export, understand named vs default exports, and structure projects for maintainability.',
    sections: [
      {
        title: 'Why modules exist',
        body: [
          'Modules split code into separate files, each with its own scope. Without modules, everything shares a global scope \u2014 name collisions, implicit dependencies, and spaghetti code.',
          'Before ES modules, JavaScript used IIFEs, CommonJS (`require`/`module.exports`), and AMD. ES modules (`import`/`export`) are now the standard, supported natively in browsers and Node.js.',
          'A module is a file. Variables, functions, and classes defined in a module are private to that module unless explicitly exported.',
        ],
        code: '// math.js\nexport function add(a, b) { return a + b; }\nexport function multiply(a, b) { return a * b; }\n\n// app.js\nimport { add, multiply } from "./math.js";\nconsole.log(add(2, 3));      // 5\nconsole.log(multiply(2, 3)); // 6',
      },
      {
        title: 'Named exports vs default exports',
        body: [
          '**Named exports:** `export const fn = ...` or `export { fn }`. Import with `{ fn }`. A module can have many named exports. The import names must match the export names (or use `as` to rename).',
          '**Default export:** `export default fn`. Import without braces: `import fn from ...`. One default per module. The importer chooses the name.',
          '**Re-export:** `export { fn } from "./other.js"` forwards exports without importing them. `export * from "./other.js"` re-exports everything. Useful for barrel files (index.js).',
          'Prefer named exports for most things \u2014 they are explicit and refactoring-friendly. Use default exports for the "main thing" a module provides (a component, a class, a primary function).',
        ],
        code: '// Named export\nexport const PI = 3.14159;\nexport function circleArea(r) { return PI * r * r; }\n\n// Default export\nexport default function greet(name) { return `Hello, ${name}`; }\n\n// Importing\nimport greet, { PI, circleArea } from "./utils.js";\nimport { circleArea as area } from "./utils.js"; // rename on import',
      },
      {
        title: 'Import and export syntax reference',
        body: [],
        table: {
          head: ['Pattern', 'Export', 'Import'],
          rows: [
            ['Named', '`export const x = 1`', '`import { x } from ...`'],
            ['Named (list)', '`export { a, b }`', '`import { a, b } from ...`'],
            ['Default', '`export default fn`', '`import fn from ...`'],
            ['Rename export', 'N/A', '`import { x as y } from ...`'],
            ['Import all', 'N/A', '`import * as mod from ...`'],
            ['Re-export', '`export { x } from ...`', 'N/A'],
            ['Side-effect only', 'N/A', '`import "./styles.css"`'],
          ],
        },
      },
      {
        title: 'Dynamic imports',
        body: [
          '`import("./module.js")` returns a Promise that resolves to the module. This is a dynamic import \u2014 it loads the module at runtime, not at parse time.',
          'Use dynamic imports for code splitting (load on demand), conditional loading (load only if feature flag is on), or when the module path is computed at runtime.',
          'Dynamic imports work anywhere, not just at the top level. They are particularly useful in tests for loading fixtures or configuration based on environment.',
        ],
        code: '// Load on demand\nbutton.addEventListener("click", async () => {\n  const { heavyFunction } = await import("./heavy-module.js");\n  heavyFunction();\n});\n\n// Conditional loading\nconst parser = useNewFormat\n  ? await import("./parser-v2.js")\n  : await import("./parser-v1.js");',
      },
      {
        title: 'CommonJS vs ES modules',
        body: [
          '**CommonJS:** `require("./module")` and `module.exports = ...`. Synchronous, dynamic, runs at require-time. Used by Node.js traditionally. Still common in older projects and some config files.',
          '**ES modules:** `import` and `export`. Static (known at parse time), asynchronous, supports tree-shaking. The modern standard. Used by browsers, newer Node.js (with `"type": "module"`), and bundlers.',
          '**Interop:** ES modules can `import` CommonJS modules (the default export is the `module.exports` value). CommonJS cannot `require` ES modules directly \u2014 use dynamic `import()`.',
        ],
        code: '// CommonJS (Node.js traditional)\nconst fs = require("fs");\nmodule.exports = { readFile: fs.readFileSync };\n\n// ES module (modern)\nimport fs from "fs";\nexport const readFile = fs.readFileSync;\n\n// Dynamic import for CJS interop\nconst esModule = await import("./modern-module.js");',
      },
      {
        title: 'SDET-relevant module patterns',
        body: [
          '**Page object files:** each page object module exports a class or object representing a page. Tests import only the pages they need.',
          '**Test fixtures:** export factory functions that create test data. `export function createUser(overrides) { return { name: "test", ...overrides }; }`.',
          '**Config modules:** export configuration objects that change per environment. `export const config = { baseURL: process.env.BASE_URL ?? "http://localhost:3000" };`.',
          '**Utility barrels:** `export { login } from "./login.js"; export { checkout } from "./checkout.js"` in an index file \u2014 import once, get all helpers.',
        ],
        code: '// pages/index.js (barrel file)\nexport { LoginPage } from "./LoginPage.js";\nexport { DashboardPage } from "./DashboardPage.js";\nexport { CheckoutPage } from "./CheckoutPage.js";\n\n// test file\nimport { LoginPage, DashboardPage } from "../pages/index.js";\n\ntest("checkout flow", async ({ page }) => {\n  const login = new LoginPage(page);\n  await login.login("user", "pass");\n  const dashboard = new DashboardPage(page);\n  await expect(dashboard.welcomeMessage).toBeVisible();\n});',
      },
    ],
    starterCode: '// Export\nconst formatName = (first, last) => `${first} ${last}`;\nconst greet = (name) => `Hello, ${name}`;\n\nexport { formatName, greet };\n\n// Import (in another file)\n// import { formatName, greet } from "./utils.js";\n// console.log(greet(formatName("Ari", "Santos")));',
  },

];

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
];
