import { useState } from 'react'
import { CodeText } from './CodeText'

export function CollapsibleBreakdown({ breakdown, jsConcepts }: { breakdown: string[]; jsConcepts: string[] }) {
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
          <div className="breakdown-mental">
            <span className="breakdown-section-label">Mental model</span>
            <CodeText text={mental} />
          </div>
          <div className="breakdown-phases">
            <span className="breakdown-section-label">How it works</span>
            <ol className="breakdown-phase-list">
              {phases.map((phase, i) => (
                <li key={i}><CodeText text={phase} /></li>
              ))}
            </ol>
          </div>
          <div className="breakdown-insight">
            <span className="breakdown-section-label">Key insight</span>
            <CodeText text={insight} />
          </div>
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
