import { forwardRef } from 'react'
import { highlightLine } from '../highlight'

type CodePanelProps = {
  code: string
  /** 0-based line to highlight with accent background + ▶ arrow */
  currentLine?: number
  /** Show line numbers (default true) */
  showLineNumbers?: boolean
  /** Optional max-height with scroll */
  maxHeight?: string
  className?: string
}

export const CodePanel = forwardRef<HTMLPreElement, CodePanelProps>(function CodePanel(
  { code, currentLine, showLineNumbers = true, maxHeight, className }, ref
) {
  const lines = code.split('\n')

  return (
    <pre
      ref={ref}
      className={className}
      style={{
        background: '#1e1e1e',
        border: '1px solid #2d2d2d',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-md)',
        overflow: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '1.7',
        color: '#d4d4d4',
        maxHeight,
        whiteSpace: 'pre',
        tabSize: 2,
      }}
    >
      {lines.map((line, i) => {
        const isCurrent = currentLine !== undefined && i + 1 === currentLine
        return (
          <div
            key={i}
            data-line={i + 1}
            style={{
              background: isCurrent ? 'var(--accent-bg)' : 'transparent',
              borderLeft: isCurrent ? '2px solid var(--accent)' : '2px solid transparent',
              paddingLeft: isCurrent ? 'var(--space-sm)' : 'calc(var(--space-sm) + 2px)',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
          >
            {showLineNumbers && (
              <span style={{
                display: 'inline-block',
                width: '28px',
                color: '#858585',
                textAlign: 'right',
                marginRight: 'var(--space-md)',
                userSelect: 'none',
              }}>
                {i + 1}
              </span>
            )}
            {isCurrent && (
              <span style={{ color: 'var(--accent)', marginRight: 'var(--space-sm)', userSelect: 'none' }}>▶</span>
            )}
            {!isCurrent && showLineNumbers && (
              <span style={{ display: 'inline-block', width: 'calc(1em + var(--space-sm))' }} />
            )}
            <span style={{ color: isCurrent ? '#e0e0e0' : '#d4d4d4' }}>
              {highlightLine(line)}
            </span>
          </div>
        )
      })}
    </pre>
  )
})
