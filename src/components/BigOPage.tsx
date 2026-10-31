import { useEffect, useState } from 'react'
import { type ScenarioId } from '../algorithm-scenarios'
import { CodePanel } from './CodePanel'
import { ScenarioSection } from './ScenarioSection'

/* ── Big O Page ───────────────────────────────────── */

export function BigOPage() {
  const [showBackTop, setShowBackTop] = useState(false)
  const bigOIds: ScenarioId[] = ['big-o-1', 'big-o-n', 'big-o-logn', 'big-o-n2']

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    function onScroll() { setShowBackTop(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="algorithm-head">
        <span className="eyebrow">Foundation</span>
        <h1>Big O Notation</h1>
        <p>Big O helps us describe <strong>how much more work</strong> a program has to do when the input gets bigger. If you have 10 toys and your program takes 10 steps, what happens with 100 toys? Still 10 steps? 100 steps? 10,000? Big O answers that question.</p>
        <p>It&rsquo;s <strong>not about seconds</strong>. It&rsquo;s about how the amount of work <strong>grows</strong> as the input grows.</p>
      </header>

      {/* What Big O does NOT tell you */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What Big O does <em>not</em> tell you</h2>
        <p className="big-o-chart-sub">Big O has limits. It does not tell you:</p>
        <div className="big-o-dont-list">
          <div className="big-o-dont-item">
            <span className="big-o-dont-icon">⏱</span>
            <div><strong>Exact seconds.</strong> Two O(n) algorithms may run at different speeds — one might be 10× faster because of how it&rsquo;s written. Big O only tells you how they both <em>grow</em> with more input.</div>
          </div>
          <div className="big-o-dont-item">
            <span className="big-o-dont-icon">📏</span>
            <div><strong>Exact operation count.</strong> O(n) might mean 2n steps or 100n steps. Big O drops the constant because it&rsquo;s about the <em>shape</em> of growth, not the precise number.</div>
          </div>
          <div className="big-o-dont-item">
            <span className="big-o-dont-icon">🐢</span>
            <div><strong>Which is faster for small inputs.</strong> An O(n²) algorithm can beat an O(n) algorithm when `n` is tiny — because constant factors matter at small scales. Big O shines when `n` gets large.</div>
          </div>
        </div>
        <p className="big-o-chart-note">Big O is about one thing: <strong>how the workload grows as the input becomes very large.</strong></p>
      </section>

      {/* Meet n */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Meet <code>n</code></h2>
        <p className="big-o-chart-sub">In Big O, we use <strong>n</strong> to represent the size of our input.</p>
        <pre className="big-o-inline-code"><CodePanel code={`const small  = [7, 2, 9];       // n = 3\nconst medium = [7, 2, 9, 4, 1, 6];  // n = 6\nconst large  = [7, 2, 9, 4, 1, 6, 3, 8];  // n = 8`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">Whenever you see O(n), think &ldquo;proportional to the input size.&rdquo; Whenever you see O(1), think &ldquo;doesn&rsquo;t depend on input size at all.&rdquo;</p>
      </section>

      {/* Growth curve comparison chart */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Growth rate comparison</h2>
        <p className="big-o-chart-sub">X-axis = input size (n) · Y-axis = number of operations (log scale)</p>
        <BigOGrowthChart />
        <p className="big-o-chart-note">
          O(1) stays flat — input size doesn&rsquo;t matter. O(log n) barely budges even for huge inputs. O(n) grows steadily. O(n log n) grows faster. O(n²) explodes.
        </p>
      </section>

      {/* Time vs Space */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Time vs Space complexity</h2>
        <p className="big-o-chart-sub">Big O can describe <strong>time</strong> (how much work) AND <strong>space</strong> (how much <strong>extra</strong> memory — beyond the input itself).</p>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>O(n) time, O(1) space</h4>
            <pre className="big-o-inline-code"><CodePanel code={`function sum(arr) {\n  let total = 0;         // one variable\n  for (const n of arr) { // loops n times\n    total += n;          // constant work\n  }\n  return total;\n}`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">We process every element (O(n) time) but only create <code>total</code> — one variable, no matter how big the input. That&rsquo;s O(1) space.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>O(n) time, O(n) space</h4>
            <pre className="big-o-inline-code"><CodePanel code={`function double(arr) {\n  const result = [];     // grows with input\n  for (const n of arr) {\n    result.push(n * 2);  // fills result\n  }\n  return result;\n}`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Now <code>result</code> grows with the input — one new slot per element. That&rsquo;s O(n) space.</p>
          </div>
        </div>
      </section>

      {/* Big O Rules */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Big O rules (two things to remember)</h2>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>1. Drop the constants</h3>
        <p className="big-o-chart-sub">Big O cares about the <strong>shape</strong> of growth, not exact numbers. O(2n), O(5n), O(100n) — they all grow linearly. So we simplify to just O(n).</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Two loops — but they run one after the other, not inside each other.\nfor (const item of arr) { console.log(item); }  // n steps\nfor (const item of arr) { console.log(item); }  // n steps\n// Total: n + n = 2n → O(n)`} showLineNumbers={false} /></pre>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '1.5rem 0 0.5rem' }}>2. Keep only the fastest-growing part</h3>
        <p className="big-o-chart-sub">When different kinds of work happen together, the fastest-growing term dominates. O(n + n²) → O(n²). As n gets large, n² makes n irrelevant.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// A loop followed by nested loops:\nfor (const item of arr) { }        // O(n)\nfor (const a of arr) {            // O(n²)\n  for (const b of arr) { }\n}\n// Total: O(n + n²) → O(n²)`} showLineNumbers={false} /></pre>
      </section>

      {/* Core scenarios */}
      {bigOIds.map((id) => (
        <ScenarioSection key={id} scenarioId={id} />
      ))}

      {/* Best, Average, Worst Case */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Best, Average, and Worst case</h2>
        <p className="big-o-chart-sub">When people say &ldquo;Big O&rdquo; without qualification, they usually mean <strong>worst case</strong>.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Search for a number in an unsorted array\nfunction find(arr, target) {\n  for (const item of arr) {\n    if (item === target) return true;\n  }\n  return false;\n}\n\n// [7, 2, 9, 4, 1]\n//  ↑ Best case: target is first → O(1)\n//        ↑ Average: somewhere in middle → O(n)\n//              ↑ Worst: last or not found → O(n)`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">Since worst case is the most important guarantee, &ldquo;this is O(n)&rdquo; means &ldquo;in the worst case, work grows proportionally to n.&rdquo;</p>
      </section>

      {/* Beyond the Basics */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Beyond the basics</h2>
        <p className="big-o-chart-sub">The four complexity classes above cover most code you&rsquo;ll write. Here are three more you&rsquo;ll see in algorithm discussions:</p>
        <table className="big-o-cheatsheet">
          <thead>
            <tr><th>Notation</th><th>Name</th><th>Example</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>O(n log n)</code></td>
              <td>Linearithmic</td>
              <td>Merge sort, quicksort — split (log n) × process all (n)</td>
            </tr>
            <tr>
              <td><code>O(2ⁿ)</code></td>
              <td>Exponential</td>
              <td>Recursive Fibonacci, some backtracking — work doubles with each new item</td>
            </tr>
            <tr>
              <td><code>O(n!)</code></td>
              <td>Factorial</td>
              <td>Trying every possible ordering — explodes catastrophically</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Cheat Sheet */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">How to recognize Big O</h2>
        <p className="big-o-chart-sub">When looking at code, ask yourself these questions:</p>
        <ol className="big-o-checklist">
          <li><strong>Is the work fixed?</strong> No loops, just direct access → <code>O(1)</code></li>
          <li><strong>Do I visit every item once?</strong> Single loop → <code>O(n)</code></li>
          <li><strong>Do I repeatedly cut the problem in half?</strong> Binary search style → <code>O(log n)</code></li>
          <li><strong>Does work happen inside another loop?</strong> Nested loops → often <code>O(n²)</code></li>
          <li><strong>Am I sorting the data?</strong> Efficient sort → often <code>O(n log n)</code></li>
        </ol>
        <p className="big-o-chart-sub" style={{ marginTop: 'var(--space-lg)' }}>These are clues, not strict rules. For example, two loops one after another are still O(n). Only <strong>nested</strong> loops multiply. Always read the code, don&rsquo;t just count loops.</p>
        <p className="big-o-chart-sub" style={{ marginTop: 'var(--space-md)' }}>Quick reference:</p>
        <table className="big-o-cheatsheet">
          <thead>
            <tr><th>Pattern</th><th>Big O</th><th>Look for</th></tr>
          </thead>
          <tbody>
            <tr><td>Fixed work</td><td><code>O(1)</code></td><td>No loops, direct access, hash table lookup</td></tr>
            <tr><td>One pass</td><td><code>O(n)</code></td><td>Single loop through array</td></tr>
            <tr><td>Cutting in half</td><td><code>O(log n)</code></td><td>Binary search, divide and conquer</td></tr>
            <tr><td>Nested loops</td><td><code>O(n²)</code></td><td>Loop inside loop over same data</td></tr>
            <tr><td>Sorting</td><td><code>O(n log n)</code></td><td>Merge sort, quicksort, any comparison sort</td></tr>
          </tbody>
        </table>
      </section>

      {/* Recap */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Big O in one picture</h2>
        <table className="big-o-cheatsheet">
          <thead>
            <tr><th>Notation</th><th>Mental model</th><th>Example</th></tr>
          </thead>
          <tbody>
            <tr><td><code>O(1)</code></td><td>Fixed work — doesn&rsquo;t depend on input size</td><td><code>arr[3]</code></td></tr>
            <tr><td><code>O(log n)</code></td><td>Keep cutting the problem in half</td><td>Binary search</td></tr>
            <tr><td><code>O(n)</code></td><td>Visit every item once</td><td>One loop</td></tr>
            <tr><td><code>O(n log n)</code></td><td>Divide-and-conquer, then process all</td><td>Merge sort</td></tr>
            <tr><td><code>O(n²)</code></td><td>Compare many pairs — work explodes</td><td>Nested loops</td></tr>
          </tbody>
        </table>
        <p className="big-o-chart-note"><strong>Remember:</strong> Big O describes how the amount of work grows as the input gets bigger. It&rsquo;s about the <strong>shape</strong> of growth, not exact speed.</p>
      </section>

      {/* Quiz */}
      <BigOQuizSection />

      {showBackTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      )}
    </>
  )
}

/* ── Big O Growth Chart (SVG) ── */

function BigOGrowthChart() {
  const W = 600
  const H = 320
  const pad = { top: 20, right: 20, bottom: 30, left: 45 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom
  const maxN = 50

  function x(n: number) { return pad.left + (n / maxN) * plotW }

  const logMax = Math.log10(maxN * maxN)
  function y(ops: number) {
    const logVal = ops <= 0 ? 0 : Math.log10(ops)
    return pad.top + plotH - (logVal / logMax) * plotH
  }

  const steps = 100

  const o1Points = Array.from({ length: steps }, (_, i) => {
    const n = (i / (steps - 1)) * maxN
    return `${x(n)},${y(1)}`
  }).join(' ')

  const olognPoints = Array.from({ length: steps }, (_, i) => {
    const n = Math.max(1, (i / (steps - 1)) * maxN)
    return `${x(n)},${y(Math.log2(n) + 1)}`
  }).join(' ')

  const onPoints = Array.from({ length: steps }, (_, i) => {
    const n = (i / (steps - 1)) * maxN
    return `${x(n)},${y(n)}`
  }).join(' ')

  const onlognPoints = Array.from({ length: steps }, (_, i) => {
    const n = Math.max(1, (i / (steps - 1)) * maxN)
    return `${x(n)},${y(n * Math.log2(n))}`
  }).join(' ')

  const on2Points = Array.from({ length: steps }, (_, i) => {
    const n = (i / (steps - 1)) * maxN
    return `${x(n)},${y(n * n)}`
  }).join(' ')

  const yTicks = [1, 10, 100, 1000, 2500]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="big-o-chart" role="img" aria-label="Big O growth curves comparison chart">
      {yTicks.map((val) => (
        <g key={`gy-${val}`}>
          <line x1={pad.left} y1={y(val)} x2={pad.left + plotW} y2={y(val)} stroke="var(--border-subtle)" strokeWidth="0.5" />
          <text x={pad.left - 6} y={y(val) + 4} textAnchor="end" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">{val}</text>
        </g>
      ))}
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="var(--text-muted)" strokeWidth="1" />
      <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="var(--text-muted)" strokeWidth="1" />
      <text x={pad.left + plotW / 2} y={H - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="10">n grows →</text>
      <text x={12} y={pad.top + plotH / 2} textAnchor="middle" fill="var(--text-muted)" fontSize="10" transform={`rotate(-90, 12, ${pad.top + plotH / 2})`}>operations (log scale)</text>
      <polyline points={o1Points} fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="6,3" />
      <polyline points={olognPoints} fill="none" stroke="#5bb8f0" strokeWidth="3" />
      <polyline points={onPoints} fill="none" stroke="var(--kyu-6-text)" strokeWidth="2.5" />
      <polyline points={onlognPoints} fill="none" stroke="#d4a853" strokeWidth="2" strokeDasharray="5,3" />
      <polyline points={on2Points} fill="none" stroke="#f28b82" strokeWidth="3" />
      <rect x={pad.left + plotW - 155} y={pad.top + 2} width={150} height={80} rx={6} fill="var(--bg-inset)" opacity="0.85" />
      <line x1={pad.left + plotW - 145} y1={pad.top + 16} x2={pad.left + plotW - 125} y2={pad.top + 16} stroke="#f28b82" strokeWidth="3" />
      <text x={pad.left + plotW - 120} y={pad.top + 20} fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">O(n²)</text>
      <line x1={pad.left + plotW - 145} y1={pad.top + 34} x2={pad.left + plotW - 125} y2={pad.top + 34} stroke="#d4a853" strokeWidth="2" strokeDasharray="5,3" />
      <text x={pad.left + plotW - 120} y={pad.top + 38} fill="var(--text-secondary)" fontSize="10" fontFamily="var(--font-mono)">O(n log n)</text>
      <line x1={pad.left + plotW - 145} y1={pad.top + 52} x2={pad.left + plotW - 125} y2={pad.top + 52} stroke="var(--kyu-6-text)" strokeWidth="2.5" />
      <text x={pad.left + plotW - 120} y={pad.top + 56} fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">O(n)</text>
      <line x1={pad.left + plotW - 145} y1={pad.top + 70} x2={pad.left + plotW - 125} y2={pad.top + 70} stroke="#5bb8f0" strokeWidth="3" />
      <text x={pad.left + plotW - 120} y={pad.top + 74} fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)">O(log n)</text>
    </svg>
  )
}

/* ── Big O Quiz ────────────────────────────────────── */

function BigOQuizSection() {
  type QuizItem = { question: string; code?: string; options: string[]; answer: number; explanation: string }
  const quiz: QuizItem[] = [
    {
      question: 'What is the time complexity of this function?',
      code: `function findMax(arr) {\n  let max = arr[0];\n  for (const n of arr) {\n    if (n > max) max = n;\n  }\n  return max;\n}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2,
      explanation: 'One loop through the entire array — visits each element once. Time: O(n). Space is O(1) since only `max` is created.',
    },
    {
      question: 'What is the space complexity of this function?',
      code: `function find(arr, target) {\n  for (const item of arr) {\n    if (item === target) return true;\n  }\n  return false;\n}`,
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
      answer: 0,
      explanation: 'No extra data structures are created. Only the loop variable exists — O(1) space, even though time is O(n).',
    },
    {
      question: 'Binary search on a sorted array has which time complexity?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 1,
      explanation: 'Each comparison eliminates half the remaining items. 1 billion items → ~30 steps. That is O(log n).',
    },
    {
      question: 'Is this O(n²) because there are two loops?',
      code: `for (const item of arr) {\n  console.log(item);\n}\n\nfor (const item of arr) {\n  console.log(item);\n}`,
      options: ['Yes — two loops always means O(n²)', 'No — the loops run one after another, so it\'s still O(n)', 'No — it\'s O(log n) because of the console.log', 'Yes — any function with for-loops is O(n²)'],
      answer: 1,
      explanation: 'The loops run sequentially (one after another), not nested. Total: n + n = 2n → O(n). Only loops inside other loops multiply.',
    },
  ]

  return (
    <section className="big-o-chart-section">
      <h2 className="big-o-chart-title">Quick check</h2>
      {quiz.map((item, i) => (
        <BigOQuizCard key={i} item={item} />
      ))}
    </section>
  )
}

function BigOQuizCard({ item }: { item: { question: string; code?: string; options: string[]; answer: number; explanation: string } }) {
  const [selected, setSelected] = useState<number | null>(null)
  const correct = selected === item.answer

  return (
    <div className="big-o-quiz-card">
      <p className="big-o-quiz-question">{item.question}</p>
      {item.code && <pre className="big-o-inline-code"><CodePanel code={item.code} showLineNumbers={false} /></pre>}
      <div className="big-o-quiz-options">
        {item.options.map((opt, i) => {
          let cls = ''
          if (selected !== null) {
            if (i === item.answer) cls = 'is-correct'
            else if (i === selected && !correct) cls = 'is-wrong'
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
            >
              <span className="big-o-quiz-letter">{(i + 10).toString(36).toUpperCase()}</span>
              <code>{opt}</code>
              {selected !== null && i === item.answer && <span className="big-o-quiz-check">✓</span>}
              {selected !== null && i === selected && !correct && <span className="big-o-quiz-cross">✗</span>}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <p className={`big-o-quiz-result ${correct ? 'is-correct' : 'is-wrong'}`}>
          {correct ? 'Correct! ' : 'Not quite. '}{item.explanation}
        </p>
      )}
    </div>
  )
}
