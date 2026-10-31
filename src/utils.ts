/* Pure utility functions — no React dependencies */

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

export function display(value: unknown): string {
  const json = JSON.stringify(value, null, 2)
  return json === undefined ? String(value) : json
}

/* Run TS code by trying as-is first, stripping types on syntax error */
export function runTS(source: string) {
  const r1 = executeExample(source)
  if (!r1.error) return r1

  const stripped = source
    .replace(/^\s*(interface|type)\s+\w+\s*(=\s*)?\{[\s\S]*?\n?\}/gm, '')
    .replace(/^\s*type\s+\w+\s*=\s*.+$/gm, '')
    .replace(/<[A-Za-z_][\w,\s]*>(?=\s*\()/g, '')
    .replace(/\breadonly\s+/g, '')
    .replace(/\bas\s+const\b/g, '')
    .replace(/\b(let|const|var)\s+(\w+)\s*:\s*(?:[A-Za-z_][\w<>\[\]|&\s]*|['"][\w\s|&'"\[\]]*['"])\s*(?=\s*=)/g, '$1 $2')
    .replace(/(\w+)\s*\?:\s*[A-Za-z_][\w<>\[\]|&\s]*(?=\s*[,)])/g, '$1')
    .replace(/(\w+)\s*:\s*[A-Za-z_][\w<>\[\]|&\s]*(?=\s*[,)])/g, '$1')
    .replace(/\)\s*:\s*[A-Za-z_][\w<>\[\]|&\s]*(?=\s*\{)/g, ')')
    .replace(/:\s*\w+\s+is\s+\w+(?=\s*[=;{])/g, '')
  return executeExample(stripped)
}

export function executeExample(source: string) {
  const output: string[] = []
  try {
    new Function('console', source)({ log: (...values: unknown[]) => output.push(values.map(display).join(' ')) })
    return { output, error: '' }
  } catch (error) {
    return { output, error: error instanceof Error ? error.message : 'This code could not run.' }
  }
}
