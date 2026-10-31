import { useRef, useEffect, useState } from 'react'
import { CodePanel } from './components/CodePanel'

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
      <CodePanel
        code={code}
        currentLine={step.currentLine}
        maxHeight="320px"
        ref={codeRef}
      />
    </div>
  )
}
