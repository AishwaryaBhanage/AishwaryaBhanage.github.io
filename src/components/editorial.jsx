import { useEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
 * Editorial primitives for the technical side.
 *
 * The shape is a printed profile: a metadata rail on the left carrying dates
 * and figures, a measured column of prose on the right, and hairline rules
 * doing the separating that cards used to do.
 * ------------------------------------------------------------------------- */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fades and lifts once, on entry. The only motion on these pages. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      el.classList.add('in')
      io.disconnect()
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`ed-in ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </Tag>
  )
}

export function Page({ index, title, lede, children }) {
  return (
    <div className="ed-page">
      <header>
        <div className="ed-head">
          {index != null && <span className="ed-num">{String(index).padStart(2, '0')}</span>}
          <span className="ed-rule" />
        </div>
        <h1 className="ed-title">{title}</h1>
        {lede && <p className="ed-lede">{lede}</p>}
      </header>
      <div className="mt-16">{children}</div>
    </div>
  )
}

/** One record: metadata rail plus prose column. */
export function Entry({ meta, children, delay = 0 }) {
  return (
    <Reveal as="article" className="ed-entry" delay={delay}>
      <div className="ed-meta">{meta}</div>
      <div className="min-w-0">{children}</div>
    </Reveal>
  )
}

/** A figure set in the margin — the number gets the room it deserves. */
export function Figure({ label, value, note }) {
  return (
    <div className="ed-figure">
      <p className="ed-figure-label">{label}</p>
      <p className="ed-figure-value">{value}</p>
      {note && <p className="ed-figure-note">{note}</p>}
    </div>
  )
}

export function Bullets({ items }) {
  return (
    <ul className="ed-list">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  )
}

/** Tools read as a sentence, not a row of pills. */
export function Tools({ label = 'Tools', items }) {
  return (
    <p className="ed-tools">
      <b>{label}</b>{'  '}
      {items.join('  ·  ')}
    </p>
  )
}

/** Counts up on entry. Used only where a number is the point. */
export function Count({ to, prefix = '', suffix = '', ms = 1100 }) {
  const ref = useRef(null)
  const [v, setV] = useState(reduced() ? to : 0)
  useEffect(() => {
    if (reduced()) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / ms)
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, ms])
  return <span ref={ref}>{prefix}{v}{suffix}</span>
}
