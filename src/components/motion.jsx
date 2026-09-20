import { useEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
 * Motion vocabulary for the creative side.
 *
 * Reveals are mask-based rather than fades; type unblurs into place; numbers
 * roll like an odometer; the ambient layer is warm blooms and flecks. Nothing
 * here fades in or slides up — that was the last set.
 * ------------------------------------------------------------------------- */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* --- Ambient: warm blooms drifting behind everything ----------------------- */

const BLOOMS = [
  { x: '8%',  y: '12%', size: 420, c: 'var(--warm-1)', dur: 26, delay: 0 },
  { x: '68%', y: '4%',  size: 340, c: 'var(--warm-2)', dur: 31, delay: -8 },
  { x: '42%', y: '58%', size: 480, c: 'var(--warm-3)', dur: 37, delay: -16 },
  { x: '84%', y: '48%', size: 300, c: 'var(--warm-2)', dur: 29, delay: -22 },
]

export function Blooms({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {BLOOMS.map((b, i) => (
        <span
          key={i}
          className="bloom"
          style={{
            left: b.x, top: b.y, width: b.size, height: b.size,
            background: `radial-gradient(circle, ${b.c} 0%, transparent 68%)`,
            '--bloom-dur': `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Warm flecks tumbling slowly, like embers off a fire. */
export function Flecks({ count = 22, className = '' }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 4.6 + 3) % 97}%`,
    size: 3 + ((i * 5) % 7),
    dur: 16 + ((i * 3.1) % 18),
    delay: -((i * 2.3) % 20),
    drift: `${((i % 5) - 2) * 40}px`,
    spin: (i % 2 ? 1 : -1) * 360,
    square: i % 3 === 0,
  }))
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((f, i) => (
        <span
          key={i}
          className="fleck"
          style={{
            left: f.left, width: f.size, height: f.size,
            borderRadius: f.square ? '1px' : '50%',
            '--fl-dur': `${f.dur}s`,
            '--fl-x': f.drift,
            '--fl-spin': `${f.spin}deg`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* --- Type: unblurs into place --------------------------------------------- */

export function BlurRise({ text, className = '', delay = 0, step = 0.04, as: Tag = 'span', style }) {
  const words = text.split(' ')
  let n = 0
  return (
    <Tag className={className} style={style} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, i) => (
            <span key={i} className="blr" aria-hidden="true" style={{ animationDelay: `${delay + n++ * step}s` }}>
              {ch}
            </span>
          ))}
          {w < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}

/* --- Reveal: a mask wipes across, it does not fade ------------------------- */

export function MaskReveal({ children, dir = 'left', delay = 0, className = '', style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      el.classList.add('in')
      io.disconnect()
    }, { threshold: 0.18 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`mask-reveal mask-${dir} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  )
}

/* --- Numbers: digits roll --------------------------------------------------- */

const DIGITS = ['0','1','2','3','4','5','6','7','8','9']

function Reel({ digit, delay }) {
  const idx = DIGITS.indexOf(digit)
  return (
    <span className="reel" aria-hidden="true">
      <span
        className="reel-strip"
        style={{ '--to': `-${idx * 10}%`, transitionDelay: `${delay}s` }}
      >
        {DIGITS.map((d) => <span key={d} className="reel-d">{d}</span>)}
      </span>
    </span>
  )
}

/** Odometer-style figure. Digits roll into place when scrolled into view. */
export function Odometer({ value, className = '', style }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { setLive(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setLive(true)
      io.disconnect()
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const chars = Array.from(String(value))
  let d = 0
  return (
    <span ref={ref} className={`odo ${live ? 'live' : ''} ${className}`} style={style} aria-label={String(value)}>
      {chars.map((c, i) =>
        /\d/.test(c)
          ? <Reel key={i} digit={c} delay={d++ * 0.09} />
          : <span key={i} aria-hidden="true">{c}</span>
      )}
    </span>
  )
}

/* --- One giant word per section -------------------------------------------- */

const hexToRgb = (h) => {
  const v = h.trim().replace('#', '')
  const n = v.length === 3 ? v.split('').map((c) => c + c).join('') : v
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
}
const mixc = (a, b, t) => `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * t)).join(',')})`

/** Letters sweep bright → dark, left to right, as the word crosses the view. */
export function GiantWord({ word, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll('.gl'))
    if (!spans.length) return

    if (reduced()) {
      const to = getComputedStyle(el).getPropertyValue('--sweep-to').trim() || '#33200F'
      spans.forEach((sp) => { sp.style.color = to })
      return
    }

    const SPREAD = 0.55
    let raf = 0
    const paint = () => {
      const cs = getComputedStyle(el)
      const from = hexToRgb(cs.getPropertyValue('--sweep-from') || '#FF8C2B')
      const to = hexToRgb(cs.getPropertyValue('--sweep-to') || '#33200F')
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      const n = spans.length
      spans.forEach((sp, i) => {
        const head = i / Math.max(1, n - 1)
        const lp = (p - head * SPREAD) / (1 - SPREAD)
        sp.style.color = mixc(from, to, Math.min(1, Math.max(0, lp)))
      })
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    paint()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [word])

  return (
    <p ref={ref} className={`giant ${className}`} aria-hidden="true">
      {Array.from(word).map((ch, i) => <span key={i} className="gl">{ch}</span>)}
    </p>
  )
}

/* --- Scroll parallax ------------------------------------------------------- */

export function useParallax(ref) {
  useEffect(() => {
    const host = ref.current
    if (!host || reduced()) return
    const items = Array.from(host.querySelectorAll('[data-par]'))
    if (!items.length) return
    let raf = 0
    const tick = () => {
      const vh = window.innerHeight
      for (const el of items) {
        const r = el.getBoundingClientRect()
        const p = 1 - (r.top + r.height / 2) / (vh / 2 + r.height / 2)
        const depth = parseFloat(el.dataset.par || '0')
        el.style.transform = `translate3d(0, ${(p * depth * 28).toFixed(1)}px, 0)`
      }
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    tick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref])
}
