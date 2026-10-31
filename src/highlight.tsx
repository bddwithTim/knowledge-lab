import { type ReactNode } from 'react'

const CODE_WORDS = new Set([
  'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'true', 'false', 'null', 'undefined', 'typeof', 'Math', 'console', 'log',
  'interface', 'type', 'extends', 'keyof', 'infer', 'as', 'is', 'never',
  'unknown', 'any', 'string', 'number', 'boolean', 'void', 'readonly',
  'switch', 'case', 'default', 'break', 'new', 'class', 'implements',
  'arr', 'left', 'right', 'slow', 'fast', 'i', 'j', 'k', 'mid', 'lo', 'hi',
  'n', 'm', 'sum', 'total', 'max', 'min', 'maxSum', 'windowSum',
  'windowStart', 'windowEnd', 'target', 'result', 'height', 'area', 'ops',
  'found', 'push', 'pop', 'map', 'filter', 'reduce', 'slice', 'splice',
])

export const SK = '#569cd6'
export const SS = '#ce9178'
export const SC = '#6a9955'
export const SN = '#b5cea8'
export const SF = '#dcdcaa'

export function highlightLine(line: string): ReactNode {
  const cm = line.indexOf('//')
  if (cm >= 0) return <>{highlightTokens(line.slice(0, cm))}<span style={{ color: SC }}>{line.slice(cm)}</span></>
  return highlightTokens(line)
}

function highlightTokens(text: string): ReactNode {
  const re = /('[^']*'|"[^"]*")|(\b[A-Za-z_]\w*\b)|(\d+(\.\d+)?)|([^A-Za-z0-9_'"]+)/g
  const nodes: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text)) !== null) {
    const full = m[0], str = m[1], word = m[2], num = m[3]
    if (str) {
      nodes.push(<span key={i++} style={{ color: SS }}>{full}</span>)
    } else if (word && CODE_WORDS.has(word)) {
      nodes.push(<span key={i++} style={{ color: SK }}>{full}</span>)
    } else if (word) {
      const after = text.slice(m.index + full.length)
      nodes.push(<span key={i++} style={{ color: /^\s*\(/.test(after) ? SF : 'inherit' }}>{full}</span>)
    } else if (num) {
      nodes.push(<span key={i++} style={{ color: SN }}>{full}</span>)
    } else {
      nodes.push(<span key={i++}>{full}</span>)
    }
  }
  return <>{nodes}</>
}
