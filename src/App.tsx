import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { challenges, lessons, type Challenge, type Kyu, type Lesson, type Topic } from './content'

type View = 'learn' | 'practice' | 'lesson' | 'challenge' | 'algorithms'
type WorkspaceMode = 'read' | 'split' | 'code'
type Result = { label: string; passed: boolean; actual?: unknown; error?: string }
type OutputFlash = 'idle' | 'success' | 'error'

const topics: Array<Topic | 'All topics'> = ['All topics', 'Fundamentals', 'Strings', 'Arrays', 'Objects']
const levels: Array<Kyu | 'All levels'> = ['All levels', '8 kyu', '7 kyu', '6 kyu', '5 kyu']
const SIDEBAR_KEY = 'knowledge-lab-sidebar-collapsed'
const SPLIT_KEY = 'knowledge-lab-reading-width'
const WORKSPACE_MODE_KEY = 'knowledge-lab-workspace-mode'
const modLabel = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform) ? '⌘' : 'Ctrl'

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

function display(value: unknown): string {
  const json = JSON.stringify(value, null, 2)
  return json === undefined ? String(value) : json
}

function executeExample(source: string) {
  const output: string[] = []
  try {
    new Function('console', source)({ log: (...values: unknown[]) => output.push(values.map(display).join(' ')) })
    return { output, error: '' }
  } catch (error) {
    return { output, error: error instanceof Error ? error.message : 'This code could not run.' }
  }
}

function runAssertions(source: string, challenge: Challenge): Result[] {
  try {
    const candidate = new Function(`${source}\nreturn typeof ${challenge.functionName} === 'function' ? ${challenge.functionName} : undefined`)()
    if (!candidate) return challenge.cases.map((item) => ({ label: item.label, passed: false, error: `Define ${challenge.functionName} as a function.` }))
    return challenge.cases.map((item) => {
      try {
        const actual = candidate(...item.args)
        return { label: item.label, passed: JSON.stringify(actual) === JSON.stringify(item.expected), actual }
      } catch (error) {
        return { label: item.label, passed: false, error: error instanceof Error ? error.message : 'This assertion could not run.' }
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'This code could not run.'
    return challenge.cases.map((item) => ({ label: item.label, passed: false, error: message }))
  }
}

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>
}

export function App() {
  const [view, setView] = useState<View>('learn')
  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0])
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(challenges[0])
  const [code, setCode] = useState(lessons[0].starterCode)
  const [output, setOutput] = useState<string[]>([])
  const [error, setError] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [showHint, setShowHint] = useState(false)
  const [topic, setTopic] = useState<Topic | 'All topics'>('All topics')
  const [level, setLevel] = useState<Kyu | 'All levels'>('All levels')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStorage(SIDEBAR_KEY) === 'true')
  const [readingWidth, setReadingWidth] = useState(() => {
    const saved = Number(readStorage(SPLIT_KEY))
    return Number.isFinite(saved) && saved >= 25 && saved <= 65 ? saved : 48
  })
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    const saved = readStorage(WORKSPACE_MODE_KEY)
    return saved === 'split' || saved === 'code' || saved === 'read' ? saved : 'read'
  })

  const runLessonRef = useRef<() => void>(() => {})
  const runChallengeRef = useRef<() => void>(() => {})
  const nextLessonRef = useRef<() => void>(() => {})
  const prevLessonRef = useRef<() => void>(() => {})

  const availableChallenges = useMemo(() => challenges.filter((item) => (topic === 'All topics' || item.topic === topic) && (level === 'All levels' || item.kyu === level)), [topic, level])

  function openLesson(lesson: Lesson) {
    setActiveLesson(lesson)
    setCode(lesson.starterCode)
    setOutput([])
    setError('')
    setSidebarCollapsed(true)
    writeStorage(SIDEBAR_KEY, 'true')
    setView('lesson')
  }

  function changeWorkspaceMode(mode: WorkspaceMode) {
    setWorkspaceMode(mode)
    writeStorage(WORKSPACE_MODE_KEY, mode)
  }

  function openChallenge(challenge: Challenge) {
    setActiveChallenge(challenge)
    setCode(challenge.starterCode)
    setResults([])
    setShowHint(false)
    setView('challenge')
  }

  const runLessonCode = useCallback(() => {
    const next = executeExample(code)
    setOutput(next.output)
    setError(next.error)
  }, [code])

  const testSolution = useCallback(() => {
    setResults(runAssertions(code, activeChallenge))
  }, [code, activeChallenge])

  const goNextLesson = useCallback(() => {
    const next = lessons.find((item) => item.order === activeLesson.order + 1)
    if (next) openLesson(next)
  }, [activeLesson.order])

  const goPrevLesson = useCallback(() => {
    const previous = lessons.find((item) => item.order === activeLesson.order - 1)
    if (previous) openLesson(previous)
  }, [activeLesson.order])

  runLessonRef.current = runLessonCode
  runChallengeRef.current = testSolution
  nextLessonRef.current = goNextLesson
  prevLessonRef.current = goPrevLesson

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
        if (view === 'lesson') {
          event.preventDefault()
          runLessonRef.current()
        }
        if (view === 'challenge') {
          event.preventDefault()
          runChallengeRef.current()
        }
      }

      if (event.shiftKey && event.key === 'ArrowRight' && view === 'lesson') {
        event.preventDefault()
        nextLessonRef.current()
      }

      if (event.shiftKey && event.key === 'ArrowLeft' && view === 'lesson') {
        event.preventDefault()
        prevLessonRef.current()
      }

      if (event.key === 'e' && view !== 'learn' && view !== 'practice') {
        event.preventDefault()
        document.querySelector<HTMLTextAreaElement>('[aria-label="Code editor"]')?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view])

  return (
    <main className={`shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <button className="brand" onClick={() => setView('learn')} title="Back to lessons">
            <span>⌁</span>
            {!sidebarCollapsed && 'knowledge lab'}
          </button>
          <button className={`sidebar-toggle${sidebarCollapsed ? ' menu-toggle' : ''}`} onClick={toggleSidebar} title={`${sidebarCollapsed ? 'Open menu' : 'Collapse menu'} (${modLabel} B)`} aria-label={sidebarCollapsed ? 'Open menu' : 'Collapse menu'}>
            {sidebarCollapsed ? '☰' : '‹'}
          </button>
        </div>
        {!sidebarCollapsed && (
          <>
            <p className="nav-label">Explore</p>
            <button className={`nav-link ${view === 'learn' || view === 'lesson' ? 'active' : ''}`} onClick={() => setView('learn')}>
              <span>◫</span>Learn
            </button>
            <button className={`nav-link ${view === 'practice' || view === 'challenge' ? 'active' : ''}`} onClick={() => setView('practice')}>
              <span>⌘</span>Practice
            </button>
            <button className={`nav-link ${view === 'algorithms' ? 'active' : ''}`} onClick={() => setView('algorithms')}>
              <span>◌</span>Algorithms
            </button>
            <div className="sidebar-note">
              <span>Personal reviewer</span>
              <strong>Review any lesson or challenge whenever you need it.</strong>
            </div>
          </>
        )}
        {sidebarCollapsed && (
          <div className="sidebar-icons">
            <button className={`nav-link ${view === 'learn' || view === 'lesson' ? 'active' : ''}`} onClick={() => setView('learn')} title="Learn">
              <span>◫</span>
            </button>
            <button className={`nav-link ${view === 'practice' || view === 'challenge' ? 'active' : ''}`} onClick={() => setView('practice')} title="Practice">
              <span>⌘</span>
            </button>
            <button className={`nav-link ${view === 'algorithms' ? 'active' : ''}`} onClick={() => setView('algorithms')} title="Algorithms">
              <span>◌</span>
            </button>
          </div>
        )}
      </aside>
      <section className="main-content">
        {view === 'learn' && <LearnIndex onOpen={openLesson} />}
        {view === 'practice' && (
          <PracticeIndex
            challenges={availableChallenges}
            topic={topic}
            level={level}
            onTopic={setTopic}
            onLevel={setLevel}
            onOpen={openChallenge}
          />
        )}
        {view === 'algorithms' && <AlgorithmsPage />}
        {view === 'lesson' && (
          <LessonPage
            lesson={activeLesson}
            code={code}
            output={output}
            error={error}
            readingWidth={readingWidth}
            workspaceMode={workspaceMode}
            onCode={setCode}
            onRun={runLessonCode}
            onNext={goNextLesson}
            onPrevious={goPrevLesson}
            onHome={() => setView('learn')}
            onResize={setReadingWidth}
            onResizeEnd={(width) => writeStorage(SPLIT_KEY, String(width))}
            onWorkspaceMode={changeWorkspaceMode}
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
          />
        )}
      </section>
    </main>
  )
}

function useMemo<T>(factory: () => T, deps: unknown[]): T {
  const ref = useRef<{ deps: unknown[]; value: T } | undefined>(undefined)
  if (!ref.current || deps.some((dep, index) => dep !== ref.current!.deps[index])) {
    ref.current = { deps, value: factory() }
  }
  return ref.current.value
}

const twoPointerSteps = [
  { left: 0, right: 5, sum: 12, action: '12 is too large — move the right pointer left.' },
  { left: 0, right: 4, sum: 9, action: '9 is too small — move the left pointer right.' },
  { left: 1, right: 4, sum: 11, action: '11 is too large — move the right pointer left.' },
  { left: 1, right: 3, sum: 9, action: '9 is too small — move the left pointer right.' },
  { left: 2, right: 3, sum: 10, action: '10 matches the target — the pair is found.', found: true },
]

const twoSumChallenge: Challenge = {
  id: 'two-sum-sorted',
  kyu: '6 kyu',
  topic: 'Arrays',
  title: 'Two Sum on a sorted array',
  description: 'Return the indexes of two values in a sorted array that add up to target. Return an empty array when no pair exists.',
  functionName: 'twoSumSorted',
  starterCode: 'function twoSumSorted(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n\n    // Write your pointer movement here.\n  }\n\n  return [];\n}',
  cases: [
    { label: 'finds a middle pair', args: [[1, 3, 4, 6, 8, 11], 10], expected: [2, 3] },
    { label: 'finds the outer pair', args: [[1, 2, 4, 9], 10], expected: [0, 3] },
    { label: 'returns empty when no pair exists', args: [[1, 3, 5], 8], expected: [] },
  ],
  hint: 'Because the array is sorted, a sum that is too small can only improve by moving left right. A sum that is too large can only improve by moving right left.',
}

function AlgorithmsPage() {
  const numbers = [1, 3, 4, 6, 8, 11]
  const target = 10
  const [stepIndex, setStepIndex] = useState(0)
  const [code, setCode] = useState(twoSumChallenge.starterCode)
  const [results, setResults] = useState<Result[]>([])
  const [showHint, setShowHint] = useState(false)
  const step = twoPointerSteps[stepIndex]
  const allPassed = results.length > 0 && results.every((result) => result.passed)

  return (
    <>
      <header className="algorithm-head">
        <span className="eyebrow">Algorithms · Arrays</span>
        <h1>Two pointers,<br />one clear path.</h1>
        <p>Two pointers use the sorted order of an array to discard impossible pairs instead of testing every combination.</p>
      </header>

      <section className="algorithm-visual" aria-labelledby="two-pointer-flow">
        <div className="algorithm-visual-head">
          <div>
            <span className="eyebrow">Visual flow</span>
            <h2 id="two-pointer-flow">Find two values that equal {target}</h2>
          </div>
          <div className="complexity">
            <span>Time <strong>O(n)</strong></span>
            <span>Extra space <strong>O(1)</strong></span>
          </div>
        </div>
        <div className="pointer-track" aria-label={`Step ${stepIndex + 1} of ${twoPointerSteps.length}: ${step.action}`}>
          {numbers.map((number, index) => (
            <div className={`number-cell${index === step.left ? ' is-left' : ''}${index === step.right ? ' is-right' : ''}${step.found && (index === step.left || index === step.right) ? ' is-match' : ''}`} key={number}>
              <span className="pointer-label">{index === step.left ? 'L' : index === step.right ? 'R' : ''}</span>
              <strong>{number}</strong>
              <small>{index}</small>
            </div>
          ))}
        </div>
        <div className="step-status" aria-live="polite">
          <strong>{numbers[step.left]} + {numbers[step.right]} = {step.sum}</strong>
          <span>{step.action}</span>
        </div>
        <div className="step-controls">
          <button onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>← Back</button>
          <span>Step {stepIndex + 1} / {twoPointerSteps.length}</span>
          <button className="step-next" onClick={() => setStepIndex((current) => Math.min(twoPointerSteps.length - 1, current + 1))} disabled={stepIndex === twoPointerSteps.length - 1}>Next step →</button>
        </div>
      </section>

      <section className="algorithm-breakdown">
        <div>
          <span className="eyebrow">Why it works</span>
          <h2>Sorted order gives every move meaning.</h2>
          <p>When the sum is too large, moving the right pointer left is the only move that can lower it. When the sum is too small, moving the left pointer right is the only move that can raise it.</p>
        </div>
        <div className="complexity-compare">
          <span>Check every pair</span><strong>O(n²)</strong>
          <span>Move two pointers</span><strong>O(n)</strong>
        </div>
      </section>

      <section className="algorithm-practice">
        <div className="algorithm-practice-head">
          <div>
            <span className="eyebrow">Coding exercise · 6 kyu</span>
            <h2>Write the two-pointer solution</h2>
            <p>{twoSumChallenge.description}</p>
          </div>
          <button className="hint-button" onClick={() => setShowHint((current) => !current)}>{showHint ? 'Hide hint' : 'Need a hint?'}</button>
        </div>
        {showHint && <p className="algorithm-hint">{twoSumChallenge.hint}</p>}
        <Editor title="two-sum.js" code={code} onCode={setCode} onRun={() => setResults(runAssertions(code, twoSumChallenge))} output={[]} error="" runLabel="Run assertions" showConsole={false} />
        <div className={`algorithm-results${results.length ? ' has-results' : ''}${allPassed ? ' all-passed' : ''}`} aria-live="polite">
          {results.length === 0 ? 'Run your solution to check the pointer logic.' : results.map((result) => (
            <p className={result.passed ? 'passed' : 'failed'} key={result.label}>{result.passed ? '✓' : '×'} {result.label}{result.passed ? '' : ` — ${result.error || `Expected ${display(twoSumChallenge.cases.find((test) => test.label === result.label)?.expected)}, received ${display(result.actual)}`}`}</p>
          ))}
        </div>
      </section>
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

function LessonPage({
  lesson,
  code,
  output,
  error,
  readingWidth,
  workspaceMode,
  onCode,
  onRun,
  onNext,
  onPrevious,
  onHome,
  onResize,
  onResizeEnd,
  onWorkspaceMode,
}: {
  lesson: Lesson
  code: string
  output: string[]
  error: string
  readingWidth: number
  workspaceMode: WorkspaceMode
  onCode: (code: string) => void
  onRun: () => void
  onNext: () => void
  onPrevious: () => void
  onHome: () => void
  onResize: (width: number) => void
  onResizeEnd: (width: number) => void
  onWorkspaceMode: (mode: WorkspaceMode) => void
}) {
  const layoutRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const hasPrevious = lesson.order > 1
  const hasNext = lesson.order < lessons.length
  const nextTitle = hasNext ? lessons[lesson.order].title : ''

  function startResize(event: ReactMouseEvent<HTMLDivElement>) {
    event.preventDefault()
    draggingRef.current = true
    document.body.classList.add('is-resizing')
  }

  function resizeWithKeyboard(event: ReactKeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 5 : 2
    let nextWidth: number | null = null

    if (event.key === 'ArrowLeft') nextWidth = readingWidth - step
    if (event.key === 'ArrowRight') nextWidth = readingWidth + step
    if (event.key === 'Home') nextWidth = 25
    if (event.key === 'End') nextWidth = 65
    if (nextWidth === null) return

    event.preventDefault()
    const boundedWidth = Math.min(65, Math.max(25, nextWidth))
    onResize(boundedWidth)
    onResizeEnd(boundedWidth)
  }

  useEffect(() => {
    function onMove(event: MouseEvent) {
      if (!draggingRef.current || !layoutRef.current) return
      const rect = layoutRef.current.getBoundingClientRect()
      const next = ((event.clientX - rect.left) / rect.width) * 100
      onResize(Math.min(65, Math.max(25, next)))
    }

    function onUp() {
      if (!draggingRef.current) return
      draggingRef.current = false
      document.body.classList.remove('is-resizing')
      if (layoutRef.current) {
        const rect = layoutRef.current.getBoundingClientRect()
        const width = ((event as MouseEvent).clientX - rect.left) / rect.width * 100
        onResizeEnd(Math.min(65, Math.max(25, width)))
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.classList.remove('is-resizing')
    }
  }, [onResize, onResizeEnd])

  return (
    <>
      <header className="lesson-head">
        <div>
          <span className="eyebrow">
            Lesson {lesson.order} of {lessons.length} · {lesson.topic}
          </span>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </div>
        <div className="workspace-switcher" aria-label="Lesson workspace mode">
          {(['read', 'split', 'code'] as WorkspaceMode[]).map((mode) => (
            <button
              className={workspaceMode === mode ? 'active' : ''}
              key={mode}
              onClick={() => onWorkspaceMode(mode)}
              aria-pressed={workspaceMode === mode}
              title={mode === 'read' ? 'Focus on the lesson explanation' : mode === 'split' ? 'Show explanation and editor together' : 'Focus on writing and running code'}
            >
              {mode === 'read' ? 'Read' : mode === 'split' ? 'Split' : 'Code'}
            </button>
          ))}
        </div>
      </header>
      <div
        ref={layoutRef}
        className={`lesson-layout mode-${workspaceMode}`}
        style={{ '--reading-width': `${readingWidth}%` } as CSSProperties}
      >
        {workspaceMode !== 'code' && (
          <article className="reading">
            {lesson.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.code && <pre className="code-sample">{section.code}</pre>}
              </section>
            ))}
            <nav className="lesson-end-nav" aria-label="Lesson navigation">
              <div>
                <span className="eyebrow">End of lesson</span>
                <strong>{hasNext ? 'Ready for the next concept?' : 'You reached the end of this path.'}</strong>
              </div>
              <div className="lesson-end-actions">
                {hasPrevious && <button onClick={onPrevious} title={`Previous lesson (${modLabel} Shift ←)`}>← Back</button>}
                <button onClick={onHome}>All lessons</button>
                {hasNext && <button className="next-lesson-button" onClick={onNext} title={`Next lesson (${modLabel} Shift →)`}>Next →</button>}
              </div>
            </nav>
          </article>
        )}
        {workspaceMode === 'split' && (
          <div
            className="split-divider"
            onMouseDown={startResize}
            onKeyDown={resizeWithKeyboard}
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Resize reading and editor panels"
            aria-valuemin={25}
            aria-valuemax={65}
            aria-valuenow={Math.round(readingWidth)}
            aria-valuetext={`Reading panel ${Math.round(readingWidth)} percent wide. Use left and right arrow keys to resize.`}
          />
        )}
        {workspaceMode !== 'read' && (
          <Editor
            title="lesson.js"
            code={code}
            onCode={onCode}
            onRun={onRun}
            output={output}
            error={error}
            runLabel="Run code"
            showConsole
            onPrevious={hasPrevious ? onPrevious : undefined}
            onNext={hasNext ? onNext : undefined}
            nextLabel={hasNext ? nextTitle : undefined}
          />
        )}
      </div>
    </>
  )
}

function ChallengePage({ challenge, code, results, showHint, onCode, onRun, onHint }: { challenge: Challenge; code: string; results: Result[]; showHint: boolean; onCode: (code: string) => void; onRun: () => void; onHint: () => void }) {
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
        <div>
          <span className="eyebrow">JavaScript · {challenge.topic}</span>
          <h1>{challenge.title}</h1>
          <p>{challenge.description}</p>
        </div>
        <span className={`kyu kyu-${challenge.kyu[0]}`}>{challenge.kyu}</span>
      </header>
      <div className="challenge-work">
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
                      <small>{item.error || `Expected ${display(challenge.cases.find((test) => test.label === item.label)?.expected)}, received ${display(item.actual)}`}</small>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

function Editor({
  title,
  code,
  onCode,
  onRun,
  output,
  error,
  runLabel = 'Run code',
  showConsole = true,
  onPrevious,
  onNext,
  nextLabel,
}: {
  title: string
  code: string
  onCode: (code: string) => void
  onRun: () => void
  output: string[]
  error: string
  runLabel?: string
  showConsole?: boolean
  onPrevious?: () => void
  onNext?: () => void
  nextLabel?: string
}) {
  const outputRef = useRef<HTMLDivElement>(null)
  const [flash, setFlash] = useState<OutputFlash>('idle')
  const [hasRun, setHasRun] = useState(false)
  const isEmpty = output.length === 0 && !error
  const runStatus = !hasRun ? 'Ready to run' : error ? 'Execution failed' : 'Ran just now'

  function handleRun() {
    onRun()
    setHasRun(true)
    setFlash('idle')
    requestAnimationFrame(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  useEffect(() => {
    if (!hasRun) return
    setFlash(error ? 'error' : 'success')
    const timer = window.setTimeout(() => setFlash('idle'), 700)
    return () => window.clearTimeout(timer)
  }, [output, error, hasRun])

  function handleEditorKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      handleRun()
    }
  }

  return (
    <section className="editor">
      <div className="editor-bar">
        <span>
          <i />
          {title}
        </span>
        <span>Editable</span>
      </div>
      <textarea value={code} onChange={(event) => onCode(event.target.value)} onKeyDown={handleEditorKeyDown} spellCheck={false} aria-label="Code editor" />
      <div className="editor-footer">
        <div className="editor-meta">
          <span>{code.split('\n').length} lines</span>
          <span className={`run-status${hasRun ? ' has-run' : ''}${error ? ' has-error' : ''}`} aria-live="polite">{runStatus}</span>
        </div>
        <div className="editor-footer-actions">
          {onPrevious && (
            <button className="nav-button" onClick={onPrevious} title={`Previous lesson (${modLabel} Shift ←)`}>
              ← Prev
            </button>
          )}
          {onNext && (
            <button className={`nav-button${hasRun && !error ? ' is-ready' : ''}`} onClick={onNext} title={nextLabel ? `Next: ${nextLabel} (${modLabel} Shift →)` : `Next lesson (${modLabel} Shift →)`}>
              {hasRun && !error ? 'Continue →' : 'Next →'}
            </button>
          )}
          <button className="run-button" onClick={handleRun} title={`${runLabel} (${modLabel} Enter)`}>
            ▶ {runLabel} <Kbd>{modLabel} ↵</Kbd>
          </button>
        </div>
      </div>
      {showConsole && (
        <div
          ref={outputRef}
          className={`output${isEmpty ? ' is-empty' : ''}${error ? ' has-error' : hasRun ? ' has-success' : ''}${flash === 'success' ? ' flash-success' : ''}${flash === 'error' ? ' flash-error' : ''}`}
        >
          <span>Console</span>
          {isEmpty ? (
            <p className="output-placeholder">Press Run code (<Kbd>{modLabel} Enter</Kbd>) to see output here.</p>
          ) : (
            <>
              {output.map((line, index) => (
                <pre key={`${line}-${index}`}>{line}</pre>
              ))}
              {error && <pre className="output-error">{error}</pre>}
            </>
          )}
        </div>
      )}
    </section>
  )
}
