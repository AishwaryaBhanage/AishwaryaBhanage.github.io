import { useEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
 * Kinetic primitives for the technical side. The creative side has its own
 * vocabulary in motion.jsx. Both no-op under prefers-reduced-motion.
 * ------------------------------------------------------------------------- */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Splits text into characters that drop in and settle. */
export function KineticText({ text, className = '', delay = 0, step = 0.028, as: Tag = 'span' }) {
  // Characters animate individually, but each word is kept unbreakable —
  // otherwise the browser happily wraps between two inline-block letters.
  const words = text.split(' ')
  let n = 0
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, i) => (
            <span
              key={i}
              className="char"
              style={{ animationDelay: `${delay + n++ * step}s` }}
              aria-hidden="true"
            >
              {ch}
            </span>
          ))}
          {w < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}

/** Counts up to a number when it scrolls into view. */
export function CountUp({ to, suffix = '', prefix = '', ms = 1200, className = '', style }) {
  const ref = useRef(null)
  const [val, setVal] = useState(reduced() ? to : 0)

  useEffect(() => {
    if (reduced()) { setVal(to); return }
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / ms)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(to * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, ms])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{val}{suffix}
    </span>
  )
}
