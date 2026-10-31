import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'

type OutputFlash = 'idle' | 'success' | 'error'

const modLabel = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform) ? '⌘' : 'Ctrl'

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>
}

/* ── Dark theme for CodeMirror ─────────────────────── */
const darkTheme = EditorView.theme(
  {
    '&': { backgroundColor: '#0a1424', color: '#e0eaf8' },
    '.cm-content': { caretColor: '#84ebba', fontFamily: "'DM Mono', monospace", fontSize: '13px', lineHeight: '1.75' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#84ebba' },
    '.cm-gutters': { backgroundColor: '#0a1424', color: '#5c7796', border: 'none', borderRight: '1px solid #1e3350' },
    '.cm-activeLineGutter': { backgroundColor: '#0f1c30', color: '#8ba3c2' },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 8px' },
    '.cm-foldPlaceholder': { backgroundColor: '#0f1c30', color: '#7d93af', borderColor: '#28415d' },
    '.cm-tooltip': { backgroundColor: '#0f1c30', color: '#e0eaf8', border: '1px solid #28415d' },
    '.cm-tooltip-autocomplete .cm-completionIcon': { opacity: '0.6' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: '#1a3555' },
    '.cm-matchingBracket': { backgroundColor: '#1e3d2e', outline: '1px solid #3e7a5c' },
    '&.cm-focused .cm-matchingBracket': { backgroundColor: '#1e3d2e', outline: '1px solid #84ebba' },
    '.cm-activeLine': { backgroundColor: 'transparent' },
  },
  { dark: true },
)

/* ── Syntax highlighting overrides ─────────────────── */
const syntaxOverrides = EditorView.theme({
  '.cm-comment': { color: '#5a705e', fontStyle: 'italic' },
  '.cm-keyword': { color: '#9bb8f7' },
  '.cm-string': { color: '#b9e8b0' },
  '.cm-number': { color: '#f2c594' },
  '.cm-def': { color: '#d4c5f7' },
  '.cm-operator': { color: '#a0b8d8' },
  '.cm-variableName': { color: '#e0eaf8' },
  '.cm-typeName': { color: '#f2c594' },
  '.cm-propertyName': { color: '#c8daf5' },
  '.cm-bool': { color: '#f2c594' },
  '.cm-function': { color: '#d4c5f7' },
  '.cm-regexp': { color: '#f28b82' },
  '.cm-meta': { color: '#a0b8d8' },
  '.cm-atom': { color: '#f2c594' },
  '.cm-attributeName': { color: '#9bb8f7' },
  '.cm-tagName': { color: '#9bb8f7' },
  '.cm-bracket': { color: '#a0b8d8' },
  '.cm-separator': { color: '#a0b8d8' },
  '.cm-punctuation': { color: '#a0b8d8' },
}, { dark: true })

export type EditorProps = {
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
  /* Step debugger support */
  debugHighlights?: number[] /* line numbers (0-based) to highlight in the gutter */
  debugCurrentLine?: number | null /* 0-based line to show an arrow on */
}

export function Editor({
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
  debugHighlights,
  debugCurrentLine,
}: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onCodeRef = useRef(onCode)
  const outputRef = useRef<HTMLDivElement>(null)
  const [flash, setFlash] = useState<OutputFlash>('idle')
  const [hasRun, setHasRun] = useState(false)

  onCodeRef.current = onCode
  const isEmpty = output.length === 0 && !error
  const runStatus = !hasRun ? 'Ready to run' : error ? 'Execution failed' : 'Ran just now'

  /* Create editor */
  useEffect(() => {
    if (!containerRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newCode = update.state.doc.toString()
        onCodeRef.current(newCode)
      }
    })

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        autocompletion(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        history(),
        javascript(),
        darkTheme,
        syntaxOverrides,
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          ...lintKeymap,
          {
            key: 'Mod-Enter',
            run: () => {
              onRun()
              return true
            },
          },
        ]),
        updateListener,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    /* Only mount once */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Sync external code changes into editor */
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (code !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: code },
      })
    }
  }, [code])

  /* Apply debug highlights */
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const effects: any[] = []

    /* Clear previous gutter markers (simple approach: re-dispatch with empty) */
    /* We handle this via CSS class on the container instead */

    view.dispatch({ effects })
  }, [debugHighlights, debugCurrentLine])

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

  return (
    <section className="editor">
      <div className="editor-bar">
        <span>
          <i />
          {title}
        </span>
        <span>JavaScript</span>
      </div>
      <div ref={containerRef} className="cm-wrapper" />
      <div className="editor-footer">
        <div className="editor-meta">
          <span>{code.split('\n').length} lines</span>
          <span className={`run-status${hasRun ? ' has-run' : ''}${error ? ' has-error' : ''}`} aria-live="polite">
            {runStatus}
          </span>
        </div>
        <div className="editor-footer-actions">
          {onPrevious && (
            <button className="nav-button" onClick={onPrevious} title={`Previous lesson (${modLabel} Shift ←)`}>
              ← Prev
            </button>
          )}
          {onNext && (
            <button
              className={`nav-button${hasRun && !error ? ' is-ready' : ''}`}
              onClick={onNext}
              title={nextLabel ? `Next: ${nextLabel} (${modLabel} Shift →)` : `Next lesson (${modLabel} Shift →)`}
            >
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
            <p className="output-placeholder">
              Press Run code (<Kbd>{modLabel} Enter</Kbd>) to see output here.
            </p>
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
