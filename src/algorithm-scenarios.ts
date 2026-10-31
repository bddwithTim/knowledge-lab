export type ScenarioId = 'pair-sum' | 'palindrome' | 'remove-duplicates' | 'container-water' | 'merge-sorted' | 'sliding-window' | 'big-o-1' | 'big-o-n' | 'big-o-n2' | 'big-o-logn'

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
  category: 'big-o' | 'two-pointer'
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
}

/* Every step includes ALL variables for that scenario — unset ones use '~' */

export const scenarios: Scenario[] = [
  /* ── Pair Sum ───────────────────────────────────── */
  {
    id: 'pair-sum',
    category: 'two-pointer',
    title: 'Pair with target sum',
    topic: 'Opposite ends → middle',
    description: 'Find two values that add up to a target in a sorted array.',
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
      { currentLine: 2, variables: { left: 0, right: '~', sum: '~' }, description: 'Initialize left pointer at index 0' },
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
  },

  /* ── Remove Duplicates ───────────────────────────── */
  {
    id: 'remove-duplicates',
    category: 'two-pointer',
    title: 'Remove duplicates in-place',
    topic: 'Same direction · fast/slow',
    description: 'Use a slow pointer to track the write position while a fast pointer scans for unique values.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    debugCode: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
    steps: [
      { currentLine: 3, variables: { slow: 0, fast: '~', fastVal: '~', slowVal: '~' }, description: 'Initialize slow pointer at index 0 (first unique value)' },
      { currentLine: 5, variables: { slow: 0, fast: 1, fastVal: '~', slowVal: 1 }, description: 'Start for loop — fast pointer begins at index 1' },
      { currentLine: 6, variables: { slow: 0, fast: 1, fastVal: 1, slowVal: 1 }, description: 'nums[1] (1) === nums[0] (1)? Duplicate — skip.' },
      { currentLine: 5, variables: { slow: 0, fast: 2, fastVal: 1, slowVal: 1 }, description: 'Next iteration — fast advances to index 2' },
      { currentLine: 6, variables: { slow: 0, fast: 2, fastVal: 2, slowVal: 1 }, description: 'nums[2] (2) !== nums[0] (1)? New value found!' },
      { currentLine: 7, variables: { slow: 1, fast: 2, fastVal: 2, slowVal: 1 }, description: 'Advance slow to index 1' },
      { currentLine: 8, variables: { slow: 1, fast: 2, fastVal: 2, slowVal: 1 }, description: 'Write nums[1] = 2. Array: [1, 2, …]' },
      { currentLine: 5, variables: { slow: 1, fast: 3, fastVal: 2, slowVal: 2 }, description: 'Next iteration — fast advances to index 3' },
      { currentLine: 6, variables: { slow: 1, fast: 3, fastVal: 2, slowVal: 2 }, description: 'nums[3] (2) === nums[1] (2)? Duplicate — skip.' },
      { currentLine: 5, variables: { slow: 1, fast: 4, fastVal: 2, slowVal: 2 }, description: 'Next iteration — fast advances to index 4' },
      { currentLine: 6, variables: { slow: 1, fast: 4, fastVal: 3, slowVal: 2 }, description: 'nums[4] (3) !== nums[1] (2)? New value found!' },
      { currentLine: 7, variables: { slow: 2, fast: 4, fastVal: 3, slowVal: 2 }, description: 'Advance slow to index 2' },
      { currentLine: 8, variables: { slow: 2, fast: 4, fastVal: 3, slowVal: 2 }, description: 'Write nums[2] = 3. Array: [1, 2, 3, …]' },
      { currentLine: 5, variables: { slow: 2, fast: 5, fastVal: 3, slowVal: 3 }, description: 'Next iteration — fast advances to index 5' },
      { currentLine: 6, variables: { slow: 2, fast: 5, fastVal: 4, slowVal: 3 }, description: 'nums[5] (4) !== nums[2] (3)? New value found!' },
      { currentLine: 7, variables: { slow: 3, fast: 5, fastVal: 4, slowVal: 3 }, description: 'Advance slow to index 3' },
      { currentLine: 8, variables: { slow: 3, fast: 5, fastVal: 4, slowVal: 3 }, description: 'Write nums[3] = 4. Array: [1, 2, 3, 4, …]' },
      { currentLine: 5, variables: { slow: 3, fast: 6, fastVal: 4, slowVal: 4 }, description: 'Next iteration — fast advances to index 6' },
      { currentLine: 6, variables: { slow: 3, fast: 6, fastVal: 4, slowVal: 4 }, description: 'nums[6] (4) === nums[3] (4)? Duplicate — skip.' },
      { currentLine: 5, variables: { slow: 3, fast: 7, fastVal: 4, slowVal: 4 }, description: 'Loop ends — fast (7) >= length (7). Exit for loop.' },
      { currentLine: 11, variables: { slow: 3, fast: 7, fastVal: 4, slowVal: 4 }, description: 'Return slow + 1 = 4. There are 4 unique values.' },
    ],
    visualType: 'array-cells',
    visualData: [
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: -1, slowIndex: 0 },
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 1, slowIndex: 0 },
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 1, slowIndex: 0 },
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 2, slowIndex: 0 },
      { items: [1, 1, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 2, slowIndex: 0 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 2, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 2, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 3, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 3, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 4, slowIndex: 1 },
      { items: [1, 2, 2, 2, 3, 4, 4], leftIndex: -1, rightIndex: 4, slowIndex: 1 },
      { items: [1, 2, 3, 2, 3, 4, 4], leftIndex: -1, rightIndex: 4, slowIndex: 2 },
      { items: [1, 2, 3, 2, 3, 4, 4], leftIndex: -1, rightIndex: 4, slowIndex: 2 },
      { items: [1, 2, 3, 2, 3, 4, 4], leftIndex: -1, rightIndex: 5, slowIndex: 2 },
      { items: [1, 2, 3, 2, 3, 4, 4], leftIndex: -1, rightIndex: 5, slowIndex: 2 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: 5, slowIndex: 3 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: 5, slowIndex: 3 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: 6, slowIndex: 3 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: 6, slowIndex: 3 },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: 6, slowIndex: 3, found: true },
      { items: [1, 2, 3, 4, 3, 4, 4], leftIndex: -1, rightIndex: 6, slowIndex: 3, found: true },
    ],
    whyItWorks: {
      title: 'One pointer writes, the other reads.',
      body: [
        'The slow pointer marks the boundary between unique values (left) and garbage (right).',
        'The fast pointer scans ahead. Whenever it finds a value different from what slow points to, it increments slow and copies the new value there.',
        'The array before slow is always deduplicated. Values after slow are irrelevant and get overwritten.',
      ],
    },
    whenToUseSummary: 'Use a slow pointer to track the write position while a fast pointer scans ahead — overwrites duplicates without extra space.',
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
      { currentLine: 2, variables: { left: 0, right: '~', maxArea: '~', area: '~' }, description: 'Initialize left pointer at index 0' },
      { currentLine: 3, variables: { left: 0, right: 8, maxArea: 0, area: '~' }, description: 'Initialize right pointer at last index (8)' },
      { currentLine: 6, variables: { left: 0, right: 8, maxArea: 0, area: '~' }, description: 'Enter while loop — left (0) < right (8) is true' },
      { currentLine: 7, variables: { left: 0, right: 8, maxArea: 0, area: 8 }, description: 'h = min(1, 7) = 1, w = 8 − 0 = 8, area = 1 × 8 = 8' },
      { currentLine: 9, variables: { left: 0, right: 8, maxArea: 8, area: 8 }, description: 'maxArea updated to 8. height[0]=1 < height[8]=7 → move left right' },
      { currentLine: 6, variables: { left: 1, right: 8, maxArea: 8, area: 8 }, description: 'Loop — left (1) < right (8) is true' },
      { currentLine: 7, variables: { left: 1, right: 8, maxArea: 8, area: 49 }, description: 'h = min(8, 7) = 7, w = 8 − 1 = 7, area = 7 × 7 = 49' },
      { currentLine: 9, variables: { left: 1, right: 8, maxArea: 49, area: 49 }, description: 'maxArea updated to 49. height[1]=8 > height[8]=7 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 7, maxArea: 49, area: 49 }, description: 'Loop — left (1) < right (7) is true' },
      { currentLine: 7, variables: { left: 1, right: 7, maxArea: 49, area: 18 }, description: 'h = min(8, 3) = 3, w = 7 − 1 = 6, area = 3 × 6 = 18' },
      { currentLine: 9, variables: { left: 1, right: 7, maxArea: 49, area: 18 }, description: '18 < 49, maxArea stays 49. height[1]=8 > height[7]=3 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 6, maxArea: 49, area: 18 }, description: 'Loop — left (1) < right (6) is true' },
      { currentLine: 7, variables: { left: 1, right: 6, maxArea: 49, area: 40 }, description: 'h = min(8, 8) = 8, w = 6 − 1 = 5, area = 8 × 5 = 40' },
      { currentLine: 9, variables: { left: 1, right: 6, maxArea: 49, area: 40 }, description: '40 < 49, maxArea stays 49. 8 = 8 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 5, maxArea: 49, area: 40 }, description: 'Loop — left (1) < right (5) is true' },
      { currentLine: 7, variables: { left: 1, right: 5, maxArea: 49, area: 16 }, description: 'h = min(8, 4) = 4, w = 5 − 1 = 4, area = 4 × 4 = 16' },
      { currentLine: 9, variables: { left: 1, right: 5, maxArea: 49, area: 16 }, description: '16 < 49, maxArea stays 49. 8 > 4 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 2, maxArea: 49, area: 16 }, description: 'Loop — left (1) < right (2) is true' },
      { currentLine: 7, variables: { left: 1, right: 2, maxArea: 49, area: 6 }, description: 'h = min(8, 6) = 6, w = 2 − 1 = 1, area = 6 × 1 = 6' },
      { currentLine: 9, variables: { left: 1, right: 2, maxArea: 49, area: 6 }, description: '6 < 49, maxArea stays 49. 8 > 6 → move right left' },
      { currentLine: 6, variables: { left: 1, right: 1, maxArea: 49, area: 6 }, description: 'Loop — left (1) < right (1) is false. Exit loop.' },
      { currentLine: 12, variables: { left: 1, right: 1, maxArea: 49, area: 6 }, description: 'Return maxArea = 49. Best pair: bars at index 1 (height 8) and index 8 (height 7). Area = min(8,7) × (8−1) = 7 × 7 = 49.' },
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
  },

  /* ── Merge Two Sorted Arrays ─────────────────────── */
  {
    id: 'merge-sorted',
    category: 'two-pointer',
    title: 'Merge two sorted arrays',
    topic: 'Two arrays → one sorted',
    description: 'Given two sorted arrays, merge them into one sorted result. Use an index for each input and pick the smaller element at each step.',
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
    whenToUseSummary: 'Two sorted inputs, one sorted result. Compare heads, take the smaller, advance. O(n+m) with three pointers.',
  },

  /* ── Sliding Window ──────────────────────────────── */
  {
    id: 'sliding-window',
    category: 'two-pointer',
    title: 'Sliding window',
    topic: 'Fixed-size window → max sum',
    description: 'You have a cardboard frame that fits exactly k=3 numbers at a time. Slide it across the number strip one step at a time. At each stop, add up the numbers inside. Which position gives the biggest total?',
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
    description: 'No matter how big the array gets, accessing arr[3] takes the same amount of time. One operation, always.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    debugCode: `// O(1): Constant time
// Array access is instant —
// no loops, no searching.

const arr = [7, 2, 9, 4, 1, 6, 3, 8];
const x = arr[3]; // one operation`,
    steps: [
      { currentLine: 5, variables: { result: '~' }, description: 'We have an array of 8 numbers. No matter the size, accessing any index is 1 operation.' },
      { currentLine: 6, variables: { result: 4 }, description: 'arr[3] directly grabs the 4th element. Done. Input size doesn\'t matter — it\'s always O(1).' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [7, 2, 9, 4, 1, 6, 3, 8], leftIndex: 3, rightIndex: -1 },
      { items: [7, 2, 9, 4, 1, 6, 3, 8], leftIndex: 3, rightIndex: -1 },
    ],
    whyItWorks: {
      title: 'One operation, no matter the input size.',
      body: [
        'Array elements are stored at contiguous memory addresses. The computer can calculate exactly where arr[3] lives, jump there, and read it — all in one step.',
        'Whether the array has 10 items or 10 million, the number of operations stays the same. That\'s O(1).',
      ],
    },
    whenToUseSummary: 'Direct access — array index lookup, hash table get/set, stack push/pop. No loops needed.',
  },

  /* ── O(n) — Linear Time ───────────────────────────── */
  {
    id: 'big-o-n',
    category: 'big-o',
    title: 'O(n) — Linear time',
    topic: 'Single loop through array',
    description: 'If the input doubles in size, the work doubles too. A single loop touching each element once grows in direct proportion to n.',
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
  },

  /* ── O(n²) — Quadratic Time ───────────────────────── */
  {
    id: 'big-o-n2',
    category: 'big-o',
    title: 'O(n²) — Quadratic time',
    topic: 'Nested loops',
    description: 'For each element, you loop through all elements again. If input doubles, work quadruples. Two nested loops = n × n operations.',
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
  },

  /* ── O(log n) — Logarithmic Time ──────────────────── */
  {
    id: 'big-o-logn',
    category: 'big-o',
    title: 'O(log n) — Logarithmic time',
    topic: 'Binary search',
    description: 'Each step cuts the search space in half. Even with a billion items, you only need ~30 steps. The algorithm gets faster relative to n as n grows.',
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
      { currentLine: 4, variables: { lo: 0, hi: 7, mid: '~', found: '~' }, description: 'Searching for 6 in sorted array [1,2,3,4,5,6,7,8]. Range: indices 0–7 (8 elements).' },
      { currentLine: 5, variables: { lo: 0, hi: 7, mid: 3, found: '~' }, description: 'mid = floor((0+7)/2) = 3. arr[3]=4 < target=6? Yes → eliminate left half. lo = 4.' },
      { currentLine: 5, variables: { lo: 4, hi: 7, mid: 5, found: '~' }, description: 'Range now 4–7 (4 elements). mid = 5. arr[5]=6 === target? YES! Found at index 5.' },
      { currentLine: 6, variables: { lo: 4, hi: 7, mid: 5, found: 5 }, description: 'Return index 5. Only 2 comparisons for 8 elements. 1 billion items → only ~30 comparisons.' },
    ],
    visualType: 'number-cells',
    visualData: [
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 0, rightIndex: 7 },
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 4, rightIndex: 7 },
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 5, rightIndex: -1, found: true },
      { items: [1, 2, 3, 4, 5, 6, 7, 8], leftIndex: 5, rightIndex: -1, found: true },
    ],
    whyItWorks: {
      title: 'Halving the search space each step.',
      body: [
        'After k steps, the search space is n / 2^k elements. We stop when this ≤ 1, so k ≈ log₂(n).',
        'That\'s why binary search on a million items takes ~20 steps, not a million.',
      ],
    },
    whenToUseSummary: 'Searching in sorted data. Each comparison eliminates half the remaining elements.',
  },
]
