import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import { projects, resumes, profile } from '../data/content'

/** ⌘K navigation. Keeps the site fast to move around without scrolling. */
export default function CommandPalette({ open, setOpen }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const inputRef = useRef(null)

  const items = useMemo(() => {
    const go = (to) => () => { nav(to); setOpen(false) }
    const ext = (href) => () => { window.open(href, '_blank', 'noopener'); setOpen(false) }
    const dl = (href) => () => {
      const a = document.createElement('a')
      a.href = href; a.download = ''
      document.body.appendChild(a); a.click(); a.remove()
      setOpen(false)
    }
    return [
      { group: 'Go to', label: 'Home', run: go('/') },
      { group: 'Go to', label: 'Experience', run: go('/experience') },
      { group: 'Go to', label: 'Projects', run: go('/projects') },
      { group: 'Go to', label: 'Skills', run: go('/skills') },
      { group: 'Go to', label: 'About', run: go('/about') },
      { group: 'Go to', label: 'Contact', run: go('/contact') },
      { group: 'Go to', label: 'Creative world', run: go('/creative') },
      ...projects.map((p) => ({ group: 'Projects', label: p.name, hint: p.tagline, run: go(`/projects#${p.id}`) })),
      ...resumes.map((r) => ({ group: 'Résumé', label: `Download: ${r.label}`, run: dl(r.file) })),
      { group: 'Links', label: 'GitHub', run: ext(profile.github) },
      { group: 'Links', label: 'LinkedIn', run: ext(profile.linkedin) },
      { group: 'Links', label: 'Email', run: ext(`mailto:${profile.email}`) },
    ]
  }, [nav, setOpen])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((it) => `${it.label} ${it.hint || ''} ${it.group}`.toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => { setI(0) }, [q])

  useEffect(() => {
    if (open) {
      setQ('')
      // Focus after paint so the caret lands reliably.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setOpen((v) => !v); return
      }
      if (!open) return
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
      if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); results[i]?.run() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, i, setOpen])

  if (!open) return null

  let lastGroup = null

  return (
    <div
      className="fade fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: 'color-mix(in srgb, var(--bg-sunk) 70%, transparent)', backdropFilter: 'blur(4px)' }}
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
        style={{ borderColor: 'var(--rule)', background: 'var(--bg-elev)' }}
      >
        <div className="flex items-center gap-2.5 border-b px-4" style={{ borderColor: 'var(--rule)' }}>
          <Search size={15} style={{ color: 'var(--fg-3)' }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a page, project, or résumé…"
            className="w-full bg-transparent py-3.5 text-sm outline-none"
            style={{ color: 'var(--fg)' }}
          />
          <kbd className="font-mono text-[10px]" style={{ color: 'var(--fg-3)' }}>esc</kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-1.5">
          {results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm" style={{ color: 'var(--fg-3)' }}>Nothing matches “{q}”.</p>
          )}
          {results.map((it, n) => {
            const head = it.group !== lastGroup ? it.group : null
            lastGroup = it.group
            const active = n === i
            return (
              <div key={`${it.group}-${it.label}`}>
                {head && (
                  <p className="px-4 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--fg-3)' }}>
                    {head}
                  </p>
                )}
                <button
                  onMouseEnter={() => setI(n)}
                  onClick={it.run}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm"
                  style={{ background: active ? 'var(--accent-soft)' : 'transparent', color: active ? 'var(--fg)' : 'var(--fg-2)' }}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {it.label}
                    {it.hint && <span className="ml-2 text-[11px]" style={{ color: 'var(--fg-3)' }}>{it.hint}</span>}
                  </span>
                  {active && <CornerDownLeft size={12} style={{ color: 'var(--accent)' }} />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
