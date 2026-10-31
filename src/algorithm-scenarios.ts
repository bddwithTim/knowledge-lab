export type ScenarioId = 'pair-sum' | 'palindrome' | 'remove-duplicates' | 'container-water' | 'merge-sorted' | 'sliding-window' | 'smallest-subarray' | 'two-sum' | 'first-unique' | 'valid-anagram' | 'most-frequent' | 'big-o-1' | 'big-o-n' | 'big-o-n2' | 'big-o-logn' | 'binary-search-classic' | 'binary-search-boundary' | 'linked-list-cycle' | 'find-middle' | 'valid-parens' | 'next-greater' | 'merge-overlapping' | 'insert-interval' | 'range-sum' | 'pivot-index' | 'three-sum' | 'meeting-rooms' | 'activity-selection' | 'jump-game' | 'fib-dp' | 'knapsack' | 'n-queens' | 'permutations'

export type ScenarioStep = {
  description: string
  variables: Record<string, unknown>
  currentLine: number
}

export type VisualStep = {
  items?: (string | number)[]
  leftIndex?: number
  rightIndex?: number
  found?: boolean
  slowIndex?: number
  // merge-arrays fields
  itemsA?: number[]
  itemsB?: number[]
  result?: number[]
  pointerA?: number
  pointerB?: number
  // sliding-window fields
  windowStart?: number
  windowEnd?: number
  windowSum?: number
  // interval-timeline fields
  intervals?: [number, number][]
  current?: number
  conflict?: boolean
  // prefix-array fields
  prefix?: number[]
  queryStart?: number
  queryEnd?: number
  // grid fields
  grid?: number[][]
  gridRow?: number
  gridCol?: number
}

export type Scenario = {
  id: ScenarioId
  category: 'big-o' | 'two-pointer' | 'sliding-window' | 'hash-map' | 'binary-search' | 'fast-slow' | 'stack' | 'merge-interval' | 'prefix-sum' | 'sorting-strategies' | 'greedy' | 'dp' | 'backtracking'
  title: string
  topic: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  debugCode: string
  steps: ScenarioStep[]
  visualType: 'number-cells' | 'char-cells' | 'array-cells' | 'bar-chart' | 'merge-arrays' | 'sliding-window' | 'interval-timeline' | 'prefix-array' | 'grid'
  visualData: VisualStep[]
  whyItWorks: { title: string; body: string[] }
  whenToUseSummary: string
  breakdown: string[]
  jsConcepts: string[]
}

/* Every step includes ALL variables for that scenario — unset ones use '~' */

export const scenarios: Scenario[] = [
  /* ── Pair Sum ───────────────────────────────────── */
  {
    id: 'pair-sum',
    category: 'two-pointer',
    title: 'Pair with target sum',
    topic: 'Opposite ends → middle',
    description: 'Find two numbers in `[1, 3, 4, 6, 8, 11]` that add up to `10`. The array is sorted — so we can use two pointers from each end.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    steps: [
      { currentLine: 2, variables: { left: 0, right: '~', sum: '~' }, description: 'Array: `[1, 3, 4, 6, 8, 11]`. Target: `10`. Start `left` at index `0` (the smallest value).' },
      { currentLine: 3, variables: { left: 0, right: 5, sum: '~' }, description: 'Initialize right pointer at the last index' },
      { currentLine: 5, variables: { left: 0, right: 5, sum: '~' }, description: 'Enter while loop — left (0) < right (5) is true' },
      { currentLine: 6, variables: { left: 0, right: 5, sum: 12 }, description: 'Compute sum: 1 + 11 = 12. Too large.' },
      { currentLine: 9, variables: { left: 0, right: 5, sum: 12 }, description: 'Sum (12) > target (10): move right pointer left' },
      { currentLine: 5, variables: { left: 0, right: 4, sum: 12 }, description: 'Loop again — left (0) < right (4) is true' },
      { currentLine: 6, variables: { left: 0, right: 4, sum: 9 }, description: 'Compute sum: 1 + 8 = 9. Too small.' },
      { currentLine: 8, variables: { left: 0, right: 4, sum: 9 }, description: 'Sum (9) < target (10): move left pointer right' },
      { currentLine: 5, variables: { left: 1, right: 4, sum: 9 }, description: 'Loop again — left (1) < right (4) is true' },
      { currentLine: 6, variables: { left: 1, right: 4, sum: 11 }, description: 'Compute sum: 3 + 8 = 11. Too large.' },
      { currentLine: 9, variables: { left: 1, right: 4, sum: 11 }, description: 'Sum (11) > target (10): move right pointer left' },
      { currentLine: 5, variables: { left: 1, right: 3, sum: 11 }, description: 'Loop again — left (1) < right (3) is true' },
      { currentLine: 6, variables: { left: 1, right: 3, sum: 9 }, description: 'Compute sum: 3 + 6 = 9. Too small.' },
      { currentLine: 8, variables: { left: 1, right: 3, sum: 9 }, description: 'Sum (9) < target (10): move left pointer right' },
      { currentLine: 5, variables: { left: 2, right: 3, sum: 9 }, description: 'Loop again — left (2) < right (3) is true' },
      { currentLine: 6, variables: { left: 2, right: 3, sum: 10 }, description: 'Compute sum: 4 + 6 = 10. Match!' },
      { currentLine: 7, variables: { left: 2, right: 3, sum: 10 }, description: 'sum === target — return [2, 3]' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: -1 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: 5 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: 5 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: 5 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: 4 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: 4 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 0, rightIndex: 4 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 1, rightIndex: 4 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 1, rightIndex: 4 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 1, rightIndex: 4 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 1, rightIndex: 3 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 1, rightIndex: 3 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 1, rightIndex: 3 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 2, rightIndex: 3 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 2, rightIndex: 3 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 2, rightIndex: 3 },
      { items: [1, 3, 4, 6, 8, 11], leftIndex: 2, rightIndex: 3, found: true },
    ],
    whyItWorks: {
      title: 'Sorted order gives every move meaning.',
      body: [
        'When the sum is too large, moving the right pointer left is the only move that can lower it.',
        'When the sum is too small, moving the left pointer right is the only move that can raise it.',
        'Because the array is sorted, you never need to backtrack — each move eliminates multiple pairs at once.',
      ],
    },
    whenToUseSummary: 'Start pointers at both ends, move inward based on whether the current sum is too high or too low.',
    breakdown: [
      'Two pointers start at opposite ends of a sorted array. Add them up. If the sum is too big, move the right pointer left (need a smaller number). If too small, move the left pointer right (need a bigger number). Because the array is **sorted**, each move eliminates not just one pair, but many — and you never need to backtrack.',
      '**Why sorting matters:** When `sum < target`, only a bigger number can help — moving the left pointer gives you exactly that. When `sum > target`, only a smaller number helps — moving the right pointer gives you that. Without sorting, you cannot predict which direction to move.',
      '**Compare to brute force:** Checking every pair with nested loops takes O(n²). For n=100, that is ~5,000 checks. Two pointers does it in O(n) — just 100 steps. The sorted order lets you skip almost all of them.',
      '**Position** — Start `left` at the smallest value (index 0) and `right` at the largest value (last index). Widest possible range.',
      '**Compute** — Add the two values. `sum = arr[left] + arr[right]`.',
      '**Compare** — If `sum === target`, return the indices. If `sum < target`, move `left` forward to a larger value. If `sum > target`, move `right` backward to a smaller value.',
      '**Repeat** — Continue until the pointers meet. If they cross without finding a match, no pair exists.',
      'Moving `left` always gives a larger number and moving `right` always gives a smaller one — thanks to the sorted order. Each step eliminates multiple pairs at once, turning O(n²) into O(n).',
    ],
    jsConcepts: [
      '`===` — strict equality. Checks both value and type. Prefer over `==`.',
      '`++` and `--` — increment/decrement by 1. `left++` is shorthand for `left = left + 1`.',
    ],
  },

  /* ── Palindrome ──────────────────────────────────── */
  {
    id: 'palindrome',
    category: 'two-pointer',
    title: 'Palindrome check',
    topic: 'Opposite ends → middle',
    description: 'Compare characters from both ends, moving inward. If all pairs match, it is a palindrome.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    steps: [
      { currentLine: 2, variables: { left: 0, right: '~', leftChar: '~', rightChar: '~' }, description: 'Initialize left pointer at index 0' },
      { currentLine: 3, variables: { left: 0, right: 6, leftChar: '~', rightChar: '~' }, description: 'Initialize right pointer at last index (6)' },
      { currentLine: 5, variables: { left: 0, right: 6, leftChar: '~', rightChar: '~' }, description: 'Enter while loop — left (0) < right (6) is true' },
      { currentLine: 6, variables: { left: 0, right: 6, leftChar: "'r'", rightChar: "'r'" }, description: 'Compare: str[0] = "r", str[6] = "r". They match.' },
      { currentLine: 7, variables: { left: 0, right: 6, leftChar: "'r'", rightChar: "'r'" }, description: 'Match — advance left pointer → 1' },
      { currentLine: 8, variables: { left: 1, right: 6, leftChar: "'r'", rightChar: "'r'" }, description: 'Advance right pointer → 5' },
      { currentLine: 5, variables: { left: 1, right: 5, leftChar: "'r'", rightChar: "'r'" }, description: 'Loop — left (1) < right (5) is true' },
      { currentLine: 6, variables: { left: 1, right: 5, leftChar: "'a'", rightChar: "'a'" }, description: 'Compare: str[1] = "a", str[5] = "a". They match.' },
      { currentLine: 7, variables: { left: 1, right: 5, leftChar: "'a'", rightChar: "'a'" }, description: 'Match — advance left pointer → 2' },
      { currentLine: 8, variables: { left: 2, right: 5, leftChar: "'a'", rightChar: "'a'" }, description: 'Advance right pointer → 4' },
      { currentLine: 5, variables: { left: 2, right: 4, leftChar: "'a'", rightChar: "'a'" }, description: 'Loop — left (2) < right (4) is true' },
      { currentLine: 6, variables: { left: 2, right: 4, leftChar: "'c'", rightChar: "'c'" }, description: 'Compare: str[2] = "c", str[4] = "c". They match.' },
      { currentLine: 7, variables: { left: 2, right: 4, leftChar: "'c'", rightChar: "'c'" }, description: 'Match — advance left pointer → 3' },
      { currentLine: 8, variables: { left: 3, right: 4, leftChar: "'c'", rightChar: "'c'" }, description: 'Advance right pointer → 3' },
      { currentLine: 5, variables: { left: 3, right: 3, leftChar: "'c'", rightChar: "'c'" }, description: 'Loop check — left (3) < right (3) is false. Exit loop.' },
      { currentLine: 10, variables: { left: 3, right: 3, leftChar: "'c'", rightChar: "'c'" }, description: 'All pairs matched — return true. It is a palindrome.' },
    ],
    visualType: 'char-cells',
    visualData: [
      { items: ['r','a','c','e','c','a','r'], leftIndex: 0, rightIndex: -1 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 0, rightIndex: 6 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 0, rightIndex: 6 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 0, rightIndex: 6 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 1, rightIndex: 6 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 1, rightIndex: 5 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 1, rightIndex: 5 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 1, rightIndex: 5 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 2, rightIndex: 5 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 2, rightIndex: 4 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 2, rightIndex: 4 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 2, rightIndex: 4 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 3, rightIndex: 4 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 3, rightIndex: 3 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 3, rightIndex: 3 },
      { items: ['r','a','c','e','c','a','r'], leftIndex: 3, rightIndex: 3, found: true },
    ],
    whyItWorks: {
      title: 'Symmetry is checked from the outside in.',
      body: [
        'A palindrome reads the same forward and backward, so the first character must equal the last, the second must equal the second-to-last, and so on.',
        'Two pointers work perfectly here because you compare pairs from the ends and work inward — no need to check any pair twice.',
      ],
    },
    whenToUseSummary: 'Compare characters from both ends, moving inward. If all pairs match, return true.',
    breakdown: [
      'Compare the first character with the last, the second with the second-to-last, and so on. Move both pointers inward. If ANY pair does not match, return `false` immediately. If ALL pairs match, it is a palindrome.',
      '**Position** — `left` starts at index 0 (first character). `right` starts at `length - 1` (last character).',
      '**Compare** — Check if `str[left] === str[right]`. If not, stop — not a palindrome.',
      '**Advance** — Both pointers move inward: `left++` and `right--`.',
      '**Finish** — Loop ends when `left >= right`. If we never had a mismatch, return `true`.',
      'Each character is compared at most once. We stop early the moment a mismatch is found — no need to check the rest. A single-character or empty string skips the loop entirely and returns `true`.',
    ],
    jsConcepts: [
      '`str.length` — returns the number of characters in a string.',
      '`str[index]` — accesses a single character at a given position. Zero-indexed.',
      '`!==` — strict inequality. Returns `true` if values differ in type or value.',
    ],
  },

  /* ── Remove Duplicates ───────────────────────────── */
  {
    id: 'remove-duplicates',
    category: 'two-pointer',
    title: 'Remove duplicates in-place',
    topic: 'Same direction · fast/slow',
    description: 'Fast pointer scans for unique values. Slow pointer builds the result in-place. Together, they remove duplicates in a single O(n) pass.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function removeDuplicates(nums) {
  if (nums.length === 0) return [];
  let write = 1;

  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return nums.slice(0, write);
}`,
    steps: [
      { currentLine: 3, variables: { read: '~', write: 1, result: '~' }, description: 'Start `write` at index 1 — we keep the first element and overwrite from there.' },
      { currentLine: 5, variables: { read: 1, write: 1, result: '~' }, description: '`read`=1: nums[1]=1 vs nums[0]=1. Same as previous? Skip — it is a duplicate.' },
      { currentLine: 5, variables: { read: 2, write: 1, result: '~' }, description: '`read`=2: nums[2]=2 vs nums[1]=1. Different! Write 2 at nums[1], then `write`=2.' },
      { currentLine: 5, variables: { read: 3, write: 2, result: '~' }, description: '`read`=3: nums[3]=2 vs nums[2]=2. Same? Skip — duplicate.' },
      { currentLine: 5, variables: { read: 4, write: 2, result: '~' }, description: '`read`=4: nums[4]=3 vs nums[3]=2. Different! Write 3 at nums[2], then `write`=3.' },
      { currentLine: 5, variables: { read: 5, write: 3, result: '~' }, description: '`read`=5: nums[5]=4 vs nums[4]=3. Different! Write 4 at nums[3], then `write`=4.' },
      { currentLine: 5, variables: { read: 6, write: 4, result: '~' }, description: '`read`=6: nums[6]=4 vs nums[5]=4. Same? Skip — duplicate.' },
      { currentLine: 9, variables: { read: 7, write: 4, result: '[1, 2, 3, 4]' }, description: 'Loop done. Return nums.slice(0, 4) = [1, 2, 3, 4].' },
    ],
    visualType: 'array-cells',
    visualData: [
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: -1, slowIndex: 1 },
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: 1, rightIndex: -1, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: 2, rightIndex: -1, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: 3, rightIndex: -1, slowIndex: 2 },
      { items: [1, 2, 3, 2, 3, 4, 4], leftIndex: 4, rightIndex: -1, slowIndex: 2 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: 5, rightIndex: -1, slowIndex: 3 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: 6, rightIndex: -1, slowIndex: 4 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: -1, slowIndex: 4 },
    ],
    whyItWorks: {
      title: 'Compare each element with the last one we kept.',
      body: [
        'Since the array is sorted, duplicates are always next to each other. We just check each element against the last one we pushed to the result.',
        'If different → push. If same → skip. After the loop, the result contains only unique values in their original order.',
      ],
    },
    whenToUseSummary: 'Loop through a sorted array and push only values that differ from the last one in the result. Simple, readable, O(n).',
    breakdown: [
      '**Fast explores. Slow builds the result.** The `read` pointer scans for values it hasn\'t seen before. The `write` pointer marks where the next unique value goes. Together they divide the array into two zones: unique values on the left, unprocessed values on the right.',
      '**Initialize** — The first element is always unique. Start `write` at index 1, reserving position 0 for the first unique value.',
      '**Scan** — `read` moves from left to right starting at index 1 (we already accepted index 0). Because the array is sorted, duplicates are always next to each other.',
      '**Detect** — Compare `nums[read]` with `nums[read - 1]` (the previous element). If they differ, we found a new unique value.',
      '**Write** — Copy the new value to `nums[write]`, then move `write` forward. The old value at that position is overwritten — we do not need it anymore.',
      '**Return** — The first `write` elements now contain all unique values. `slice(0, write)` returns a new array with just those elements (indices 0 through write-1).',
      'The array is divided into unique (left) and unprocessed (right). `write` marks the boundary between them. `read` scans the right side, and whenever it finds a new value, the boundary moves right by one.',
    ],
    jsConcepts: [
      '`slice(start, end)` — returns a new array from `start` up to (but not including) `end`. Does NOT mutate the original array.',
      '`!==` — strict inequality. Checks that two values are NOT equal in both value and type. Prefer over `!=`.',
      'Zero-indexing — array indices start at 0. `arr[0]` is the first element, `arr[arr.length - 1]` is the last.',
    ],
  },

  /* ── Container With Most Water ──────────────────── */
  {
    id: 'container-water',
    category: 'two-pointer',
    title: 'Container with most water',
    topic: 'Opposite ends → middle',
    description: 'Each bar is a wall. Pick two walls — the space between them fills with water up to the shorter wall. Find the pair that holds the most water (width × height).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    maxArea = Math.max(maxArea, h * w);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}`,
    steps: [
      { currentLine: 2, variables: { left: 0, right: '~', maxArea: '~', area: '~', h: '~', w: '~' }, description: 'Initialize left pointer at index 0' },
      { currentLine: 3, variables: { left: 0, right: 8, maxArea: 0, area: '~', h: '~', w: '~' }, description: 'Initialize right pointer at last index (8)' },
      { currentLine: 6, variables: { left: 0, right: 8, maxArea: 0, area: '~', h: '~', w: '~' }, description: 'Enter while loop — left (0) < right (8) is true' },
      { currentLine: 7, variables: { left: 0, right: 8, maxArea: 0, area: 8, h: 1, w: 8 }, description: 'h = min(1, 7) = 1, w = 8 − 0 = 8, area = 1 × 8 = 8' },
      { currentLine: 9, variables: { left: 0, right: 8, maxArea: 8, area: 8, h: 1, w: 8 }, description: 'maxArea updated to 8. height[0]=1 < height[8]=7 → move left right' },
      { currentLine: 6, variables: { left: 1, right: 8, maxArea: 8, area: 8, h: 1, w: 8 }, description: 'Loop — left (1) < right (8) is true' },
      { currentLine: 7, variables: { left: 1, right: 8, maxArea: 8, area: 49, h: 7, w: 7 }, description: 'h = min(8, 7) = 7, w = 8 − 1 = 7, area = 7 × 7 = 49' },
      { currentLine: 9, variables: { left: 1, right: 8, maxArea: 49, area: 49, h: 7, w: 7 }, description: 'maxArea updated to 49. height[1]=8 > height[8]=7 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 7, maxArea: 49, area: 49, h: 7, w: 7 }, description: 'Loop — left (1) < right (7) is true' },
      { currentLine: 7, variables: { left: 1, right: 7, maxArea: 49, area: 18, h: 3, w: 6 }, description: 'h = min(8, 3) = 3, w = 7 − 1 = 6, area = 3 × 6 = 18' },
      { currentLine: 9, variables: { left: 1, right: 7, maxArea: 49, area: 18, h: 3, w: 6 }, description: '18 < 49, maxArea stays 49. height[1]=8 > height[7]=3 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 6, maxArea: 49, area: 18, h: 3, w: 6 }, description: 'Loop — left (1) < right (6) is true' },
      { currentLine: 7, variables: { left: 1, right: 6, maxArea: 49, area: 40, h: 8, w: 5 }, description: 'h = min(8, 8) = 8, w = 6 − 1 = 5, area = 8 × 5 = 40' },
      { currentLine: 9, variables: { left: 1, right: 6, maxArea: 49, area: 40, h: 8, w: 5 }, description: '40 < 49, maxArea stays 49. 8 = 8 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 5, maxArea: 49, area: 40, h: 8, w: 5 }, description: 'Loop — left (1) < right (5) is true' },
      { currentLine: 7, variables: { left: 1, right: 5, maxArea: 49, area: 16, h: 4, w: 4 }, description: 'h = min(8, 4) = 4, w = 5 − 1 = 4, area = 4 × 4 = 16' },
      { currentLine: 9, variables: { left: 1, right: 5, maxArea: 49, area: 16, h: 4, w: 4 }, description: '16 < 49, maxArea stays 49. 8 > 4 → move right left (R → 4)' },
      { currentLine: 6, variables: { left: 1, right: 4, maxArea: 49, area: 16, h: 4, w: 4 }, description: 'Loop — left (1) < right (4) is true' },
      { currentLine: 7, variables: { left: 1, right: 4, maxArea: 49, area: 15, h: 5, w: 3 }, description: 'h = min(8, 5) = 5, w = 4 − 1 = 3, area = 5 × 3 = 15' },
      { currentLine: 9, variables: { left: 1, right: 4, maxArea: 49, area: 15, h: 5, w: 3 }, description: '15 < 49, maxArea stays 49. 8 > 5 → move right left (R → 3)' },
      { currentLine: 6, variables: { left: 1, right: 3, maxArea: 49, area: 15, h: 5, w: 3 }, description: 'Loop — left (1) < right (3) is true' },
      { currentLine: 7, variables: { left: 1, right: 3, maxArea: 49, area: 4, h: 2, w: 2 }, description: 'h = min(8, 2) = 2, w = 3 − 1 = 2, area = 2 × 2 = 4' },
      { currentLine: 9, variables: { left: 1, right: 3, maxArea: 49, area: 4, h: 2, w: 2 }, description: '4 < 49, maxArea stays 49. 8 > 2 → move right left (R → 2)' },
      { currentLine: 6, variables: { left: 1, right: 2, maxArea: 49, area: 4, h: 2, w: 2 }, description: 'Loop — left (1) < right (2) is true' },
      { currentLine: 7, variables: { left: 1, right: 2, maxArea: 49, area: 6, h: 6, w: 1 }, description: 'h = min(8, 6) = 6, w = 2 − 1 = 1, area = 6 × 1 = 6' },
      { currentLine: 9, variables: { left: 1, right: 2, maxArea: 49, area: 6, h: 6, w: 1 }, description: '6 < 49, maxArea stays 49. 8 > 6 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 1, maxArea: 49, area: 6, h: 6, w: 1 }, description: 'Loop — left (1) < right (1) is false. Exit loop.' },
      { currentLine: 12, variables: { left: 1, right: 1, maxArea: 49, area: 6, h: 6, w: 1 }, description: 'Return maxArea = 49. Best pair: bars at index 1 (height 8) and index 8 (height 7). Area = min(8,7) × (8−1) = 7 × 7 = 49.' },
    ],
    visualType: 'bar-chart',
    visualData: [
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 0, rightIndex: -1 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 0, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 0, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 0, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 0, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 8 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 7 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 7 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 7 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 6 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 6 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 6 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 5 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 5 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 5 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 4 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 4 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 4 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 3 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 3 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 3 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 2 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 2 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 2 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 1 },
      { items: [1,8,6,2,5,4,8,3,7], leftIndex: 1, rightIndex: 1 },
    ],
    whyItWorks: {
      title: 'The shorter line is always the bottleneck.',
      body: [
        'The area is limited by the shorter of the two lines. Moving the taller line inward can never increase the area because the width decreases and the height is already capped.',
        'Always move the shorter line inward — this is the only move that could potentially find a taller line and increase the area.',
      ],
    },
    whenToUseSummary: 'Start at both ends, calculate area, and always move the shorter line inward — the width can only decrease.',
    breakdown: [
      'Two walls trap water between them. The water level cannot exceed the **shorter wall** — it would spill over. The area is height × width. Start at the widest possible container (both ends), then always move the shorter wall inward. Why? Because the shorter wall is the bottleneck.',
      '**Why move the shorter side?** The container\'s height is capped by the shorter wall. If you move the taller wall, the width shrinks and the height cannot improve (still limited by the same short wall). Moving the shorter wall is the ONLY move with potential upside — you might find a taller wall.',
      '**Position** — Start `left` at the first wall and `right` at the last. This is the widest possible container.',
      '**Measure** — Compute height (`min` of the two walls) and width (`right - left`). Area = `h × w`.',
      '**Track** — Update `maxArea` if the current area is larger. `Math.max` keeps the best result.',
      '**Move** — Always move the SHORTER wall. This is the key insight. Moving the taller one cannot help — the height stays capped and the width only shrinks.',
      '**Repeat** — Continue until the walls meet. The best area found is the answer.',
      'This eliminates the need to check every pair (O(n²)). By always moving the bottleneck, we guarantee we explore every potentially better container in one O(n) pass.',
    ],
    jsConcepts: [
      '`Math.min(a, b)` — returns the smaller of two numbers.',
      '`Math.max(a, b)` — returns the larger of two numbers.',
    ],
  },

  /* ── Merge Two Sorted Arrays ─────────────────────── */
  {
    id: 'merge-sorted',
    category: 'two-pointer',
    title: 'Merge two sorted arrays',
    topic: 'Two arrays → one sorted',
    description: 'One pointer per array. Compare heads, take the smaller, advance that pointer. Like interleaving two sorted card piles into one. This is the two-array variation of Two Pointers.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    debugCode: `function merge(A, B) {
  const result = [];
  let i = 0, j = 0;

  while (i < A.length && j < B.length) {
    if (A[i] < B[j]) {
      result.push(A[i]);
      i++;
    } else {
      result.push(B[j]);
      j++;
    }
  }
  while (i < A.length) result.push(A[i++]);
  while (j < B.length) result.push(B[j++]);
  return result;
}`,
    steps: [
      { currentLine: 2, variables: { i: 0, j: '~', result: '[]' }, description: 'Initialize pointers: i = 0 (into A)' },
      { currentLine: 2, variables: { i: 0, j: 0, result: '[]' }, description: 'Initialize pointers: j = 0 (into B)' },
      { currentLine: 4, variables: { i: 0, j: 0, result: '[]' }, description: 'Enter while loop. i(0) < 4 and j(0) < 4, both in bounds.' },
      { currentLine: 5, variables: { i: 0, j: 0, result: '[1]' }, description: 'A[0]=1 < B[0]=5? Yes. Push A[0]=1, i++ → i=1.' },
      { currentLine: 4, variables: { i: 1, j: 0, result: '[1]' }, description: 'i(1) < 4 and j(0) < 4, continue loop.' },
      { currentLine: 5, variables: { i: 1, j: 0, result: '[1, 3]' }, description: 'A[1]=3 < B[0]=5? Yes. Push A[1]=3, i++ → i=2.' },
      { currentLine: 4, variables: { i: 2, j: 0, result: '[1, 3]' }, description: 'i(2) < 4 and j(0) < 4, continue loop.' },
      { currentLine: 8, variables: { i: 2, j: 0, result: '[1, 3, 5]' }, description: 'A[2]=7 < B[0]=5? No. Push B[0]=5, j++ → j=1.' },
      { currentLine: 4, variables: { i: 2, j: 1, result: '[1, 3, 5]' }, description: 'i(2) < 4 and j(1) < 4, continue loop.' },
      { currentLine: 5, variables: { i: 2, j: 1, result: '[1, 3, 5, 7]' }, description: 'A[2]=7 < B[1]=6? No (else). Push B[1]=6, j++ → j=2.' },
      { currentLine: 4, variables: { i: 2, j: 2, result: '[1, 3, 5, 7]' }, description: 'i(2) < 4 and j(2) < 4, continue loop.' },
      { currentLine: 5, variables: { i: 2, j: 2, result: '[1, 3, 5, 7, 7]' }, description: 'A[2]=7 < B[2]=8? Yes. Push A[2]=7, i++ → i=3.' },
      { currentLine: 4, variables: { i: 3, j: 2, result: '[1, 3, 5, 7, 7]' }, description: 'i(3) < 4 and j(2) < 4, continue loop.' },
      { currentLine: 5, variables: { i: 3, j: 2, result: '[1, 3, 5, 7, 7, 8]' }, description: 'A[3]=9 < B[2]=8? No. Push B[2]=8, j++ → j=3.' },
      { currentLine: 4, variables: { i: 3, j: 3, result: '[1, 3, 5, 7, 7, 8]' }, description: 'j(3) < 4? Yes, i(3) < 4? Yes. Still in loop.' },
      { currentLine: 8, variables: { i: 3, j: 3, result: '[1, 3, 5, 7, 7, 8, 9]' }, description: 'A[3]=9 < B[3]=10? Yes. Push A[3]=9, i++ → i=4.' },
      { currentLine: 4, variables: { i: 4, j: 3, result: '[1, 3, 5, 7, 7, 8, 9]' }, description: 'i(4) < 4? No. Exit while loop — A is exhausted.' },
      { currentLine: 13, variables: { i: 4, j: 3, result: '[1, 3, 5, 7, 7, 8, 9, 10]' }, description: 'Drain remaining B: push B[3]=10, j++ → j=4. Done.' },
      { currentLine: 14, variables: { i: 4, j: 4, result: '[1, 3, 5, 6, 7, 8, 9, 10]' }, description: 'Return merged result: [1, 3, 5, 6, 7, 8, 9, 10]. Both arrays had 4 elements — result has 8.' },
    ],
    visualType: 'merge-arrays',
    visualData: [
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [], pointerA: 0, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [], pointerA: 0, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [], pointerA: 0, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1], pointerA: 1, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1], pointerA: 1, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3], pointerA: 2, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3], pointerA: 2, pointerB: 0 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5], pointerA: 2, pointerB: 1 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5], pointerA: 2, pointerB: 1 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6], pointerA: 2, pointerB: 2 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6], pointerA: 2, pointerB: 2 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7], pointerA: 3, pointerB: 2 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7], pointerA: 3, pointerB: 2 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7, 8], pointerA: 3, pointerB: 3 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7, 8], pointerA: 3, pointerB: 3 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7, 8, 9], pointerA: 4, pointerB: 3 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7, 8, 9], pointerA: 4, pointerB: 3 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7, 8, 9, 10], pointerA: 4, pointerB: 4 },
      { itemsA: [1,3,7,9], itemsB: [5,6,8,10], result: [1, 3, 5, 6, 7, 8, 9, 10], pointerA: 4, pointerB: 4 },
    ],
    whyItWorks: {
      title: 'Both arrays are already sorted — just interleave.',
      body: [
        'Since A and B are sorted, the smallest unmerged element is always at the front of one of the two. Just compare A[i] and B[j], take the smaller, and advance that pointer.',
        'When one array runs out, drain the rest of the other — no comparisons needed.',
      ],
    },
    whenToUseSummary: 'One pointer per array. Compare heads, take the smaller, advance that pointer. O(n+m) with two independent pointers.',
    breakdown: [
      'You have two sorted piles of cards. Two Pointers doesn&rsquo;t always mean two positions on the same array — here, one pointer tracks each array. Look at the top card of each pile, take the smaller one, and advance that pile&rsquo;s pointer.',
      '**Setup** — Create an empty `result` array. Two pointers `i` and `j` start at the beginning of each input array.',
      '**Compare** — While both arrays still have elements, compare `A[i]` and `B[j]`. Take the smaller one and push it to `result`, then advance that array\'s pointer.',
      '**Drain A** — If B is exhausted but A still has elements, copy all remaining from A. They are already sorted, so just push them in order.',
      '**Drain B** — Same logic for B. Only ONE of these drain loops runs — whichever array runs out second.',
      'Only the current heads of each array compete. Since both arrays are sorted, the smallest remaining element is always at the front of one of them. Three pointers (`i`, `j`, and the implicit result position) produce a merged sorted array in O(n+m).',
    ],
    jsConcepts: [
      '`push(item)` — adds an element to the END of an array. Mutates the array and returns its new length.',
      '`&&` (AND) — both conditions must be true: `i < A.length && j < B.length`.',
      '`i++` inside `A[i++]` — "use the current value of i, then increment it."',
    ],
  },

  /* ── Sliding Window ──────────────────────────────── */
  {
    id: 'sliding-window',
    category: 'two-pointer',
    title: 'Sliding window',
    topic: 'Fixed-size window → max sum',
    description: 'You have a cardboard frame that fits exactly `k=3` numbers at a time. Slide it across the number strip one step at a time. At each stop, add up the numbers inside. Which position gives the biggest total?',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function maxWindowSum(arr, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
    steps: [
      { currentLine: 2, variables: { windowSum: 0, maxSum: '~', i: '~' }, description: 'k=3 is our window size — the frame always shows 3 numbers. Start with an empty frame, windowSum = 0.' },
      { currentLine: 3, variables: { windowSum: 2, maxSum: '~', i: 0 }, description: 'First number enters the frame: 2. Frame sum = 2.' },
      { currentLine: 3, variables: { windowSum: 3, maxSum: '~', i: 1 }, description: 'Next number enters: 1. Frame sum = 2 + 1 = 3.' },
      { currentLine: 3, variables: { windowSum: 8, maxSum: '~', i: 2 }, description: 'Last number for first frame: 5. Frame [2, 1, 5] sum = 8. The frame is full!' },
      { currentLine: 5, variables: { windowSum: 8, maxSum: 8, i: '~' }, description: 'Save this as our best total so far: maxSum = 8.' },
      { currentLine: 7, variables: { windowSum: 8, maxSum: 8, i: 3 }, description: 'Slide the frame right. Number 2 falls out, number 1 enters. New sum: 8 + 1 − 2 = 7.' },
      { currentLine: 8, variables: { windowSum: 7, maxSum: 8, i: 3 }, description: '7 is less than our best (8). Keep looking.' },
      { currentLine: 7, variables: { windowSum: 7, maxSum: 8, i: 4 }, description: 'Slide again. 1 drops out, 3 enters. Frame [5, 1, 3] sum = 7 + 3 − 1 = 9.' },
      { currentLine: 8, variables: { windowSum: 9, maxSum: 9, i: 4 }, description: '9 beats our old best of 8! New best total: 9. 🎉' },
      { currentLine: 7, variables: { windowSum: 9, maxSum: 9, i: 5 }, description: 'Slide one last time. 5 drops out, 2 enters. Frame [1, 3, 2] sum = 9 + 2 − 5 = 6.' },
      { currentLine: 8, variables: { windowSum: 6, maxSum: 9, i: 5 }, description: '6 is lower than 9. No update needed.' },
      { currentLine: 10, variables: { windowSum: 6, maxSum: 9, i: 5 }, description: 'Can\'t slide anymore — we reached the end. The biggest sum we found was 9, from the frame at [5, 1, 3] (indices 2–4).' },
    ],
    visualType: 'sliding-window',
    visualData: [
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: -1, windowEnd: -1, windowSum: 0 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 0, windowSum: 2 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 1, windowSum: 3 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 2, windowSum: 8 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 2, windowSum: 8 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 1, windowEnd: 3, windowSum: 7 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 1, windowEnd: 3, windowSum: 7 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 2, windowEnd: 4, windowSum: 9 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 2, windowEnd: 4, windowSum: 9 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 3, windowEnd: 5, windowSum: 6 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 3, windowEnd: 5, windowSum: 6 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 2, windowEnd: 4, windowSum: 9 },
    ],
    whyItWorks: {
      title: 'Reuse the previous sum — just slide.',
      body: [
        'k is the window size (how many numbers your frame holds). Instead of re-adding all k numbers from scratch (slow!), just subtract the one leaving and add the one entering.',
        'This turns a naive O(n·k) approach into O(n) — each element enters and leaves the window exactly once.',
      ],
    },
    whenToUseSummary: 'Fixed-size subarray problems — slide a window, add incoming element, subtract outgoing. O(n) instead of O(n·k).',
    breakdown: [
      'A cardboard frame shows exactly `k` numbers. First, sum the first `k` numbers. Then slide the frame one step right: the leftmost number falls out, a new number enters on the right. Update the sum by subtracting the one that left and adding the one that entered — do NOT re-add all `k` from scratch.',
      '**Fill** — Add the first `k` elements to get the initial `windowSum`. This is the first frame.',
      '**Save** — Record this sum as `maxSum` — our best so far.',
      '**Slide** — Move the frame right. The element at `i - k` leaves the window; the element at `i` enters. `windowSum += arr[i] - arr[i - k]` updates the sum in ONE operation instead of re-summing all `k` elements.',
      '**Track** — After each slide, update `maxSum` if the new `windowSum` is larger.',
      'Without the sliding window trick, each slide costs O(k) — re-adding all k numbers. With it, each slide costs O(1). Total goes from O(n·k) to O(n). Every element enters and leaves the window exactly once.',
    ],
    jsConcepts: [
      '`+=` — add and assign. `a += b` is shorthand for `a = a + b`.',
      '`Math.max(a, b)` — returns the larger of two numbers.',
    ],
  },

  /* ═════════════════════════════════════════════════════
     BIG O NOTATION SCENARIOS
     ═════════════════════════════════════════════════════ */

  /* ── O(1) — Constant Time ─────────────────────────── */
  {
    id: 'big-o-1',
    category: 'big-o',
    title: 'O(1) — Constant time',
    topic: 'Array access by index',
    description: 'The amount of work stays the same no matter how big the input gets. Adding more items does not mean more steps.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    debugCode: `// O(1): Constant time
// Array access is instant —
// no loops, no searching.

const arr = [7, 2, 9, 4, 1, 6, 3, 8];
const x = arr[3]; // one operation`,
    steps: [
      { currentLine: 5, variables: { result: '~' }, description: '8 items in the array. Accessing index 3 is exactly 1 operation, no matter how big the array is.' },
      { currentLine: 6, variables: { result: 4 }, description: 'The computer knows exactly where arr[3] lives in memory — one jump, one read. 10 items or 10 million, it\'s still 1 step.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [7, 2, 9, 4, 1, 6, 3, 8], leftIndex: 3, rightIndex: -1 },
      { items: [7, 2, 9, 4, 1, 6, 3, 8], leftIndex: 3, rightIndex: -1 },
    ],
    whyItWorks: {
      title: 'Same work, no matter the input size.',
      body: [
        'Array elements live at known memory addresses. The computer calculates: base + (index × elementSize), jumps there, and reads it — all in one step.',
        'O(1) does NOT mean "one second." It means the number of operations does not grow when input grows.',
      ],
    },
    whenToUseSummary: 'Direct access — array index lookups, hash table get/set, stack push/pop. No loops needed.',
    breakdown: [
      'Imagine you have a numbered shelf. You need item #3 — you walk directly to slot 3 and grab it. Whether the shelf has 10 slots or 10,000, finding slot 3 takes the same time. That is O(1).',
      '**Why it works:** The computer knows where every array element lives in memory. `arr[3]` means: take the starting address of the array, add `3 × (size of one element)`, and read what\'s there. One calculation, one memory read.',
      '**No scaling:** The input can be 10 items, 1,000 items, or 10 million items — the number of steps never changes. The cost does not depend on `n`.',
      'O(1) is the best you can get. It means your algorithm won\'t slow down no matter how much data you throw at it. Hash table lookups, stack operations, and array indexing are all O(1).',
    ],
    jsConcepts: [
      '`arr[index]` — bracket notation. Accesses the element at a specific position in an array. Zero-indexed.',
    ],
  },

  /* ── O(n) — Linear Time ───────────────────────────── */
  {
    id: 'big-o-n',
    category: 'big-o',
    title: 'O(n) — Linear time',
    topic: 'Single loop through array',
    description: 'The work grows in direct proportion to the input size. If `n` doubles, the work doubles too. A single loop touching each element once is the classic O(n) pattern.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `// O(n): Linear time
// One loop, visits each element once.

function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
    steps: [
      { currentLine: 4, variables: { total: 0, i: '~' }, description: 'Start with total = 0. The loop will visit each element exactly once.' },
      { currentLine: 5, variables: { total: 7, i: 0 }, description: 'i=0: add arr[0]=7. total = 7. Cost: 1 operation for 1 element.' },
      { currentLine: 5, variables: { total: 9, i: 1 }, description: 'i=1: add arr[1]=2. total = 9. 2 elements → 2 operations so far.' },
      { currentLine: 5, variables: { total: 18, i: 2 }, description: 'i=2: add arr[2]=9. total = 18. 3 elements → 3 operations.' },
      { currentLine: 5, variables: { total: 22, i: 3 }, description: 'i=3: add arr[3]=4. total = 22. Every element costs 1 operation.' },
      { currentLine: 7, variables: { total: 22, i: 4 }, description: 'Loop done. Return total = 22. n elements = n operations → O(n).' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [7, 2, 9, 4], leftIndex: -1, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 0, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 1, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 2, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 3, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: -1, rightIndex: -1 },
    ],
    whyItWorks: {
      title: 'Work grows in direct proportion to input size.',
      body: [
        'If you have 10 items, the loop runs 10 times. If you have 10,000 items, the loop runs 10,000 times. The relationship is linear — double the input, double the work.',
        'O(n) is generally the best you can do if you need to look at every element.',
      ],
    },
    whenToUseSummary: 'Any algorithm that must examine each element once: summing, finding max, linear search.',
    breakdown: [
      'Imagine counting toys in a line. Point at each one and say the number. 10 toys → 10 counts. 100 toys → 100 counts. The work grows at exactly the same rate as the input. That is O(n).',
      '**What is `n`?** In this example, `n` is `arr.length` — the number of items. `n = 4` means the loop runs 4 times. `n = 1,000` means 1,000 times. The work grows proportionally to `n`.',
      '**Linear growth** — if you double the input, you double the work. Triple the input, triple the work. The graph of O(n) is a straight line.',
      'A single `for` loop is the classic O(n) pattern. Each iteration does a constant amount of work, and you visit every element exactly once.',
      'O(n) is often the best you can do if you must examine every element. Examples: summing values, finding the maximum, linear search, counting occurrences.',
    ],
    jsConcepts: [
      '`for (let i = 0; i < arr.length; i++)` — three-part loop: initialize, condition, increment.',
      '`+=` — add and assign. `total += arr[i]` means `total = total + arr[i]`.',
    ],
  },

  /* ── O(n²) — Quadratic Time ───────────────────────── */
  {
    id: 'big-o-n2',
    category: 'big-o',
    title: 'O(n²) — Quadratic time',
    topic: 'Nested loops',
    description: 'For each element, you loop through all elements again. If input doubles, work quadruples. Two nested loops = `n × n` operations.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    debugCode: `// O(n²): Quadratic time
// For each outer i, inner j runs n times.
// Total: n × n = n² operations.

function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}`,
    steps: [
      { currentLine: 5, variables: { i: '~', j: '~', ops: 0 }, description: 'Nested loops: for each i, j runs through all n elements. 4 items → 4×4 = 16 ops.' },
      { currentLine: 6, variables: { i: 0, j: 0, ops: 1 }, description: 'i=0, j=0: print(7,7). 1st of 16 total operations.' },
      { currentLine: 6, variables: { i: 0, j: 1, ops: 5 }, description: 'i=0, j=1..4: j loop completes for i=0. 4 ops done.' },
      { currentLine: 6, variables: { i: 1, j: 0, ops: 9 }, description: 'i=1, j=0..4: j loop completes for i=1. 8 ops done.' },
      { currentLine: 6, variables: { i: 2, j: 0, ops: 13 }, description: 'i=2, j=0..4: j loop completes. 12 ops done.' },
      { currentLine: 8, variables: { i: 3, j: 4, ops: 16 }, description: 'i=3, j=0..4: final loop. Total: 16 operations for 4 elements. For 100 elements → 10,000 ops.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [7, 2, 9, 4], leftIndex: -1, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 0, rightIndex: 0 },
      { items: [7, 2, 9, 4], leftIndex: 0, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 1, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 2, rightIndex: -1 },
      { items: [7, 2, 9, 4], leftIndex: 3, rightIndex: -1 },
    ],
    whyItWorks: {
      title: 'Work explodes as input grows.',
      body: [
        'n=10 → 100 ops. n=100 → 10,000 ops. n=1,000 → 1,000,000 ops. Each time n grows 10×, operations grow 100×.',
        'Nested loops are the most common source of O(n²). Always ask: can I avoid the inner loop?',
      ],
    },
    whenToUseSummary: 'Avoid when possible. Acceptable for small n (<100). Look for O(n log n) or O(n) alternatives.',
    breakdown: [
      'Imagine every person in a room shakes hands with every person (including themselves). 4 people → 4×4 = 16 handshakes. 100 people → 10,000 handshakes. Work grows MUCH faster than input — that is O(n²).',
      '**Nested loops** — An outer loop runs `n` times. For EACH outer iteration, an inner loop runs `n` times. Total: `n × n = n²` operations.',
      '**Important:** Two loops do NOT automatically mean O(n²). Two loops that run one after the other (not inside each other) are just `n + n = 2n`, which simplifies to O(n). Only nested loops multiply.',
      '**Explosive growth** — Multiply `n` by 10 → multiply work by 100. For `n = 1,000`, that is 1,000,000 operations. Things get slow fast.',
      'Nested loops are the most common cause of O(n²). Always ask: can I avoid the inner loop? A hash map or two-pointer approach often reduces O(n²) to O(n).',
    ],
    jsConcepts: [],
  },

  /* ── O(log n) — Logarithmic Time ──────────────────── */
  {
    id: 'big-o-logn',
    category: 'big-o',
    title: 'O(log n) — Logarithmic time',
    topic: 'Binary search',
    description: 'Each step cuts the search space in half. Even with a billion items, you only need about 30 steps. The more data you have, the more efficient this becomes compared to O(n).',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    debugCode: `// O(log n): Logarithmic time
// Each step halves the search space.

function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    let mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    steps: [
      { currentLine: 4, variables: { lo: 0, hi: 7, mid: '~', found: '~' }, description: 'Search for 6 in sorted [1,2,3,4,5,6,7,8]. Start: full range 0–7 (8 elements).' },
      { currentLine: 5, variables: { lo: 0, hi: 7, mid: 3, found: '~' }, description: 'mid = 3 (value 4). 4 < 6 → target is on the right. Discard left half. lo = 4. Now only 4 elements remain.' },
      { currentLine: 5, variables: { lo: 4, hi: 7, mid: 5, found: '~' }, description: 'mid = 5 (value 6). arr[5] === 6? YES! Found after only 2 comparisons — even though there are 8 elements.' },
      { currentLine: 6, variables: { lo: 4, hi: 7, mid: 5, found: 5 }, description: 'Return index 5. 🚀 Cool fact: searching 1 billion sorted items takes only ~30 comparisons. Not a billion — thirty!' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 0, rightIndex: 7 },
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 4, rightIndex: 7 },
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 5, rightIndex: -1, found: true },
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 5, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Halving the search space every step.',
      body: [
        'After k steps, the search space shrinks to n / 2ᵏ elements. We stop when this is ≤ 1, so k ≈ log₂(n).',
        'That\'s why binary search on a million items takes ~20 steps, not a million. Growing n from 1 million to 1 billion only adds ~10 more steps.',
      ],
    },
    whenToUseSummary: 'Searching in sorted data. Each comparison eliminates half of the remaining elements.',
    breakdown: [
      'You\'re looking for a word in a dictionary. Instead of flipping page by page (O(n)), open to the middle, see whether your word comes before or after, and throw away half the dictionary. Repeat. A million-page dictionary needs only ~20 flips.',
      '**How it works:** Start with the full range. Compute `mid = Math.floor((lo + hi) / 2)`. If `target > mid`, search the right half (`lo = mid + 1`). If `target < mid`, search the left half (`hi = mid - 1`). Each comparison eliminates HALF the remaining elements — not just one.',
      '**Visualize the halving:** 8 → 4 → 2 → 1. With 8 elements, binary search needs at most 3 comparisons. With 1,000 elements: ~10. With 1 billion: ~30.',
      '🚀 **Why O(log n) is so fast:** Growing from 1,000 to 1,000,000 items only needs about 10 extra steps. The algorithm barely notices as `n` grows. That\'s why binary search, balanced trees, and divide-and-conquer algorithms are so powerful.',
      'O(log n) only works with SORTED data. If the array is unsorted, you must use O(n) linear search — because you can\'t safely discard half.',
    ],
    jsConcepts: [
      '`Math.floor(x)` — rounds a number DOWN to the nearest integer. `Math.floor(3.7)` → `3`. Needed because array indices must be whole numbers.',
    ],
  },

  /* ── Smallest Subarray (Variable Window) ────────── */
  {
    id: 'smallest-subarray',
    category: 'sliding-window',
    title: 'Smallest subarray with sum ≥ target',
    topic: 'Variable-size window',
    description: 'Find the shortest contiguous subarray whose sum is at least 7 in `[2, 1, 5, 1, 3, 2]`. Expand the window until the sum is enough, then shrink from the left to find the minimum length.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function minSubarrayLen(arr, target) {
  let left = 0, sum = 0, minLen = Infinity;
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= arr[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,
    steps: [
      { currentLine: 2, variables: { left: 0, sum: 0, minLen: '∞', right: '~' }, description: 'Start with empty window. Target sum = 7.' },
      { currentLine: 4, variables: { left: 0, sum: 2, minLen: '∞', right: 0 }, description: 'right=0: add arr[0]=2. Window [2], sum=2 < 7. Expand.' },
      { currentLine: 4, variables: { left: 0, sum: 3, minLen: '∞', right: 1 }, description: 'right=1: add arr[1]=1. Window [2,1], sum=3 < 7. Expand.' },
      { currentLine: 4, variables: { left: 0, sum: 8, minLen: '∞', right: 2 }, description: 'right=2: add arr[2]=5. Window [2,1,5], sum=8 ≥ 7! Valid — now shrink.' },
      { currentLine: 6, variables: { left: 0, sum: 8, minLen: 3, right: 2 }, description: 'Length = 3. minLen updated to 3.' },
      { currentLine: 7, variables: { left: 0, sum: 8, minLen: 3, right: 2 }, description: 'Shrink: drop arr[0]=2. sum = 6. left moves to 1.' },
      { currentLine: 4, variables: { left: 1, sum: 6, minLen: 3, right: 3 }, description: 'sum=6 < 7. Expand again. right=3: add arr[3]=1. Window [1,5,1], sum=7 ≥ 7.' },
      { currentLine: 6, variables: { left: 1, sum: 7, minLen: 3, right: 3 }, description: 'Length = 3. Same as current min — no change.' },
      { currentLine: 7, variables: { left: 1, sum: 7, minLen: 3, right: 3 }, description: 'Shrink: drop arr[1]=1. sum = 6. left = 2.' },
      { currentLine: 4, variables: { left: 2, sum: 11, minLen: 3, right: 4 }, description: 'sum=6 < 7. Expand: right=4, add arr[4]=3. Window [5,1,3], sum=9 ≥ 7.' },
      { currentLine: 6, variables: { left: 2, sum: 9, minLen: 3, right: 4 }, description: 'Length = 3. Same.' },
      { currentLine: 7, variables: { left: 2, sum: 9, minLen: 3, right: 4 }, description: 'Shrink: drop arr[2]=5. sum = 4.' },
      { currentLine: 4, variables: { left: 3, sum: 6, minLen: 3, right: 5 }, description: 'Expand: right=5, add arr[5]=2. Window [1,3,2], sum=6 < 7. Still not enough.' },
      { currentLine: 10, variables: { left: 3, sum: 6, minLen: 3, right: 5 }, description: 'End of array. No smaller window found. Return minLen = 3.' },
    ],
    visualType: 'sliding-window',
    visualData: [
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: -1, windowEnd: -1, windowSum: 0 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 0, windowSum: 2 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 1, windowSum: 3 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 2, windowSum: 8 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 0, windowEnd: 2, windowSum: 8 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 1, windowEnd: 2, windowSum: 6 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 1, windowEnd: 3, windowSum: 7 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 1, windowEnd: 3, windowSum: 7 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 2, windowEnd: 3, windowSum: 6 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 2, windowEnd: 4, windowSum: 9 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 2, windowEnd: 4, windowSum: 9 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 3, windowEnd: 4, windowSum: 4 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 3, windowEnd: 5, windowSum: 6 },
      { items: [2,1,5,1,3,2], leftIndex: -1, rightIndex: -1, windowStart: 1, windowEnd: 3, windowSum: 7 },
    ],
    whyItWorks: {
      title: 'Expand until valid, shrink to optimize.',
      body: [
        'The right pointer expands the window until the condition (sum ≥ target) is met. Then the left pointer shrinks it as much as possible while the condition still holds.',
        'Every element enters and leaves the window at most once, so the total work is O(n) — not O(n²).',
      ],
    },
    whenToUseSummary: 'Expand right until condition met, shrink left to find minimum. Both pointers move forward — each element processed at most twice.',
    breakdown: [
      'This is the **variable-size** sliding window. Unlike the fixed-size version, the window grows and shrinks dynamically. Expand until you meet the target sum, then shrink to see if a smaller window also works.',
      '**Expand** — The `right` pointer moves forward, adding elements to `sum`. Keep expanding until `sum ≥ target`.',
      '**Shrink** — Once valid, record the window length (`right - left + 1`). Then move `left` forward, subtracting from `sum`. Keep shrinking while `sum ≥ target` — you might find a smaller valid window.',
      '**Repeat** — Continue expanding and shrinking. Each element enters the window once (when `right` passes it) and leaves once (when `left` passes it). That&rsquo;s at most 2n operations → O(n).',
      '**Edge case** — If no window ever reaches the target sum, `minLen` stays at `Infinity`. Return `0` to indicate no valid subarray exists.',
      '💡 The variable window pattern solves many problems: smallest subarray with sum ≥ k, longest substring without repeating characters, longest substring with at most k distinct characters, and more.',
    ],
    jsConcepts: [
      '`Infinity` — a special numeric value larger than any number. Used as an initial &ldquo;no answer yet&rdquo; sentinel.',
      '`Math.min(a, b)` — returns the smaller of two numbers. `Math.min(3, 5)` → `3`.',
    ],
  },

  /* ── Two Sum (unordered) ────────────────────────── */
  {
    id: 'two-sum',
    category: 'hash-map',
    title: 'Two Sum (unordered)',
    topic: 'Complement lookup',
    description: 'Find two numbers in [2, 7, 11, 15] that add up to 9. Think of it like a memory game — as you scan each number, ask: "Have I seen 9 minus this number before?" A hash map remembers what you have seen, so each lookup is instant.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    debugCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    steps: [
      { currentLine: 2, variables: { seen: '{}', i: '~', complement: '~', result: '~' }, description: 'Create an empty map. Target = 9.' },
      { currentLine: 4, variables: { seen: '{}', i: 0, complement: 7, result: '~' }, description: 'i=0, nums[0]=2. Complement is 9-2=7. Is 7 in the map? No → store {2→0}.' },
      { currentLine: 8, variables: { seen: '{2:0}', i: 0, complement: 7, result: '~' }, description: 'Store nums[0]=2 at index 0.' },
      { currentLine: 4, variables: { seen: '{2:0}', i: 1, complement: 2, result: '~' }, description: 'i=1, nums[1]=7. Complement is 9-7=2. Is 2 in the map? YES at index 0!' },
      { currentLine: 6, variables: { seen: '{2:0}', i: 1, complement: 2, result: '[0, 1]' }, description: 'Return [0, 1] — numbers at those indices (2+7) sum to 9. The pair is [2, 7].' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [2, 7, 11, 15], leftIndex: -1, rightIndex: -1 },
      { items: [2, 7, 11, 15], leftIndex: 0, rightIndex: -1 },
      { items: [2, 7, 11, 15], leftIndex: 0, rightIndex: -1 },
      { items: [2, 7, 11, 15], leftIndex: 1, rightIndex: -1 },
      { items: [2, 7, 11, 15], leftIndex: 0, rightIndex: 1, found: true },
    ],
    whyItWorks: {
      title: 'The complement is the key.',
      body: [
        'For each number, compute what it needs to reach the target (the complement). Check if that complement was already seen — if yes, you found the pair.',
        'Hash map lookups are O(1), so the entire scan is O(n). Without the map, you would need nested loops (O(n²)).',
      ],
    },
    whenToUseSummary: 'Store each value as you go. For each new value, check if its complement already exists. One pass, O(n).',
    breakdown: [
      'Instead of checking every pair (O(n²)), ask: for each number, what other number would make the target? That\'s the complement. Check if you\'ve already seen it — the map tells you instantly.',
      '**Compute complement** — For each number `n`, the needed partner is `target - n`. If `n + complement = target`, we\'re done.',
      '**Check the map** — `seen.has(complement)` is O(1). If the complement was already seen, return both indices.',
      '**Store current** — `seen.set(nums[i], i)` stores the current value and its index. Future numbers can find it as their complement.',
      '**Why O(n)?** — Single pass through the array. Each lookup and insertion is O(1). Total: O(n) time, O(n) space (the map stores up to n entries).',
      'This is the most important hash map pattern: trade space for time. Use extra memory (the map) to avoid O(n²) nested loops.',
      '**Index tracking:** The map stores the number AND its index (`seen.set(nums[i], i)`). We don\'t just remember <em>that</em> we saw a number — we remember <em>where</em> we saw it. That\'s the index/position tracking pattern.',
    ],
    jsConcepts: [
      '`Map` — a collection of key-value pairs. `set(key, value)` stores, `get(key)` retrieves, `has(key)` checks existence. All O(1).',
    ],
  },

  /* ── First Unique ───────────────────────────────── */
  {
    id: 'first-unique',
    category: 'hash-map',
    title: 'First unique character',
    topic: 'Frequency counting',
    description: 'Find the first character in `"pineapple"` that appears only once. Count all characters first, then scan for the first one with count = 1.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function firstUnique(str) {
  const count = new Map();

  // Pass 1: count every character
  for (const ch of str) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // Pass 2: find the first with count = 1
  for (let i = 0; i < str.length; i++) {
    if (count.get(str[i]) === 1) {
      return i;
    }
  }
  return -1;
}`,
    steps: [
      { currentLine: 2, variables: { count: '{}', i: '~', ch: '~' }, description: 'Empty map. We\'ll count each character in "pineapple".' },
      { currentLine: 5, variables: { count: '{p:1}', i: '~', ch: 'p' }, description: 'ch="p": first occurrence. count = 1.' },
      { currentLine: 5, variables: { count: '{p:1,i:1}', i: '~', ch: 'i' }, description: 'ch="i": first occurrence. count = 1.' },
      { currentLine: 5, variables: { count: '{p:1,i:1,n:1}', i: '~', ch: 'n' }, description: 'ch="n": first occurrence. count = 1.' },
      { currentLine: 5, variables: { count: '{p:1,i:1,n:1,e:1}', i: '~', ch: 'e' }, description: 'ch="e": first occurrence. count = 1.' },
      { currentLine: 5, variables: { count: '{p:1,i:1,n:1,e:1,a:1}', i: '~', ch: 'a' }, description: 'ch="a": first occurrence. count = 1.' },
      { currentLine: 5, variables: { count: '{p:2,i:1,n:1,e:1,a:1}', i: '~', ch: 'p' }, description: 'ch="p": seen before! count = 2.' },
      { currentLine: 5, variables: { count: '{p:3,i:1,n:1,e:1,a:1}', i: '~', ch: 'p' }, description: 'ch="p": third time. count = 3.' },
      { currentLine: 5, variables: { count: '{p:3,i:1,n:1,e:1,a:1,l:1}', i: '~', ch: 'l' }, description: 'ch="l": first occurrence. count = 1.' },
      { currentLine: 5, variables: { count: '{p:3,i:1,n:1,e:2,a:1,l:1}', i: '~', ch: 'e' }, description: 'ch="e": seen before! count = 2.' },
      { currentLine: 11, variables: { count: '{p:3,i:1,n:1,e:2,a:1,l:1}', i: 0, ch: 'p' }, description: 'Pass 2: i=0, str[0]="p". count[p]=3 ≠ 1 → skip.' },
      { currentLine: 12, variables: { count: '{p:3,i:1,n:1,e:2,a:1,l:1}', i: 1, ch: 'i' }, description: 'i=1, str[1]="i". count[i]=1 → first unique! Return index 1.' },
    ],
    visualType: 'char-cells',
    visualData: [
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: -1, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 0, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 1, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 2, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 3, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 4, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 5, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 6, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 7, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 8, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 0, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: 1, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Count first, then scan for the answer.',
      body: [
        'First pass counts every character. Second pass checks counts in original order — the first character with count 1 is the answer.',
        'You cannot find the first unique in one pass because you don\'t know if a character appears again later.',
      ],
    },
    whenToUseSummary: 'Two passes: count everything, then scan in order. Map keys are the characters, values are the frequencies.',
    breakdown: [
      'You need the FIRST character that appears exactly once. You can\'t know this on the first pass — a character might repeat later. So count everything first, then scan again.',
      '**Pass 1 — Count:** Iterate through the string. For each character, increment its count in the map.',
      '**Pass 2 — Find:** Scan the string again in original order. The first character with count 1 is your answer.',
      '**Two-pass but still O(n):** Two O(n) passes = O(2n) = O(n). The map stores at most 26 keys (lowercase only) or 128 (ASCII), so space is O(1).',
      'Frequency counting is one of the most common hash map patterns — count first, then use the counts to answer the question.',
    ],
    jsConcepts: [
      '`count.get(ch) ?? 0` — returns the stored count, or 0 if the key doesn\'t exist yet. `??` only defaults on `null`/`undefined`, not on `0`.',
    ],
  },

  /* ── Valid Anagram ──────────────────────────────── */
  {
    id: 'valid-anagram',
    category: 'hash-map',
    title: 'Valid anagram',
    topic: 'Letter frequency comparison',
    description: 'Check if `"anagram"` and `"nagaram"` contain the same letters in the same quantities. Count letters in one string, subtract from the other — if all counts reach zero, it\'s an anagram.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Map();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }
  for (const ch of t) {
    const c = count.get(ch) ?? 0;
    if (c === 0) return false;
    count.set(ch, c - 1);
  }
  return true;
}`,
    steps: [
      { currentLine: 2, variables: { s: 'anagram', t: 'nagaram', sLen: 7, tLen: 7, c: '~' }, description: 'Both strings have length 7 — proceed. If lengths differ, return false immediately.' },
      { currentLine: 5, variables: { s: 'anagram', t: 'nagaram', count: '{a:3,n:1,g:1,r:1,m:1}', c: '~' }, description: 'Count letters in "anagram": a=3, n=1, g=1, r=1, m=1' },
      { currentLine: 8, variables: { s: 'anagram', t: 'nagaram', count: '{a:3,n:1,g:1,r:1,m:1}', c: 1 }, description: 'Process "nagaram". "n" → c = count[n] = 1, decrement to 0.' },
      { currentLine: 8, variables: { s: 'anagram', t: 'nagaram', count: '{a:3,n:0,g:1,r:1,m:1}', c: '~' }, description: '"a" → 3→2. "g" → 1→0. "a" → 2→1. "r" → 1→0. "a" → 1→0. "m" → 1→0.' },
      { currentLine: 12, variables: { s: 'anagram', t: 'nagaram', count: '{a:0,n:0,g:0,r:0,m:0}', c: '~' }, description: 'All counts reached zero. Same letters, same quantities → anagram! Return true.' },
    ],
    visualType: 'char-cells',
    visualData: [
      { items: ['a','n','a','g','r','a','m'], leftIndex: -1, rightIndex: -1 },
      { items: ['a','n','a','g','r','a','m'], leftIndex: -1, rightIndex: -1 },
      { items: ['a','n','a','g','r','a','m'], leftIndex: -1, rightIndex: -1 },
      { items: ['a','n','a','g','r','a','m'], leftIndex: -1, rightIndex: -1 },
      { items: ['a','n','a','g','r','a','m'], leftIndex: -1, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Same letters, same counts.',
      body: [
        'Count letters in the first string (increment). For each letter in the second string, decrement. If any count goes negative or doesn\'t reach zero, not an anagram.',
        'If lengths differ, skip the counting entirely — they cannot be anagrams.',
      ],
    },
    whenToUseSummary: 'Count first, subtract second. If all counts hit zero, it is an anagram. O(n) time, O(1) space (limited alphabet).',
    breakdown: [
      'An anagram rearranges the same letters. So both strings must have identical letter counts. Count letters in `s`, then subtract letters in `t` — if every count hits zero, they\'re anagrams.',
      '**Early exit** — If `s.length !== t.length`, they cannot be anagrams. Return false immediately.',
      '**Pass 1 — Count s:** For each character, increment its count.',
      '**Pass 2 — Subtract t:** For each character in `t`, check its count. If count is 0, not an anagram. Otherwise decrement.',
      '**Final check** — If we finish pass 2 without returning false, all counts reached zero — anagram confirmed.',
      'This pattern (count + subtract) avoids sorting both strings (O(n log n)). Instead, O(n) with a hash map.',
    ],
    jsConcepts: [
      '`count.get(ch) ?? 0` — retrieves the count or defaults to 0. `??` only kicks in for `null`/`undefined`, not falsy values.',
    ],
  },

  /* ── Most Frequent ──────────────────────────────── */
  {
    id: 'most-frequent',
    category: 'hash-map',
    title: 'Most frequent element',
    topic: 'Frequency + max tracking',
    description: 'Find the number that appears most often in `[1, 3, 2, 1, 4, 1]`. Count frequencies as you go, tracking the current maximum on the fly.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    debugCode: `function mostFrequent(nums) {
  if (nums.length === 0) return null;
  const freq = new Map();
  let maxCount = 0, result = nums[0];

  for (const n of nums) {
    const count = (freq.get(n) ?? 0) + 1;
    freq.set(n, count);
    if (count > maxCount) {
      maxCount = count;
      result = n;
    }
  }
  return result;
}`,
    steps: [
      { currentLine: 2, variables: { freq: '{}', maxCount: 0, result: '~', n: '~', count: '~' }, description: 'Guard: array is non-empty (length=6). Initialize empty frequency map, maxCount=0.' },
      { currentLine: 4, variables: { freq: '{}', maxCount: 0, result: 1, n: '~', count: '~' }, description: 'Set result = nums[0] = 1 as the initial candidate.' },
      { currentLine: 6, variables: { freq: '{}', maxCount: 0, result: 1, n: 1, count: 1 }, description: 'n=1: first occurrence. count = (undefined ?? 0) + 1 = 1.' },
      { currentLine: 8, variables: { freq: '{1:1}', maxCount: 1, result: 1, n: 1, count: 1 }, description: 'Store freq[1]=1. count(1) > maxCount(0)? YES → update: maxCount=1, result=1.' },
      { currentLine: 6, variables: { freq: '{1:1}', maxCount: 1, result: 1, n: 3, count: 1 }, description: 'n=3: new number. count = (undefined ?? 0) + 1 = 1.' },
      { currentLine: 8, variables: { freq: '{1:1,3:1}', maxCount: 1, result: 1, n: 3, count: 1 }, description: 'Store freq[3]=1. count(1) > maxCount(1)? No → keep maxCount=1.' },
      { currentLine: 6, variables: { freq: '{1:1,3:1}', maxCount: 1, result: 1, n: 2, count: 1 }, description: 'n=2: new number. count = (undefined ?? 0) + 1 = 1.' },
      { currentLine: 8, variables: { freq: '{1:1,3:1,2:1}', maxCount: 1, result: 1, n: 2, count: 1 }, description: 'Store freq[2]=1. count(1) > maxCount(1)? No → no change.' },
      { currentLine: 6, variables: { freq: '{1:1,3:1,2:1}', maxCount: 1, result: 1, n: 1, count: 2 }, description: 'n=1: seen before. count = freq[1] + 1 = 2.' },
      { currentLine: 8, variables: { freq: '{1:2,3:1,2:1}', maxCount: 2, result: 1, n: 1, count: 2 }, description: 'Store freq[1]=2. count(2) > maxCount(1)? YES → update: maxCount=2, result=1.' },
      { currentLine: 6, variables: { freq: '{1:2,3:1,2:1}', maxCount: 2, result: 1, n: 4, count: 1 }, description: 'n=4: new number. count = (undefined ?? 0) + 1 = 1.' },
      { currentLine: 8, variables: { freq: '{1:2,3:1,2:1,4:1}', maxCount: 2, result: 1, n: 4, count: 1 }, description: 'Store freq[4]=1. count(1) > maxCount(2)? No → no change.' },
      { currentLine: 6, variables: { freq: '{1:2,3:1,2:1,4:1}', maxCount: 2, result: 1, n: 1, count: 3 }, description: 'n=1: third occurrence. count = freq[1] + 1 = 3.' },
      { currentLine: 8, variables: { freq: '{1:3,3:1,2:1,4:1}', maxCount: 3, result: 1, n: 1, count: 3 }, description: 'Store freq[1]=3. count(3) > maxCount(2)? YES → update: maxCount=3, result=1.' },
      { currentLine: 14, variables: { freq: '{1:3,3:1,2:1,4:1}', maxCount: 3, result: 1, n: '~', count: '~' }, description: 'Loop finished. Return result = 1 (appears 3 times — more than any other).' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 3, 2, 1, 4, 1], leftIndex: -1, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 0, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 0, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 0, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 1, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 1, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 2, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 2, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 3, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 3, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 4, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 4, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 5, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 5, rightIndex: -1 },
      { items: [1, 3, 2, 1, 4, 1], leftIndex: 5, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Count and track max in one pass.',
      body: [
        'Instead of counting everything and then finding the max (two passes), track the max as you count. Each time a count exceeds the current max, update both maxCount and result.',
        'This is a single O(n) pass with O(n) space for the frequency map.',
      ],
    },
    whenToUseSummary: 'Count frequencies with a map, update the max on the fly. Guard empty arrays first. One pass, O(n) time.',
    breakdown: [
      'Track frequencies AND the current maximum in a single pass. Each time you increment a count, check: did it just become the new max? If yes, update both maxCount and result.',
      '**Guard** — If the array is empty, return `null` immediately. No element exists to be \'most frequent\'. Without this, `nums[0]` would crash.',
      '**Init** — Set `result = nums[0]` as the initial candidate. It appears at least once, so maxCount will be at least 1.',
      '**Count** — For each element `n`, compute `(freq.get(n) ?? 0) + 1`. Store it with `freq.set(n, count)`.',
      '**Compare** — If the new count exceeds `maxCount`, this element is now the most frequent. Update `maxCount` and `result`.',
      '**Why one pass?** — You don\'t need a second pass over the map to find the max. The max can only increase, and every increment is a candidate.',
      '**Tie-breaking** — If two elements tie for max count, the first one to reach that count wins (it was set as `result` earlier).',
    ],
    jsConcepts: [
      'Tracking max on the fly — instead of a second loop, update every time a count changes. Works because counts only increase.',
    ],
  },

  /* ═══════════════════════════════════════════════════
     BINARY SEARCH
  ═══════════════════════════════════════════════════ */

  /* ── Binary Search Classic ───────────────────────── */
  {
    id: 'binary-search-classic',
    category: 'binary-search',
    title: 'Classic binary search',
    topic: 'Divide & conquer',
    description: 'Find `7` in `[1, 3, 5, 7, 9, 11, 13]`. Each step cuts the search space in half — from 7 elements to 3 to 1.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    debugCode: `function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    steps: [
      { currentLine: 2, variables: { lo: 0, hi: '~', mid: '~' }, description: 'Start: `lo = 0` (first index)' },
      { currentLine: 3, variables: { lo: 0, hi: 6, mid: '~' }, description: '`hi = arr.length - 1 = 6` (last index). Search space: indices 0–6.' },
      { currentLine: 5, variables: { lo: 0, hi: 6, mid: '~' }, description: 'Enter loop — `lo (0) <= hi (6)` is true' },
      { currentLine: 6, variables: { lo: 0, hi: 6, mid: 3 }, description: '`mid = floor((0 + 6) / 2) = 3`. Check `arr[3] = 7`.' },
      { currentLine: 7, variables: { lo: 0, hi: 6, mid: 3 }, description: '`arr[3] = 7 === target = 7`. Found! Return 3.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 3, 5, 7, 9, 11, 13], leftIndex: 0, rightIndex: 6 },
      { items: [1, 3, 5, 7, 9, 11, 13], leftIndex: 0, rightIndex: 6 },
      { items: [1, 3, 5, 7, 9, 11, 13], leftIndex: 0, rightIndex: 6 },
      { items: [1, 3, 5, 7, 9, 11, 13], leftIndex: 0, rightIndex: 6 },
      { items: [1, 3, 5, 7, 9, 11, 13], leftIndex: 0, rightIndex: 6, found: true },
    ],
    whyItWorks: {
      title: 'Every comparison eliminates half the remaining elements.',
      body: [
        'If target is bigger than mid, everything to the left is also too small — discard them all at once.',
        'If target is smaller than mid, everything to the right is also too big — discard them all at once.',
        'After k steps, only n / 2ᵏ elements remain. When k = log₂ n, only 1 remains.',
      ],
    },
    whenToUseSummary: 'Set lo and hi. Compute mid. If mid matches target, done. Otherwise eliminate the half that cannot contain the target.',
    breakdown: [
      'Binary search works because the array is **sorted**. When you check `arr[mid]`, you instantly know which half of the array the target must be in — because all values to the left are smaller and all values to the right are larger.',
      '**The middle check** — Compute `mid = floor((lo + hi) / 2)` and compare `arr[mid]` with the target. Three possibilities: equal (found it!), less (target must be in the right half), greater (target must be in the left half).',
      '**Why guessing the middle?** — If you guessed any other position, you risk eliminating fewer elements. The middle position guarantees you eliminate *at least* half of the remaining elements every time.',
      '**Why `lo <= hi`?** — When `lo === hi`, there is still one un-checked element. Using `lo < hi` would skip it. This is a common off-by-one bug in binary search.',
      '**Why `mid + 1` and `mid - 1`?** — You have already checked `arr[mid]`. If you set `lo = mid` or `hi = mid` without the +1/-1, you could get stuck in an infinite loop.',
      '**Logarithmic growth** — For n = 1,000,000, binary search needs only ~20 steps. Linear search would need up to 1,000,000. That is the power of dividing by 2 each time.',
    ],
    jsConcepts: [
      '`Math.floor` — rounds down. Since `(lo + hi) / 2` may be a decimal (e.g., 5/2 = 2.5), `floor` gives the integer index.',
      'Off-by-one errors — the most common binary search bug. Always test edge cases: empty array, one element, target at edge.',
    ],
  },

  /* ── Binary Search Boundary ──────────────────────── */
  {
    id: 'binary-search-boundary',
    category: 'binary-search',
    title: 'Find first occurrence (boundary)',
    topic: 'Lower / upper bound',
    description: 'Find the FIRST 2 in [1, 2, 2, 2, 3, 4, 5]. When you spot a 2, do not stop — keep searching left. There might be an earlier 2 hiding. The first match is not necessarily the first occurrence.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    debugCode: `function findFirst(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  let result = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) {
      result = mid;
      hi = mid - 1;
    } else if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}`,
    steps: [
      { currentLine: 2, variables: { lo: 0, hi: '~', mid: '~', result: -1 }, description: 'Start `lo` at 0.' },
      { currentLine: 3, variables: { lo: 0, hi: 6, mid: '~', result: -1 }, description: '`hi` at last index (6).' },
      { currentLine: 4, variables: { lo: 0, hi: 6, mid: '~', result: -1 }, description: '`result = -1` — nothing found yet.' },
      { currentLine: 6, variables: { lo: 0, hi: 6, mid: '~', result: -1 }, description: 'Enter loop — `lo (0) <= hi (6)` is true' },
      { currentLine: 7, variables: { lo: 0, hi: 6, mid: 3, result: -1 }, description: '`mid = 3`, `arr[3] = 2`. Match! Record `result = 3`.' },
      { currentLine: 9, variables: { lo: 0, hi: 6, mid: 3, result: 3 }, description: '`hi = mid - 1 = 2`. Search LEFT half (0–2) — maybe there is an earlier 2.' },
      { currentLine: 6, variables: { lo: 0, hi: 2, mid: 3, result: 3 }, description: 'Loop — `lo (0) <= hi (2)` is true' },
      { currentLine: 7, variables: { lo: 0, hi: 2, mid: 1, result: 3 }, description: '`mid = 1`, `arr[1] = 2`. Match! Record `result = 1`.' },
      { currentLine: 9, variables: { lo: 0, hi: 2, mid: 1, result: 1 }, description: '`hi = mid - 1 = 0`. Still looking left.' },
      { currentLine: 6, variables: { lo: 0, hi: 0, mid: 1, result: 1 }, description: 'Loop — `lo (0) <= hi (0)` is true' },
      { currentLine: 7, variables: { lo: 0, hi: 0, mid: 0, result: 1 }, description: '`mid = 0`, `arr[0] = 1`. Smaller than 2.' },
      { currentLine: 11, variables: { lo: 0, hi: 0, mid: 0, result: 1 }, description: '`arr[0] < target`: `lo = mid + 1 = 1`.' },
      { currentLine: 6, variables: { lo: 1, hi: 0, mid: 0, result: 1 }, description: '`lo (1) > hi (0)`. Loop exits.' },
      { currentLine: 16, variables: { lo: 1, hi: 0, mid: 0, result: 1 }, description: 'Return `result = 1` — the first occurrence.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 6 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 6 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 6 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 6 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 2 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 2 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 2 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0, found: true },
    ],
    whyItWorks: {
      title: 'Record the match, then keep searching.',
      body: [
        'When you find a match, save the position but continue searching left (or right) to find the boundary.',
        'The search space still halves each step — you are just persisting the best answer seen so far.',
      ],
    },
    whenToUseSummary: 'Same as binary search, but instead of returning immediately on match, save the position and continue searching in one direction.',
    breakdown: [
      'Finding a boundary is binary search with one extra rule: **do not stop on the first match**. Save the position (`result = mid`) and keep searching in the direction where an earlier/later match could be.',
      '**Why continue?** — If you are looking for the first occurrence, finding a `2` at index 3 does not mean it is the first one. There could be another `2` at index 1 or 2. You must keep checking left.',
      '**The pattern** — Initialize `result = -1`. On match, update `result` and narrow the search space past the match (`hi = mid - 1` for first, `lo = mid + 1` for last). Return `result` after the loop.',
      '**Why `result = -1`?** — If the target is never found, `-1` signals "not found." Without the sentinel, you would not know the difference between "found at index 0" and "not found."',
      '**Counting occurrences** — Find first and find last are the building blocks for counting how many times a value appears: `lastIndex - firstIndex + 1`. Both use the same boundary-search pattern.',
    ],
    jsConcepts: [
      'Sentinel values — `result = -1` acts as a "not found" signal. It separates the zero case from the not-found case.',
      'Binary search variants — classic (return on match), boundary (save and continue), and range (first + last). All are O(log n).',
    ],
  },

  /* ═══════════════════════════════════════════════════
     FAST & SLOW POINTERS
  ═══════════════════════════════════════════════════ */

  /* ── Linked List Cycle ───────────────────────────── */
  {
    id: 'linked-list-cycle',
    category: 'fast-slow',
    title: 'Detect cycle in linked list',
    topic: 'Floyd\'s algorithm',
    description: 'A slow pointer moves one step at a time. A fast pointer moves two. If they ever meet, there is a cycle — like two runners on a circular track.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    steps: [
      { currentLine: 2, variables: { slow: '3', fast: '~' }, description: 'Initialize slow at head (value 3).' },
      { currentLine: 3, variables: { slow: '3', fast: '3' }, description: 'Initialize fast at head too. Both start together.' },
      { currentLine: 5, variables: { slow: '3', fast: '3' }, description: 'Enter loop — fast and fast.next both exist.' },
      { currentLine: 6, variables: { slow: '3', fast: '3' }, description: 'slow moves: 3 → 2. fast moves: 3 → 2 → 0. Both pointers advance.' },
      { currentLine: 8, variables: { slow: '2', fast: '0' }, description: 'Compare: slow (2) !== fast (0). No meeting — continue looping.' },
      { currentLine: 5, variables: { slow: '2', fast: '0' }, description: 'fast and fast.next still exist — loop again.' },
      { currentLine: 6, variables: { slow: '2', fast: '0' }, description: 'slow: 2 → 0. fast: 0 → -4 → 2. Fast laps around the cycle.' },
      { currentLine: 8, variables: { slow: '0', fast: '2' }, description: 'Compare: slow (0) !== fast (2). Not yet — keep going.' },
      { currentLine: 5, variables: { slow: '0', fast: '2' }, description: 'Loop continues — fast and fast.next are alive.' },
      { currentLine: 6, variables: { slow: '0', fast: '2' }, description: 'slow: 0 → -4. fast: 2 → 0 → -4. They converge on the same node!' },
      { currentLine: 8, variables: { slow: '-4', fast: '-4' }, description: 'slow === fast at node -4 — cycle detected! Return true.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [3, 2, 0, -4], leftIndex: 0, rightIndex: -1 },
      { items: [3, 2, 0, -4], leftIndex: 0, rightIndex: 0 },
      { items: [3, 2, 0, -4], leftIndex: 0, rightIndex: 0 },
      { items: [3, 2, 0, -4], leftIndex: 0, rightIndex: 0 },
      { items: [3, 2, 0, -4], leftIndex: 1, rightIndex: 2 },
      { items: [3, 2, 0, -4], leftIndex: 1, rightIndex: 2 },
      { items: [3, 2, 0, -4], leftIndex: 1, rightIndex: 2 },
      { items: [3, 2, 0, -4], leftIndex: 2, rightIndex: 1 },
      { items: [3, 2, 0, -4], leftIndex: 2, rightIndex: 1 },
      { items: [3, 2, 0, -4], leftIndex: 2, rightIndex: 1 },
      { items: [3, 2, 0, -4], leftIndex: 3, rightIndex: 3, found: true },
    ],
    whyItWorks: {
      title: 'Speed difference guarantees a meeting on any cycle.',
      body: [
        'If there is a cycle, the fast pointer will eventually lap the slow pointer — like a faster runner on a circular track.',
        'On each step of the cycle, fast gains one position on slow. With n nodes in the cycle, they meet within n steps.',
        'If there is no cycle, fast reaches null first — no loop, no meeting.',
      ],
    },
    whenToUseSummary: 'Two pointers moving at different speeds. If they meet, there is a cycle. If fast reaches the end, there is no cycle.',
    breakdown: [
      'Floyd\'s cycle detection (the "tortoise and hare" algorithm) uses two pointers moving at **different speeds**. The slow pointer moves one step per iteration; the fast pointer moves two.',
      '**Why different speeds?** — If there is a cycle, the distance between slow and fast decreases by one each step. They are guaranteed to meet within the length of the cycle.',
      '**Why two steps?** — One step would keep them at the same distance forever (they would never catch up). Two steps guarantees the distance shrinks by 1 each time. Three would work too but risks skipping over null checks.',
      '**The guard** — `while (fast && fast.next)` checks that both fast and the next node exist. Since fast moves two steps at a time, both must be non-null to avoid a crash. If either is null, the list ends — no cycle.',
      '**No extra memory** — A hash-set approach needs O(n) space to remember visited nodes. Floyd\'s algorithm uses only two pointers — O(1) space.',
    ],
    jsConcepts: [
      '`&&` — short-circuit evaluation. If `fast` is null, `fast.next` is never accessed (avoids a crash).',
      '`=` — assignment (not `==`). This is where beginners often confuse `=` and `===`. The code uses `===` for comparison, `=` for setting slow/fast.',
    ],
  },

  /* ── Find Middle ─────────────────────────────────── */
  {
    id: 'find-middle',
    category: 'fast-slow',
    title: 'Find middle of linked list',
    topic: 'Fast & slow speeds',
    description: 'Fast moves twice as fast as slow. When fast reaches the end, slow is exactly in the middle. No need to count the length first.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function findMiddle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    steps: [
      { currentLine: 2, variables: { slow: '1', fast: '~' }, description: 'Initialize slow at head (value 1). Array: [1, 2, 3, 4, 5].' },
      { currentLine: 3, variables: { slow: '1', fast: '1' }, description: 'Initialize fast at head too.' },
      { currentLine: 5, variables: { slow: '1', fast: '1' }, description: 'Enter loop — fast and fast.next both exist.' },
      { currentLine: 6, variables: { slow: '1', fast: '1' }, description: 'slow moves: 1 → 2. fast moves: 1 → 3 (skips one).' },
      { currentLine: 5, variables: { slow: '2', fast: '3' }, description: 'fast (3) and fast.next (4) exist — continue loop.' },
      { currentLine: 6, variables: { slow: '2', fast: '3' }, description: 'slow: 2 → 3. fast: 3 → 5. Fast is near the end.' },
      { currentLine: 5, variables: { slow: '3', fast: '5' }, description: 'fast.next is null (5 is the last node). Loop exits.' },
      { currentLine: 9, variables: { slow: '3', fast: '5' }, description: 'Return slow (value 3) — the middle node.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 2, 3, 4, 5], leftIndex: 0, rightIndex: -1 },
      { items: [1, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 3, 4, 5], leftIndex: 0, rightIndex: 0 },
      { items: [1, 2, 3, 4, 5], leftIndex: 1, rightIndex: 2 },
      { items: [1, 2, 3, 4, 5], leftIndex: 1, rightIndex: 2 },
      { items: [1, 2, 3, 4, 5], leftIndex: 2, rightIndex: 4 },
      { items: [1, 2, 3, 4, 5], leftIndex: 2, rightIndex: 4, found: true },
    ],
    whyItWorks: {
      title: '2× speed = ½ distance. When fast finishes, slow is halfway.',
      body: [
        'For every step slow takes, fast takes two. By the time fast reaches the end, slow has covered exactly half the distance.',
        'For odd-length lists, slow lands on the exact middle. For even-length lists, slow lands on the second middle node.',
      ],
    },
    whenToUseSummary: 'Two pointers at different speeds. When the fast one reaches the end, the slow one is in the middle.',
    breakdown: [
      'Instead of two passes (count length, then traverse to middle), use **one pass** with two pointers. The fast pointer moves at double speed, so it finishes when slow is exactly in the middle.',
      '**Why it works** — When fast moves 2 steps and slow moves 1, slow covers half the distance of fast in the same time. When fast hits the end, slow is at the midpoint. No counting needed.',
      '**Odd vs even length** — For `[1, 2, 3, 4, 5]` (odd), slow lands at 3 (the center). For `[1, 2, 3, 4]` (even), slow lands at 3 (the second of the two middle nodes). Both are the standard definitions.',
      '**Comparison to counting** — The counting approach needs one pass to count, then a second pass to reach the middle. Fast & slow does it in one pass, halving the work.',
    ],
    jsConcepts: [
      '`.next.next` — chaining property access. In a linked list, each node has a `.next` reference. Two dots moves two steps.',
      'Single pass algorithms — doing two things at once (moving fast and slow) to avoid a second traversal. Common optimization pattern.',
    ],
  },

  /* ═══════════════════════════════════════════════════
     STACK
  ═══════════════════════════════════════════════════ */

  /* ── Valid Parentheses ───────────────────────────── */
  {
    id: 'valid-parens',
    category: 'stack',
    title: 'Validate parentheses',
    topic: 'LIFO matching',
    description: 'Every opening bracket must be closed by the same type and in the correct order. A stack remembers what needs to be closed — last opened, first closed.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    debugCode: `function isValid(s) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };

  for (const ch of s) {
    if (pairs[ch]) {
      stack.push(ch);
    } else {
      const last = stack.pop();
      if (pairs[last] !== ch) return false;
    }
  }
  return stack.length === 0;
}`,
    steps: [
      { currentLine: 2, variables: { stack: '[]', ch: '~', last: '~' }, description: 'Initialize empty stack and the pairs map.' },
      { currentLine: 5, variables: { stack: '[]', ch: "'('", last: '~' }, description: 'Read open paren. It is an opening bracket — push it.' },
      { currentLine: 7, variables: { stack: "['(']", ch: "'('", last: '~' }, description: 'Push open paren onto stack.' },
      { currentLine: 5, variables: { stack: "['(']", ch: "')'", last: '~' }, description: 'Read close paren. Not in pairs map — it is a closing bracket.' },
      { currentLine: 9, variables: { stack: "['(']", ch: "')'", last: "'('" }, description: 'Pop: last = open paren.' },
      { currentLine: 10, variables: { stack: '[]', ch: "')'", last: "'('" }, description: 'pairs[last] matches ch. Good — continue.' },
      { currentLine: 5, variables: { stack: '[]', ch: "'['", last: "'('" }, description: 'Read open bracket. Opening bracket — push it.' },
      { currentLine: 7, variables: { stack: "['[']", ch: "'['", last: "'('" }, description: 'Push open bracket onto stack.' },
      { currentLine: 5, variables: { stack: "['[']", ch: "'{'", last: "'('" }, description: 'Read open brace — push it.' },
      { currentLine: 7, variables: { stack: "['[', '{']", ch: "'{'", last: "'('" }, description: 'Push open brace onto stack.' },
      { currentLine: 5, variables: { stack: "['[', '{']", ch: "'}'", last: "'('" }, description: 'Read close brace — pop and check.' },
      { currentLine: 9, variables: { stack: "['[', '{']", ch: "'}'", last: "'{'" }, description: 'Pop: last = open brace.' },
      { currentLine: 10, variables: { stack: "['[']", ch: "'}'", last: "'{'" }, description: 'pairs[brace] matches ch. Good — continue.' },
      { currentLine: 5, variables: { stack: "['[']", ch: "']'", last: "'{'" }, description: 'Read close bracket — pop and check.' },
      { currentLine: 9, variables: { stack: "['[']", ch: "']'", last: "'['" }, description: 'Pop: last = open bracket.' },
      { currentLine: 10, variables: { stack: '[]', ch: "']'", last: "'['" }, description: 'pairs[bracket] matches ch. Good — all matched!' },
      { currentLine: 13, variables: { stack: '[]', ch: "']'", last: "'['" }, description: 'Stack is empty — all openers had matching closers. Return true.' },
    ],
    visualType: 'char-cells',
    visualData: [
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: -1, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 0, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 0, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 1, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 1, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 1, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 2, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 2, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 3, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 3, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 4, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 4, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 4, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 5, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 5, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: 5, rightIndex: -1 },
      { items: ['(', ')', '[', '{', '}', ']'], leftIndex: -1, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Last opened must be first closed — a stack enforces this naturally.',
      body: [
        'When you see an opening bracket, you push it. When you see a closing bracket, you pop the most recent opener — it must match.',
        'A closing bracket can only match the most recent unmatched opener. Anything else would mean brackets are nested incorrectly.',
        'After processing every character, an empty stack means every opener was matched. A non-empty stack means dangling openers.',
      ],
    },
    whenToUseSummary: 'Push openers, pop and check against closers. An empty stack at the end means valid. A mismatched pop means invalid.',
    breakdown: [
      'A stack remembers what still needs to be closed. When you see `(`, `[`, or `{`, push it. When you see `)`, `]`, or `}`, the **most recent unmatched opener** must match — pop it and check.',
      '**LIFO (Last In, First Out)** — The last opener you pushed is the first one that must close. `([])` is valid: `(` then `[`, so `]` must close before `)`. A stack enforces this ordering naturally.',
      '**The pairs map** — `{ \'(\': \')\' }` lets you check in two directions: "is this an opener?" and "what must close this opener?" Without it, you would need two separate checks.',
      '**Common failure modes** — (1) Extra closer: pop from empty stack. (2) Mismatch: closing bracket does not match the popped opener. (3) Leftover: stack is not empty after processing — unclosed openers remain.',
    ],
    jsConcepts: [
      '`.push()` / `.pop()` — array methods that add/remove from the end. Together they make an array act like a stack (LIFO).',
      '`for...of` — iterates over each character of a string. Cleaner than a C-style for loop when you need each element.',
    ],
  },

  /* ── Next Greater Element ────────────────────────── */
  {
    id: 'next-greater',
    category: 'stack',
    title: 'Next greater element',
    topic: 'Monotonic stack',
    description: 'For each number, find the next bigger number to its right. Imagine people waiting in line by height — shorter people wait. When a taller person arrives, everyone shorter gets resolved at once. One pass, O(n).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    debugCode: `function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];

  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack.at(-1)] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
    steps: [
      { currentLine: 2, variables: { i: '~', stack: '[]', idx: '~' }, description: 'All results start as -1. Stack is empty. Input: `[2, 1, 3, 4]`.' },
      { currentLine: 5, variables: { i: 0, stack: '[]', idx: '~' }, description: 'i = 0, nums[0] = 2. Stack is empty — no comparison. Push index 0.' },
      { currentLine: 9, variables: { i: 0, stack: '[0]', idx: '~' }, description: 'Push index 0 onto stack. Stack waits for a greater neighbor.' },
      { currentLine: 5, variables: { i: 1, stack: '[0]', idx: '~' }, description: 'i = 1, nums[1] = 1. Check stack top: nums[0]=2. 2 > 1 — no pop.' },
      { currentLine: 9, variables: { i: 1, stack: '[0]', idx: '~' }, description: 'Push 1. Stack: [0, 1] — both waiting, stack stays decreasing (2 > 1).' },
      { currentLine: 5, variables: { i: 2, stack: '[0, 1]', idx: '~' }, description: 'i = 2, nums[2] = 3. 3 is greater than nums[1]=1 — pop!' },
      { currentLine: 7, variables: { i: 2, stack: '[0, 1]', idx: 1 }, description: 'Pop 1. result[1] = 3 — 1\'s next greater is 3.' },
      { currentLine: 6, variables: { i: 2, stack: '[0]', idx: 1 }, description: '3 is also greater than nums[0]=2 — pop again!' },
      { currentLine: 7, variables: { i: 2, stack: '[0]', idx: 0 }, description: 'Pop 0. result[0] = 3 — 2\'s next greater is 3.' },
      { currentLine: 9, variables: { i: 2, stack: '[]', idx: 0 }, description: 'Stack empty. Push 2. Stack: [2].' },
      { currentLine: 5, variables: { i: 3, stack: '[2]', idx: 0 }, description: 'i = 3, nums[3] = 4. 4 > nums[2]=3 — pop!' },
      { currentLine: 7, variables: { i: 3, stack: '[2]', idx: 2 }, description: 'Pop 2. result[2] = 4 — 3\'s next greater is 4.' },
      { currentLine: 9, variables: { i: 3, stack: '[]', idx: 2 }, description: 'Push 3. Stack: [3]. Loop ends. Return [-1, 3, 4, -1].' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [2, 1, 3, 4], leftIndex: -1, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 0, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 0, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 1, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 1, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 2, rightIndex: 1 },
      { items: [2, 1, 3, 4], leftIndex: 2, rightIndex: 1 },
      { items: [2, 1, 3, 4], leftIndex: 2, rightIndex: 0 },
      { items: [2, 1, 3, 4], leftIndex: 2, rightIndex: 0 },
      { items: [2, 1, 3, 4], leftIndex: 2, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 3, rightIndex: -1 },
      { items: [2, 1, 3, 4], leftIndex: 3, rightIndex: 2 },
      { items: [2, 1, 3, 4], leftIndex: 3, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'A decreasing stack finds the first greater element the moment it appears.',
      body: [
        'The stack stores indices in decreasing order of values. A new number that is larger than the top means it is the "next greater" for everything on the stack that it beats.',
        'Each element is pushed once and popped at most once — O(n) total.',
      ],
    },
    whenToUseSummary: 'Maintain a stack of unresolved elements in decreasing value order. When a larger element arrives, resolve everything it beats.',
    breakdown: [
      'A **monotonic decreasing stack** keeps indices of elements that are still waiting for a greater neighbor. As long as new values are smaller, they join the wait. When a larger value arrives, it resolves everyone waiting that is smaller.',
      '**Why "monotonic"?** — The values at the stack indices are always decreasing (e.g., `[4, 3, 1]`). This property is maintained by popping everything smaller than the current value before pushing.',
      '**Why O(n)?** — At first glance, the nested while loop looks like O(n²). But each element is pushed once and popped at most once. Total pushes + pops = 2n, which is O(n).',
      '**Comparison to brute force** — Brute force checks every element to the right for each element (O(n²)). The monotonic stack defers the check: elements wait until their greater neighbor appears.',
      '**Variants** — "Next smaller" uses an increasing stack. "Previous greater" iterates from right to left. The core pattern is the same: maintain an invariant on the stack and resolve on violation.',
    ],
    jsConcepts: [
      '`.at(-1)` — gets the last element. Cleaner than `stack[stack.length - 1]`. Supported in all modern browsers since 2022.',
      '`.fill(-1)` — initializes every element of a new Array to -1. A concise way to set defaults.',
    ],
  },

  /* ═══════════════════════════════════════════════════
     MERGE INTERVALS
  ═══════════════════════════════════════════════════ */

  /* ── Merge Overlapping Intervals ─────────────────── */
  {
    id: 'merge-overlapping',
    category: 'merge-interval',
    title: 'Merge overlapping intervals',
    topic: 'Sort + merge',
    description: 'You have four meetings: [1,3], [2,6], [8,10], [15,18]. Some overlap — like [1,3] and [2,6] share hours 2-3. Your job: combine any overlapping meetings into bigger blocks until no two meetings touch. Sort by start time first, then merge in one pass.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    debugCode: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}`,
    steps: [
      { currentLine: 2, variables: { prevStart: '~', prevEnd: '~', currStart: '~', currEnd: '~' }, description: 'Step 1: Sort the meetings by start time. Now they are in order: `[1,3]`, `[2,6]`, `[8,10]`, `[15,18]`.' },
      { currentLine: 3, variables: { prevStart: '~', prevEnd: '~', currStart: '~', currEnd: '~' }, description: 'Start with the first meeting `[1,3]` in your result list. This is the seed — everything else compares to it.' },
      { currentLine: 5, variables: { prevStart: 1, prevEnd: 3, currStart: '~', currEnd: '~' }, description: 'Now look at the next meeting: `[2,6]`. It starts at 2.' },
      { currentLine: 7, variables: { prevStart: 1, prevEnd: 3, currStart: 2, currEnd: 6 }, description: 'Does 2 overlap with `[1,3]`? Well, 2 comes BEFORE 3 ends — so yes, they overlap! The meetings share time from 2 to 3.' },
      { currentLine: 8, variables: { prevStart: 1, prevEnd: 3, currStart: 2, currEnd: 6 }, description: 'Since they overlap, combine them. Keep the earliest start (1) and the latest end (6). New merged meeting: `[1,6]`.' },
      { currentLine: 9, variables: { prevStart: 1, prevEnd: 6, currStart: 2, currEnd: 6 }, description: 'Result is now `[[1,6]]` — one big meeting covering hour 1 through 6.' },
      { currentLine: 5, variables: { prevStart: 1, prevEnd: 6, currStart: '~', currEnd: '~' }, description: 'Next meeting: `[8,10]`. It starts at 8.' },
      { currentLine: 7, variables: { prevStart: 1, prevEnd: 6, currStart: 8, currEnd: 10 }, description: 'Does 8 overlap with `[1,6]`? No — 8 comes AFTER 6 ends. These meetings are completely separate.' },
      { currentLine: 8, variables: { prevStart: 1, prevEnd: 6, currStart: 8, currEnd: 10 }, description: 'No overlap, so keep `[8,10]` as its own meeting. Add it to the result.' },
      { currentLine: 11, variables: { prevStart: 8, prevEnd: 10, currStart: 8, currEnd: 10 }, description: 'Result is now `[[1,6], [8,10]]`. Two clean, non-overlapping meetings.' },
      { currentLine: 5, variables: { prevStart: 8, prevEnd: 10, currStart: '~', currEnd: '~' }, description: 'Last meeting: `[15,18]`. It starts at 15.' },
      { currentLine: 7, variables: { prevStart: 8, prevEnd: 10, currStart: 15, currEnd: 18 }, description: 'Does 15 overlap with `[8,10]`? No — 15 is way after 10. No overlap.' },
      { currentLine: 8, variables: { prevStart: 8, prevEnd: 10, currStart: 15, currEnd: 18 }, description: 'Add it as its own meeting. No merging needed.' },
      { currentLine: 11, variables: { prevStart: 15, prevEnd: 18, currStart: 15, currEnd: 18 }, description: 'Final result: `[[1,6], [8,10], [15,18]]`. Three non-overlapping meetings.' },
      { currentLine: 14, variables: { prevStart: 15, prevEnd: 18, currStart: 15, currEnd: 18 }, description: 'Done! All overlapping meetings have been merged into clean, separate blocks.' },
    ],
    visualType: 'interval-timeline',
    visualData: [
      { items: [], intervals: [[1,3],[2,6],[8,10],[15,18]], current: -1 },
      { items: [], intervals: [[1,3],[2,6],[8,10],[15,18]], current: 0 },
      { items: [], intervals: [[1,3],[2,6],[8,10],[15,18]], current: 0 },
      { items: [], intervals: [[1,3],[2,6],[8,10],[15,18]], current: 1 },
      { items: [], intervals: [[1,6],[2,6],[8,10],[15,18]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,6],[2,6],[8,10],[15,18]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,6],[2,6],[8,10],[15,18]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,6],[2,6],[8,10],[15,18]], current: 2 },
      { items: [], intervals: [[1,6],[2,6],[8,10],[15,18]], current: 2 },
      { items: [], intervals: [[1,6],[2,6],[8,10],[15,18]], current: 2, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,6],[8,10],[2,6],[15,18]], current: 2 },
      { items: [], intervals: [[1,6],[8,10],[2,6],[15,18]], current: 3 },
      { items: [], intervals: [[1,6],[8,10],[15,18],[2,6]], current: 3 },
      { items: [], intervals: [[1,6],[8,10],[15,18],[2,6]], current: 3, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,6],[8,10],[15,18],[2,6]], current: 3, found: true },
    ],
    whyItWorks: {
      title: 'Sort first. Then only compare neighbors — no looking backward.',
      body: [
        'Sorting by start time means overlapping notes MUST be next to each other. If note A ends before note B starts, no note after B can overlap with A either.',
        'The overlap check is dead simple: does the next note start before the current one ends? If yes, merge. If no, keep them separate.',
        'Merging just means: keep the earlier start, keep the later end. That is it.',
      ],
    },
    whenToUseSummary: 'Sort meetings by start time. Start with the first one. For each next meeting: if it starts before the last one ends, combine them (keep earliest start, latest end). If not, add it as a new meeting.',
    breakdown: [
      'Imagine sticky notes on a calendar. Some notes overlap — your job is to combine any overlapping notes into bigger notes until no two notes touch each other. One simple rule: sort by start time first, then check each note against the last one.',
      '**Sort by start time.** Line them up from earliest to latest. Once sorted, you never need to look backward — any overlap is right next to you.',
      '**Start with the first note.** Put `[1,3]` in your result. It is your anchor. Every new note compares to whatever is currently last in your result.',
      '**Compare with the last note.** Does the new note start before the last note ends? If yes → merge them. If no → add it separately. That is the ONLY check you need.',
      '**When two notes overlap** — Keep the earlier start and the later end. `[1,3]` + `[2,6]` becomes `[1,6]`. The overlapping part (hours 2-3) disappears into the bigger note.',
      '**Why sorting by START (not end)?** — Imagine `[[1,10], [2,3]]`. Sorting by start puts the big one first, so the small one gets absorbed correctly. Sorting by end might place the small one first and miss the merge.',
      '**One pass, done.** Each note is touched once. No nested loops, no checking every pair. O(n log n) for sorting + O(n) for merging = way better than checking every pair (O(n²)).',
    ],
    jsConcepts: [
      '`.sort((a,b)=>a[0]-b[0])` — sort by the first element of each pair. Returns negative (a before b), zero (equal), or positive (b before a).',
      '`merged[merged.length - 1]` — accessing the last element. Equivalent to `.at(-1)` but more widely supported.',
    ],
  },

  /* ── Insert Interval ─────────────────────────────── */
  {
    id: 'insert-interval',
    category: 'merge-interval',
    title: 'Insert and merge interval',
    topic: 'Three-phase merge',
    description: 'Your calendar has meetings [1,3] and [6,9]. Now add a new meeting [2,5]. It overlaps with [1,3] — so merge them into [1,5]. Result: [[1,5],[6,9]].',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    debugCode: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0;

  // Phase 1: add all intervals before newInterval
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // Phase 2: merge overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);

  // Phase 3: add remaining intervals
  while (i < intervals.length) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}`,
    steps: [
      { currentLine: 2, variables: { start: 2, end: 5, i: "~" }, description: "You have two existing meetings: [1,3] and [6,9]. You want to add a new meeting [2,5]. Start with an empty result list." },
      { currentLine: 3, variables: { start: 2, end: 5, i: 0 }, description: "Phase 1 — Skip meetings that end before your new one starts. Check [1,3]: does it end (3) before your new meeting starts (2)?" },
      { currentLine: 6, variables: { start: 2, end: 5, i: 0 }, description: "3 is NOT less than 2 — meeting [1,3] ends AFTER your new meeting starts. So it might overlap. Move to Phase 2." },
      { currentLine: 11, variables: { start: 2, end: 5, i: 0 }, description: "Phase 2 — Merge any meeting that overlaps. Does [1,3] start (1) before your new meeting ends (5)? Yes — they overlap!" },
      { currentLine: 12, variables: { start: 2, end: 5, i: 0 }, description: "Expand your new meeting left: the earliest start between 2 and 1 is 1. Your meeting grows to start at 1." },
      { currentLine: 13, variables: { start: 1, end: 5, i: 0 }, description: "Expand right: the latest end between 5 and 3 is 5. Your meeting becomes [1,5] — it swallowed [1,3]!" },
      { currentLine: 11, variables: { start: 1, end: 5, i: 1 }, description: "Check the next meeting [6,9]. Does it start (6) before your new meeting ends (5)? No — 6 is after 5. No overlap here." },
      { currentLine: 16, variables: { start: 1, end: 5, i: 1 }, description: "Phase 2 done. Add your merged meeting [1,5] to the result. Result: [[1,5]]." },
      { currentLine: 19, variables: { start: 1, end: 5, i: 1 }, description: "Phase 3 — Copy everything after. [6,9] starts after your meeting — it cannot overlap. Add it as-is." },
      { currentLine: 20, variables: { start: 1, end: 5, i: 1 }, description: "Add [6,9]. Final result: [[1,5], [6,9]]. Your new meeting slid in and merged with the one it overlapped." },
      { currentLine: 22, variables: { start: 1, end: 5, i: 2 }, description: "Done! Three phases: (1) skip what is before, (2) merge what overlaps, (3) copy what is after." },
    ],
    visualType: 'interval-timeline',
    visualData: [
      { items: [], intervals: [[1,3],[6,9]], current: -1 },
      { items: [], intervals: [[1,3],[6,9]], current: -1 },
      { items: [], intervals: [[1,3],[6,9]], current: 0 },
      { items: [], intervals: [[1,3],[6,9]], current: 0, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,3],[6,9]], current: 0, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,5],[6,9]], current: 0, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,5],[6,9]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,5],[6,9]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,5],[6,9]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,5],[6,9]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,5],[6,9]], current: 1, found: true },
    ],
    whyItWorks: {
      title: 'Three simple phases: skip, merge, copy.',
      body: [
        'Phase 1: Copy meetings that end before your new one starts. They are in the past — no conflict.',
        'Phase 2: Merge any meeting that overlaps with your new one. Stretch your new meeting to cover everything it bumps into.',
        'Phase 3: Copy everything after. Since the list is sorted, no future meeting can overlap with your (now possibly expanded) meeting.',
      ],
    },
    whenToUseSummary: 'You have a sorted schedule and one new meeting to add. Phase 1: skip meetings before. Phase 2: merge anything that overlaps — stretch your meeting to cover them. Phase 3: copy meetings after. One pass, O(n).',
    breakdown: [
      'Think of your calendar. You have meetings scheduled in order. Now someone asks: "Can we meet from 2 to 5?" You do not need to rewrite the whole calendar — just find where the new meeting fits, merge if it bumps into anything, and leave the rest alone.',
      '**Phase 1 — Before the new meeting.** Walk through existing meetings. Any meeting that ends BEFORE your new one starts is safe — it cannot overlap. Copy it to your result and keep going.',
      '**Phase 2 — During the new meeting.** Now you reach meetings that MIGHT overlap. The rule: a meeting overlaps if it starts before your new meeting ends. If it overlaps, stretch your new meeting to cover it — push the start earlier and the end later — then check the next one. Keep expanding until you find a meeting that starts AFTER your expanded end.',
      '**Phase 3 — After the new meeting.** Everything after Phase 2 starts safely after your meeting ends. No overlap possible (because the list is sorted). Copy the rest as-is.',
      '**Why three phases?** — You cannot just merge everything in one loop because the middle phase might expand to cover MULTIPLE existing meetings. The three phases separate "definitely before," "definitely overlapping," and "definitely after" — each with a simple, clean rule.',
      '**Why O(n)?** — You walk through the list exactly once. Each existing meeting is touched once. No sorting needed because the input already comes sorted.',
    ],
    jsConcepts: [
      '`Math.min / Math.max` — pick the smaller/larger of two numbers. Critical for expanding interval boundaries during merging.',
      'Three-phase algorithms — a common pattern when inserting into sorted data: before, during (merge), after.',
    ],
  },

  /* ═══════════════════════════════════════════════════
     PREFIX SUM
  ═══════════════════════════════════════════════════ */

  /* ── Range Sum Query ─────────────────────────────── */
  {
    id: 'range-sum',
    category: 'prefix-sum',
    title: 'Range sum queries',
    topic: 'Precomputation',
    description: 'Imagine a number strip: [3, 1, 4, 1, 5, 9]. Someone asks: "What is the sum from position 1 to 4?" Instead of adding 1+4+1+5 every single time, precompute a running total once. Then any range sum becomes just one subtraction - instant, no matter how many times you are asked.',
    timeComplexity: 'Build O(n), Query O(1)',
    spaceComplexity: 'O(n)',
    debugCode: `function buildPrefix(nums) {
  const prefix = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[prefix.length - 1] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix, l, r) {
  return prefix[r + 1] - prefix[l];
}`,
    steps: [
      { currentLine: 2, variables: { i: '~', running: 0 }, description: 'Initialize prefix array with `[0]`. The zero at the start makes range math clean.' },
      { currentLine: 3, variables: { i: 0, running: 0 }, description: 'i=0: nums[0]=3. Add to running sum: 0+3 = 3.' },
      { currentLine: 4, variables: { i: 0, running: 3 }, description: 'Push 3. Prefix = `[0, 3]`.' },
      { currentLine: 3, variables: { i: 1, running: 3 }, description: 'i=1: nums[1]=1. Running sum: 3+1 = 4.' },
      { currentLine: 4, variables: { i: 1, running: 4 }, description: 'Push 4. Prefix = `[0, 3, 4]`.' },
      { currentLine: 3, variables: { i: 2, running: 4 }, description: 'i=2: nums[2]=4. Running sum: 4+4 = 8.' },
      { currentLine: 4, variables: { i: 2, running: 8 }, description: 'Push 8. Prefix = `[0, 3, 4, 8]`.' },
      { currentLine: 3, variables: { i: 3, running: 8 }, description: 'i=3: nums[3]=1. Running sum: 8+1 = 9.' },
      { currentLine: 4, variables: { i: 3, running: 9 }, description: 'Push 9. Prefix = `[0, 3, 4, 8, 9]`.' },
      { currentLine: 3, variables: { i: 4, running: 9 }, description: 'i=4: nums[4]=5. Running sum: 9+5 = 14.' },
      { currentLine: 4, variables: { i: 4, running: 14 }, description: 'Push 14. Prefix = `[0, 3, 4, 8, 9, 14]`.' },
      { currentLine: 3, variables: { i: 5, running: 14 }, description: 'i=5: nums[5]=9. Running sum: 14+9 = 23.' },
      { currentLine: 4, variables: { i: 5, running: 23 }, description: 'Push 23. Prefix = `[0, 3, 4, 8, 9, 14, 23]`. Build done.' },
      { currentLine: 6, variables: { i: 5, running: 23 }, description: 'Query sum(1,4): `prefix[5] - prefix[1] = 14 - 3 = 11`. O(1)!' },
      { currentLine: 10, variables: { i: 5, running: 23 }, description: 'Check: nums[1]+nums[2]+nums[3]+nums[4] = 1+4+1+5 = 11. ✓' },
    ],
    visualType: 'prefix-array',
    visualData: [
      { items: [3, 1, 4, 1, 5, 9], prefix: [0], leftIndex: -1 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0], leftIndex: 0 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3], leftIndex: 0 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3], leftIndex: 1 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4], leftIndex: 1 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4], leftIndex: 2 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8], leftIndex: 2 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8], leftIndex: 3 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9], leftIndex: 3 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9], leftIndex: 4 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9, 14], leftIndex: 4 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9, 14], leftIndex: 5 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9, 14, 23], leftIndex: 5 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9, 14, 23], leftIndex: 5, queryStart: 1, queryEnd: 4 },
      { items: [3, 1, 4, 1, 5, 9], prefix: [0, 3, 4, 8, 9, 14, 23], leftIndex: 5, queryStart: 1, queryEnd: 4, found: true },
    ],
    whyItWorks: {
      title: 'Precompute running sums once — any range sum becomes a single subtraction.',
      body: [
        'The prefix array stores the cumulative sum up to each index. prefix[i] = sum of nums[0..i-1].',
        'To get sum(l, r), compute prefix[r+1] - prefix[l]. This subtracts everything before l from everything up to r, leaving only the range.',
        'Without prefix sums, each query would take O(n). With them, any number of queries runs in O(1) each.',
      ],
    },
    whenToUseSummary: 'Precompute an array where each entry is the sum of all elements up to that index. Range sum is a single subtraction: prefix[r+1] - prefix[l].',
    breakdown: [
      'A prefix sum array turns any range sum query into **one subtraction**. Build takes O(n) once, then every query is O(1) — no matter how many queries you make.',
      '**The zero sentinel** — Starting with `prefix[0] = 0` is a deliberate trick. It means `sum(0, r) = prefix[r+1] - prefix[0] = prefix[r+1]`, which works without a special case for ranges starting at index 0.',
      '**Why prefix[r+1]?** — `prefix[i]` stores the sum of `nums[0..i-1]`. So `prefix[r+1]` is the sum up to r (inclusive), and `prefix[l]` is the sum up to l-1. The difference is `nums[l..r]`.',
      '**The formula** — `prefix[r+1] - prefix[l]` = (sum up to r) - (sum up to l-1) = sum from l to r. Both values are O(1) lookups in the prefix array.',
      '**Beyond sums** — The same pattern works for products, XORs, and any operation with an inverse. Prefix XOR, prefix product (with care for zeros), etc.',
    ],
    jsConcepts: [
      'Precomputation — a trade-off: spend O(n) upfront to make future operations O(1). Common in algorithms where queries outnumber builds.',
      'Sentinel zero — prefix[0] = 0 avoids an if-statement for range queries that start at index 0. Elegant and bug-reducing.',
    ],
  },

  /* ── Pivot Index ─────────────────────────────────── */
  {
    id: 'pivot-index',
    category: 'prefix-sum',
    title: 'Find pivot index',
    topic: 'Equilibrium point',
    description: 'Imagine a seesaw. Find the balance point where the weight on the left equals the weight on the right. In [1, 7, 3, 6, 5, 6], index 3 is the pivot — left side (1+7+3=11) equals right side (5+6=11). The element at the pivot itself does not count on either side.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;

  for (let i = 0; i < nums.length; i++) {
    if (leftSum === total - leftSum - nums[i]) return i;
    leftSum += nums[i];
  }
  return -1;
}`,
    steps: [
      { currentLine: 2, variables: { i: '~', leftSum: '~', total: '~' }, description: 'Compute total sum: 1+7+3+6+5+6 = 28.' },
      { currentLine: 3, variables: { i: '~', leftSum: 0, total: 28 }, description: 'Initialize `leftSum = 0`. At any index i, right sum = total - leftSum - nums[i].' },
      { currentLine: 5, variables: { i: 0, leftSum: 0, total: 28 }, description: 'i=0: nums[0]=1. right sum = 28 - 0 - 1 = 27. 0 !== 27 — not a pivot.' },
      { currentLine: 6, variables: { i: 0, leftSum: 1, total: 28 }, description: 'Add nums[0]=1 to leftSum. leftSum is now 1.' },
      { currentLine: 5, variables: { i: 1, leftSum: 1, total: 28 }, description: 'i=1: nums[1]=7. right sum = 28 - 1 - 7 = 20. 1 !== 20 — not a pivot.' },
      { currentLine: 6, variables: { i: 1, leftSum: 8, total: 28 }, description: 'Add nums[1]=7 to leftSum. leftSum is now 8.' },
      { currentLine: 5, variables: { i: 2, leftSum: 8, total: 28 }, description: 'i=2: nums[2]=3. right sum = 28 - 8 - 3 = 17. 8 !== 17 — not a pivot.' },
      { currentLine: 6, variables: { i: 2, leftSum: 11, total: 28 }, description: 'Add nums[2]=3 to leftSum. leftSum is now 11.' },
      { currentLine: 5, variables: { i: 3, leftSum: 11, total: 28 }, description: 'i=3: nums[3]=6. right sum = 28 - 11 - 6 = 11. 11 === 11 — pivot found!' },
      { currentLine: 5, variables: { i: 3, leftSum: 11, total: 28 }, description: 'Return index 3. Left of index 3: [1,7,3] = 11. Right: [5,6] = 11. ✓' },
    ],
    visualType: 'prefix-array',
    visualData: [
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: -1 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: -1 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 0 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 0 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 1 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 1 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 2 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 2 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 3 },
      { items: [1, 7, 3, 6, 5, 6], prefix: [], leftIndex: 3, found: true },
    ],
    whyItWorks: {
      title: 'One formula avoids recomputing the right sum from scratch.',
      body: [
        'Right sum at index i = total - leftSum - nums[i]. No need to loop through the right side each time.',
        'As i moves right, leftSum grows by nums[i]. The right sum can be computed in O(1) at each step — total O(n).',
      ],
    },
    whenToUseSummary: 'Compute total once. Track leftSum as you iterate. At each index, rightSum = total - leftSum - nums[i]. If equal, return i.',
    breakdown: [
      'The naive approach recomputes the right sum for every index — O(n²). The pivot-index pattern avoids this with a **single formula**: `rightSum = total - leftSum - nums[i]`.',
      '**Why it works** — At any index i, the total array is split into three parts: left (sum to the left), nums[i] (the element itself), and right (sum to the right). Since total = leftSum + nums[i] + rightSum, solving for rightSum gives the formula.',
      '**Why O(n)?** — Total is computed once (O(n)). Then a single pass checks each index with O(1) arithmetic per step — also O(n). Total: O(n) time, O(1) extra space.',
      '**The pivot is NOT counted** — The element at the pivot index itself is excluded from both left and right sums. That is why we subtract `nums[i]` in the formula.',
      '**No pivot edge case** — If no index satisfies the condition, return -1. This happens when no equilibrium point exists (e.g., `[1, 2, 3]`).',
    ],
    jsConcepts: [
      '`.reduce((a,b) => a+b, 0)` — accumulates the sum of an array. The second argument (0) is the initial value. Without it, reduce would skip the first element.',
      'O(1) space — we only track total and leftSum, regardless of array size. No extra arrays or hash maps needed.',
    ],
  },

  /* ═══════════════════════════════════════════════════
     SORTING STRATEGIES
  ═══════════════════════════════════════════════════ */

  /* ── Three Sum ───────────────────────────────────── */
  {
    id: 'three-sum',
    category: 'sorting-strategies',
    title: 'Three sum to zero',
    topic: 'Sort + two-pointer',
    description: 'Find three numbers that add to zero, like [-1, 0, 1] or [-1, -1, 2]. Sort the numbers first, then turn it into a two-sum: pick one number as the anchor, find the other two with two fingers from the ends.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    debugCode: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;

    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        result.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) {
        l++;
      } else {
        r--;
      }
    }
  }
  return result;
}`,
    steps: [
      { currentLine: 2, variables: { i: '~', l: '~', r: '~', sum: '~' }, description: 'Sort array: `[-4, -1, -1, 0, 1, 2]`. Sorting lets us use two-pointers and skip duplicates.' },
      { currentLine: 5, variables: { i: 0, l: '~', r: '~', sum: '~' }, description: 'Outer loop: i=0, nums[0]=-4. Not a duplicate — continue.' },
      { currentLine: 7, variables: { i: 0, l: 1, r: 5, sum: '~' }, description: 'Set two-pointer range: l=1 (nums[1]=-1), r=5 (nums[5]=2).' },
      { currentLine: 10, variables: { i: 0, l: 1, r: 5, sum: -3 }, description: 'sum = -4 + (-1) + 2 = -3. Too small — need bigger numbers.' },
      { currentLine: 17, variables: { i: 0, l: 2, r: 5, sum: -3 }, description: 'Move l right: l=2 (nums[2]=-1).' },
      { currentLine: 10, variables: { i: 0, l: 2, r: 5, sum: -3 }, description: 'sum = -4 + (-1) + 2 = -3. Still too small — move l again.' },
      { currentLine: 17, variables: { i: 0, l: 3, r: 5, sum: -3 }, description: 'Move l right: l=3 (nums[3]=0).' },
      { currentLine: 10, variables: { i: 0, l: 3, r: 5, sum: -2 }, description: 'sum = -4 + 0 + 2 = -2. Too small — move l.' },
      { currentLine: 17, variables: { i: 0, l: 4, r: 5, sum: -2 }, description: 'Move l right: l=4 (nums[4]=1).' },
      { currentLine: 10, variables: { i: 0, l: 4, r: 5, sum: -1 }, description: 'sum = -4 + 1 + 2 = -1. l meets r — exit while. No match with -4.' },
      { currentLine: 5, variables: { i: 1, l: 4, r: 5, sum: -1 }, description: 'Outer loop: i=1, nums[1]=-1. Not a duplicate of nums[0]=-4.' },
      { currentLine: 7, variables: { i: 1, l: 2, r: 5, sum: -1 }, description: 'Set two-pointer range: l=2 (nums[2]=-1), r=5 (nums[5]=2).' },
      { currentLine: 10, variables: { i: 1, l: 2, r: 5, sum: 0 }, description: 'sum = -1 + (-1) + 2 = 0. Match found! Triplet: [-1, -1, 2].' },
      { currentLine: 11, variables: { i: 1, l: 2, r: 5, sum: 0 }, description: 'Push triplet to result. Skip duplicate values at l and r.' },
      { currentLine: 14, variables: { i: 1, l: 4, r: 4, sum: 0 }, description: 'Skip duplicates and move pointers. l=4, r=4 — while loop ends.' },
      { currentLine: 5, variables: { i: 2, l: 4, r: 4, sum: 0 }, description: 'i=2, nums[2]=-1 === nums[1]=-1 — skip duplicate anchor.' },
      { currentLine: 5, variables: { i: 3, l: 4, r: 4, sum: 0 }, description: 'i=3, nums[3]=0. Not a duplicate.' },
      { currentLine: 7, variables: { i: 3, l: 4, r: 5, sum: 0 }, description: 'Set two-pointer range: l=4 (nums[4]=1), r=5 (nums[5]=2).' },
      { currentLine: 10, variables: { i: 3, l: 4, r: 5, sum: 3 }, description: 'sum = 0 + 1 + 2 = 3. Too big — need smaller numbers.' },
      { currentLine: 19, variables: { i: 3, l: 4, r: 4, sum: 3 }, description: 'Move r left: r=4. l meets r — exit while. Loop ends.' },
      { currentLine: 21, variables: { i: 3, l: 4, r: 4, sum: 3 }, description: 'Return result: `[[-1, -1, 2]]`.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 0, rightIndex: -1 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 0, rightIndex: -1 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 1, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 1, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 2, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 2, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 3, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 3, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 1, rightIndex: -1 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 2, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 2, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 2, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 4 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 2, rightIndex: -1 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 3, rightIndex: -1 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 5 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 4 },
      { items: [-4, -1, -1, 0, 1, 2], leftIndex: 4, rightIndex: 4, found: true },
    ],
    whyItWorks: {
      title: 'Sorting reduces 3Sum to 2Sum — which two-pointers solves in O(n).',
      body: [
        'For each anchor element i, the remaining problem is "find two numbers that sum to -nums[i]" on a sorted subarray.',
        'Sorting plus duplicate-skipping guarantees unique triplets without needing a Set.',
        'The overall complexity is O(n²): O(n log n) for sorting + O(n²) for the nested two-pointer scans.',
      ],
    },
    whenToUseSummary: 'Sort the array. For each element as anchor, use two-pointers to find pairs that sum to the complement. Skip duplicates at every level.',
    breakdown: [
      '3Sum is a classic example of **sorting as a strategy**. Without sorting, you would need three nested loops (O(n³)). Sorting plus two-pointers drops it to O(n²).',
      '**How it works** — Sort the array first. For each element at index i (the anchor), set two pointers on the remaining subarray (i+1 to end). The target is `-nums[i]` — find two numbers that sum to it.',
      '**Duplicate handling** — Skip duplicate anchors (`nums[i] === nums[i-1]`). After finding a match, skip duplicate values at both l and r to avoid duplicate triplets in the result.',
      '**Why sort?** — Sorting does two things: (1) enables the two-pointer technique on the subarray, (2) makes duplicates adjacent so they are easy to skip.',
      '**Comparison to hash map approach** — A hash-map 3Sum is O(n²) but needs O(n) space and duplicate handling is messier. The sort + two-pointer approach is O(1) extra space and handles duplicates elegantly.',
    ],
    jsConcepts: [
      'Duplicate skipping — `if (i > 0 && nums[i] === nums[i-1]) continue` skips repeated anchor values. Prevents duplicate triplets.',
      'Nested two-pointer — outer loop picks an anchor, inner while-loop runs two-pointers on the remainder. O(n²) total because the inner loop runs O(n) times per anchor.',
    ],
  },

  /* ── Meeting Rooms ───────────────────────────────── */
  {
    id: 'meeting-rooms',
    category: 'sorting-strategies',
    title: 'Meeting rooms (overlap check)',
    topic: 'Sort + sweep',
    description: 'You have three meetings: [0,30], [5,10], [15,20]. Can one person attend all of them? Sort them by start time and check each pair — if any meeting starts before the last one ends, there is a conflict.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    debugCode: `function canAttend(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      return false;
    }
  }
  return true;
}`,
    steps: [
      { currentLine: 2, variables: { prevStart: '~', prevEnd: '~', currStart: '~' }, description: 'Sort meetings by start time: `[[0,30],[5,10],[15,20]]`.' },
      { currentLine: 4, variables: { prevStart: '~', prevEnd: '~', currStart: '~' }, description: 'Loop: i=1. Compare meeting 1 with meeting 0.' },
      { currentLine: 5, variables: { prevStart: 0, prevEnd: 30, currStart: 5 }, description: '`intervals[1][0]=5 < intervals[0][1]=30`. Meeting starts before previous ends — conflict!' },
      { currentLine: 6, variables: { prevStart: 0, prevEnd: 30, currStart: 5 }, description: 'Return false — cannot attend all meetings. [0,30] and [5,10] overlap.' },
    ],
    visualType: 'interval-timeline',
    visualData: [
      { items: [], intervals: [[0,30],[5,10],[15,20]], current: -1 },
      { items: [], intervals: [[0,30],[5,10],[15,20]], current: 1 },
      { items: [], intervals: [[0,30],[5,10],[15,20]], current: 1, leftIndex: 0, rightIndex: 0, conflict: true },
      { items: [], intervals: [[0,30],[5,10],[15,20]], current: 1, leftIndex: 0, rightIndex: 0, conflict: true, found: true },
    ],
    whyItWorks: {
      title: 'Sorting makes the check linear — only adjacent meetings can conflict.',
      body: [
        'After sorting by start time, the only possible conflict is between a meeting and the next one. If all adjacent pairs are non-overlapping, no non-adjacent pair can overlap either.',
        'Without sorting, you would need to check every pair — O(n²). Sorting reduces it to O(n log n) total.',
      ],
    },
    whenToUseSummary: 'Sort by start time. Check each adjacent pair — if any meeting starts before the previous one ends, there is a conflict.',
    breakdown: [
      'Meeting Rooms demonstrates the **sort + sweep** pattern. The geometric intuition: if you sort intervals by their start times, you can walk through them in order and only check consecutive pairs.',
      '**Why only adjacent?** — Imagine three meetings A, B, C sorted by start time. If A and B do not overlap, and B and C do not overlap, then A and C cannot overlap either (A ends before B starts, and B ends before C starts, so A definitely ends before C starts).',
      '**The overlap condition** — `intervals[i][0] < intervals[i-1][1]` — a conflict exists if the current meeting starts before the previous one ends. This works because of the sort — you know i-1 started first.',
      '**What about equal times?** — If one meeting ends at exactly the same time another starts (e.g., [2,4] and [4,6]), that is NOT considered overlapping — you can attend both. The condition uses `<`, not `<=`.',
      '**Extension to meeting rooms II** — The same sort pattern combined with a min-heap (priority queue) solves "minimum number of meeting rooms needed." Another great interview follow-up.',
    ],
    jsConcepts: [
      'Edge equality — `intervals[i][0] < intervals[i-1][1]` uses strict `<`. Meetings that end and start at the same time do not conflict.',
      'Sort by first element — `a[0] - b[0]` sorts in ascending order. To sort by end time instead, use `a[1] - b[1]`.',
    ],
  },
  /* ═══════════════════════════════════════════════════
     GREEDY
  ═══════════════════════════════════════════════════ */

  /* ── Activity Selection ─────────────────────────── */
  {
    id: 'activity-selection',
    category: 'greedy',
    title: 'Activity selection',
    topic: 'Pick the one that leaves first',
    description: 'You have ONE playroom. Four friends want to use it: [1-4], [3-5], [0-6], and [5-7]. Some times overlap. Simple rule: always pick the friend who LEAVES earliest. They free up the room fastest.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    debugCode: `function selectActivities(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  const picked = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = picked[picked.length - 1];
    if (intervals[i][0] >= last[1]) {
      picked.push(intervals[i]);
    }
  }
  return picked;
}`,
    steps: [
      { currentLine: 2, variables: { lastEnd: '~', i: '~', picked: '~' }, description: 'Line up the friends by when they LEAVE. [1-4] leaves at 4 - earliest! [3-5] leaves at 5. [0-6] at 6. [5-7] at 7.' },
      { currentLine: 3, variables: { lastEnd: 4, i: '~', picked: '[[1,4]]' }, description: 'Friend [1-4] leaves first. Let them use the room! The room is free again at 4.' },
      { currentLine: 5, variables: { lastEnd: 4, i: 1, picked: '[[1,4]]' }, description: 'Next in line: [3-5]. They want to start at 3.' },
      { currentLine: 6, variables: { lastEnd: 4, i: 1, picked: '[[1,4]]' }, description: 'But the room is busy until 4! 3 comes before 4 - they overlap. Sorry, skip this friend.' },
      { currentLine: 5, variables: { lastEnd: 4, i: 2, picked: '[[1,4]]' }, description: 'Next: [0-6]. They want to start at 0.' },
      { currentLine: 6, variables: { lastEnd: 4, i: 2, picked: '[[1,4]]' }, description: '0 is way before 4. The room is still busy. Skip.' },
      { currentLine: 5, variables: { lastEnd: 4, i: 3, picked: '[[1,4]]' }, description: 'Next: [5-7]. They want to start at 5.' },
      { currentLine: 6, variables: { lastEnd: 4, i: 3, picked: '[[1,4]]' }, description: '5 is AFTER 4! The room is free. Let them use it. Room is now busy until 7.' },
      { currentLine: 7, variables: { lastEnd: 7, i: 3, picked: '[[1,4], [5,7]]' }, description: 'No more friends in line. We fit 2 friends: [1-4] and [5-7].' },
      { currentLine: 10, variables: { lastEnd: 7, i: 3, picked: '[[1,4], [5,7]]' }, description: 'Done! Sorting by END time gave us the max. If we sorted by START time, [0-6] would block everyone else.' },
    ],
    visualType: 'interval-timeline',
    visualData: [
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: -1 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 0, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 0, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 1, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 2, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 2, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 3, leftIndex: 0, rightIndex: 0 },
      { items: [], intervals: [[1,4],[3,5],[0,6],[5,7]], current: 3, leftIndex: 0, rightIndex: 1 },
      { items: [], intervals: [[1,4],[5,7],[0,6],[3,5]], current: 3, leftIndex: 0, rightIndex: 1, found: true },
    ],
    whyItWorks: {
      title: 'The friend who leaves earliest frees up the room for the most other friends.',
      body: [
        'Line everyone up by when they LEAVE, not when they arrive. The earliest leaver can never be a bad choice.',
        'After someone uses the room, only let in friends who start AFTER the room is free. One check per friend.',
      ],
    },
    whenToUseSummary: 'Sort by end time. Always pick the activity that finishes first among those that can start. One pass.',
    breakdown: [
      'You have ONE playroom. Friends all want to use it, but at different times. Some overlap. Your goal: say yes to as MANY friends as possible.',
      '**Line them up by leaving time.** Sort the list so the friend who leaves earliest is first. Do NOT sort by arrival time - that is the trap!',
      '**Say yes to the first friend.** They leave earliest, so they free up the room fastest.',
      '**Check each next friend.** Does this friend start AFTER the room is free? If yes, let them in! If no, skip.',
      '**Why it cannot fail.** The friend who leaves earliest is ALWAYS a good choice. Any other friend would leave later and block MORE time.',
      '**One pass, no take-backs.** You walk through the line once. You never second-guess a choice.',
    ],
    jsConcepts: [
      '.sort((a, b) => a[1] - b[1]) - sort by the SECOND number in each pair (the ending time).',
      'picked[picked.length - 1] - grab the last thing added to the list.',
    ],
  },

  /* ── Jump Game ──────────────────────────────────── */
  {
    id: 'jump-game',
    category: 'greedy',
    title: 'Jump game',
    topic: 'How far can the frog go?',
    description: 'A frog sits on lily pads: [2, 3, 1, 1, 4]. Each number is how many pads the frog CAN skip. Start at pad 0. Can the frog reach the last pad? The frog always jumps as far as it can - greedy!',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function canJump(nums) {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return false;
}`,
    steps: [
      { currentLine: 2, variables: { i: '~', maxReach: 0 }, description: 'Frog starts on pad 0. So far, the farthest pad it can reach is pad 0.' },
      { currentLine: 4, variables: { i: 0, maxReach: 0 }, description: 'Frog is on pad 0. Can the frog even get here? Yes - pad 0 is where it started!' },
      { currentLine: 6, variables: { i: 0, maxReach: 2 }, description: 'Pad 0 says "2." The frog can reach up to pad 0+2 = pad 2.' },
      { currentLine: 7, variables: { i: 0, maxReach: 2 }, description: 'Can the frog reach the last pad (pad 4) from pad 2? Not yet. Hop to the next pad.' },
      { currentLine: 4, variables: { i: 1, maxReach: 2 }, description: 'Frog is on pad 1. Can it get here? Its reach (pad 2) is past pad 1 - yes!' },
      { currentLine: 6, variables: { i: 1, maxReach: 4 }, description: 'Pad 1 says "3." The frog can now reach pad 1+3 = pad 4. That is the last pad!' },
      { currentLine: 7, variables: { i: 1, maxReach: 4 }, description: 'Reach covers the last pad (4 >= 4). The frog made it! Return true.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [2, 3, 1, 1, 4], leftIndex: -1, rightIndex: -1 },
      { items: [2, 3, 1, 1, 4], leftIndex: 0, rightIndex: -1 },
      { items: [2, 3, 1, 1, 4], leftIndex: 0, rightIndex: 2 },
      { items: [2, 3, 1, 1, 4], leftIndex: 0, rightIndex: 2 },
      { items: [2, 3, 1, 1, 4], leftIndex: 1, rightIndex: 2 },
      { items: [2, 3, 1, 1, 4], leftIndex: 1, rightIndex: 4 },
      { items: [2, 3, 1, 1, 4], leftIndex: 1, rightIndex: 4, found: true },
    ],
    whyItWorks: {
      title: 'Always jump as far as you can - you can never jump too far.',
      body: [
        'The frog keeps track of the farthest pad it can reach. At each new pad, it stretches its reach further.',
        'If the frog ever reaches or passes the last pad, it wins. If a pad is too far away, the frog is stuck.',
      ],
    },
    whenToUseSummary: 'One number tracks the farthest pad reachable. Stretch it further at each step. O(n), one pass.',
    breakdown: [
      'A frog is hopping across a pond on lily pads. Each pad has a number: how many pads the frog can skip from there.',
      '**The frog\'s reach.** The frog remembers the FARTHEST pad it can get to. We call this maxReach.',
      '**Can the frog even get here?** At each pad, first check: is this pad within reach?',
      '**Stretch the reach.** If the frog can get here, stretch the reach: maxReach = max(maxReach, i + nums[i]).',
      '**Check for victory.** If the reach covers the last pad (or goes past it), the frog wins!',
      '**Why jumping as far as possible never hurts.** Jumping LESS cannot help you reach MORE pads.',
      '**One pass, two numbers.** The frog visits each pad at most once. No backtracking, no trying different paths.',
    ],
    jsConcepts: [
      'Math.max(a, b) - picks the bigger number. Math.max(2, 5) gives 5.',
      '>= - "greater than or equal to." The frog win condition: reach >= last pad.',
    ],
  },


  /* ═══════════════════════════════════════════════════
     DYNAMIC PROGRAMMING
  ═══════════════════════════════════════════════════ */

  /* ── Fibonacci (DP, bottom-up) ─────────────────── */
  {
    id: 'fib-dp',
    category: 'dp',
    title: 'Fibonacci (bottom-up DP)',
    topic: 'Build a table, reuse answers',
    description: 'Fibonacci the smart way: build the sequence 0, 1, 1, 2, 3, 5, 8, 13, 21 from the bottom up. Each number is just the sum of the two before it. One loop, O(n) - no tree, no repeats.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    debugCode: `function fib(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    steps: [
      { currentLine: 3, variables: { i: '~', n: 8, 'dp[0]': 0, 'dp[1]': 1 }, description: 'Start with the two seeds: fib(0)=0, fib(1)=1. Table begins [0, 1].' },
      { currentLine: 4, variables: { i: 2, n: 8, 'dp[i-1]': 1, 'dp[i-2]': 0 }, description: 'i=2: fib(2) = 1+0 = 1. Each cell adds the two before it.' },
      { currentLine: 4, variables: { i: 3, n: 8, 'dp[i-1]': 1, 'dp[i-2]': 1 }, description: 'i=3: fib(3) = 1+1 = 2.' },
      { currentLine: 4, variables: { i: 4, n: 8, 'dp[i-1]': 2, 'dp[i-2]': 1 }, description: 'i=4: fib(4) = 2+1 = 3.' },
      { currentLine: 4, variables: { i: 5, n: 8, 'dp[i-1]': 3, 'dp[i-2]': 2 }, description: 'i=5: fib(5) = 3+2 = 5.' },
      { currentLine: 4, variables: { i: 6, n: 8, 'dp[i-1]': 5, 'dp[i-2]': 3 }, description: 'i=6: fib(6) = 5+3 = 8.' },
      { currentLine: 4, variables: { i: 7, n: 8, 'dp[i-1]': 8, 'dp[i-2]': 5 }, description: 'i=7: fib(7) = 8+5 = 13.' },
      { currentLine: 4, variables: { i: 8, n: 8, 'dp[i-1]': 13, 'dp[i-2]': 8 }, description: 'i=8: fib(8) = 13+8 = 21. The sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21.' },
      { currentLine: 6, variables: { i: 8, n: 8, 'dp[n]': 21 }, description: 'Return dp[8] = 21. DP: 8 steps. Naive recursion: ~54 calls. That is the power of remembering answers.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [0, 1, '·', '·', '·', '·', '·', '·', '·'], leftIndex: 1, rightIndex: -1 },
      { items: [0, 1, 1, '·', '·', '·', '·', '·', '·'], leftIndex: 2, rightIndex: -1 },
      { items: [0, 1, 1, 2, '·', '·', '·', '·', '·'], leftIndex: 3, rightIndex: -1 },
      { items: [0, 1, 1, 2, 3, '·', '·', '·', '·'], leftIndex: 4, rightIndex: -1 },
      { items: [0, 1, 1, 2, 3, 5, '·', '·', '·'], leftIndex: 5, rightIndex: -1 },
      { items: [0, 1, 1, 2, 3, 5, 8, '·', '·'], leftIndex: 6, rightIndex: -1 },
      { items: [0, 1, 1, 2, 3, 5, 8, 13, '·'], leftIndex: 7, rightIndex: -1 },
      { items: [0, 1, 1, 2, 3, 5, 8, 13, 21], leftIndex: 8, rightIndex: -1 },
      { items: [0, 1, 1, 2, 3, 5, 8, 13, 21], leftIndex: 8, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Fill the table left to right. Each cell depends only on cells you already computed.',
      body: [
        'Store each Fibonacci number as you compute it. fib(i) = dp[i-1] + dp[i-2] - both values are already in the table.',
        'No tree, no redundant calls. A single loop replaces the exponential explosion of naive recursion.',
      ],
    },
    whenToUseSummary: 'When a recursive solution repeats the same subproblems, store answers in a table. Build from smallest to largest.',
    breakdown: [
      'Fibonacci is the simplest DP example. The recursive version calls fib(2) three separate times for fib(5). DP says: compute it ONCE, store it, reuse it.',
      'Think of it like filling in a worksheet. Row 0 and row 1 are given (the base cases). Each row after that adds the two numbers above it.',
      '**The table.** dp[0]=0, dp[1]=1. For i from 2 to n: dp[i] = dp[i-1] + dp[i-2]. One loop, O(n) time.',
      '**Why DP is better.** Recursive Fibonacci makes ~2^n calls. For n=8, that is ~54 calls. DP does it in 8 steps.',
    ],
    jsConcepts: [
      'Bottom-up - solving the smallest subproblems first, then combining them. Opposite of recursion (top-down).',
      'Table / memo - the array that stores answers. dp[i] = answer for subproblem i.',
    ],
  },


  /* ── 0/1 Knapsack ─────────────────────────────── */
  {
    id: 'knapsack',
    category: 'dp',
    title: '0/1 Knapsack',
    topic: '2D table',
    description: 'You can carry 5kg. Items: a 2kg gem worth $3, a 3kg toy worth $4, a 4kg book worth $5, a 5kg gadget worth $6. Which items give the most value? The DP grid tells you exactly what to pick.',
    timeComplexity: 'O(n x W)',
    spaceComplexity: 'O(n x W)',
    debugCode: `function knapsack(items, capacity) {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const [weight, value] = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
      }
    }
  }
  return dp[n][capacity];
}`,
    steps: [
      { currentLine: 2, variables: { n: 4, capacity: 5 }, description: '4 items, capacity = 5kg. Build a 5-row x 6-column table. Row 0 and col 0 are all zeros.' },
      { currentLine: 5, variables: { i: 1, weight: 2, value: 3, w: '~' }, description: 'Item 1: 2kg gem worth $3. Fill row 1.' },
      { currentLine: 7, variables: { i: 1, weight: 2, value: 3, w: 2 }, description: 'At w=2: weight(2) <= 2? YES. Max(skip=0, take=0+3) = 3. Can carry the gem!' },
      { currentLine: 6, variables: { i: 1, weight: 2, value: 3, w: 5 }, description: 'Row 1 done. From w=2 onward, value stays 3. Row 1 = [0,0,3,3,3,3].' },
      { currentLine: 5, variables: { i: 2, weight: 3, value: 4, w: '~' }, description: 'Item 2: 3kg toy worth $4.' },
      { currentLine: 7, variables: { i: 2, weight: 3, value: 4, w: 3 }, description: 'At w=3: Max(skip=dp[1][3]=3, take=dp[1][0]+4=4) = 4. Toy alone beats gem.' },
      { currentLine: 7, variables: { i: 2, weight: 3, value: 4, w: 5 }, description: 'At w=5: Max(skip=dp[1][5]=3, take=dp[1][2]+4=3+4=7) = 7! Gem + toy = $7.' },
      { currentLine: 5, variables: { i: 3, weight: 4, value: 5, w: '~' }, description: 'Item 3: 4kg book worth $5.' },
      { currentLine: 7, variables: { i: 3, weight: 4, value: 5, w: 4 }, description: 'At w=4: Max(skip=dp[2][4]=4, take=dp[2][0]+5=5) = 5. Book beats toy for 4kg.' },
      { currentLine: 7, variables: { i: 3, weight: 4, value: 5, w: 5 }, description: 'At w=5: Max(skip=dp[2][5]=7, take=dp[2][1]+5=5) = 7. Gem+toy still best.' },
      { currentLine: 10, variables: { i: 4, weight: 5, value: 6, w: 5 }, description: 'Item 4: 5kg gadget worth $6. At w=5: Max(skip=dp[3][5]=7, take=dp[3][0]+6=6) = 7. The gem+toy pair wins! Best value = $7.' },
    ],
    visualType: 'grid',
    visualData: [
      { items: [], grid: [[0,0,0,0,0,0],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: -1, gridCol: -1 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 1, gridCol: -1 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 1, gridCol: 3 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 1, gridCol: -1 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,-1,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 2, gridCol: -1 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,4,-1,-1],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 2, gridCol: 3 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,4,4,7],[0,-1,-1,-1,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 2, gridCol: 5 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,4,4,7],[0,0,0,0,-1,-1],[0,-1,-1,-1,-1,-1]], gridRow: 3, gridCol: -1 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,4,4,7],[0,0,0,0,5,-1],[0,-1,-1,-1,-1,-1]], gridRow: 3, gridCol: 4 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,4,4,7],[0,0,0,0,5,7],[0,-1,-1,-1,-1,-1]], gridRow: 3, gridCol: 5 },
      { items: [], grid: [[0,0,0,0,0,0],[0,0,0,3,3,3],[0,0,0,4,4,7],[0,0,0,0,5,7],[0,0,0,0,0,7]], gridRow: 4, gridCol: 5 },
    ],
    whyItWorks: {
      title: 'Each cell asks: with these items and this weight, what is my best value?',
      body: [
        'dp[i][w] = best value using first i items with weight limit w.',
        'For each item, two choices: SKIP it (value = dp[i-1][w]) or TAKE it (value = dp[i-1][w-weight] + value). Always pick the better one.',
      ],
    },
    whenToUseSummary: 'Problems where you choose items with constraints. Build a grid: rows=items, cols=capacity.',
    breakdown: [
      'You are packing a bag for a trip. You can carry 5kg. Each item has a weight and a value.',
      '**The grid.** Rows = items, Columns = weight limits from 0 to capacity. Each cell dp[i][w] answers: best value with first i items and weight w.',
      '**Fill one cell at a time.** For each item: SKIP (dp[i-1][w]) or TAKE (dp[i-1][w-weight] + value). Pick the MAX.',
      '**Read the answer.** The bottom-right cell dp[n][capacity] holds the answer.',
      '**O(n x W) time.** For 100 items and capacity 1000, that is 100,000 cells - very fast vs 2^100 brute force.',
    ],
    jsConcepts: [
      'Array.from({ length: n }, () => Array(m).fill(0)) - creates a 2D array of zeros.',
      'Math.max(a, b) - picks the larger value. The DP decision: skip or take, which is better?',
    ],
  },


  /* ═══════════════════════════════════════════════════
     BACKTRACKING
  ═══════════════════════════════════════════════════ */

  /* ── Sudoku (4x4) ──────────────────────────────── */
  {
    id: 'n-queens',
    category: 'backtracking',
    title: 'Sudoku (4x4 mini)',
    topic: 'Dead end → undo → retry',
    description: 'Fill a 4x4 Sudoku. (2,1) can be 1 or 3. Try 1. It forces (2,2) to be either 3 or 4 — but look at column 2: 3 AND 4 are both already there! (2,2) has no valid number. Undo (2,1), try 3 instead. Everything resolves.',
    timeComplexity: 'O(4^n)',
    spaceComplexity: 'O(n)',
    debugCode: `function solve(board, row, col) {
  if (row === 4) return true;
  const [nr, nc] = col === 3 ? [row + 1, 0] : [row, col + 1];
  if (board[row][col] !== 0) return solve(board, nr, nc);
  for (let num = 1; num <= 4; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solve(board, nr, nc)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}`,
    steps: [
      { currentLine: 1, variables: { row: 0, col: 0 }, description: 'Givens: (0,0)=1, (0,3)=2, (1,0)=3, (1,3)=1. Four seeds. (0,1): row 0 has 1 and 2. Try 4 (3 is blocked by (1,0)=3 in same box).' },
      { currentLine: 7, variables: { row: 0, col: 2, num: 3 }, description: '4 works. (0,2): row 0 has 1,4,2 — only 3 is left. Row 0 done: [1,4,3,2].' },
      { currentLine: 4, variables: { row: 1, col: 1 }, description: '(1,1): row 1 has 3,1. Box top-left has 1,4,3 — only 2 is left. Must be 2.' },
      { currentLine: 7, variables: { row: 1, col: 2, num: 4 }, description: '(1,2): row 1 has 3,2,1 — only 4 is left. Row 1 done: [3,2,4,1].' },
      { currentLine: 4, variables: { row: 2, col: 0 }, description: '(2,0): col 0 has 1,3. Try 2 (4 is also available, the solver tries smallest first).' },
      { currentLine: 7, variables: { row: 2, col: 1, num: 1 }, description: '(2,1): col 1 has 4,2. Row 2 has 2. Options: 1 or 3. Try 1 first.' },
      { currentLine: 7, variables: { row: 2, col: 2 }, description: '1 is tentatively placed. Now (2,2): row 2 has 2,1 — needs 3 or 4. But LOOK at column 2: (0,2)=3, (1,2)=4. BOTH 3 AND 4 ARE TAKEN! (2,2) has NO valid number. Dead end.' },
      { currentLine: 8, variables: { row: 2, col: 1, num: '~' }, description: 'solve() returns false. UNDO (2,1) — erase the 1 that got us stuck. You can SEE it go blank in the grid.' },
      { currentLine: 7, variables: { row: 2, col: 1, num: 3 }, description: 'Try the other option: 3. Row 2 has 2. Col 1 has 4,2. 3 is new — no conflict.' },
      { currentLine: 7, variables: { row: 2, col: 2, num: 1 }, description: '(2,2): row 2 has 2,3 — needs 1 or 4. Col 2 has 3,4. Try 1 (1 is not in col 2). 1 works — no dead end this time.' },
      { currentLine: 7, variables: { row: 2, col: 3, num: 4 }, description: '(2,3): row 2 has 2,3,1 — only 4 is left. Row 2 done: [2,3,1,4].' },
      { currentLine: 7, variables: { row: 3, col: 0, num: 4 }, description: '(3,0): col 0 has 1,3,2 — only 4 is left. Must be 4.' },
      { currentLine: 7, variables: { row: 3, col: 1, num: 1 }, description: '(3,1): row 3 has 4. Col 1 has 4,2,3 — only 1 is left. Must be 1.' },
      { currentLine: 7, variables: { row: 3, col: 2, num: 2 }, description: '(3,2): row 3 has 4,1. Col 2 has 3,4,1 — only 2 is left. Must be 2.' },
      { currentLine: 2, variables: { row: 4, col: 0 }, description: '(3,3): row 3 has 4,1,2 — only 3 is left. Puzzle solved! One backtrack, one retry, everything falls into place.' },
    ],
    visualType: 'grid',
    visualData: [
      { items: [], grid: [[1,-1,-1, 2],[ 3,-1,-1, 1],[-1,-1,-1,-1],[-1,-1,-1,-1]], gridRow: -1, gridCol: -1 },
      { items: [], grid: [[1, 4,-1, 2],[ 3,-1,-1, 1],[-1,-1,-1,-1],[-1,-1,-1,-1]], gridRow: 0, gridCol: 2 },
      { items: [], grid: [[1, 4, 3, 2],[ 3,-1,-1, 1],[-1,-1,-1,-1],[-1,-1,-1,-1]], gridRow: 1, gridCol: 1 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2,-1, 1],[-1,-1,-1,-1],[-1,-1,-1,-1]], gridRow: 1, gridCol: 2 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[-1,-1,-1,-1],[-1,-1,-1,-1]], gridRow: 2, gridCol: 0 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2,-1,-1,-1],[-1,-1,-1,-1]], gridRow: 2, gridCol: 1 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 1,-1,-1],[-1,-1,-1,-1]], gridRow: 2, gridCol: 2 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2,-1,-1,-1],[-1,-1,-1,-1]], gridRow: 2, gridCol: 1 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3,-1,-1],[-1,-1,-1,-1]], gridRow: 2, gridCol: 2 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3, 1,-1],[-1,-1,-1,-1]], gridRow: 2, gridCol: 3 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3, 1, 4],[-1,-1,-1,-1]], gridRow: 3, gridCol: 0 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3, 1, 4],[ 4,-1,-1,-1]], gridRow: 3, gridCol: 1 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3, 1, 4],[ 4, 1,-1,-1]], gridRow: 3, gridCol: 2 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3, 1, 4],[ 4, 1, 2,-1]], gridRow: 3, gridCol: 3 },
      { items: [], grid: [[1, 4, 3, 2],[ 3, 2, 4, 1],[ 2, 3, 1, 4],[ 4, 1, 2, 3]], gridRow: -1, gridCol: -1 },
    ],
    whyItWorks: {
      title: 'A dead end is a cell with ZERO valid numbers. You can see why — all options are blocked.',
      body: [
        '(2,1)=1 seemed fine. But then (2,2) needed 3 or 4 — and BOTH were already in column 2. No valid number. Dead end.',
        'The undo erases the choice that led here and tries the next option. (2,1)=3 → (2,2)=1 works because 1 is not in col 2.',
      ],
    },
    whenToUseSummary: 'Constraint puzzles. The solver tries numbers. When a cell has zero options, the PREVIOUS choice was wrong. Undo and retry.',
    breakdown: [
      'A dead end is not a wrong number placed on the board — it is a cell where no number from 1-4 is valid. The grid LOOKS fine, but the solver cannot continue.',
      '**The dead end at (2,2).** Row 2 demands 3 or 4. But column 2 already has both (0,2)=3 and (1,2)=4. No valid option. Dead end.',
      '**The blame goes backward.** (2,2) is not at fault — it was forced by (2,1)=1. So (2,1) must be wrong.',
      '**The visual undo.** You SEE (2,1) go from 1 to blank. Then 3 appears. The undo is on line 8: board[row][col] = 0.',
      '**After the retry.** (2,1)=3 → (2,2)=1 (1 is not in col 2). Everything resolves, one cell at a time.',
      '**In a harder puzzle.** A wrong choice might cause a dead end 5-10 cells later. The undo still goes all the way back to the mistake.',
    ],
    jsConcepts: [
      'Dead end vs conflict. A conflict is a number breaking rules NOW. A dead end is no valid moves LEFT.',
      'Backtracking travels backward until it finds a cell with an untried option. Then it tries that option.',
    ],
  },

  /* ── Permutations ──────────────────────────────── */
  {
    id: 'permutations',
    category: 'backtracking',
    title: 'Generate permutations',
    topic: 'Try every ordering, undo and try again',
    description: 'Find every way to arrange [1, 2, 3]. Swap two numbers, explore all orders starting that way, then swap BACK (undo) and try a different swap.',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    debugCode: `function permute(nums, start, result) {
  if (start === nums.length) {
    result.push([...nums]);
    return;
  }
  for (let i = start; i < nums.length; i++) {
    [nums[start], nums[i]] = [nums[i], nums[start]];
    permute(nums, start + 1, result);
    [nums[start], nums[i]] = [nums[i], nums[start]];
  }
}`,
    steps: [
      { currentLine: 1, variables: { start: 0, nums: '[1,2,3]', i: '~' }, description: 'Start with [1, 2, 3]. We need every possible ordering. Fix position 0 first.' },
      { currentLine: 5, variables: { start: 0, nums: '[1,2,3]', i: 0 }, description: 'Swap nums[0] with nums[0] (no change). Now fix position 0 with 1, permute [2,3].' },
      { currentLine: 6, variables: { start: 1, nums: '[1,2,3]', i: 1 }, description: 'At start=1: swap nums[1] with nums[1]. Fix position 1 with 2, permute [3].' },
      { currentLine: 6, variables: { start: 2, nums: '[1,2,3]', i: 2 }, description: 'At start=2: swap nums[2] with nums[2]. We reached the end! Record [1,2,3].' },
      { currentLine: 7, variables: { start: 2, nums: '[1,2,3]', i: 2 }, description: 'UNDO: swap back. Back at start=2, no more i values. Return to start=1.' },
      { currentLine: 5, variables: { start: 1, nums: '[1,2,3]', i: 2 }, description: 'Back at start=1, try i=2: swap nums[1] with nums[2] -> [1,3,2]. Then [1,3,2] recorded.' },
      { currentLine: 7, variables: { start: 1, nums: '[1,3,2]', i: 2 }, description: 'UNDO: swap back -> [1,2,3]. All i exhausted at start=1, return to start=0.' },
      { currentLine: 5, variables: { start: 0, nums: '[1,2,3]', i: 1 }, description: 'Back at start=0, try i=1: swap 0<->1 -> [2,1,3]. Branch produces [2,1,3] and [2,3,1].' },
      { currentLine: 7, variables: { start: 0, nums: '[2,1,3]', i: 1 }, description: 'UNDO. Try i=2: swap 0<->2 -> [3,2,1]. Branch produces [3,2,1] and [3,1,2].' },
      { currentLine: 2, variables: { start: 3, nums: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', i: '~' }, description: 'All 6 permutations found! Every possible ordering generated by systematically swapping and undoing.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 2, 3], leftIndex: -1, rightIndex: -1 },
      { items: [1, 2, 3], leftIndex: 0, rightIndex: -1 },
      { items: [1, 2, 3], leftIndex: 1, rightIndex: -1 },
      { items: [1, 2, 3], leftIndex: 2, rightIndex: -1 },
      { items: [1, 2, 3], leftIndex: 1, rightIndex: -1 },
      { items: [1, 3, 2], leftIndex: 1, rightIndex: -1 },
      { items: [1, 2, 3], leftIndex: 0, rightIndex: -1 },
      { items: [2, 1, 3], leftIndex: 1, rightIndex: -1 },
      { items: [3, 2, 1], leftIndex: 0, rightIndex: -1 },
      { items: [1, 2, 3], leftIndex: -1, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Swap to make a choice, recurse, then swap BACK to undo.',
      body: [
        'Fixing one position at a time: start with index 0, try every number in that spot by swapping. Then recurse on the rest.',
        'After exploring all permutations starting with a choice, swap back to restore the original order. The UNDO is essential.',
      ],
    },
    whenToUseSummary: 'Generating all arrangements, subsets, or combinations. Pattern: choose, recurse, undo, try next.',
    breakdown: [
      'You have three number tiles: 1, 2, and 3. How many different orders? 3! = 6.',
      '**Fix one position at a time.** Start with position 0. Try putting 1 there, then figure out all orders for positions 1 and 2.',
      '**Swap to choose.** To put a number in position start, swap it with whatever is currently there.',
      '**Undo is not optional.** If you forget to swap back, later branches see a corrupted array.',
      '**Why 3! = 6.** For position 0: 3 choices. For each, position 1: 2 choices. For each, position 2: 1 choice. 3x2x1 = 6.',
    ],
    jsConcepts: [
      'Destructuring swap - [a, b] = [b, a] exchanges two values in one line.',
      '[...nums] - spread operator copies an array. Used to save a snapshot of the current permutation.',
    ],
  },

]