import { useRef, useEffect, useState } from 'react'

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
        background: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-md)',
        overflow: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '1.7',
        color: 'var(--text-secondary)',
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
              color: i === step.currentLine ? 'var(--text-primary)' : 'var(--text-muted)',
            }}>
              {line}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}
