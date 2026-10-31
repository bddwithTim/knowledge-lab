import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { challenges, lessons, type Challenge, type Kyu, type Lesson, type Topic } from './content'
import { tsLessons, type TSLesson, type TSExercise } from './ts-content'
import { Editor } from './editor'
import { StepDebugger } from './debugger'
import { scenarios, type ScenarioId } from './algorithm-scenarios'
import { BookOpen, CaretLeft, Code, Flask, Graph, List } from '@phosphor-icons/react'
import { readStorage, writeStorage, display, runTS, executeExample, modLabel, runAssertions } from './utils'
import { Kbd } from './components/Kbd'

type View = 'learn' | 'practice' | 'lesson' | 'challenge' | 'big-o' | 'patterns' | 'pattern-detail' | 'ts-learn' | 'ts-lesson'
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
            <button className={`nav-link ${view === 'patterns' || view === 'pattern-detail' ? 'active' : ''}`} onClick={() => navigateTo('patterns')}>
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
            <button className={`nav-link ${view === 'patterns' || view === 'pattern-detail' ? 'active' : ''}`} onClick={() => navigateTo('patterns')} title="Algorithm Patterns">
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
        {view === 'patterns' && <PatternsOverview onSelectPattern={() => navigateTo('pattern-detail')} />}
        {view === 'pattern-detail' && <PatternDetailPage onBack={() => navigateTo('patterns')} onOpenChallenge={(c) => navigateTo('challenge', undefined, undefined, c)} />}
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

  // Scroll to top when page mounts
  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    function onScroll() { setShowBackTop(window.scrollY > 400) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bigOIds: ScenarioId[] = ['big-o-1', 'big-o-n', 'big-o-n2', 'big-o-logn']

  return (
    <>
      <header className="algorithm-head">
        <span className="eyebrow">Foundation</span>
        <h1>Big O Notation</h1>
        <p>Big O describes how an algorithm <strong>slows down</strong> as the input grows. It\'s not about seconds — it\'s about <strong>growth rate</strong>. The chart below compares the four most common complexity classes side by side.</p>
      </header>

      {/* Growth curve comparison chart */}
      <section className="big-o-chart-section">
        <h2 className="big-o-chart-title">Growth rate comparison</h2>
        <p className="big-o-chart-sub">X-axis = input size (n) · Y-axis = number of operations</p>
        <BigOGrowthChart />
        <p className="big-o-chart-note">
          O(1) is flat — input size doesn\'t matter. O(n) grows steadily. O(n²) explodes. O(log n) barely budges even for huge inputs.
        </p>
      </section>

      {bigOIds.map((id) => (
        <ScenarioSection key={id} scenarioId={id} />
      ))}

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
      <polyline points={on2Points} fill="none" stroke="#f28b82" strokeWidth="3" />
      {/* Legend */}
      <rect x={pad.left + plotW - 145} y={pad.top + 2} width={140} height={62} rx={6} fill="var(--bg-inset)" opacity="0.85" />
      <line x1={pad.left + plotW - 135} y1={pad.top + 16} x2={pad.left + plotW - 115} y2={pad.top + 16} stroke="#f28b82" strokeWidth="3" />
      <text x={pad.left + plotW - 110} y={pad.top + 20} fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">O(n²)</text>
      <line x1={pad.left + plotW - 135} y1={pad.top + 34} x2={pad.left + plotW - 115} y2={pad.top + 34} stroke="var(--kyu-6-text)" strokeWidth="2.5" />
      <text x={pad.left + plotW - 110} y={pad.top + 38} fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">O(n)</text>
      <line x1={pad.left + plotW - 135} y1={pad.top + 52} x2={pad.left + plotW - 115} y2={pad.top + 52} stroke="#5bb8f0" strokeWidth="3" />
      <text x={pad.left + plotW - 110} y={pad.top + 56} fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)">O(log n)</text>
    </svg>
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
import { CodePanel } from './components/CodePanel'

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
  { id: 'two-pointer', label: 'Two Pointers', tags: ['6 scenarios', 'O(n)'], active: true },
  { id: 'hash-map', label: 'Hash Map / Frequency', tags: ['Four sum', 'Anagrams', 'First unique', 'O(n)'], active: false },
  { id: 'fast-slow', label: 'Fast & Slow Pointers', tags: ['Cycle detection', 'O(n)'], active: false },
  { id: 'merge-interval', label: 'Merge / Interval', tags: ['Overlapping intervals', 'O(n log n)'], active: false },
  { id: 'prefix-sum', label: 'Prefix Sum', tags: ['Running sum', 'Subarray = K', 'O(n)'], active: false },
  { id: 'binary-search', label: 'Binary Search', tags: ['Sorted array', 'O(log n)'], active: false },
]

function PatternsOverview({ onSelectPattern }: { onSelectPattern: () => void }) {
  return (
    <>
      <header className="algorithm-head patterns-head">
        <span className="eyebrow">Patterns</span>
        <h1>Algorithm Patterns</h1>
        <p>Proven strategies that solve entire classes of problems. Click Two Pointers to explore — the rest are coming soon.</p>
      </header>
      <section className="patterns-grid-section">
        {patternEntries.map((p) =>
          p.active ? (
            <button key={p.id} className="when-to-use-card" onClick={onSelectPattern} style={{ cursor: 'pointer' }}>
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
        )}
      </section>
    </>
  )
}

/* ── PatternDetailPage: scrollable inline scenarios for a pattern ── */
function PatternDetailPage({ onBack, onOpenChallenge }: { onBack: () => void; onOpenChallenge: (c: Challenge) => void }) {
  const twoPointerIds: ScenarioId[] = ['pair-sum', 'palindrome', 'remove-duplicates', 'container-water', 'merge-sorted', 'sliding-window']

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <header className="algorithm-head">
        <button className="back-link" onClick={onBack}>← Back to patterns</button>
        <span className="eyebrow">Algorithm Pattern</span>
        <h1>Two Pointers</h1>
        <p>Two pointers traverse data from different positions — opposite ends, same direction, or one fast and one slow. Each variant solves a different class of problems with O(n) efficiency.</p>
      </header>
      {twoPointerIds.map((id) => (
        <ScenarioSection key={id} scenarioId={id} />
      ))}
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


