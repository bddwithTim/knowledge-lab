import { CodePanel } from './CodePanel'

export function CodeBlock({ text }: { text: string }) {
  return <CodePanel code={text} showLineNumbers={false} />
}
