import { useEffect, useRef, useState } from 'react'
import { Download, ChevronDown, Check } from 'lucide-react'
import { resumes, TRACKS } from '../data/content'

/**
 * Résumé download. Defaults to the ML variant; the dropdown offers the rest.
 */
export default function ResumeMenu({ track = "ml" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const primary = resumes.find((r) => r.track === track) || resumes[0]

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-stretch overflow-hidden rounded-lg" style={{ background: 'var(--accent)' }}>
        <a
          href={primary.file}
          download
          className="inline-flex items-center gap-2 py-2.5 pl-4 pr-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Download size={14} />
          Résumé
          <span className="font-mono text-[11px] opacity-80">· {primary.label}</span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Choose a résumé for a different role"
          aria-expanded={open}
          className="grid w-9 place-items-center border-l border-white/25 text-white transition-opacity hover:opacity-90"
        >
          <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
      </div>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl"
          style={{ borderColor: 'var(--rule)', background: 'var(--bg-elev)' }}
        >
          <p className="border-b px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-wider" style={{ borderColor: 'var(--rule)', color: 'var(--fg-3)' }}>
            Tailored per role
          </p>
          {resumes.map((r) => {
            // 'campus' has no engineering track; fall back to the accent dot.
            const dot = TRACKS[r.track]?.color || 'var(--accent)'
            const isCurrent = r.track === primary.track
            return (
              <a
                key={r.track}
                href={r.file}
                download
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:opacity-75"
                style={{ color: 'var(--fg-2)' }}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dot }} />
                <span className="flex-1">{r.label}</span>
                {isCurrent && <Check size={13} style={{ color: 'var(--accent)' }} />}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
