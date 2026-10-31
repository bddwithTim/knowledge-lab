export type ScenarioId = 'pair-sum' | 'palindrome' | 'remove-duplicates' | 'container-water' | 'merge-sorted' | 'sliding-window' | 'smallest-subarray' | 'two-sum' | 'first-unique' | 'valid-anagram' | 'most-frequent' | 'big-o-1' | 'big-o-n' | 'big-o-n2' | 'big-o-logn'

export type ScenarioStep = {
  description: string
  variables: Record<string, unknown>
  currentLine: number
}

export type VisualStep = {
  items: (string | number)[]
  leftIndex: number
  rightIndex: number
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
}

export type Scenario = {
  id: ScenarioId
  category: 'big-o' | 'two-pointer' | 'sliding-window' | 'hash-map'
  title: string
  topic: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  debugCode: string
  steps: ScenarioStep[]
  visualType: 'number-cells' | 'char-cells' | 'array-cells' | 'bar-chart' | 'merge-arrays' | 'sliding-window'
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
      'Two pointers start at opposite ends of a sorted array. Add them up. If the sum is too big, move the right pointer left (need a smaller number). If too small, move the left pointer right (need a bigger number). Because the array is <strong>sorted</strong>, each move eliminates not just one pair, but many — and you never need to backtrack.',
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
      '<strong>Fast explores. Slow builds the result.</strong> The `read` pointer scans for values it hasn\'t seen before. The `write` pointer marks where the next unique value goes. Together they divide the array into two zones: unique values on the left, unprocessed values on the right.',
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
      'Two walls trap water between them. The water level cannot exceed the <strong>shorter wall</strong> — it would spill over. The area is height × width. Start at the widest possible container (both ends), then always move the shorter wall inward. Why? Because the shorter wall is the bottleneck.',
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
      'This is the <strong>variable-size</strong> sliding window. Unlike the fixed-size version, the window grows and shrinks dynamically. Expand until you meet the target sum, then shrink to see if a smaller window also works.',
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
    description: 'Find two numbers in `[2, 7, 11, 15]` that add up to `9`. Without a hash map, you\'d check every pair (O(n²)). With one, look up the complement in O(1) — total O(n).',
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
  for (const ch of str) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }
  for (let i = 0; i < str.length; i++) {
    if (count.get(str[i]) === 1) return i;
  }
  return -1;
}`,
    steps: [
      { currentLine: 2, variables: { count: '{}', i: '~', ch: '~' }, description: 'Empty map. Scan the string once to count every character.' },
      { currentLine: 4, variables: { count: '{p:3,i:1,n:1,e:2,a:1,l:1}', i: '~', ch: '~' }, description: 'Counts: p=3, i=1, n=1, e=2, a=1, l=1. "i" is the first character with count 1 that appears earliest.' },
      { currentLine: 7, variables: { count: '{p:3,...}', i: 1, ch: '~' }, description: 'Second pass: str[0] = "p". count[p]=3 → skip. str[1] = "i". count[i]=1 → first unique! Return 1.' },
    ],
    visualType: 'char-cells',
    visualData: [
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: -1, rightIndex: -1 },
      { items: ['p','i','n','e','a','p','p','l','e'], leftIndex: -1, rightIndex: -1 },
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
]
