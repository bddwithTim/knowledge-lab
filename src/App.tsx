import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { challenges, lessons, type Challenge, type Kyu, type Lesson, type Topic } from './content'
import { tsLessons, type TSLesson, type TSExercise } from './ts-content'
import { Editor } from './editor'
import { StepDebugger } from './debugger'
import { scenarios, type ScenarioId } from './algorithm-scenarios'
import { BookOpen, CaretLeft, Code, Flask, Graph, List } from '@phosphor-icons/react'
import { readStorage, writeStorage, display, runTS, executeExample, modLabel, runAssertions } from './utils'
import { Kbd } from './components/Kbd'
import { CodePanel } from './components/CodePanel'

type View = 'learn' | 'practice' | 'lesson' | 'challenge' | 'big-o' | 'patterns' | 'pattern-detail' | 'sliding-window' | 'hash-map' | 'ts-learn' | 'ts-lesson'
type NavEntry = { v: View; lo?: number; to?: number; cid?: string }
type Result = { label: string; passed: boolean; actual?: unknown; error?: string }
type OutputFlash = 'idle' | 'success' | 'error'

const topics: Array<Topic | 'All topics'> = ['All topics', 'Fundamentals', 'Strings', 'Arrays', 'Objects']
const levels: Array<Kyu | 'All levels'> = ['All levels', '8 kyu', '7 kyu', '6 kyu', '5 kyu']
const SIDEBAR_KEY = 'knowledge-lab-sidebar-collapsed'

function CollapsibleSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section>
      <button
        className="lesson-section-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h2>{title}</h2>
        <span className={`lesson-section-arrow${open ? ' open' : ''}`}>&#9654;</span>
      </button>
      <div className={`lesson-section-body${open ? '' : ' collapsed'}`}>
        <div style={{ paddingTop: 'var(--space-sm)' }}>
          {children}
        </div>
      </div>
    </section>
  )
}

export function App() {
  const [view, setView] = useState<View>('learn')
  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0])
  const [activeTSLesson, setActiveTSLesson] = useState<TSLesson>(tsLessons[0])
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(challenges[0])
  const [code, setCode] = useState(lessons[0].starterCode)
  const [output, setOutput] = useState<string[]>([])
  const [error, setError] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [showHint, setShowHint] = useState(false)
  const [topic, setTopic] = useState<Topic | 'All topics'>('All topics')
  const [level, setLevel] = useState<Kyu | 'All levels'>('All levels')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStorage(SIDEBAR_KEY) === 'true')

  const runLessonRef = useRef<() => void>(() => {})
  const runChallengeRef = useRef<() => void>(() => {})
  const nextLessonRef = useRef<() => void>(() => {})
  const prevLessonRef = useRef<() => void>(() => {})
  const nextTSLessonRef = useRef<() => void>(() => {})
  const prevTSLessonRef = useRef<() => void>(() => {})

  const availableChallenges = useMemo(() => challenges.filter((item) => (topic === 'All topics' || item.topic === topic) && (level === 'All levels' || item.kyu === level)), [topic, level])

  const navigatingRef = useRef(false)

  function navigateTo(view: View, lesson?: Lesson, tsLesson?: TSLesson, challenge?: Challenge) {
    setView(view)
    if (lesson) setActiveLesson(lesson)
    if (tsLesson) setActiveTSLesson(tsLesson)
    if (challenge) setActiveChallenge(challenge)

    if (lesson) { setCode(lesson.starterCode); setOutput([]); setError('') }
    if (challenge) { setCode(challenge.starterCode); setResults([]); setShowHint(false) }
    if (tsLesson) { setCode(tsLesson.starterCode); setOutput([]); setError('') }

    if (!navigatingRef.current) {
      const entry: NavEntry = { v: view }
      if (lesson) entry.lo = lesson.order
      if (tsLesson) entry.to = tsLesson.order
      if (challenge) entry.cid = challenge.id
      history.pushState(entry, '', '')
    }
  }

  function goNextChallenge() {
    const idx = availableChallenges.indexOf(activeChallenge)
    if (idx >= 0 && idx < availableChallenges.length - 1) {
      navigateTo('challenge', undefined, undefined, availableChallenges[idx + 1])
    }
  }

  function goPrevChallenge() {
    const idx = availableChallenges.indexOf(activeChallenge)
    if (idx > 0) {
      navigateTo('challenge', undefined, undefined, availableChallenges[idx - 1])
    }
  }

  const runLessonCode = useCallback(() => {
    const src = view === 'ts-lesson' ? code : code  // TS code is handled by executeExample with strip fallback in runLessonCode
    const next = view === 'ts-lesson' ? runTS(code) : executeExample(code)
    setOutput(next.output)
    setError(next.error)
  }, [code, view])

  const testSolution = useCallback(() => {
    setResults(runAssertions(code, activeChallenge))
  }, [code, activeChallenge])

  const goNextLesson = useCallback(() => {
    const next = lessons.find((item) => item.order === activeLesson.order + 1)
    if (next) navigateTo('lesson', next)
  }, [activeLesson.order])

  const goPrevLesson = useCallback(() => {
    const previous = lessons.find((item) => item.order === activeLesson.order - 1)
    if (previous) navigateTo('lesson', previous)
  }, [activeLesson.order])

  const goNextTSLesson = useCallback(() => {
    const next = tsLessons.find((item) => item.order === activeTSLesson.order + 1)
    if (next) navigateTo('ts-lesson', undefined, next)
  }, [activeTSLesson.order])

  const goPrevTSLesson = useCallback(() => {
    const previous = tsLessons.find((item) => item.order === activeTSLesson.order - 1)
    if (previous) navigateTo('ts-lesson', undefined, previous)
  }, [activeTSLesson.order])

  runLessonRef.current = runLessonCode
  runChallengeRef.current = testSolution
  nextLessonRef.current = goNextLesson
  prevLessonRef.current = goPrevLesson
  nextTSLessonRef.current = goNextTSLesson
  prevTSLessonRef.current = goPrevTSLesson

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current
      writeStorage(SIDEBAR_KEY, String(next))
      return next
    })
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLSelectElement) return
      const mod = event.metaKey || event.ctrlKey
      if (!mod) return

      if (event.key.toLowerCase() === 'b') {
        event.preventDefault()
        toggleSidebar()
        return
      }

      if (event.key === 'Enter') {
        if (view === 'lesson' || view === 'ts-lesson') {
          event.preventDefault()
          runLessonRef.current()
        }
        if (view === 'challenge') {
          event.preventDefault()
          runChallengeRef.current()
        }
      }

      if (event.shiftKey && event.key === 'ArrowRight' && (view === 'lesson')) {
        event.preventDefault()
        nextLessonRef.current()
      }
      if (event.shiftKey && event.key === 'ArrowRight' && (view === 'ts-lesson')) {
        event.preventDefault()
        nextTSLessonRef.current()
      }

      if (event.shiftKey && event.key === 'ArrowLeft' && (view === 'lesson')) {
        event.preventDefault()
        prevLessonRef.current()
      }
      if (event.shiftKey && event.key === 'ArrowLeft' && (view === 'ts-lesson')) {
        event.preventDefault()
        prevTSLessonRef.current()
      }

      if (event.key === 'e' && view !== 'learn' && view !== 'practice') {
        event.preventDefault()
        const editor = document.querySelector<HTMLElement>('.cm-editor')
        editor?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view])

  // Browser back/forward navigation
  useEffect(() => {
    function onPopState(event: PopStateEvent) {
      const entry = event.state as NavEntry | null
      if (!entry) return
      navigatingRef.current = true
      setView(entry.v)
      const lo = entry.lo; if (lo) { const l = lessons.find(x => x.order === lo); if (l) { setActiveLesson(l); setCode(l.starterCode); setOutput([]); setError('') } }
      const to = entry.to; if (to) { const l = tsLessons.find(x => x.order === to); if (l) { setActiveTSLesson(l); setCode(l.starterCode); setOutput([]); setError('') } }
      const cid = entry.cid; if (cid) { const c = challenges.find(x => x.id === cid); if (c) { setActiveChallenge(c); setCode(c.starterCode); setResults([]); setShowHint(false) } }
      navigatingRef.current = false
    }
    window.addEventListener('popstate', onPopState)
    // Restore state on refresh, or seed initial entry
    if (history.state?.v) {
      onPopState({ state: history.state } as PopStateEvent)
    } else {
      history.replaceState({ v: 'learn' } as NavEntry, '', '')
    }
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <main className={`shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <button className="brand" onClick={() => navigateTo('learn')} title="Back to lessons">
            <span><Flask size={20} weight="fill" /></span>
            {!sidebarCollapsed && 'knowledge lab'}
          </button>
          <button className={`sidebar-toggle${sidebarCollapsed ? ' menu-toggle' : ''}`} onClick={toggleSidebar} title={`${sidebarCollapsed ? 'Open menu' : 'Collapse menu'} (${modLabel} B)`} aria-label={sidebarCollapsed ? 'Open menu' : 'Collapse menu'}>
            {sidebarCollapsed ? <List size={18} /> : <CaretLeft size={18} />}
          </button>
        </div>
        {!sidebarCollapsed && (
          <>
            <p className="nav-label">Explore</p>
            <button className={`nav-link ${view === 'learn' || view === 'lesson' ? 'active' : ''}`} onClick={() => navigateTo('learn')}>
              <span><BookOpen size={16} /></span>JavaScript
            </button>
            <button className={`nav-link ${view === 'ts-learn' || view === 'ts-lesson' ? 'active' : ''}`} onClick={() => navigateTo('ts-learn')}>
              <span><BookOpen size={16} /></span>TypeScript
            </button>
            <button className={`nav-link ${view === 'practice' || view === 'challenge' ? 'active' : ''}`} onClick={() => navigateTo('practice')}>
              <span><Code size={16} /></span>Practice
            </button>
            <button className={`nav-link ${view === 'big-o' ? 'active' : ''}`} onClick={() => navigateTo('big-o')}>
              <span><Graph size={16} /></span>Big O Notation
            </button>
            <button className={`nav-link ${view === 'patterns' || view === 'pattern-detail' || view === 'sliding-window' || view === 'hash-map' ? 'active' : ''}`} onClick={() => navigateTo('patterns')}>
              <span><Graph size={16} /></span>Algorithm Patterns
            </button>
            <div className="sidebar-note">
              <span>Personal reviewer</span>
              <strong>Review any lesson or challenge whenever you need it.</strong>
            </div>
          </>
        )}
        {sidebarCollapsed && (
          <div className="sidebar-icons">
            <button className={`nav-link ${view === 'learn' || view === 'lesson' ? 'active' : ''}`} onClick={() => navigateTo('learn')} title="JavaScript">
              <span><BookOpen size={16} /></span>
            </button>
            <button className={`nav-link ${view === 'ts-learn' || view === 'ts-lesson' ? 'active' : ''}`} onClick={() => navigateTo('ts-learn')} title="TypeScript">
              <span><BookOpen size={16} weight="fill" /></span>
            </button>
            <button className={`nav-link ${view === 'practice' || view === 'challenge' ? 'active' : ''}`} onClick={() => navigateTo('practice')} title="Practice">
              <span><Code size={16} /></span>
            </button>
            <button className={`nav-link ${view === 'big-o' ? 'active' : ''}`} onClick={() => navigateTo('big-o')} title="Big O Notation">
              <span><Graph size={16} /></span>
            </button>
            <button className={`nav-link ${view === 'patterns' || view === 'pattern-detail' || view === 'sliding-window' || view === 'hash-map' ? 'active' : ''}`} onClick={() => navigateTo('patterns')} title="Algorithm Patterns">
              <span><Graph size={16} /></span>
            </button>
          </div>
        )}
      </aside>
      <section className="main-content">
        {view === 'learn' && <LearnIndex onOpen={(l) => navigateTo('lesson', l)} />}
        {view === 'practice' && (
          <PracticeIndex
            challenges={availableChallenges}
            topic={topic}
            level={level}
            onTopic={setTopic}
            onLevel={setLevel}
            onOpen={(c) => navigateTo('challenge', undefined, undefined, c)}
          />
        )}
        {view === 'big-o' && <BigOPage />}
        {view === 'patterns' && <PatternsOverview onSelectPattern={(v) => navigateTo(v)} />}
        {view === 'pattern-detail' && <PatternDetailPage onBack={() => navigateTo('patterns')} onNext={() => navigateTo('sliding-window')} onOpenChallenge={(c) => navigateTo('challenge', undefined, undefined, c)} />}
        {view === 'sliding-window' && <SlidingWindowPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('pattern-detail')} onNext={() => navigateTo('hash-map')} />}
        {view === 'hash-map' && <HashMapPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('sliding-window')} />}
        {view === 'ts-learn' && <TSLearnIndex onOpen={(l) => navigateTo('ts-lesson', undefined, l)} />}
        {view === 'ts-lesson' && (
          <TSLessonPage
            lesson={activeTSLesson}
            code={code}
            output={output}
            error={error}
            onCode={setCode}
            onRun={runLessonCode}
            onNext={goNextTSLesson}
            onPrevious={goPrevTSLesson}
            onHome={() => navigateTo('ts-learn')}
          />
        )}
        {view === 'lesson' && (
          <LessonPage
            lesson={activeLesson}
            code={code}
            output={output}
            error={error}
            onCode={setCode}
            onRun={runLessonCode}
            onNext={goNextLesson}
            onPrevious={goPrevLesson}
            onHome={() => navigateTo('learn')}
          />
        )}
        {view === 'challenge' && (
          <ChallengePage
            challenge={activeChallenge}
            code={code}
            results={results}
            showHint={showHint}
            onCode={setCode}
            onRun={testSolution}
            onHint={() => setShowHint(!showHint)}
            onBack={() => navigateTo('practice')}
            onNext={availableChallenges.indexOf(activeChallenge) < availableChallenges.length - 1 ? goNextChallenge : null}
            onPrevious={availableChallenges.indexOf(activeChallenge) > 0 ? goPrevChallenge : null}
          />
        )}
      </section>
    </main>
  )
}


function BigOPage() {
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
            <div><strong>Exact seconds.</strong> Two O(n) algorithms may run at different speeds — one might be 10× faster because of how it\'s written. Big O only tells you how they both <em>grow</em> with more input.</div>
          </div>
          <div className="big-o-dont-item">
            <span className="big-o-dont-icon">📏</span>
            <div><strong>Exact operation count.</strong> O(n) might mean 2n steps or 100n steps. Big O drops the constant because it\'s about the <em>shape</em> of growth, not the precise number.</div>
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
        <pre className="big-o-inline-code"><CodePanel code={`const small  = [7, 2, 9];       // n = 3
const medium = [7, 2, 9, 4, 1, 6];  // n = 6
const large  = [7, 2, 9, 4, 1, 6, 3, 8];  // n = 8`} showLineNumbers={false} /></pre>
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
            <pre className="big-o-inline-code"><CodePanel code={`function sum(arr) {
  let total = 0;         // one variable
  for (const n of arr) { // loops n times
    total += n;          // constant work
  }
  return total;
}`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">We process every element (O(n) time) but only create <code>total</code> — one variable, no matter how big the input. That&rsquo;s O(1) space.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>O(n) time, O(n) space</h4>
            <pre className="big-o-inline-code"><CodePanel code={`function double(arr) {
  const result = [];     // grows with input
  for (const n of arr) {
    result.push(n * 2);  // fills result
  }
  return result;
}`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Now <code>result</code> grows with the input — one new slot per element. That&rsquo;s O(n) space.</p>
          </div>
        </div>
      </section>

      {/* Big O Rules */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Big O rules (two things to remember)</h2>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>1. Drop the constants</h3>
        <p className="big-o-chart-sub">Big O cares about the <strong>shape</strong> of growth, not exact numbers. O(2n), O(5n), O(100n) — they all grow linearly. So we simplify to just O(n).</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Two loops — but they run one after the other, not inside each other.
for (const item of arr) { console.log(item); }  // n steps
for (const item of arr) { console.log(item); }  // n steps
// Total: n + n = 2n → O(n)`} showLineNumbers={false} /></pre>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '1.5rem 0 0.5rem' }}>2. Keep only the fastest-growing part</h3>
        <p className="big-o-chart-sub">When different kinds of work happen together, the fastest-growing term dominates. O(n + n²) → O(n²). As n gets large, n² makes n irrelevant.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// A loop followed by nested loops:
for (const item of arr) { }        // O(n)
for (const a of arr) {            // O(n²)
  for (const b of arr) { }
}
// Total: O(n + n²) → O(n²)`} showLineNumbers={false} /></pre>
      </section>

      {/* Core scenarios */}
      {bigOIds.map((id) => (
        <ScenarioSection key={id} scenarioId={id} />
      ))}

      {/* Best, Average, Worst Case */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Best, Average, and Worst case</h2>
        <p className="big-o-chart-sub">When people say &ldquo;Big O&rdquo; without qualification, they usually mean <strong>worst case</strong>.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Search for a number in an unsorted array
function find(arr, target) {
  for (const item of arr) {
    if (item === target) return true;
  }
  return false;
}

// [7, 2, 9, 4, 1]
//  ↑ Best case: target is first → O(1)
//        ↑ Average: somewhere in middle → O(n)
//              ↑ Worst: last or not found → O(n)`} showLineNumbers={false} /></pre>
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

  // Log scale Y: map log₁₀(ops) to plot height, min=0, max for n² at n=50 = log₁₀(2500) ≈ 3.4
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

  // Y-axis reference labels (log scale: 1, 10, 100, 1000)
  const yTicks = [1, 10, 100, 1000, 2500]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="big-o-chart" role="img" aria-label="Big O growth curves comparison chart">
      {/* Y-axis grid + labels */}
      {yTicks.map((val) => (
        <g key={`gy-${val}`}>
          <line x1={pad.left} y1={y(val)} x2={pad.left + plotW} y2={y(val)} stroke="var(--border-subtle)" strokeWidth="0.5" />
          <text x={pad.left - 6} y={y(val) + 4} textAnchor="end" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">{val}</text>
        </g>
      ))}
      {/* Axes */}
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="var(--text-muted)" strokeWidth="1" />
      <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="var(--text-muted)" strokeWidth="1" />
      {/* X-axis: just show direction */}
      <text x={pad.left + plotW / 2} y={H - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="10">n grows →</text>
      {/* Y-axis label */}
      <text x={12} y={pad.top + plotH / 2} textAnchor="middle" fill="var(--text-muted)" fontSize="10" transform={`rotate(-90, 12, ${pad.top + plotH / 2})`}>operations (log scale)</text>
      {/* Curves */}
      <polyline points={o1Points} fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="6,3" />
      <polyline points={olognPoints} fill="none" stroke="#5bb8f0" strokeWidth="3" />
      <polyline points={onPoints} fill="none" stroke="var(--kyu-6-text)" strokeWidth="2.5" />
      <polyline points={onlognPoints} fill="none" stroke="#d4a853" strokeWidth="2" strokeDasharray="5,3" />
      <polyline points={on2Points} fill="none" stroke="#f28b82" strokeWidth="3" />
      {/* Legend */}
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
      code: `function findMax(arr) {
  let max = arr[0];
  for (const n of arr) {
    if (n > max) max = n;
  }
  return max;
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2,
      explanation: 'One loop through the entire array — visits each element once. Time: O(n). Space is O(1) since only `max` is created.',
    },
    {
      question: 'What is the space complexity of this function?',
      code: `function find(arr, target) {
  for (const item of arr) {
    if (item === target) return true;
  }
  return false;
}`,
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
      code: `for (const item of arr) {
  console.log(item);
}

for (const item of arr) {
  console.log(item);
}`,
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

/* ── WaterLayer: ref-based water overlay for bar charts ── */
function WaterLayer({ chartId, l, r, waterH, maxH, chartHeight }: {
  chartId: string; l: number; r: number; waterH: number; maxH: number; chartHeight: number;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const chart = document.getElementById(chartId)
    if (!chart) return
    const lb = chart.querySelector(`[data-bar-index="${l}"]`) as HTMLElement | null
    const rb = chart.querySelector(`[data-bar-index="${r}"]`) as HTMLElement | null
    if (!lb || !rb) return
    const cr = chart.getBoundingClientRect()
    const lr = lb.getBoundingClientRect()
    const rr = rb.getBoundingClientRect()
    setPos({
      left: lr.left - cr.left,
      width: rr.right - cr.left - (lr.left - cr.left),
    })
  }, [chartId, l, r])

  const h = (waterH / maxH) * chartHeight

  return <div ref={ref} className="bar-water-area" style={pos ? {
    left: pos.left,
    width: pos.width,
    height: h,
  } : { display: 'none' }} />
}

/* ── ScenarioSection: one inline scenario with viz + debugger ── */
function ScenarioSection({ scenarioId }: { scenarioId: ScenarioId }) {
  const [stepIndex, setStepIndex] = useState(0)
  const scenario = scenarios.find((s) => s.id === scenarioId)!
  const step = scenario.visualData[stepIndex]
  const debugStep = scenario.steps[stepIndex]

  return (
    <section className="scenario-section" id={scenarioId}>
      <h2 className="scenario-section-title">{scenario.title}</h2>
      <p className="scenario-section-desc">{scenario.description}</p>
      <div className="scenario-section-meta">
        <span>Time <strong>{scenario.timeComplexity}</strong></span>
        <span>Space <strong>{scenario.spaceComplexity}</strong></span>
      </div>
      <div className="scenario-viz-stack">
        {/* Visualization */}
        <div className="algorithm-visual">
          {scenario.visualType === 'bar-chart' ? (
            <div className="bar-chart" id="bar-chart-root">
              {step.leftIndex >= 0 && step.rightIndex >= 0 && step.leftIndex < step.rightIndex && (
                <WaterLayer
                  chartId="bar-chart-root"
                  l={step.leftIndex}
                  r={step.rightIndex}
                  waterH={Math.min(Number(step.items[step.leftIndex]), Number(step.items[step.rightIndex]))}
                  maxH={8}
                  chartHeight={160}
                />
              )}
              {step.items.map((item, index) => {
                const height = Number(item)
                const isLeft = index === step.leftIndex
                const isRight = index === step.rightIndex
                const between = step.leftIndex >= 0 && step.rightIndex >= 0 && index > Math.min(step.leftIndex, step.rightIndex) && index < Math.max(step.leftIndex, step.rightIndex)
                return (
                  <div className="bar-col" key={index}>
                    <div className={`bar-wrapper${isLeft ? ' is-left' : ''}${isRight ? ' is-right' : ''}`} data-bar-index={index}>
                      <div className={`bar${isLeft ? ' is-left' : ''}${isRight ? ' is-right' : ''}${between ? ' is-between' : ''}`} style={{ height: `${(height / 8) * 100}%` }}>
                        <span className="pointer-label">{isLeft && 'L'}{isRight && !isLeft && 'R'}</span>
                      </div>
                    </div>
                    <small>{index}</small>
                    <span className="bar-value">{item}</span>
                  </div>
                )
              })}
            </div>
          ) : scenario.visualType === 'merge-arrays' ? (
            <div className="merge-viz">
              <div className="merge-row merge-row-a">
                <span className="merge-label">A</span>
                {step.itemsA!.map((item, index) => (
                  <div className={`merge-cell${step.pointerA === index ? ' is-left' : ''}${step.pointerA !== undefined && step.pointerA > 0 && index < step.pointerA ? ' is-done' : ''}`} key={index}>
                    {step.pointerA === index && <span className="pointer-label">i</span>}
                    <strong>{item}</strong><small>{index}</small>
                  </div>
                ))}
              </div>
              <div className="merge-row merge-row-b">
                <span className="merge-label">B</span>
                {step.itemsB!.map((item, index) => (
                  <div className={`merge-cell${step.pointerB === index ? ' is-right' : ''}${step.pointerB !== undefined && step.pointerB > 0 && index < step.pointerB ? ' is-done' : ''}`} key={index}>
                    {step.pointerB === index && <span className="pointer-label">j</span>}
                    <strong>{item}</strong><small>{index}</small>
                  </div>
                ))}
              </div>
              <div className="merge-row merge-row-result">
                <span className="merge-label">R</span>
                {step.result!.map((item, index) => (
                  <div className="merge-cell is-result" key={index}><strong>{item}</strong><small>{index}</small></div>
                ))}
              </div>
            </div>
          ) : scenario.visualType === 'sliding-window' ? (
            <div className="window-viz">
              <div className="window-track">
                {step.items.map((item, index) => {
                  const inWindow = step.windowStart !== undefined && step.windowEnd !== undefined && step.windowStart >= 0 && index >= step.windowStart! && index <= step.windowEnd!
                  const isFirst = inWindow && index === step.windowStart
                  const isLast = inWindow && index === step.windowEnd
                  const entering = inWindow && index === step.windowEnd
                  return (
                    <div className={`window-pane${inWindow ? ' is-visible' : ' is-dark'}${isFirst ? ' is-first' : ''}${isLast ? ' is-last' : ''}${entering ? ' is-entering' : ''}`} key={index}>
                      <strong>{item}</strong><small>{index}</small>
                    </div>
                  )
                })}
              </div>
              <div className="window-sum"><span>Sum in frame:</span><strong>{step.windowSum}</strong></div>
            </div>
          ) : (
            <div className="pointer-track">
              {step.items.map((item, index) => {
                const isLeft = index === step.leftIndex
                const isRight = index === step.rightIndex
                const isSlow = step.slowIndex !== undefined && index === step.slowIndex
                const isMatch = step.found && (isLeft || isRight)
                const isInResult = step.slowIndex !== undefined && index <= step.slowIndex && index !== step.rightIndex
                return (
                  <div className={`number-cell${isLeft ? ' is-left' : ''}${isRight ? ' is-right' : ''}${isSlow ? ' is-slow' : ''}${isMatch ? ' is-match' : ''}${isInResult ? ' is-result' : isSlow === false && step.slowIndex !== undefined && index > step.slowIndex ? ' is-stale' : ''}`} key={index}>
                    <span className="pointer-label">{isLeft && 'L'}{isRight && !isLeft && 'R'}{isSlow && !isLeft && !isRight && 'W'}</span>
                    <strong>{item}</strong><small>{index}</small>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {/* Code debugger */}
        <div className="algorithm-visual">
          <div>
            <span className="eyebrow">Code</span>
          </div>
          <StepDebugger
            code={scenario.debugCode}
            steps={scenario.steps}
            currentStep={stepIndex}
            onStep={setStepIndex}
          />
        </div>
      </div>
      {/* Why it works */}
      <CollapsibleBreakdown breakdown={scenario.breakdown} jsConcepts={scenario.jsConcepts || []} />
    </section>
  )
}

/* ── Collapsible breakdown ── */
function CollapsibleBreakdown({ breakdown, jsConcepts }: { breakdown: string[]; jsConcepts: string[] }) {
  const [open, setOpen] = useState(false)
  const [jsOpen, setJsOpen] = useState(false)
  const mental = breakdown[0]
  const phases = breakdown.slice(1, -1)
  const insight = breakdown[breakdown.length - 1]

  return (
    <div className="scenario-breakdown">
      <button className="breakdown-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="breakdown-arrow">{open ? '▾' : '▸'}</span>
        Breakdown
      </button>
      {open && (
        <div className="breakdown-body">
          {/* Mental model */}
          <div className="breakdown-mental">
            <span className="breakdown-section-label">Mental model</span>
            <CodeText text={mental} />
          </div>

          {/* Phases */}
          <div className="breakdown-phases">
            <span className="breakdown-section-label">How it works</span>
            <ol className="breakdown-phase-list">
              {phases.map((phase, i) => (
                <li key={i}><CodeText text={phase} /></li>
              ))}
            </ol>
          </div>

          {/* Key insight */}
          <div className="breakdown-insight">
            <span className="breakdown-section-label">Key insight</span>
            <CodeText text={insight} />
          </div>

          {/* JS Concepts reference */}
          {jsConcepts.length > 0 && (
            <div className="breakdown-js">
              <button className="breakdown-js-toggle" onClick={() => setJsOpen(!jsOpen)}>
                <span className="breakdown-arrow">{jsOpen ? '▾' : '▸'}</span>
                JavaScript concepts used
              </button>
              {jsOpen && (
                <ul className="breakdown-js-list">
                  {jsConcepts.map((concept, i) => (
                    <li key={i}><CodeText text={concept} /></li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Inline code renderer ── */
// Matches: backtick-wrapped text, code patterns like O(...), variable names, numbers, string literals
/* ── Inline code renderer ── */

function CodeBlock({ text }: { text: string }) {
  return <CodePanel code={text} showLineNumbers={false} />
}

function CodeText({ text }: { text: string }) {
  /* Split on **bold** and `code` patterns */
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  const nodes: ReactNode[] = []
  for (const [pi, part] of parts.entries()) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(<strong key={`b${pi}`}>{part.slice(2, -2)}</strong>)
    } else if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(<code key={`c${pi}`}>{part.slice(1, -1)}</code>)
    } else {
      nodes.push(<span key={`t${pi}`}>{part}</span>)
    }
  }
  return <>{nodes}</>
}

/* ── PatternsOverview: cards for each pattern category ── */

const patternEntries: { id: string; label: string; tags: string[]; active: boolean }[] = [
  { id: 'two-pointer', label: 'Two Pointers', tags: ['5 scenarios', 'O(n)'], active: true },
  { id: 'sliding-window', label: 'Sliding Window', tags: ['2 scenarios', 'Fixed + Variable', 'O(n)'], active: true },
  { id: 'hash-map', label: 'Hash Map / Frequency', tags: ['4 scenarios', 'Two sum', 'Anagrams', 'O(n)'], active: true },
  { id: 'fast-slow', label: 'Fast & Slow Pointers', tags: ['Cycle detection', 'O(n)'], active: false },
  { id: 'merge-interval', label: 'Merge / Intervals', tags: ['Overlapping intervals', 'O(n log n)'], active: false },
  { id: 'prefix-sum', label: 'Prefix Sum', tags: ['Running sum', 'Subarray = K', 'O(n)'], active: false },
  { id: 'binary-search', label: 'Binary Search', tags: ['Sorted array', 'O(log n)'], active: false },
  { id: 'stack', label: 'Stack', tags: ['Valid parens', 'Monotonic', 'O(n)'], active: false },
  { id: 'sorting-strategies', label: 'Sorting Strategies', tags: ['Sort + two ptr', 'Sort + greedy', 'O(n log n)'], active: false },
  { id: 'greedy', label: 'Greedy', tags: ['Best choice at each step', 'Activity selection'], active: false },
  { id: 'recursion', label: 'Recursion', tags: ['Self-calling', 'Base case', 'Tree-like'], active: false },
  { id: 'backtracking', label: 'Backtracking', tags: ['Permutations', 'Combinations', 'Advanced'], active: false },
]

function PatternsOverview({ onSelectPattern }: { onSelectPattern: (view: View) => void }) {
  return (
    <>
      <header className="algorithm-head patterns-head">
        <span className="eyebrow">Patterns</span>
        <h1>Algorithm Patterns</h1>
        <p>Proven strategies for solving common classes of coding problems. Review the patterns, recognize when to use them, and understand why each approach works.</p>
      </header>
      <section className="patterns-grid-section">
        {patternEntries.map((p) => {
          const targetView = p.id === 'two-pointer' ? 'pattern-detail' : p.id === 'sliding-window' ? 'sliding-window' : p.id === 'hash-map' ? 'hash-map' : null
          return p.active && targetView ? (
            <button key={p.id} className="when-to-use-card" onClick={() => onSelectPattern(targetView)} style={{ cursor: 'pointer' }}>
              <span className="when-to-use-label" style={{ fontSize: '1.125rem', fontWeight: 700 }}>{p.label}</span>
              <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </button>
          ) : (
            <div key={p.id} className="when-to-use-card is-placeholder" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="when-to-use-label" style={{ fontSize: '1.125rem', fontWeight: 700 }}>{p.label}</span>
              <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {p.tags.map((t) => <span key={t} className="tag" style={{ opacity: 0.6 }}>{t}</span>)}
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}

/* ── PatternDetailPage: scrollable inline scenarios for a pattern ── */
function PatternDetailPage({ onBack, onNext, onOpenChallenge }: { onBack: () => void; onNext: () => void; onOpenChallenge: (c: Challenge) => void }) {
  const twoPointerIds: ScenarioId[] = ['pair-sum', 'palindrome', 'remove-duplicates', 'container-water', 'merge-sorted']

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Two Pointers</h1>
        <p>Use two positions to systematically eliminate unnecessary work. Instead of checking every pair (O(n²)), move pointers strategically based on what you see — and finish in O(n).</p>
      </header>

      {/* What is Two Pointers? */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is Two Pointers?</h2>
        <p className="big-o-chart-sub">Two Pointers keeps track of <strong>two positions</strong> at the same time and moves them strategically. It is not one algorithm — it&rsquo;s a <strong>problem-solving pattern</strong>.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Instead of checking every pair (O(n²)):
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    // check arr[i] and arr[j]
  }
}

// Use two pointers and move them smartly (O(n)):
let left = 0, right = arr.length - 1;
while (left < right) {
  // decide which pointer to move based on what you see
}`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">The key insight: <strong>you know which pointer to move</strong> because the data has structure (sorted, symmetrical, etc.). You never need to backtrack.</p>
      </section>

      {/* Three patterns */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Three ways to use Two Pointers</h2>
        <div className="big-o-compare" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="big-o-compare-card">
            <h4>← Opposite direction →</h4>
            <pre className="big-o-inline-code"><CodePanel code={`[1, 2, 3, 4, 5, 6]
 L           R
 →           ←`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Pointers start at opposite ends, move toward each other. Good for: pair sum, palindrome, container with most water.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>→ Same direction →</h4>
            <pre className="big-o-inline-code"><CodePanel code={`[1, 1, 2, 2, 3, 3]
 S  F
 slow→ fast→`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Both move left to right, usually at different speeds. Good for: remove duplicates, partitioning, cycle detection.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Two arrays ↕</h4>
            <pre className="big-o-inline-code"><CodePanel code={`A: [1, 3, 5] B: [2, 4, 6]
    ↑          ↑`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">One pointer per array. Compare heads, take the smaller. Good for: merge sorted arrays, set intersection.</p>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      {twoPointerIds.map((id) => (
        <ScenarioSection key={id} scenarioId={id} />
      ))}

      {/* When to think of Two Pointers */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Two Pointers?</h2>
        <ol className="big-o-checklist">
          <li>You&rsquo;re working with an <strong>array or string</strong></li>
          <li>You need to <strong>compare elements from different positions</strong></li>
          <li>The data is <strong>sorted</strong> (or you can sort it)</li>
          <li>You need to <strong>find pairs</strong> or combinations</li>
          <li>You need to process the array <strong>in-place</strong></li>
          <li>You can make progress by <strong>moving one pointer based on what you see</strong></li>
        </ol>
        <p className="big-o-chart-note">⚠️ Two Pointers isn&rsquo;t always the answer. Look for a reason that moving a pointer lets you <strong>safely eliminate possibilities</strong> without checking every pair.</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div>
          <span className="eyebrow">End of Two Pointers</span>
          <strong>Ready for the next pattern?</strong>
        </div>
        <div className="lesson-end-actions">
          <button onClick={onBack}>← Algorithm Patterns</button>
          <button className="next-lesson-button" onClick={onNext}>Sliding Window →</button>
        </div>
      </nav>
    </>
  )
}

/* ── SlidingWindowPage ───────────────────────────── */
function SlidingWindowPage({ onBack, onPrevious, onNext }: { onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Sliding Window</h1>
        <p>A sliding window looks at a <strong>small, continuous chunk</strong> of an array or string at a time. Two pointers mark the start and end of that chunk — the &ldquo;window.&rdquo; As it moves, add what enters, drop what leaves — no need to start over.</p>
      </header>

      {/* What is Sliding Window? */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is Sliding Window?</h2>
        <p className="big-o-chart-sub">Instead of re-summing everything from scratch each time the window moves, we <strong>reuse the previous result</strong>. One subtraction, one addition — done.</p>
        <p className="big-o-chart-sub">Here&rsquo;s the visual version first:</p>
        <pre className="big-o-inline-code"><CodePanel code={`[2, 1, 5, 1, 3, 2]
 └──────┘     Old window: 2+1+5 = 8

[2, 1, 5, 1, 3, 2]
    └──────┘  New window: 8 - 2 + 1 = 7
              (drop what left, add what entered)`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-sub">And the code version:</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Without sliding window — re-sum every time (O(n×k)):
for (let i = 0; i <= arr.length - k; i++) {
  let sum = 0;
  for (let j = i; j < i + k; j++) sum += arr[j];
}

// With sliding window — reuse the previous sum (O(n)):
let windowSum = 0;
for (let i = 0; i < k; i++) windowSum += arr[i];
for (let i = k; i < arr.length; i++) {
  windowSum += arr[i] - arr[i - k];  // add new, drop old
}`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> the window doesn&rsquo;t start over when it moves. We reuse what we already calculated — just add the new element and subtract the departing one.</p>
      </section>

      {/* Two types */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two types of sliding windows</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Fixed-size window</h4>
            <pre className="big-o-inline-code"><CodePanel code={`[2, 1, 5, 1, 3, 2]  k=3
 [▁▁▁]           sum=8
    [▁▁▁]        sum=7
       [▁▁▁]     sum=9  ← max`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Window size stays constant (k). Slide one step, add the new element, drop the old. Good for: max sum, average of subarrays.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Variable-size window</h4>
            <pre className="big-o-inline-code"><CodePanel code={`Find smallest subarray with sum ≥ 7

[2, 1, 5, 1, 3, 2]
 └─────────┘ sum=8 ✓
    └──────┘  sum=7 ✓ ← smallest!
       └───┘   sum=6 ✗

Expand until condition met,
shrink while it still holds.`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Window grows and shrinks dynamically. Expand until you break a condition, then shrink from the left. Good for: subarray sum, substring without repeats.</p>
          </div>
        </div>
      </section>

      {/* Connection to Two Pointers */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">How Sliding Window relates to Two Pointers</h2>
        <p className="big-o-chart-sub">Both use two positions. The difference is intent:</p>
        <table className="big-o-cheatsheet">
          <thead>
            <tr><th></th><th>Two Pointers</th><th>Sliding Window</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Focus</strong></td><td>Compare or process elements at two positions</td><td>Maintain a contiguous range</td></tr>
            <tr><td><strong>Movement</strong></td><td>Move one pointer based on a condition</td><td>Move the window by expanding or shrinking its boundaries</td></tr>
            <tr><td><strong>Key operation</strong></td><td>Compare left vs right</td><td>Add incoming, subtract outgoing</td></tr>
            <tr><td><strong>Classic example</strong></td><td>Pair sum in sorted array</td><td>Max sum of k consecutive elements</td></tr>
          </tbody>
        </table>
      </section>

      {/* Scenarios */}
      <ScenarioSection scenarioId="sliding-window" />
      <ScenarioSection scenarioId="smallest-subarray" />

      {/* When to use */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Sliding Window?</h2>
        <ol className="big-o-checklist">
          <li>You need to process <strong>contiguous subarrays or substrings</strong></li>
          <li>The problem asks for <strong>maximum / minimum / average</strong> over a range</li>
          <li>You&rsquo;re working with <strong>consecutive elements</strong> (not arbitrary combinations)</li>
          <li>You can <strong>reuse the previous computation</strong> instead of starting fresh</li>
          <li>You see keywords like &ldquo;subarray,&rdquo; &ldquo;substring,&rdquo; &ldquo;consecutive,&rdquo; &ldquo;k elements&rdquo;</li>
        </ol>
        <p className="big-o-chart-note">⚠️ Sliding Window needs <strong>contiguous</strong> elements. If the problem asks for arbitrary combinations (like &ldquo;any two numbers&rdquo;), Two Pointers or Hash Map may be better.</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div>
          <span className="eyebrow">End of Sliding Window</span>
          <strong>Review or move on?</strong>
        </div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Two Pointers</button>
          <button className="next-lesson-button" onClick={onNext}>Hash Map / Frequency →</button>
        </div>
      </nav>
    </>
  )
}

/* ── HashMapPage ─────────────────────────────────── */
function HashMapPage({ onBack, onPrevious }: { onBack: () => void; onPrevious: () => void }) {
  const hashMapIds: ScenarioId[] = ['two-sum', 'first-unique', 'valid-anagram', 'most-frequent']

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Hash Map / Frequency</h1>
        <p>Use a map (dictionary) to store and look up values in <strong>O(1)</strong>. Trade a bit of memory for dramatically faster lookups — turn nested loops into single passes.</p>
      </header>

      {/* What is a Hash Map? */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is a Hash Map?</h2>
        <p className="big-o-chart-sub">A hash map stores <strong>key-value pairs</strong>. You give it a key, it gives you back the value — instantly, in O(1) time. No searching, no scanning.</p>
        <pre className="big-o-inline-code"><CodePanel code={`const map = new Map();
map.set('alice', 42);       // store
map.get('alice');            // → 42  (O(1)!)
map.has('alice');            // → true
map.set('alice', 43);        // update

// Compare: searching an array for 'alice'
// requires scanning every element (O(n)).
// A hash map finds it in one step.`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The core trade-off:</strong> hash maps use extra memory (O(n) space) to give you O(1) lookups. This is almost always worth it when it eliminates nested loops.</p>
      </section>

      {/* Common patterns */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Three common hash map patterns</h2>
        <div className="big-o-compare" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="big-o-compare-card">
            <h4>Complement lookup</h4>
            <pre className="big-o-inline-code"><CodePanel code={`For each value x:
  need = target - x
  if map has 'need':
    → found pair!`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Store seen values. For each new value, check if its complement exists. Good for: two sum, pair difference.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Frequency counting</h4>
            <pre className="big-o-inline-code"><CodePanel code={`Count how many times
each item appears.

Then use the counts
to answer questions.`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">First pass: count everything. Second pass: use the counts. Good for: first unique, most frequent, anagrams.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Index / position tracking</h4>
            <pre className="big-o-inline-code"><CodePanel code={`map.set(value, index)

Remember WHERE you
saw each value.
O(1) lookup later.`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Store position alongside value. Good for: two sum (indices), first/last occurrence.</p>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      {hashMapIds.map((id) => (
        <ScenarioSection key={id} scenarioId={id} />
      ))}

      {/* When to use */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of a Hash Map?</h2>
        <ol className="big-o-checklist">
          <li>You need to <strong>look things up quickly</strong> (not scan the whole array)</li>
          <li>You&rsquo;re <strong>counting occurrences</strong> — characters, numbers, words</li>
          <li>You need to check if something <strong>already exists</strong></li>
          <li>You&rsquo;re doing a <strong>nested loop</strong> — can a map replace the inner loop?</li>
          <li>You see keywords like &ldquo;find,&rdquo; &ldquo;count,&rdquo; &ldquo;duplicate,&rdquo; &ldquo;unique,&rdquo; &ldquo;pair&rdquo;</li>
        </ol>
        <p className="big-o-chart-note">💡 <strong>The core mental model:</strong> when you see a Hash Map problem, ask &ldquo;What information can I remember so I don&rsquo;t have to search for it again?&rdquo;</p>
        <p className="big-o-chart-note">⚠️ Hash maps need <strong>extra memory</strong> (O(n) space). Usually worth it — but if space is very constrained, consider sorting + two pointers instead.</p>
      </section>

      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div>
          <span className="eyebrow">End of Hash Map / Frequency</span>
          <strong>Review or move on?</strong>
        </div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Sliding Window</button>
          <button className="next-lesson-button" onClick={onBack}>Algorithm Patterns</button>
        </div>
      </nav>
    </>
  )
}

/* ── TS Learn Index ──────────────────────────────── */
function TSLearnIndex({ onOpen }: { onOpen: (lesson: TSLesson) => void }) {
  return (
    <>
      <header className="page-head">
        <span className="eyebrow">Review TypeScript</span>
        <h1>Type annotations, generics,<br />and type-level programming.</h1>
        <p>Progressive lessons from basic annotations to advanced generics and discriminated unions. Every lesson includes exercises — not just reading, but finding and fixing real type errors.</p>
      </header>
      <section className="path-heading">
        <div>
          <span className="eyebrow">Reference path</span>
          <h2>TypeScript fundamentals</h2>
        </div>
        <span>{tsLessons.length} detailed lessons</span>
      </section>
      <ol className="learning-path">
        {tsLessons.map((lesson) => (
          <li key={lesson.id}>
            <span className="path-number">{String(lesson.order).padStart(2, '0')}</span>
            <div>
              <span className="lesson-topic">{lesson.block}</span>
              <strong>{lesson.title}</strong>
              <p>{lesson.summary}</p>
            </div>
            <button onClick={() => onOpen(lesson)}>
              Review <b>→</b>
            </button>
          </li>
        ))}
      </ol>
    </>
  )
}

function LearnIndex({ onOpen }: { onOpen: (lesson: Lesson) => void }) {
  return (
    <>
      <header className="page-head">
        <span className="eyebrow">Review JavaScript</span>
        <h1>A detailed reference<br />for the fundamentals.</h1>
        <p>Lessons follow a sensible order, but nothing is marked complete. Revisit any topic whenever you forget a concept — read the explanation, run the example, and move on when you are ready.</p>
      </header>
      <section className="path-heading">
        <div>
          <span className="eyebrow">Reference path</span>
          <h2>JavaScript fundamentals</h2>
        </div>
        <span>{lessons.length} detailed lessons</span>
      </section>
      <ol className="learning-path">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <span className="path-number">{String(lesson.order).padStart(2, '0')}</span>
            <div>
              <span className="lesson-topic">{lesson.topic}</span>
              <strong>{lesson.title}</strong>
              <p>{lesson.summary}</p>
            </div>
            <button onClick={() => onOpen(lesson)}>
              Review <b>→</b>
            </button>
          </li>
        ))}
      </ol>
    </>
  )
}

function PracticeIndex({ challenges: items, topic, level, onTopic, onLevel, onOpen }: { challenges: Challenge[]; topic: Topic | 'All topics'; level: Kyu | 'All levels'; onTopic: (topic: Topic | 'All topics') => void; onLevel: (level: Kyu | 'All levels') => void; onOpen: (challenge: Challenge) => void }) {
  return (
    <>
      <header className="page-head practice-head">
        <span className="eyebrow">Practice JavaScript</span>
        <h1>Sharpen the basics<br />with small challenges.</h1>
        <p>Start at 8 kyu and progress to 5 kyu. Every challenge has assertions that run against your own solution, with no completion tracking.</p>
      </header>
      <section className="practice-toolbar">
        <div>
          <span className="eyebrow">40 challenges</span>
          <h2>Challenge catalogue</h2>
        </div>
        <div className="filters">
          <label>
            Topic
            <select value={topic} onChange={(event) => onTopic(event.target.value as Topic | 'All topics')}>
              {topics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Level
            <select value={level} onChange={(event) => onLevel(event.target.value as Kyu | 'All levels')}>
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section className="challenge-catalogue">
        {items.map((challenge) => (
          <button key={challenge.id} onClick={() => onOpen(challenge)}>
            <span className={`kyu kyu-${challenge.kyu[0]}`}>{challenge.kyu}</span>
            <span className="catalogue-copy">
              <strong>{challenge.title}</strong>
              <small>{challenge.topic}</small>
            </span>
            <span className="catalogue-arrow">→</span>
          </button>
        ))}
      </section>
      {items.length === 0 && <p className="empty-state">No challenges match these filters.</p>}
    </>
  )
}

function TSLessonPage({
  lesson,
  code,
  output,
  error,
  onCode,
  onRun,
  onNext,
  onPrevious,
  onHome,
}: {
  lesson: TSLesson
  code: string
  output: string[]
  error: string
  onCode: (code: string) => void
  onRun: () => void
  onNext: () => void
  onPrevious: () => void
  onHome: () => void
}) {
  const hasPrevious = lesson.order > 1
  const hasNext = lesson.order < tsLessons.length
  useEffect(() => { window.scrollTo(0, 0) }, [lesson.order])

  return (
    <>
      <header className="lesson-head">
        <div>
          <span className="eyebrow">Lesson {lesson.order} of {tsLessons.length} · {lesson.block}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </div>
      </header>
      <article className="reading ts-reading">
        {lesson.sections.map((section) => (
          <CollapsibleSection key={section.title} title={section.title} defaultOpen>
            {section.body.map((paragraph) => <p key={paragraph}><CodeText text={paragraph} /></p>)}
            {section.code && <CodeBlock text={section.code} />}
          </CollapsibleSection>
        ))}
      </article>
      <Editor title="lesson.ts" code={code} onCode={onCode} onRun={onRun} output={output} error={error} />
      <div className="reading ts-reading">
        {lesson.exercises.length > 0 && (
          <section className="ts-exercises">
            <h2>Exercises</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>Each snippet below asks you to think, then click to reveal the answer.</p>
            {lesson.exercises.map((ex, i) => <TSExerciseCard key={i} exercise={ex} index={i} />)}
          </section>
        )}
        <nav className="lesson-end-nav" aria-label="Lesson navigation">
          <div>
            <span className="eyebrow">End of lesson</span>
            <strong>{hasNext ? 'Ready for the next concept?' : 'You reached the end of this path.'}</strong>
          </div>
          <div className="lesson-end-actions">
            {hasPrevious && <button onClick={onPrevious}>← Back</button>}
            <button onClick={onHome}>All lessons</button>
            {hasNext && <button className="next-lesson-button" onClick={onNext}>Next →</button>}
          </div>
        </nav>
      </div>
    </>
  )
}

function TSExerciseCard({ exercise, index }: { exercise: TSExercise; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const [revealedBlanks, setRevealedBlanks] = useState<Set<number>>(new Set())
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  function toggleBlank(i: number) {
    setRevealedBlanks((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  return (
    <div className="ts-exercise-card">
      <div className="ts-exercise-header">
        <span className="ts-exercise-badge">{index + 1}</span>
        <span>{exercise.question}</span>
      </div>

      {exercise.kind === 'convert-js-ts' && (
        <>
          <div className="ts-ex-label">JavaScript</div>
          <pre className="ts-exercise-code"><CodeBlock text={exercise.jsCode} /></pre>
          {!revealed ? (
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal TypeScript</button>
          ) : (
            <>
              <div className="ts-ex-label">TypeScript</div>
              <pre className="ts-exercise-code"><CodeBlock text={exercise.tsCode} /></pre>
            </>
          )}
        </>
      )}

      {exercise.kind === 'fix-type' && (
        <>
          <div className="ts-ex-label">Broken code <span className="ts-error-desc">{exercise.errorDescription}</span></div>
          <pre className="ts-exercise-code"><CodeBlock text={exercise.brokenCode} /></pre>
          {!revealed ? (
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal fix</button>
          ) : (
            <>
              <div className="ts-ex-label" style={{ color: '#4caf88' }}>Fixed</div>
              <pre className="ts-exercise-code ts-ex-fixed"><CodeBlock text={exercise.fixedCode} /></pre>
            </>
          )}
        </>
      )}

      {exercise.kind === 'predict-type' && (
        <>
          <pre className="ts-exercise-code"><CodeBlock text={exercise.code} /></pre>
          {!revealed ? (
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal type</button>
          ) : (
            <div className="ts-ex-answer">{exercise.answer}</div>
          )}
        </>
      )}

      {exercise.kind === 'model-it' && (
        <>
          <div className="ts-ex-label">Data</div>
          <pre className="ts-exercise-code"><CodeBlock text={exercise.data} /></pre>
          {!revealed ? (
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal interface</button>
          ) : (
            <>
              <div className="ts-ex-label">Interface</div>
              <pre className="ts-exercise-code ts-ex-fixed"><CodeBlock text={exercise.interface} /></pre>
            </>
          )}
        </>
      )}

      {exercise.kind === 'choose-best' && (
        <div className="ts-exercise-options">
          {exercise.options.map((opt, i) => {
            let cls = 'ts-option'
            if (revealed) {
              if (opt.isCorrect) cls += ' is-correct'
              else if (i === selectedOption && !opt.isCorrect) cls += ' is-wrong'
            }
            return (
              <button
                key={i}
                className={cls}
                disabled={revealed}
                onClick={() => { setSelectedOption(i); setRevealed(true) }}
              >
                <span className="ts-option-letter">{opt.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{opt.code}</span>
                {revealed && opt.isCorrect && <span className="ts-option-check">✓</span>}
                {revealed && i === selectedOption && !opt.isCorrect && <span className="ts-option-cross">✗</span>}
              </button>
            )
          })}
        </div>
      )}

      {exercise.kind === 'fill-blank' && (
        <>
          <pre className="ts-exercise-code">{renderFillBlank(exercise.code, exercise.blanks, revealedBlanks, toggleBlank)}</pre>
          {revealedBlanks.size < exercise.blanks.length && (
            <p className="ts-blank-hint">Click each <code>___</code> to reveal the answer. {exercise.blanks.length - revealedBlanks.size} remaining.</p>
          )}
        </>
      )}

      {revealed && exercise.kind !== 'fill-blank' && (
        <div className={`ts-exercise-result ${exercise.kind === 'choose-best' && selectedOption !== null && !exercise.options[selectedOption].isCorrect ? 'is-wrong' : 'is-correct'}`}>
          {exercise.kind === 'choose-best' && selectedOption !== null && !exercise.options[selectedOption].isCorrect && (
            <strong>✗ Not quite.</strong>
          )}
          <p>{exercise.explanation}</p>
        </div>
      )}
      {revealedBlanks.size === (exercise.kind === 'fill-blank' ? exercise.blanks.length : 0) && exercise.kind === 'fill-blank' && (
        <div className="ts-exercise-result is-correct">
          <p>{exercise.explanation}</p>
        </div>
      )}
    </div>
  )
}

/* Render code with clickable blanks */
function renderFillBlank(
  code: string,
  blanks: { label: string; answer: string }[],
  revealedBlanks: Set<number>,
  toggleBlank: (i: number) => void,
): ReactNode {
  let result = code
  const parts: ReactNode[] = []
  let last = 0
  blanks.forEach((blank, i) => {
    const idx = result.indexOf('___', last)
    if (idx === -1) return
    parts.push(<span key={`t${i}`}>{result.slice(last, idx)}</span>)
    last = idx + 3
    if (revealedBlanks.has(i)) {
      parts.push(<span key={`b${i}`} className="ts-blank filled">{blank.answer}</span>)
    } else {
      parts.push(<button key={`b${i}`} className="ts-blank" onClick={() => toggleBlank(i)} title={blank.label}>___</button>)
    }
  })
  parts.push(<span key="end">{result.slice(last)}</span>)
  return <>{parts}</>
}

function LessonPage({
  lesson,
  code,
  output,
  error,
  onCode,
  onRun,
  onNext,
  onPrevious,
  onHome,
}: {
  lesson: Lesson
  code: string
  output: string[]
  error: string
  onCode: (code: string) => void
  onRun: () => void
  onNext: () => void
  onPrevious: () => void
  onHome: () => void
}) {
  const hasPrevious = lesson.order > 1
  const hasNext = lesson.order < lessons.length

  useEffect(() => { window.scrollTo(0, 0) }, [lesson.order])

  return (
    <>
      <header className="lesson-head">
        <div>
          <span className="eyebrow">Lesson {lesson.order} of {lessons.length} · {lesson.topic}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </div>
      </header>
      <article className="reading">
        {lesson.sections.map((section) => (
          <CollapsibleSection key={section.title} title={section.title} defaultOpen>
            {section.body.map((paragraph) => <p key={paragraph}><CodeText text={paragraph} /></p>)}
            {section.code && <CodeBlock text={section.code} />}
          </CollapsibleSection>
        ))}
      </article>
      <Editor title="lesson.js" code={code} onCode={onCode} onRun={onRun} output={output} error={error} />
      <nav className="lesson-end-nav" aria-label="Lesson navigation">
        <div>
          <span className="eyebrow">End of lesson</span>
          <strong>{hasNext ? 'Ready for the next concept?' : 'You reached the end of this path.'}</strong>
        </div>
        <div className="lesson-end-actions">
          {hasPrevious && <button onClick={onPrevious}>← Back</button>}
          <button onClick={onHome}>All lessons</button>
          {hasNext && <button className="next-lesson-button" onClick={onNext}>Next →</button>}
        </div>
      </nav>
    </>
  )
}

function ChallengePage({ challenge, code, results, showHint, onCode, onRun, onHint, onBack, onNext, onPrevious }: { challenge: Challenge; code: string; results: Result[]; showHint: boolean; onCode: (code: string) => void; onRun: () => void; onHint: () => void; onBack: () => void; onNext: (() => void) | null; onPrevious: (() => void) | null }) {
  const passed = results.filter((item) => item.passed).length
  const allPassed = results.length > 0 && passed === results.length
  const hasFailures = results.some((item) => !item.passed)
  const [panelFlash, setPanelFlash] = useState<OutputFlash>('idle')
  const panelRef = useRef<HTMLElement>(null)

  function handleRun() {
    onRun()
    setPanelFlash('idle')
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  useEffect(() => {
    if (results.length === 0) return
    setPanelFlash(allPassed ? 'success' : 'error')
    const timer = window.setTimeout(() => setPanelFlash('idle'), 700)
    return () => window.clearTimeout(timer)
  }, [results, allPassed])

  return (
    <>
      <header className="challenge-head">
        <button className="back-link" onClick={onBack}>← Practice</button>
        <div>
          <span className="eyebrow">JavaScript · {challenge.topic}</span>
          <h1>{challenge.title}</h1>
          <p>{challenge.description}</p>
        </div>
        <span className={`kyu kyu-${challenge.kyu[0]}`}>{challenge.kyu}</span>
      </header>
      <Editor title="solution.js" code={code} onCode={onCode} onRun={handleRun} output={[]} error="" runLabel="Run assertions" showConsole={false} />
      <section
        ref={panelRef}
        className={`test-panel${panelFlash === 'success' ? ' flash-success' : ''}${panelFlash === 'error' ? ' flash-error' : ''}${results.length === 0 ? ' is-idle' : ''}${allPassed ? ' all-passed' : ''}${hasFailures ? ' has-failures' : ''}`}
        aria-live="polite"
      >
        <div>
          <div>
            <span className="eyebrow">Assertions</span>
            <h2>{results.length ? `${passed} of ${results.length} passing` : 'Run your solution'}</h2>
          </div>
          <button className="hint-button" onClick={onHint}>
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        </div>
        {showHint && <p className="hint">{challenge.hint}</p>}
        {results.length === 0 ? (
          <p className="test-placeholder">Press Run assertions (<Kbd>{modLabel} Enter</Kbd>) to evaluate your solution.</p>
        ) : (
          <ul>
            {results.map((item) => (
              <li className={item.passed ? 'passed' : 'failed'} key={item.label}>
                <span>{item.passed ? '✓' : '×'}</span>
                <div>
                  <strong>{item.label}</strong>
                  {!item.passed && (
                    <small>
                      Called: `{challenge.functionName}({challenge.cases.find((c) => c.label === item.label)?.args.map((a) => JSON.stringify(a)).join(', ')})`
                      <br />
                      {item.error || `Expected ${display(challenge.cases.find((test) => test.label === item.label)?.expected)}, received ${display(item.actual)}`}
                    </small>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {(onPrevious || onNext) && (
        <nav className="lesson-end-nav" aria-label="Challenge navigation">
          <div>
            <span className="eyebrow">End of challenge</span>
            <strong>{allPassed ? 'All assertions pass. Great work!' : 'Keep going — you can do this.'}</strong>
          </div>
          <div className="lesson-end-actions">
            <button onClick={onPrevious ?? undefined} disabled={!onPrevious}>← Previous</button>
            <button onClick={onNext ?? undefined} className={`next-lesson-button${!onNext ? ' disabled' : ''}`} disabled={!onNext}>Next →</button>
          </div>
        </nav>
      )}
    </>
  )
}
