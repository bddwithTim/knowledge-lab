/* Pure utility functions — no React dependencies */

import type { Challenge } from './content'

export const modLabel = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform) ? '⌘' : 'Ctrl'

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
  // Strip import lines — they cannot run in new Function()
  let cleaned = source.replace(/^import\s+.*$/gm, '')

  // Inject a lightweight Zod stub so z.object(), z.string(), etc. work
  const zodStub = `
const z = (() => {
  const fail = (msg) => { throw new Error(msg) }
  const chain = (type, methods = {}) => {
    const base = {
      parse: (v) => { if (typeof v === type || (type === 'any')) return v; fail('Expected ' + type + ', got ' + typeof v) },
      safeParse: (v) => ({ success: typeof v === type || type === 'any', data: v, error: typeof v === type || type === 'any' ? undefined : { issues: [{ message: 'Expected ' + type + ', got ' + typeof v }] } }),
      optional: () => chain(type, { ...methods, optional: true }),
      nullable: () => chain(type, { ...methods, nullable: true }),
      nullish: () => chain(type, { ...methods, nullish: true }),
      default: (d) => chain(type, { ...methods, default: d }),
      refine: () => chain(type),
      transform: () => chain(type),
      brand: () => chain(type),
      pipe: () => chain(type),
      describe: () => chain(type),
      min: () => chain(type),
      max: () => chain(type),
      positive: () => chain(type),
      int: () => chain(type),
      email: () => chain(type),
      url: () => chain(type),
      regex: () => chain(type),
      startsWith: () => chain(type),
      trim: () => chain(type),
      toLowerCase: () => chain(type),
      catch: (d) => chain(type, { ...methods, catch: d }),
      ...methods
    }
    return base
  }
  const coerce = { number: () => chain('number'), string: () => chain('string'), boolean: () => chain('boolean'), date: () => chain('string') }
  return {
    string: () => chain('string'),
    number: () => chain('number'),
    boolean: () => chain('boolean'),
    object: (shape) => ({
      parse: (v) => { if (typeof v !== 'object' || v === null) fail('Expected object'); return v },
      safeParse: (v) => (typeof v === 'object' && v !== null ? { success: true, data: v } : { success: false, error: { issues: [{ message: 'Expected object' }] } }),
      extend: (ext) => chain('any'),
      merge: (other) => chain('any'),
      pick: () => chain('any'),
      omit: () => chain('any'),
      partial: () => chain('any'),
      required: () => chain('any'),
      passthrough: () => chain('any'),
      strict: () => chain('any'),
    }),
    array: (schema) => ({
      parse: (v) => { if (!Array.isArray(v)) fail('Expected array'); return v },
      safeParse: (v) => (Array.isArray(v) ? { success: true, data: v } : { success: false, error: { issues: [{ message: 'Expected array' }] } }),
    }),
    union: (schemas) => chain('any'),
    enum: (vals) => ({
      parse: (v) => { if (!vals.includes(v)) fail('Expected one of: ' + vals.join(', ')); return v },
      safeParse: (v) => (vals.includes(v) ? { success: true, data: v } : { success: false, error: { issues: [{ message: 'Expected one of: ' + vals.join(', ') }] } }),
    }),
    literal: (val) => ({
      parse: (v) => { if (v !== val) fail('Expected ' + val); return v },
      safeParse: (v) => (v === val ? { success: true, data: v } : { success: false, error: { issues: [{ message: 'Expected ' + val }] } }),
    }),
    discriminatedUnion: (key, schemas) => chain('any'),
    tuple: (schemas) => chain('any'),
    record: (k, v) => chain('any'),
    lazy: (fn) => chain('any'),
    nativeEnum: (e) => chain('any'),
    coerce,
    infer: null,
  }
})()`

  cleaned = zodStub + '\n' + cleaned

  const r1 = executeExample(cleaned)
  if (!r1.error) return r1

  const stripped = cleaned
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

export function runAssertions(source: string, challenge: Challenge): { label: string; passed: boolean; actual?: unknown; error?: string }[] {
  try {
    const candidate = new Function(`${source}\nreturn typeof ${challenge.functionName} === 'function' ? ${challenge.functionName} : undefined`)()
    if (!candidate) return challenge.cases.map((item) => ({ label: item.label, passed: false, error: `Define ${challenge.functionName} as a function.` }))
    return challenge.cases.map((item) => {
      try {
        const actual = candidate(...item.args)
        return { label: item.label, passed: JSON.stringify(actual) === JSON.stringify(item.expected), actual }
      } catch (error) {
        return { label: item.label, passed: false, error: error instanceof Error ? error.message : 'This assertion could not run.' }
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'This code could not run.'
    return challenge.cases.map((item) => ({ label: item.label, passed: false, error: message }))
  }
}
