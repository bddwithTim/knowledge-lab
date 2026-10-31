import { useState, type ReactNode } from 'react'

export function CollapsibleSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section>
      <button
        className="lesson-section-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h2>{title}</h2>
        <span className={`lesson-section-arrow${open ? ' open' : ''}`}>&#9654;</span>
      </button>
      <div className={`lesson-section-body${open ? '' : ' collapsed'}`}>
        <div style={{ paddingTop: 'var(--space-sm)' }}>
          {children}
        </div>
      </div>
    </section>
  )
}
