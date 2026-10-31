import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { challenges, lessons, type Challenge, type Kyu, type Lesson, type Topic } from './content'
import { tsLessons, type TSLesson, type TSExercise } from './ts-content'
import { zodLessons, type ZodLesson, type ZodExercise } from './zod-content'
import { Editor } from './editor'
import { type ScenarioId } from './algorithm-scenarios'
import { BookOpen, CaretLeft, Code, Flask, Graph, List } from '@phosphor-icons/react'
import { readStorage, writeStorage, display, runTS, executeExample, modLabel, runAssertions } from './utils'
import { Kbd } from './components/Kbd'
import { CodePanel } from './components/CodePanel'
import { CollapsibleSection } from './components/CollapsibleSection'
import { CollapsibleBreakdown } from './components/CollapsibleBreakdown'
import { CodeText } from './components/CodeText'
import { CodeBlock } from './components/CodeBlock'
import { ScenarioSection } from './components/ScenarioSection'
import { BigOPage } from './components/BigOPage'
import { WaterLayer } from './components/WaterLayer'

type View = 'learn' | 'practice' | 'lesson' | 'challenge' | 'big-o' | 'patterns' | 'pattern-detail' | 'sliding-window' | 'hash-map' | 'binary-search' | 'fast-slow' | 'stack' | 'merge-intervals' | 'prefix-sum' | 'sorting-strategies' | 'ts-learn' | 'ts-lesson' | 'zod-learn' | 'zod-lesson'
type NavEntry = { v: View; lo?: number; to?: number; zo?: number; cid?: string }
type Result = { label: string; passed: boolean; actual?: unknown; error?: string }
type OutputFlash = 'idle' | 'success' | 'error'

const topics: Array<Topic | 'All topics'> = ['All topics', 'Fundamentals', 'Strings', 'Arrays', 'Objects', 'Modern JS']
const levels: Array<Kyu | 'All levels'> = ['All levels', '8 kyu', '7 kyu', '6 kyu', '5 kyu']
const SIDEBAR_KEY = 'knowledge-lab-sidebar-collapsed'

export function App() {
  const [view, setView] = useState<View>('learn')
  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0])
  const [activeTSLesson, setActiveTSLesson] = useState<TSLesson>(tsLessons[0])
  const [activeZodLesson, setActiveZodLesson] = useState<ZodLesson>(zodLessons[0])
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
  const nextZodLessonRef = useRef<() => void>(() => {})
  const prevZodLessonRef = useRef<() => void>(() => {})

  const availableChallenges = useMemo(() => challenges.filter((item) => (topic === 'All topics' || item.topic === topic) && (level === 'All levels' || item.kyu === level)), [topic, level])

  const navigatingRef = useRef(false)

  function navigateTo(view: View, lesson?: Lesson, tsLesson?: TSLesson, challenge?: Challenge, zodLesson?: ZodLesson) {
    setView(view)
    if (lesson) setActiveLesson(lesson)
    if (tsLesson) setActiveTSLesson(tsLesson)
    if (zodLesson) setActiveZodLesson(zodLesson)
    if (challenge) setActiveChallenge(challenge)

    if (lesson) { setCode(lesson.starterCode); setOutput([]); setError('') }
    if (challenge) { setCode(challenge.starterCode); setResults([]); setShowHint(false) }
    if (tsLesson) { setCode(tsLesson.starterCode); setOutput([]); setError('') }
    if (zodLesson) { setCode(zodLesson.starterCode); setOutput([]); setError('') }

    if (!navigatingRef.current) {
      const entry: NavEntry = { v: view }
      if (lesson) entry.lo = lesson.order
      if (tsLesson) entry.to = tsLesson.order
      if (zodLesson) entry.zo = zodLesson.order
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
    const src = view === 'ts-lesson' || view === 'zod-lesson' ? code : code
    const next = view === 'ts-lesson' || view === 'zod-lesson' ? runTS(code) : executeExample(code)
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

  const goNextZodLesson = useCallback(() => {
    const next = zodLessons.find((item) => item.order === activeZodLesson.order + 1)
    if (next) navigateTo('zod-lesson', undefined, undefined, undefined, next)
  }, [activeZodLesson.order])

  const goPrevZodLesson = useCallback(() => {
    const previous = zodLessons.find((item) => item.order === activeZodLesson.order - 1)
    if (previous) navigateTo('zod-lesson', undefined, undefined, undefined, previous)
  }, [activeZodLesson.order])

  runLessonRef.current = runLessonCode
  runChallengeRef.current = testSolution
  nextLessonRef.current = goNextLesson
  prevLessonRef.current = goPrevLesson
  nextTSLessonRef.current = goNextTSLesson
  prevTSLessonRef.current = goPrevTSLesson
  nextZodLessonRef.current = goNextZodLesson
  prevZodLessonRef.current = goPrevZodLesson

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
        if (view === 'lesson' || view === 'ts-lesson' || view === 'zod-lesson') {
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
      if (event.shiftKey && event.key === 'ArrowRight' && (view === 'zod-lesson')) {
        event.preventDefault()
        nextZodLessonRef.current()
      }

      if (event.shiftKey && event.key === 'ArrowLeft' && (view === 'lesson')) {
        event.preventDefault()
        prevLessonRef.current()
      }
      if (event.shiftKey && event.key === 'ArrowLeft' && (view === 'ts-lesson')) {
        event.preventDefault()
        prevTSLessonRef.current()
      }
      if (event.shiftKey && event.key === 'ArrowLeft' && (view === 'zod-lesson')) {
        event.preventDefault()
        prevZodLessonRef.current()
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
            <button className={`nav-link ${view === 'zod-learn' || view === 'zod-lesson' ? 'active' : ''}`} onClick={() => navigateTo('zod-learn')}>
              <span><Flask size={16} /></span>Zod
            </button>
            <button className={`nav-link ${view === 'practice' || view === 'challenge' ? 'active' : ''}`} onClick={() => navigateTo('practice')}>
              <span><Code size={16} /></span>Practice
            </button>
            <button className={`nav-link ${view === 'big-o' ? 'active' : ''}`} onClick={() => navigateTo('big-o')}>
              <span><Graph size={16} /></span>Big O Notation
            </button>
            <button className={`nav-link ${view === 'patterns' || view === 'pattern-detail' || view === 'sliding-window' || view === 'hash-map' || view === 'binary-search' || view === 'fast-slow' || view === 'stack' || view === 'merge-intervals' || view === 'prefix-sum' || view === 'sorting-strategies' ? 'active' : ''}`} onClick={() => navigateTo('patterns')}>
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
            <button className={`nav-link ${view === 'zod-learn' || view === 'zod-lesson' ? 'active' : ''}`} onClick={() => navigateTo('zod-learn')} title="Zod">
              <span><Flask size={16} weight="fill" /></span>
            </button>
            <button className={`nav-link ${view === 'practice' || view === 'challenge' ? 'active' : ''}`} onClick={() => navigateTo('practice')} title="Practice">
              <span><Code size={16} /></span>
            </button>
            <button className={`nav-link ${view === 'big-o' ? 'active' : ''}`} onClick={() => navigateTo('big-o')} title="Big O Notation">
              <span><Graph size={16} /></span>
            </button>
            <button className={`nav-link ${view === 'patterns' || view === 'pattern-detail' || view === 'sliding-window' || view === 'hash-map' || view === 'binary-search' || view === 'fast-slow' || view === 'stack' || view === 'merge-intervals' || view === 'prefix-sum' || view === 'sorting-strategies' ? 'active' : ''}`} onClick={() => navigateTo('patterns')} title="Algorithm Patterns">
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
        {view === 'binary-search' && <BinarySearchPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('hash-map')} onNext={() => navigateTo('fast-slow')} />}
        {view === 'fast-slow' && <FastSlowPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('binary-search')} onNext={() => navigateTo('stack')} />}
        {view === 'stack' && <StackPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('fast-slow')} onNext={() => navigateTo('merge-intervals')} />}
        {view === 'merge-intervals' && <MergeIntervalsPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('stack')} onNext={() => navigateTo('prefix-sum')} />}
        {view === 'prefix-sum' && <PrefixSumPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('merge-intervals')} onNext={() => navigateTo('sorting-strategies')} />}
        {view === 'sorting-strategies' && <SortingStrategiesPage onBack={() => navigateTo('patterns')} onPrevious={() => navigateTo('prefix-sum')} />}
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
        {view === 'zod-learn' && <ZodLearnIndex onOpen={(l) => navigateTo('zod-lesson', undefined, undefined, undefined, l)} />}
        {view === 'zod-lesson' && (
          <ZodLessonPage
            lesson={activeZodLesson}
            code={code}
            output={output}
            error={error}
            onCode={setCode}
            onRun={runLessonCode}
            onNext={goNextZodLesson}
            onPrevious={goPrevZodLesson}
            onHome={() => navigateTo('zod-learn')}
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


/* ── PatternsOverview: cards for each pattern category ── */

const patternEntries: { id: string; label: string; tags: string[]; active: boolean }[] = [
  { id: 'two-pointer', label: 'Two Pointers', tags: ['5 scenarios', 'O(n)'], active: true },
  { id: 'sliding-window', label: 'Sliding Window', tags: ['2 scenarios', 'Fixed + Variable', 'O(n)'], active: true },
  { id: 'hash-map', label: 'Hash Map / Frequency', tags: ['4 scenarios', 'Two sum', 'Anagrams', 'O(n)'], active: true },
  { id: 'fast-slow', label: 'Fast & Slow Pointers', tags: ['Cycle detection', 'Middle find', 'O(n)'], active: true },
  { id: 'merge-interval', label: 'Merge / Intervals', tags: ['Overlapping intervals', 'Sort + merge', 'O(n log n)'], active: true },
  { id: 'prefix-sum', label: 'Prefix Sum', tags: ['Range queries', 'Equilibrium', 'O(n)'], active: true },
  { id: 'binary-search', label: 'Binary Search', tags: ['Sorted array', 'Boundary', 'O(log n)'], active: true },
  { id: 'stack', label: 'Stack', tags: ['Valid parens', 'Monotonic', 'O(n)'], active: true },
  { id: 'sorting-strategies', label: 'Sorting Strategies', tags: ['Sort + two ptr', 'Sort + sweep', 'O(n log n)'], active: true },
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
          const targetView = p.id === 'two-pointer' ? 'pattern-detail' : p.id === 'sliding-window' ? 'sliding-window' : p.id === 'hash-map' ? 'hash-map' : p.id === 'binary-search' ? 'binary-search' : p.id === 'fast-slow' ? 'fast-slow' : p.id === 'stack' ? 'stack' : p.id === 'merge-interval' ? 'merge-intervals' : p.id === 'prefix-sum' ? 'prefix-sum' : p.id === 'sorting-strategies' ? 'sorting-strategies' : null
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

/* ── BinarySearchPage ──────────────────────────── */
function BinarySearchPage({ onBack, onPrevious, onNext }: { onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  const binarySearchIds: ScenarioId[] = ['binary-search-classic', 'binary-search-boundary']
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Binary Search</h1>
        <p>Cut the search space <strong>in half</strong> with every step. With one comparison, you eliminate millions of elements — no need to check them one by one.</p>
      </header>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is Binary Search?</h2>
        <p className="big-o-chart-sub">Binary search is like guessing a number: you ask &ldquo;is it higher or lower than X?&rdquo; and cut the possible range in half each time. 20 guesses cover <strong>one million</strong> numbers.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Linear search — check every element (O(n)):
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) return i;
}

// Binary search — cut in half each step (O(log n)):
let lo = 0, hi = arr.length - 1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> the array must be <strong>sorted</strong>. Only then can you know which half to discard after checking mid. Without sorting, binary search is useless.</p>
      </section>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two binary search patterns</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Classic: Find any occurrence</h4>
            <pre className="big-o-inline-code"><CodePanel code={`arr = [1, 3, 5, 7, 9]
target = 5
mid = (0+4)/2 = 2 → arr[2]=5 ✓`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Compare mid with target. If equal, return. If smaller, search right. If larger, search left.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Boundary: Find first / last</h4>
            <pre className="big-o-inline-code"><CodePanel code={`arr = [1, 2, 2, 2, 3]
target = 2
Find first 2 → keep searching left`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">On match, save position but continue searching past it — left for first occurrence, right for last.</p>
          </div>
        </div>
      </section>
      {binarySearchIds.map((id) => <ScenarioSection key={id} scenarioId={id} />)}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Binary Search?</h2>
        <ol className="big-o-checklist">
          <li>The input is <strong>sorted</strong> (or can be sorted without breaking the solution)</li>
          <li>You need to <strong>find a specific value</strong> — not process every element</li>
          <li>You can <strong>eliminate half the search space</strong> with a single decision</li>
          <li>The search space is <strong>ordered</strong> — numbers, dates, alphabetical, etc.</li>
          <li>You see keywords like &ldquo;sorted array,&rdquo; &ldquo;logarithmic,&rdquo; &ldquo;O(log n)&rdquo;</li>
        </ol>
        <p className="big-o-chart-note">⚠️ Binary search <strong>requires sorted data</strong>. If the array is unsorted and sorting is too expensive (O(n log n)), consider a hash map instead.</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div>
          <span className="eyebrow">End of Binary Search</span>
          <strong>Review or move on?</strong>
        </div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Hash Map</button>
          <button className="next-lesson-button" onClick={onNext}>Fast &amp; Slow Pointers →</button>
        </div>
      </nav>
    </>
  )
}

/* ── FastSlowPage ──────────────────────────────── */
function FastSlowPage({ onBack, onPrevious, onNext }: { onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Fast &amp; Slow Pointers</h1>
        <p>Two pointers moving at <strong>different speeds</strong>. The speed difference is the algorithm — it detects cycles and finds midpoints in a single pass with O(1) space.</p>
      </header>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is Fast &amp; Slow?</h2>
        <p className="big-o-chart-sub">Also called the <strong>tortoise and hare</strong> algorithm. The slow pointer moves one step at a time; the fast pointer moves two. The speed gap reveals structure: if there is a cycle, fast will eventually catch up to slow.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Without fast & slow — need a visited set (O(n) space):
const visited = new Set();
while (current) {
  if (visited.has(current)) return true; // cycle found
  visited.add(current);
  current = current.next;
}

// With fast & slow — two pointers, O(1) space:
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true; // caught up → cycle!
}`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> the speed difference guarantees convergence. On each cycle step, fast gains one position on slow. If there is a cycle, they meet within n steps.</p>
      </section>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two classic uses</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Detect cycle</h4>
            <pre className="big-o-inline-code"><CodePanel code={`3 → 2 → 0 → -4
     ↑         ↓
     └─────────┘
slow: 3→2→0→-4→2→...
fast: 3→0→2→-4→0→...
Meet at 2 ✓`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Fast moves two steps, slow moves one. If they meet on a cycle node, the list has a loop.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Find middle</h4>
            <pre className="big-o-inline-code"><CodePanel code={`1 → 2 → 3 → 4 → 5 → null
s   s   s    → stops at 3
f       f        f → stops at 5

When fast reaches end,
slow is at middle ✓`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Fast moves at 2× speed. When fast reaches the end, slow is exactly halfway. No need to count first.</p>
          </div>
        </div>
      </section>
      <ScenarioSection scenarioId="linked-list-cycle" />
      <ScenarioSection scenarioId="find-middle" />
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Fast &amp; Slow Pointers?</h2>
        <ol className="big-o-checklist">
          <li>You have a <strong>linked list</strong> (or any node chain with next/prev)</li>
          <li>You need to <strong>detect cycles or find middle</strong> in one pass</li>
          <li>You need <strong>O(1) space</strong> — no hash sets or extra arrays</li>
          <li>The structure is <strong>linear with possible loops</strong></li>
          <li>You need to <strong>find the start of a cycle</strong> (variant: reset one pointer to head after meeting)</li>
        </ol>
        <p className="big-o-chart-note">⚠️ Fast &amp; slow only applies to <strong>linked structures with pointers</strong>. For array cycle detection, use different techniques (e.g., index arithmetic or hash maps).</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div>
          <span className="eyebrow">End of Fast &amp; Slow</span>
          <strong>Review or move on?</strong>
        </div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Binary Search</button>
          <button className="next-lesson-button" onClick={onNext}>Stack →</button>
        </div>
      </nav>
    </>
  )
}

/* ── StackPage ──────────────────────────────────── */
function StackPage({ onBack, onPrevious, onNext }: { onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Stack</h1>
        <p>A stack remembers <strong>what still needs attention</strong>. Last one in is first one out — like a stack of plates. Perfect for tracking open tasks in reverse order.</p>
      </header>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is a Stack?</h2>
        <p className="big-o-chart-sub">A stack follows <strong>LIFO</strong> (Last In, First Out). You push items on top and pop them off in reverse order. It is the go-to pattern when you need to <strong>match or resolve things in reverse order</strong>.</p>
        <pre className="big-o-inline-code"><CodePanel code={`const stack = [];

stack.push('a');  // ['a']
stack.push('b');  // ['a', 'b']
stack.push('c');  // ['a', 'b', 'c']

stack.pop();  // returns 'c'  → ['a', 'b']
stack.pop();  // returns 'b'  → ['a']`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> a stack remembers what still needs completion. When you see a closing delimiter, the most recent opener is the one that must match — that is exactly what a stack gives you.</p>
      </section>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two ways to use a stack</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Matching (LIFO pairs)</h4>
            <pre className="big-o-inline-code"><CodePanel code={`'([{}])'
( → push   stack: ['(']
[ → push   stack: ['(', '[']
{ → push   stack: ['(', '[', '{']
} → pop {  stack: ['(', '['] ✓
] → pop [  stack: ['(']      ✓
) → pop (  stack: []          ✓`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Push openers, pop and match closers. Empty stack at the end = valid.</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Monotonic (next greater/smaller)</h4>
            <pre className="big-o-inline-code"><CodePanel code={`[2, 1, 3, 4]
2 ⊣ wait   stack: [2]
1 ⊣ wait   stack: [2, 1]
3 arrives → pop 1, pop 2
4 arrives → pop 3`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Maintain a decreasing (or increasing) stack. When a new element breaks the trend, resolve everything it beats. O(n) total.</p>
          </div>
        </div>
      </section>
      <ScenarioSection scenarioId="valid-parens" />
      <ScenarioSection scenarioId="next-greater" />
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of a Stack?</h2>
        <ol className="big-o-checklist">
          <li>You need to <strong>match open/close pairs</strong> — brackets, tags, quotes</li>
          <li>You need <strong>next greater / next smaller</strong> efficiently</li>
          <li>Processing must happen in <strong>reverse order</strong> (LIFO)</li>
          <li>You need to <strong>track unfinished work</strong> — like undo history or backtracking</li>
          <li>You see keywords like &ldquo;balanced,&rdquo; &ldquo;parentheses,&rdquo; &ldquo;next greater,&rdquo; &ldquo;monotonic&rdquo;</li>
        </ol>
        <p className="big-o-chart-note">⚠️ A stack adds O(n) space. If the problem can be solved with a counter (like simple single-type bracket validation), prefer O(1) space over O(n).</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div>
          <span className="eyebrow">End of Stack</span>
          <strong>Review or move on?</strong>
        </div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Fast &amp; Slow</button>
          <button className="next-lesson-button" onClick={onNext}>Merge / Intervals →</button>
        </div>
      </nav>
    </>
  )
}



/* ── MergeIntervalsPage ────────────────────────── */
function MergeIntervalsPage({ onBack, onPrevious, onNext }: { onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Merge / Intervals</h1>
        <p>When intervals overlap, you can <strong>combine them into one</strong>. Sort by start time first — then one pass merges everything. Without sorting, overlapping intervals could be anywhere.</p>
      </header>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is Merge / Intervals?</h2>
        <p className="big-o-chart-sub">Intervals are just pairs of numbers: a start and an end. When two intervals share any time range, they overlap — and you can merge them by taking the min start and max end.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Without sorting — check every pair (O(n^2)):
for (let i = 0; i < intervals.length; i++) {
  for (let j = i + 1; j < intervals.length; j++) {
    if (intervals[i] overlaps intervals[j]) merge;
  }
}

// With sorting — one linear pass (O(n log n)):
intervals.sort((a, b) => a[0] - b[0]);
const merged = [intervals[0]];
for (const curr of intervals) {
  if (curr[0] <= last.end) last.end = max(last.end, curr.end);
  else merged.push(curr);
}`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> sorting by start time guarantees that any overlapping intervals are <strong>adjacent</strong>. You only ever need to compare with the last merged interval — never look backward.</p>
      </section>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two approaches</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Merge all overlapping</h4>
            <pre className="big-o-inline-code"><CodePanel code={`[[1,3],[2,6],[8,10]]
sort: [[1,3],[2,6],[8,10]]
[1,3] → seed
[2,6] → overlaps → [1,6]
[8,10] → no overlap → push
Result: [[1,6],[8,10]]`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Sort first, then one pass. Overlap check: curr[0] ≤ prev[1]. On overlap, prev[1] = max(prev[1], curr[1]).</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Insert and merge</h4>
            <pre className="big-o-inline-code"><CodePanel code={`Insert [2,5] into [[1,3],[6,9]]
Phase 1: before — none
Phase 2: merge [1,3] → [1,5]
Phase 3: after — [6,9]
Result: [[1,5],[6,9]]`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Three phases when the list is already sorted: copy before overlap, merge during, copy after. O(n) — no full sort needed.</p>
          </div>
        </div>
      </section>
      <ScenarioSection scenarioId="merge-overlapping" />
      <ScenarioSection scenarioId="insert-interval" />
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Merge / Intervals?</h2>
        <ol className="big-o-checklist">
          <li>Input is <strong>pairs of numbers</strong> representing ranges (time, coordinates, etc.)</li>
          <li>You need to <strong>combine overlapping ranges</strong> into a cleaner list</li>
          <li>You need to <strong>count gaps, overlaps, or non-overlapping regions</strong></li>
          <li>Sorting makes the problem <strong>linear</strong> — overlap check becomes O(1) per interval</li>
          <li>Keywords: "merge intervals," "overlapping," "insert range," "meeting rooms"</li>
        </ol>
        <p className="big-o-chart-note">⚠️ If intervals are <strong>not</strong> sortable (e.g., they have identity that cannot be reordered), consider a different approach like line sweep with a TreeMap.</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div><span className="eyebrow">End of Merge / Intervals</span><strong>Review or move on?</strong></div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Stack</button>
          <button className="next-lesson-button" onClick={onNext}>Prefix Sum →</button>
        </div>
      </nav>
    </>
  )
}

/* ── PrefixSumPage ─────────────────────────────── */
function PrefixSumPage({ onBack, onPrevious, onNext }: { onBack: () => void; onPrevious: () => void; onNext: () => void }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Prefix Sum</h1>
        <p>Precompute running totals <strong>once</strong>, then answer any range query in <strong>O(1)</strong>. Instead of re-summing every time, a single subtraction gives the answer.</p>
      </header>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What is Prefix Sum?</h2>
        <p className="big-o-chart-sub">A prefix sum array stores the cumulative total up to each index. Once built, any range sum is just <strong>one subtraction</strong> — no loops, no re-computation.</p>
        <pre className="big-o-inline-code"><CodePanel code={`nums:    [3, 1, 4, 1, 5, 9]
prefix: [0, 3, 4, 8, 9, 14, 23]  ← one extra at start
         ↑ zero makes range math clean

// Range sum query: sum(nums[1..4])
// = prefix[5] - prefix[1]
// = 14 - 3 = 11   ✓  O(1)!`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> prefix[r+1] - prefix[l] gives the sum of nums[l..r] because prefix[i] stores the sum of nums[0..i-1]. The leading zero avoids special-casing ranges that start at index 0.</p>
      </section>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two classic uses</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Range sum queries</h4>
            <pre className="big-o-inline-code"><CodePanel code={`Build: O(n) once
Query: O(1) each
After 1,000,000 queries:
  Without prefix: 1M × n steps
  With prefix: 1M × 1 step`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">When queries outnumber builds, prefix sums save enormous time. Build once, answer forever in O(1).</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Pivot / equilibrium</h4>
            <pre className="big-o-inline-code"><CodePanel code={`[1, 7, 3, 6, 5, 6]
total = 28
At index 3: leftSum = 11
rightSum = 28 - 11 - 6 = 11 ✓
Pivot found!`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Track leftSum as you scan. At each index, rightSum = total - leftSum - nums[i]. No need to recompute the right side.</p>
          </div>
        </div>
      </section>
      <ScenarioSection scenarioId="range-sum" />
      <ScenarioSection scenarioId="pivot-index" />
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Prefix Sum?</h2>
        <ol className="big-o-checklist">
          <li>You need to answer <strong>many range sum queries</strong> on static data</li>
          <li>Looking for <strong>subarray sums or equilibrium points</strong></li>
          <li>You can <strong>precompute once, query many times</strong></li>
          <li>Keywords: "subarray sum," "range sum," "pivot index," "equilibrium"</li>
        </ol>
        <p className="big-o-chart-note">⚠️ Prefix sums need <strong>static data</strong>. If the array changes between queries, use a Fenwick tree (Binary Indexed Tree) instead — O(log n) updates and queries.</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div><span className="eyebrow">End of Prefix Sum</span><strong>Review or move on?</strong></div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Merge / Intervals</button>
          <button className="next-lesson-button" onClick={onNext}>Sorting Strategies →</button>
        </div>
      </nav>
    </>
  )
}

/* ── SortingStrategiesPage ──────────────────────── */
function SortingStrategiesPage({ onBack, onPrevious }: { onBack: () => void; onPrevious: () => void }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Sorting Strategies</h1>
        <p>Sorting is not just for finding elements — it is a <strong>meta-strategy</strong> that unlocks other patterns. Sort first, then use two-pointers, binary search, or sweeping to finish in one pass.</p>
      </header>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">What are Sorting Strategies?</h2>
        <p className="big-o-chart-sub">Sorting rearranges data to make <strong>adjacency</strong> meaningful. Once sorted, duplicates are grouped, ranges line up, and you can use techniques that require ordered data — like two-pointers or binary search.</p>
        <pre className="big-o-inline-code"><CodePanel code={`// Without sorting — 3Sum takes O(n^3):
for (i..n) for (j..n) for (k..n) check sum

// Sort + two-pointer — 3Sum takes O(n^2):
nums.sort();
for (i..n)  // anchor
  twoPointer(i+1, end, target=-nums[i])

// Sort + sweep — overlap check in O(n log n):
intervals.sort(by start);
for (i=1..n) if overlaps(i, i-1) return false;`} showLineNumbers={false} /></pre>
        <p className="big-o-chart-note">💡 <strong>The key insight:</strong> the O(n log n) sorting cost buys you a huge simplification. After sorting, problems that required nested loops often collapse to a single linear scan.</p>
      </section>
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Two common patterns</h2>
        <div className="big-o-compare">
          <div className="big-o-compare-card">
            <h4>Sort + two-pointer</h4>
            <pre className="big-o-inline-code"><CodePanel code={`3Sum: [-4,-1,-1,0,1,2]
Anchor: -4 → find pair sum = 4
        l=-1, r=2 → -1+2 = 1 ✗
        ... l and r converge
Anchor: -1 → find pair sum = 1
        l=-1, r=2 → -1+2 = 1 ✓
Triplet: [-1, -1, 2]`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">For each anchor, run two-pointers on the remainder. O(n²) instead of O(n³).</p>
          </div>
          <div className="big-o-compare-card">
            <h4>Sort + sweep</h4>
            <pre className="big-o-inline-code"><CodePanel code={`Meetings: [[0,30],[5,10],[15,20]]
Sort by start: same order
Check adjacent:
  [0,30] vs [5,10] → conflict!
Return false`} showLineNumbers={false} /></pre>
            <p className="big-o-chart-note">Sort by one dimension, then scan adjacent pairs. Any conflict must be adjacent after sorting.</p>
          </div>
        </div>
      </section>
      <ScenarioSection scenarioId="three-sum" />
      <ScenarioSection scenarioId="meeting-rooms" />
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">When should I think of Sorting Strategies?</h2>
        <ol className="big-o-checklist">
          <li>Brute force is <strong>O(n²) or O(n³)</strong> — sorting may drop a dimension</li>
          <li>The problem involves <strong>pairs, triplets, or ranges</strong> where order matters</li>
          <li>You need to <strong>find, count, or check</strong> — not modify the original data</li>
          <li>Duplicates need to be <strong>grouped or skipped</strong></li>
          <li>Keywords: "sort and then," "after sorting," "sorted array," "pair sum"</li>
        </ol>
        <p className="big-o-chart-note">⚠️ Sorting costs O(n log n). If a solution exists in O(n) without sorting (like hash map for two-sum), prefer the faster approach. Sorting strategies shine when O(n log n) is better than O(n²).</p>
      </section>
      <nav className="lesson-end-nav" aria-label="Pattern navigation">
        <div><span className="eyebrow">End of Sorting Strategies</span><strong>Review or move on?</strong></div>
        <div className="lesson-end-actions">
          <button onClick={onPrevious}>← Prefix Sum</button>
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

/* ── Zod Learn Index ───────────────────────────── */
function ZodLearnIndex({ onOpen }: { onOpen: (lesson: ZodLesson) => void }) {
  return (
    <>
      <header className="page-head">
        <span className="eyebrow">Review Zod</span>
        <h1>Runtime validation,<br />API contracts, and testing.</h1>
        <p>Zod keeps your types alive at runtime. Learn to validate API responses, form inputs, config files, and test fixtures — with clear, composable schemas. Includes real Playwright and API testing patterns.</p>
      </header>
      <section className="path-heading">
        <div>
          <span className="eyebrow">Reference path</span>
          <h2>Zod fundamentals &amp; testing</h2>
        </div>
        <span>{zodLessons.length} detailed lessons</span>
      </section>
      <ol className="learning-path">
        {zodLessons.map((lesson) => (
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

/* ── Zod Lesson Page ────────────────────────────── */
function ZodLessonPage({
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
  lesson: ZodLesson
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
  const hasNext = lesson.order < zodLessons.length

  useEffect(() => { window.scrollTo(0, 0) }, [lesson.order])

  return (
    <>
      <header className="lesson-head">
        <div>
          <span className="eyebrow">Zod Lesson {lesson.order} of {zodLessons.length} · {lesson.block}</span>
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
      <Editor title="lesson.zod.ts" code={code} onCode={onCode} onRun={onRun} output={output} error={error} />
      {lesson.exercises.length > 0 && (
        <section className="ts-exercises-section">
          <h2 className="scenario-section-title">Exercises</h2>
          <div className="ts-exercises-grid">
            {lesson.exercises.map((exercise, index) => (
              <ZodExerciseCard key={index} exercise={exercise} index={index} />
            ))}
          </div>
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
    </>
  )
}

/* ── Zod Exercise Card ──────────────────────────── */
function ZodExerciseCard({ exercise, index }: { exercise: ZodExercise; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  return (
    <div className="ts-exercise-card">
      <div className="ts-exercise-header">
        <span className="ts-exercise-badge">{index + 1}</span>
        <span>{exercise.question}</span>
      </div>

      {exercise.kind === 'convert-js-ts' && (
        <>
          <div className="ts-ex-label">Without Zod</div>
          <pre className="ts-exercise-code"><CodeBlock text={exercise.jsCode} /></pre>
          {!revealed ? (
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal Zod version</button>
          ) : (
            <>
              <div className="ts-ex-label">With Zod</div>
              <pre className="ts-exercise-code"><CodeBlock text={exercise.tsCode} /></pre>
            </>
          )}
        </>
      )}

      {exercise.kind === 'fix-type' && (
        <>
          <div className="ts-ex-label">Broken schema <span className="ts-error-desc">{exercise.errorDescription}</span></div>
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
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal answer</button>
          ) : (
            <div className="ts-ex-answer">{exercise.answer}</div>
          )}
        </>
      )}

      {exercise.kind === 'model-it' && (
        <>
          <div className="ts-ex-label">Data shape</div>
          <pre className="ts-exercise-code"><CodeBlock text={exercise.data} /></pre>
          {!revealed ? (
            <button className="ts-reveal-btn" onClick={() => setRevealed(true)}>Reveal schema</button>
          ) : (
            <>
              <div className="ts-ex-label">Zod schema</div>
              <pre className="ts-exercise-code ts-ex-fixed"><CodeBlock text={exercise.interface} /></pre>
            </>
          )}
        </>
      )}

      {exercise.kind === 'choose-best' && (
        <div className="ts-exercise-options">
          {(exercise.options).map((opt, i) => {
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

      {(exercise.kind === 'fill-blank') && (() => {
        const blanks = exercise.blanks
        const el = <div className="ts-fill-blank">
          <pre className="ts-exercise-code"><CodeBlock text={exercise.code} /></pre>
          <div className="ts-blank-hints">
            {blanks.map((b, i) => <span key={i} className="ts-blank-chip">{b.label}: {b.answer}</span>)}
          </div>
        </div>
        return (
          <>
            {el}
            <div className="ts-ex-label" style={{ color: '#858585', marginTop: 'var(--space-sm)' }}>
              {exercise.explanation}
            </div>
          </>
        )
      })()}

      {revealed && exercise.explanation && exercise.kind !== 'fill-blank' && (
        <div className="ts-ex-explanation">{exercise.explanation}</div>
      )}
    </div>
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
            {section.table && (
              <table className="lesson-table">
                <thead>
                  <tr>{section.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
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
            {section.table && (
              <table className="lesson-table">
                <thead>
                  <tr>{section.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
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
