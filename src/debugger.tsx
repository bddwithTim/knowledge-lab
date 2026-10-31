import { useRef, useEffect, useState, type ReactNode } from 'react'

// Syntax highlighting helpers (shared with App.tsx)
const CODE_KW = new Set([
  'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'true', 'false', 'null', 'undefined', 'typeof', 'Math', 'console', 'log',
])
const SK = '#569cd6', SS = '#ce9178', SC = '#6a9955', SN = '#b5cea8', SF = '#dcdcaa'

function hlLine(line: string) {
  const cm = line.indexOf('//')
  if (cm >= 0) return <>{hlTokens(line.slice(0, cm))}<span style={{ color: SC }}>{line.slice(cm)}</span></>
  return hlTokens(line)
}

function hlTokens(text: string): ReactNode {
  const re = /('[^']*'|"[^"]*")|(\b[A-Za-z_]\w*\b)|(\d+(\.\d+)?)|([^A-Za-z0-9_'"]+)/g
  const nodes: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    const full = m[0], str = m[1], word = m[2], num = m[3]
    if (str) nodes.push(<span key={i++} style={{ color: SS }}>{full}</span>)
    else if (word && CODE_KW.has(word)) nodes.push(<span key={i++} style={{ color: SK }}>{full}</span>)
    else if (word) nodes.push(<span key={i++} style={{ color: /^\s*\(/.test(text.slice(m.index + full.length)) ? SF : 'inherit' }}>{full}</span>)
    else if (num) nodes.push(<span key={i++} style={{ color: SN }}>{full}</span>)
    else nodes.push(<span key={i++}>{full}</span>)
  }
  return <>{nodes}</>
}

export type StepDebuggerProps = {
  code: string
  steps: {
    currentLine: number
    variables: Record<string, unknown>
    description: string
  }[]
  currentStep: number
  onStep: (step: number) => void
}

export function StepDebugger({ code, steps, currentStep, onStep }: StepDebuggerProps) {
  const codeRef = useRef<HTMLPreElement>(null)
  const prevVarsRef = useRef<Record<string, unknown>>({})
  const [changedVars, setChangedVars] = useState<Set<string>>(new Set())
  const step = steps[currentStep]

  const hasPrev = currentStep > 0
  const hasNext = currentStep < steps.length - 1

  function goToStep(index: number) {
    if (index >= 0 && index < steps.length) {
      onStep(index)
    }
  }

  /* Detect changed variables — highlight persists until next step */
  useEffect(() => {
    const prev = prevVarsRef.current
    const changed = new Set<string>()

    for (const [name, value] of Object.entries(step.variables)) {
      const prevValue = prev[name]
      if (prevValue !== undefined && JSON.stringify(prevValue) !== JSON.stringify(value)) {
        changed.add(name)
      }
    }

    prevVarsRef.current = { ...step.variables }
    setChangedVars(changed)
  }, [currentStep, step.variables])

  /* Scroll current line into view */
  useEffect(() => {
    if (!codeRef.current) return
    const lineEl = codeRef.current.querySelector(`[data-line="${step.currentLine}"]`)
    if (lineEl) {
      lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [step.currentLine])

  const codeLines = code.split('\n')

  return (
    <div className="step-debugger">
      <div className="step-debugger-header">
        <strong>
          Step {currentStep + 1} of {steps.length}
        </strong>
        <div className="step-debugger-controls">
          <button disabled={!hasPrev} onClick={() => goToStep(currentStep - 1)}>
            ← Back
          </button>
          <button disabled={currentStep === 0} onClick={() => goToStep(0)}>
            ↺ Reset
          </button>
          <button disabled={!hasNext} onClick={() => goToStep(currentStep + 1)}>
            Next →
          </button>
        </div>
      </div>
      <p className="step-debugger-step-info">{step.description}</p>
      <div className="step-debugger-vars">
        {Object.entries(step.variables).map(([name, value]) => (
          <div
            className={`step-debugger-var${changedVars.has(name) ? ' changed' : ''}`}
            key={name}
          >
            <strong>{name}</strong> = {JSON.stringify(value)}
          </div>
        ))}
      </div>
      <pre ref={codeRef} className="step-debugger-code" style={{
        background: '#1e1e1e',
        border: '1px solid #2d2d2d',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-md)',
        overflow: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '1.7',
        color: '#d4d4d4',
        maxHeight: '320px',
        whiteSpace: 'pre',
        tabSize: 2,
        margin: 'var(--space-sm) 0 0',
      }}>
        {codeLines.map((line, i) => (
          <div
            key={i}
            data-line={i}
            style={{
              background: i === step.currentLine ? 'var(--accent-bg)' : 'transparent',
              borderLeft: i === step.currentLine ? '2px solid var(--accent)' : '2px solid transparent',
              paddingLeft: i === step.currentLine ? 'var(--space-sm)' : 'calc(var(--space-sm) + 2px)',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: '24px',
              color: 'var(--text-muted)',
              textAlign: 'right',
              marginRight: 'var(--space-md)',
              userSelect: 'none',
            }}>
              {i + 1}
            </span>
            {i === step.currentLine && (
              <span style={{ color: 'var(--accent)', marginRight: 'var(--space-sm)', userSelect: 'none' }}>▶</span>
            )}
            {i !== step.currentLine && (
              <span style={{ display: 'inline-block', width: 'calc(1em + var(--space-sm))' }} />
            )}
            <span style={{
              color: i === step.currentLine ? 'var(--text-primary)' : 'var(--text-code)',
            }}>
              {hlLine(line)}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}
