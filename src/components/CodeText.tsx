import type { ReactNode } from 'react'

export function CodeText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  const nodes: ReactNode[] = []
  for (const [pi, part] of parts.entries()) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(<strong key={`b${pi}`}>{part.slice(2, -2)}</strong>)
    } else if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(<code key={`c${pi}`}>{part.slice(1, -1)}</code>)
    } else {
      nodes.push(<span key={`t${pi}`}>{part}</span>)
    }
  }
  return <>{nodes}</>
}
