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
    '&': { backgroundColor: '#1e1e1e', color: '#d4d4d4' },
    '.cm-content': { caretColor: '#569cd6', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.7' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#569cd6' },
    '.cm-gutters': { backgroundColor: '#1e1e1e', color: '#858585', border: 'none', borderRight: '1px solid #2d2d2d' },
    '.cm-activeLineGutter': { backgroundColor: '#252525', color: '#cccccc' },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 16px 0 8px' },
    '.cm-foldPlaceholder': { backgroundColor: '#252525', color: '#858585', borderColor: '#2d2d2d' },
    '.cm-tooltip': { backgroundColor: '#252525', color: '#d4d4d4', border: '1px solid #3d3d3d' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: '#264f78' },
    '.cm-matchingBracket': { backgroundColor: '#3a3d41', outline: '1px solid #666' },
    '&.cm-focused .cm-matchingBracket': { backgroundColor: '#3a3d41', outline: '1px solid #888' },
    '.cm-activeLine': { backgroundColor: 'transparent' },
  },
  { dark: true },
)

/* ── Syntax highlighting — VSCode Dark Modern ──────── */
const syntaxOverrides = EditorView.theme({
  '.cm-comment': { color: '#6a9955', fontStyle: 'italic' },
  '.cm-keyword': { color: '#569cd6' },
  '.cm-string': { color: '#ce9178' },
  '.cm-number': { color: '#b5cea8' },
  '.cm-def': { color: '#dcdcaa' },
  '.cm-operator': { color: '#d4d4d4' },
  '.cm-variableName': { color: '#d4d4d4' },
  '.cm-typeName': { color: '#4ec9b0' },
  '.cm-propertyName': { color: '#9cdcfe' },
  '.cm-bool': { color: '#569cd6' },
  '.cm-function': { color: '#dcdcaa' },
  '.cm-regexp': { color: '#d16969' },
  '.cm-meta': { color: '#d4d4d4' },
  '.cm-atom': { color: '#569cd6' },
  '.cm-attributeName': { color: '#9cdcfe' },
  '.cm-tagName': { color: '#569cd6' },
  '.cm-bracket': { color: '#d4d4d4' },
  '.cm-separator': { color: '#d4d4d4' },
  '.cm-punctuation': { color: '#d4d4d4' },
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
        <span>{title}</span>
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
