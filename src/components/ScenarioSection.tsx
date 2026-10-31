import { useState } from 'react'
import { scenarios, type ScenarioId } from '../algorithm-scenarios'
import { StepDebugger } from '../debugger'
import { WaterLayer } from './WaterLayer'
import { CollapsibleBreakdown } from './CollapsibleBreakdown'

export function ScenarioSection({ scenarioId }: { scenarioId: ScenarioId }) {
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
          ) : scenario.visualType === 'interval-timeline' ? (
            <div className="interval-timeline">
              {step.intervals!.map(([start, end], i) => {
                const maxEnd = Math.max(...step.intervals!.map(([, e]) => e))
                const total = maxEnd || 1
                const leftPct = (start / total) * 100
                const widthPct = ((end - start) / total) * 100
                const isCurrent = step.current === i
                const isMerged = step.leftIndex !== undefined && step.leftIndex >= 0 && step.rightIndex === 0 && i <= step.leftIndex && step.intervals![i] !== undefined
                const isConflict = step.conflict && isCurrent && step.leftIndex === 0
                return (
                  <div className={`interval-row${isCurrent ? ' is-current' : ''}`} key={i}>
                    <span className="interval-label">[{start},{end}]</span>
                    <div className="interval-track">
                      <div
                        className={`interval-bar${isCurrent ? ' is-current' : ''}${isConflict ? ' is-conflict' : ''}${isMerged ? ' is-merged' : ''}`}
                        style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }}
                      >
                        {isCurrent && !isConflict && <span className="interval-curr-marker">curr</span>}
                        {isConflict && <span className="interval-conflict-marker">!</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : scenario.visualType === 'prefix-array' ? (
            <div className="prefix-array-viz">
              <div className="prefix-row">
                <span className="prefix-row-label">nums</span>
                {step.items.map((item, index) => {
                  const isCurrent = index === step.leftIndex
                  const inQuery = step.queryStart !== undefined && step.queryEnd !== undefined && index >= step.queryStart && index <= step.queryEnd
                  return (
                    <div className={`prefix-cell${isCurrent ? ' is-current' : ''}${inQuery ? ' is-query' : ''}`} key={index}>
                      <strong>{item}</strong><small>{index}</small>
                    </div>
                  )
                })}
              </div>
              {step.prefix && step.prefix.length > 0 && (
                <div className="prefix-row">
                  <span className="prefix-row-label">prefix</span>
                  {step.prefix.map((val, index) => {
                    const isLast = index === step.prefix!.length - 1
                    const isQueryBoundary = step.queryStart !== undefined && (index === step.queryStart || index === step.queryEnd! + 1)
                    return (
                      <div className={`prefix-cell prefix-val${isLast ? ' is-last' : ''}${isQueryBoundary ? ' is-query-boundary' : ''}`} key={index}>
                        <strong>{val}</strong><small>{index}</small>
                      </div>
                    )
                  })}
                </div>
              )}
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
