import { TRACKS } from '../data/content'

/** Page wrapper — every route renders inside one of these. */
export function Page({ eyebrow, title, lede, children, wide = false }) {
  return (
    <div className={`relative z-[2] mx-auto w-full px-5 pb-24 pt-28 sm:px-8 sm:pt-32 ${wide ? 'max-w-6xl' : 'max-w-5xl'}`}>
      <header className="rise mb-10 sm:mb-14">
        {eyebrow && (
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.02] tracking-tight" style={{ color: 'var(--fg)' }}>
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--fg-2)' }}>
            {lede}
          </p>
        )}
      </header>
      {children}
    </div>
  )
}

export function TrackBadge({ track }) {
  const t = TRACKS[track]
  if (!t) return null
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
      style={{ background: `color-mix(in srgb, ${t.color} 12%, transparent)`, color: t.color }}
    >
      <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full" style={{ background: t.color }} />
      {t.short}
    </span>
  )
}

export function Chip({ children, muted = false }) {
  return (
    <span
      className="inline-block rounded-md border px-2 py-[3px] font-mono text-[11px] leading-snug"
      style={{
        borderColor: 'var(--rule)',
        color: muted ? 'var(--fg-3)' : 'var(--fg-2)',
        background: muted ? 'transparent' : 'var(--bg-elev)',
      }}
    >
      {children}
    </span>
  )
}

export function Card({ children, className = '', style, ...rest }) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{ borderColor: 'var(--rule)', background: 'var(--bg-elev)', ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
