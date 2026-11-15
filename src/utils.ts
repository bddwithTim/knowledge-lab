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

/* ── Console capture ──────────────────────────────── */

function makeConsole(push: (line: string) => void) {
  const capture = (...values: unknown[]) => push(values.map(display).join(' '))
  return { log: capture, info: capture, warn: capture, error: capture, debug: capture, table: capture, trace: capture, dir: capture }
}

/* ── Minimal Zod-compatible runtime ─────────────────
   Lessons demonstrate real validation failures, so the
   stub must actually validate instead of echoing input. */

type ZIssue = { path: (string | number)[]; message: string }

class ZodIssueError extends Error {
  issues: ZIssue[]
  constructor(issues: ZIssue[]) {
    super(issues.map((i) => (i.path.length ? `${i.message} at "${i.path.join('.')}"` : i.message)).join('; '))
    this.name = 'ZodError'
    this.issues = issues
  }
}

type ZCheck = (value: unknown, path: (string | number)[]) => unknown
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZSchema = Record<string, any> & { run: ZCheck; parse: (v: unknown) => unknown; safeParse: (v: unknown) => { success: boolean; data?: unknown; error?: ZodIssueError } }

function zReceived(v: unknown): string {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (v instanceof Date) return 'date'
  if (typeof v === 'number' && Number.isNaN(v)) return 'nan'
  return typeof v
}

function zFail(expected: string, v: unknown, path: (string | number)[]): never {
  throw new ZodIssueError([{ path, message: `Expected ${expected}, received ${zReceived(v)}` }])
}

function zIsObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function zSchema(check: ZCheck): ZSchema {
  const self: ZSchema = {
    run: (v, p = []) => check(v, p),
    parse: (v) => check(v, []),
    safeParse: (v) => {
      try {
        return { success: true, data: check(v, []) }
      } catch (e) {
        if (e instanceof ZodIssueError) return { success: false, error: e }
        throw e
      }
    },
  }
  const wrap = (next: ZCheck): ZSchema => {
    const s = zSchema(next)
    s._shape = self._shape
    return s
  }
  self.optional = () => wrap((v, p) => (v === undefined ? undefined : self.run(v, p)))
  self.nullable = () => wrap((v, p) => (v === null ? null : self.run(v, p)))
  self.nullish = () => wrap((v, p) => (v == null ? v : self.run(v, p)))
  self.default = (d: unknown) => wrap((v, p) => (v === undefined ? (typeof d === 'function' ? (d as () => unknown)() : d) : self.run(v, p)))
  self.catch = (d: unknown) => wrap((v, p) => { try { return self.run(v, p) } catch { return typeof d === 'function' ? (d as () => unknown)() : d } })
  self.refine = (fn: (v: unknown) => boolean, msg?: string | { message?: string }) =>
    wrap((v, p) => {
      const d = self.run(v, p)
      if (!fn(d)) throw new ZodIssueError([{ path: p, message: typeof msg === 'string' ? msg : msg?.message ?? 'Invalid input' }])
      return d
    })
  self.superRefine = (fn: (v: unknown, ctx: { addIssue: (i: { message: string; path?: (string | number)[] }) => void }) => void) =>
    wrap((v, p) => {
      const d = self.run(v, p)
      const extra: ZIssue[] = []
      fn(d, { addIssue: (i) => extra.push({ path: p.concat(i.path ?? []), message: i.message }) })
      if (extra.length) throw new ZodIssueError(extra)
      return d
    })
  self.transform = (fn: (v: unknown) => unknown) => wrap((v, p) => fn(self.run(v, p)))
  self.pipe = (next: ZSchema) => wrap((v, p) => next.run(self.run(v, p), p))
  self.or = (other: ZSchema) => zUnion([self, other])
  self.brand = () => self
  self.describe = () => self
  self.readonly = () => self
  const bound = (pred: (d: never) => boolean, label: string, msg?: string) =>
    wrap((v, p) => {
      const d = self.run(v, p)
      if (!pred(d as never)) throw new ZodIssueError([{ path: p, message: msg ?? `Expected ${label}` }])
      return d
    })
  const sizeOf = (d: unknown) => (typeof d === 'string' || Array.isArray(d) ? d.length : typeof d === 'number' ? d : NaN)
  self.min = (n: number, msg?: string) => bound((d) => sizeOf(d) >= n, `min ${n}`, msg)
  self.max = (n: number, msg?: string) => bound((d) => sizeOf(d) <= n, `max ${n}`, msg)
  self.length = (n: number, msg?: string) => bound((d) => sizeOf(d) === n, `length ${n}`, msg)
  self.nonempty = (msg?: string) => bound((d) => sizeOf(d) > 0, 'non-empty value', msg)
  self.gt = (n: number, msg?: string) => bound((d: number) => d > n, `> ${n}`, msg)
  self.gte = (n: number, msg?: string) => bound((d: number) => d >= n, `>= ${n}`, msg)
  self.lt = (n: number, msg?: string) => bound((d: number) => d < n, `< ${n}`, msg)
  self.lte = (n: number, msg?: string) => bound((d: number) => d <= n, `<= ${n}`, msg)
  self.positive = (msg?: string) => bound((d: number) => d > 0, 'positive number', msg)
  self.nonnegative = (msg?: string) => bound((d: number) => d >= 0, 'non-negative number', msg)
  self.negative = (msg?: string) => bound((d: number) => d < 0, 'negative number', msg)
  self.int = (msg?: string) => bound((d: number) => Number.isInteger(d), 'integer', msg)
  self.finite = (msg?: string) => bound((d: number) => Number.isFinite(d), 'finite number', msg)
  self.multipleOf = (n: number, msg?: string) => bound((d: number) => d % n === 0, `multiple of ${n}`, msg)
  self.email = (msg?: string) => bound((d: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d), 'valid email', msg)
  self.url = (msg?: string) => bound((d: string) => { try { new URL(d); return true } catch { return false } }, 'valid URL', msg)
  self.uuid = (msg?: string) => bound((d: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d), 'valid UUID', msg)
  self.datetime = (msg?: string) => bound((d: string) => !Number.isNaN(Date.parse(d)), 'valid datetime', msg)
  self.regex = (re: RegExp, msg?: string) => bound((d: string) => re.test(d), msg ?? `match ${re}`, msg)
  self.startsWith = (s: string, msg?: string) => bound((d: string) => d.startsWith(s), `start with "${s}"`, msg)
  self.endsWith = (s: string, msg?: string) => bound((d: string) => d.endsWith(s), `end with "${s}"`, msg)
  self.includes = (s: string, msg?: string) => bound((d: string) => d.includes(s), `include "${s}"`, msg)
  self.trim = () => wrap((v, p) => { const d = self.run(v, p); return typeof d === 'string' ? d.trim() : d })
  self.toLowerCase = () => wrap((v, p) => { const d = self.run(v, p); return typeof d === 'string' ? d.toLowerCase() : d })
  self.toUpperCase = () => wrap((v, p) => { const d = self.run(v, p); return typeof d === 'string' ? d.toUpperCase() : d })
  return self
}

function zObjectSchema(shape: Record<string, ZSchema>): ZSchema {
  const self = zSchema((v, p) => {
    if (!zIsObj(v)) zFail('object', v, p)
    const out: Record<string, unknown> = {}
    const issues: ZIssue[] = []
    for (const [k, s] of Object.entries(shape)) {
      try {
        const r = s.run(v[k], p.concat(k))
        if (r !== undefined || k in v) out[k] = r
      } catch (e) {
        if (e instanceof ZodIssueError) {
          issues.push(...(v[k] === undefined ? [{ path: p.concat(k), message: 'Required' }] : e.issues))
        } else throw e
      }
    }
    if (self._mode === 'strict') {
      for (const k of Object.keys(v)) {
        if (!(k in shape)) issues.push({ path: p.concat(k), message: 'Unrecognized key' })
      }
    }
    if (issues.length) throw new ZodIssueError(issues)
    return self._mode === 'passthrough' ? { ...v, ...out } : out
  })
  self._shape = shape
  self._mode = 'strip'
  self.shape = shape
  self.passthrough = () => { self._mode = 'passthrough'; return self }
  self.strict = () => { self._mode = 'strict'; return self }
  self.catchall = () => self
  self.extend = (adj: Record<string, ZSchema>) => zObjectSchema({ ...shape, ...adj })
  self.merge = (other: ZSchema) => zObjectSchema({ ...shape, ...(other._shape ?? {}) })
  self.pick = (keys: Record<string, true>) => zObjectSchema(Object.fromEntries(Object.entries(shape).filter(([k]) => keys[k])))
  self.omit = (keys: Record<string, true>) => zObjectSchema(Object.fromEntries(Object.entries(shape).filter(([k]) => !keys[k])))
  self.partial = (keys?: Record<string, true>) => zObjectSchema(Object.fromEntries(Object.entries(shape).map(([k, s]) => [k, !keys || keys[k] ? s.optional() : s])))
  self.required = () => self
  self.keyof = () => zEnumOf(Object.keys(shape))
  return self
}

function zEnumOf(vals: unknown[]): ZSchema {
  const self = zSchema((v, p) => (vals.includes(v) ? v : zFail(vals.map((x) => JSON.stringify(x)).join(' | '), v, p)))
  self.options = vals
  return self
}

function zUnion(options: ZSchema[]): ZSchema {
  const self = zSchema((v, p) => {
    for (const o of options) {
      try { return o.run(v, p) } catch (e) { if (!(e instanceof ZodIssueError)) throw e }
    }
    throw new ZodIssueError([{ path: p, message: 'No union variant matched' }])
  })
  self.options = options
  return self
}

function makeZod() {
  const Z: Record<string, unknown> = {}
  const prim = (test: (v: unknown) => boolean, expected: string) => () => zSchema((v, p) => (test(v) ? v : zFail(expected, v, p)))
  Z.string = prim((v) => typeof v === 'string', 'string')
  Z.number = prim((v) => typeof v === 'number' && !Number.isNaN(v), 'number')
  Z.boolean = prim((v) => typeof v === 'boolean', 'boolean')
  Z.bigint = prim((v) => typeof v === 'bigint', 'bigint')
  Z.symbol = prim((v) => typeof v === 'symbol', 'symbol')
  Z.function = prim((v) => typeof v === 'function', 'function')
  Z.date = prim((v) => v instanceof Date && !Number.isNaN(v.getTime()), 'Date')
  Z.undefined = prim((v) => v === undefined, 'undefined')
  Z.null = prim((v) => v === null, 'null')
  Z.any = () => zSchema((v) => v)
  Z.unknown = Z.any
  Z.never = () => zSchema((v, p) => zFail('never', v, p))
  Z.nan = () => zSchema((v, p) => (typeof v === 'number' && Number.isNaN(v) ? v : zFail('nan', v, p)))
  Z.void = Z.undefined
  Z.literal = (val: unknown) => {
    const s = zSchema((v, p) => (v === val ? v : zFail(JSON.stringify(val), v, p)))
    s._literal = val
    s.value = val
    return s
  }
  Z.enum = (vals: unknown[]) => zEnumOf(vals)
  Z.nativeEnum = (e: Record<string, unknown>) => zEnumOf(Object.values(e))
  Z.array = (el: ZSchema) => zSchema((v, p) => {
    if (!Array.isArray(v)) zFail('array', v, p)
    return v.map((x, i) => el.run(x, p.concat(i)))
  })
  Z.tuple = (els: ZSchema[]) => zSchema((v, p) => {
    if (!Array.isArray(v) || v.length !== els.length) zFail(`tuple of length ${els.length}`, v, p)
    return els.map((s, i) => s.run(v[i], p.concat(i)))
  })
  Z.set = (el: ZSchema) => zSchema((v, p) => {
    if (!(v instanceof Set)) zFail('Set', v, p)
    return new Set([...v].map((x, i) => el.run(x, p.concat(i))))
  })
  Z.map = (k: ZSchema, val: ZSchema) => zSchema((v, p) => {
    if (!(v instanceof Map)) zFail('Map', v, p)
    return new Map([...v].map(([key, x], i) => [k.run(key, p.concat(i)), val.run(x, p.concat(i))]))
  })
  Z.object = (shape: Record<string, ZSchema>) => zObjectSchema(shape)
  Z.strictObject = Z.object
  Z.record = (...args: ZSchema[]) => {
    const valSchema = args[args.length - 1]
    return zSchema((v, p) => {
      if (!zIsObj(v)) zFail('record', v, p)
      const out: Record<string, unknown> = {}
      for (const [key, x] of Object.entries(v)) out[key] = valSchema.run(x, p.concat(key))
      return out
    })
  }
  Z.union = (options: ZSchema[]) => zUnion(options)
  Z.intersection = (a: ZSchema, b: ZSchema) => zSchema((v, p) => {
    const r1 = a.run(v, p)
    const r2 = b.run(v, p)
    return zIsObj(r1) && zIsObj(r2) ? { ...r1, ...r2 } : r2
  })
  Z.discriminatedUnion = (key: string, options: ZSchema[]) => zSchema((v, p) => {
    if (!zIsObj(v)) zFail('object', v, p)
    const dv = v[key]
    const match = options.find((o) => o._shape?.[key]?._literal === dv || o._shape?.[key]?.options?.includes(dv))
    if (match) return match.run(v, p)
    zFail(`one of ${options.map((o) => JSON.stringify(o._shape?.[key]?._literal)).join(', ')} for "${key}"`, dv, p.concat(key))
  })
  Z.lazy = (fn: () => ZSchema) => zSchema((v, p) => fn().run(v, p))
  Z.coerce = {
    number: () => zSchema((v, p) => { const n = Number(v); return Number.isNaN(n) ? zFail('number', v, p) : n }),
    string: () => zSchema((v) => String(v)),
    boolean: () => zSchema((v) => Boolean(v)),
    date: () => zSchema((v, p) => { const d = new Date(v as string | number); return Number.isNaN(d.getTime()) ? zFail('Date', v, p) : d }),
    bigint: () => zSchema((v, p) => { try { return BigInt(v as string) } catch { return zFail('bigint', v, p) } }),
  }
  Z.ZodError = ZodIssueError
  Z.ZodIssueCode = {}
  Z.ZodSchema = class {}
  Z.ZodType = Z.ZodSchema
  return Z
}

let zodModule: Record<string, unknown> | null = null
function requireShim(name: string): unknown {
  if (name === 'zod') {
    if (!zodModule) {
      const z = makeZod()
      zodModule = { z, default: z, ZodError: ZodIssueError }
    }
    return zodModule
  }
  throw new Error(`Cannot import "${name}" in this playground. Only 'zod' is available.`)
}

/* ── Code runner ────────────────────────────────────
   Transpile TS/ESM to plain CJS with the real compiler
   (lazy-loaded so it stays out of the main bundle).   */

type RunResult = { output: string[]; error: string }

export async function runCode(source: string, onLate?: (line: string) => void): Promise<RunResult> {
  const output: string[] = []
  let settled = false
  const push = (line: string) => {
    output.push(line)
    if (settled) onLate?.(line)
  }

  let js: string
  try {
    const tsModule = await import('typescript')
    const ts = tsModule.default ?? tsModule
    js = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
      reportDiagnostics: false,
    }).outputText
  } catch (error) {
    return { output, error: error instanceof Error ? error.message : 'This code could not be compiled.' }
  }

  try {
    const body = new Function('console', 'exports', 'module', 'require', `return (async () => {\n${js}\n})()`)
    await body(makeConsole(push), {}, { exports: {} }, requireShim)
  } catch (error) {
    settled = true
    return { output, error: error instanceof Error ? error.message : 'This code could not run.' }
  }
  settled = true
  return { output, error: '' }
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
