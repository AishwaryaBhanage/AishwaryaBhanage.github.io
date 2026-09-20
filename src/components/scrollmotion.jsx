import { useEffect, useRef } from 'react'

/* ---------------------------------------------------------------------------
 * Scroll motion.
 *
 * One rAF loop measures scroll position and velocity and publishes them as CSS
 * custom properties on <html>. Everything else reads those, so the whole page
 * can react to scrolling without a single extra listener or React render.
 *
 *   --sp   0 → 1 progress through the document
 *   --sv  -1 → 1 smoothed scroll velocity (negative = scrolling up)
 * ------------------------------------------------------------------------- */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Mount once. Publishes --sp and --sv. */
export function ScrollDriver() {
  useEffect(() => {
    if (reduced()) return
    const root = document.documentElement
    let last = window.scrollY
    let vel = 0
    let raf = 0

    const tick = () => {
      const y = window.scrollY
      const raw = y - last
      last = y
      // Smooth, then clamp to a usable range.
      vel += (raw - vel) * 0.16
      const v = Math.max(-1, Math.min(1, vel / 38))

      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? y / max : 0

      root.style.setProperty('--sv', v.toFixed(4))
      root.style.setProperty('--sp', p.toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      root.style.removeProperty('--sv')
      root.style.removeProperty('--sp')
    }
  }, [])
  return null
}

/**
 * Generic scroll-linked transform. Each child element is offset by its own
 * factor as it crosses the viewport.
 *
 * @param {number} x       horizontal travel in px across the crossing
 * @param {number} y       vertical travel in px
 * @param {number} rotate  degrees of rotation across the crossing
 * @param {number} scale   scale delta across the crossing
 */
export function Move({ x = 0, y = 0, rotate = 0, scale = 0, className = '', style, children, as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    let raf = 0

    const paint = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // -1 below the fold → 0 centred → 1 above it
      const p = Math.max(-1, Math.min(1, 1 - (r.top + r.height / 2) / (vh / 2 + r.height / 2)))
      el.style.transform =
        `translate3d(${(p * x).toFixed(1)}px, ${(p * y).toFixed(1)}px, 0)` +
        (rotate ? ` rotate(${(p * rotate).toFixed(2)}deg)` : '') +
        (scale ? ` scale(${(1 + p * scale).toFixed(3)})` : '')
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
  }, [x, y, rotate, scale])

  return <Tag ref={ref} className={className} style={{ willChange: 'transform', ...style }}>{children}</Tag>
}

/**
 * A band of text driven entirely by scroll — it only moves while you move.
 * Direction flips with `reverse`, so stacked bands scissor against each other.
 */
export function ScrollTicker({ items, speed = 0.55, reverse = false, className = '', sep = '·' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { el.style.transform = 'translate3d(0,0,0)'; return }

    let raf = 0
    const half = () => el.scrollWidth / 2 || 1

    const paint = () => {
      const y = window.scrollY
      const dir = reverse ? -1 : 1
      // Wrap so the duplicated run makes the loop seamless.
      const offset = ((y * speed * dir) % half() + half()) % half()
      el.style.transform = `translate3d(${-offset}px, 0, 0)`
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
  }, [speed, reverse])

  const run = (k) => (
    <span key={k} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap">{it}</span>
          <span className="mx-5 shrink-0 opacity-40 sm:mx-8" aria-hidden="true">{sep}</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className={`overflow-hidden ${className}`} role="presentation">
      <div ref={ref} className="flex w-max" style={{ willChange: 'transform' }}>
        {run('a')}{run('b')}
      </div>
    </div>
  )
}

/** Orbs that drift and spin as the page moves. Cheap, purely decorative. */
export function Orbs({ count = 9, className = '' }) {
  const ref = useRef(null)

  const seeds = useRef(
    Array.from({ length: count }, (_, i) => ({
      left: `${(i * 11.3 + 6) % 92}%`,
      top: `${(i * 17.7 + 8) % 86}%`,
      size: 6 + ((i * 7) % 20),
      depth: 0.15 + ((i * 13) % 45) / 100,
      spin: (i % 2 ? 1 : -1) * (40 + (i * 23) % 90),
      ring: i % 3 === 0,
    }))
  ).current

  useEffect(() => {
    const host = ref.current
    if (!host || reduced()) return
    const kids = Array.from(host.children)
    const words = Array.from(wordRef.current?.children || [])
    let raf = 0

    const paint = () => {
      const y = window.scrollY
      kids.forEach((el, i) => {
        const s = seeds[i]
        el.style.transform =
          `translate3d(0, ${(-y * s.depth).toFixed(1)}px, 0) rotate(${(y * s.spin * 0.02).toFixed(1)}deg)`
      })
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    window.addEventListener('scroll', onScroll, { passive: true })
    paint()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [seeds])

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {seeds.map((s, i) => (
        <span
          key={i}
          className="absolute block rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            border: s.ring ? '1.5px solid currentColor' : 'none',
            background: s.ring ? 'transparent' : 'currentColor',
            opacity: s.ring ? 0.3 : 0.16,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

/* --- Scroll-driven backdrop ------------------------------------------------ */

const hx = (h) => {
  const v = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16))
}
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`

/** Colour stops the page ramps through, keyed to scroll progress. */
// Cream → sand, the light half of the coffee palette.
const RAMP_LIGHT = [
  [0.00, '#FAF1E6'], [0.16, '#F8EDDF'], [0.32, '#F4E6D3'],
  [0.46, '#EFD9C0'], [0.62, '#F3E3CF'], [0.80, '#F8EDE0'], [1.00, '#FAF1E6'],
]
// Espresso, warming slightly through the middle.
const RAMP_DARK = [
  [0.00, '#241A14'], [0.16, '#2A1F17'], [0.32, '#33231B'],
  [0.46, '#3A2920'], [0.62, '#312318'], [0.80, '#291E16'], [1.00, '#241A14'],
]

function sample(ramp, p) {
  for (let i = 0; i < ramp.length - 1; i++) {
    const [a, ca] = ramp[i]
    const [b, cb] = ramp[i + 1]
    if (p >= a && p <= b) {
      const t = (p - a) / (b - a || 1)
      const A = hx(ca), B = hx(cb)
      return rgb([0, 1, 2].map((k) => Math.round(A[k] + (B[k] - A[k]) * t)))
    }
  }
  return rgb(hx(ramp[ramp.length - 1][1]))
}

// Large, slow objects that live behind everything.
// A scattered set of shapes across the whole coffee palette — filled and
// outlined, 26px to 380px, each at its own depth, spin and idle animation.
const OBJECTS = [
  { x: '4%',  y: '8%',  s: 300, kind: 'ring',      d: 0.22, spin: 18,  o: .16, c: 'var(--cool-1)', anim: 'breathe' },
  { x: '78%', y: '5%',  s: 96,  kind: 'tri',       d: 0.58, spin: -46, o: .14, c: 'var(--warm-1)', anim: 'sway'    },
  { x: '34%', y: '12%', s: 42,  kind: 'dot',       d: 0.72, spin: 0,   o: .22, c: 'var(--accent)', anim: 'pulse'   },
  { x: '62%', y: '16%', s: 170, kind: 'frame',     d: 0.34, spin: 26,  o: .15, c: 'var(--cool-2)', anim: 'spin'    },
  { x: '14%', y: '24%', s: 130, kind: 'blob',      d: 0.48, spin: -14, o: .13, c: 'var(--warm-2)', anim: 'breathe' },
  { x: '90%', y: '28%', s: 210, kind: 'arc',       d: 0.28, spin: 38,  o: .2,  c: 'var(--cool-1)', anim: 'sway'    },
  { x: '48%', y: '33%', s: 64,  kind: 'diamond',   d: 0.66, spin: 52,  o: .16, c: 'var(--warm-3)', anim: 'spin'    },
  { x: '6%',  y: '40%', s: 110, kind: 'capsule',   d: 0.42, spin: -22, o: .14, c: 'var(--cool-2)', anim: 'sway'    },
  { x: '70%', y: '44%', s: 380, kind: 'ring',      d: 0.16, spin: -12, o: .12, c: 'var(--warm-1)', anim: 'breathe' },
  { x: '26%', y: '48%', s: 78,  kind: 'hexOutline',d: 0.55, spin: 34,  o: .18, c: 'var(--cool-3)', anim: 'spin'    },
  { x: '54%', y: '54%', s: 150, kind: 'halfDisc',  d: 0.38, spin: 20,  o: .13, c: 'var(--warm-2)', anim: 'sway'    },
  { x: '88%', y: '58%', s: 54,  kind: 'plus',      d: 0.70, spin: -40, o: .2,  c: 'var(--accent)', anim: 'pulse'   },
  { x: '10%', y: '62%', s: 240, kind: 'frame',     d: 0.24, spin: 15,  o: .12, c: 'var(--cool-1)', anim: 'breathe' },
  { x: '40%', y: '68%', s: 100, kind: 'square',    d: 0.5,  spin: -28, o: .13, c: 'var(--warm-3)', anim: 'spin'    },
  { x: '74%', y: '72%', s: 130, kind: 'triOutline',d: 0.44, spin: 30,  o: .18, c: 'var(--cool-2)', anim: 'sway'    },
  { x: '18%', y: '78%', s: 60,  kind: 'dot',       d: 0.64, spin: 0,   o: .18, c: 'var(--warm-1)', anim: 'pulse'   },
  { x: '58%', y: '82%', s: 190, kind: 'ring',      d: 0.3,  spin: -20, o: .15, c: 'var(--cool-3)', anim: 'breathe' },
  { x: '92%', y: '86%', s: 86,  kind: 'hex',       d: 0.52, spin: 44,  o: .12, c: 'var(--warm-2)', anim: 'spin'    },
  { x: '30%', y: '90%', s: 120, kind: 'capsule',   d: 0.4,  spin: 24,  o: .14, c: 'var(--cool-1)', anim: 'sway'    },
  { x: '66%', y: '94%', s: 26,  kind: 'dot',       d: 0.8,  spin: 0,   o: .24, c: 'var(--accent)', anim: 'pulse'   },
]

/** One backdrop shape. Simple forms are CSS; the angular ones are SVG. */
function Shape({ o }) {
  const box = { width: o.s, height: o.s, color: o.c, opacity: o.o }
  const svg = (children) => (
    <svg viewBox="0 0 100 100" style={box}>{children}</svg>
  )
  switch (o.kind) {
    case 'dot':
      return <span style={{ ...box, background: 'currentColor', borderRadius: '50%' }} />
    case 'ring':
      return <span style={{ ...box, border: `${Math.max(2, o.s * 0.018)}px solid currentColor`, borderRadius: '50%' }} />
    case 'square':
      return <span style={{ ...box, background: 'currentColor', borderRadius: o.s * 0.14 }} />
    case 'frame':
      return <span style={{ ...box, border: `${Math.max(2, o.s * 0.016)}px solid currentColor`, borderRadius: o.s * 0.1 }} />
    case 'capsule':
      return <span style={{ ...box, height: o.s * 0.42, background: 'currentColor', borderRadius: 999 }} />
    case 'blob':
      return <span style={{ ...box, background: 'currentColor', borderRadius: '46% 54% 58% 42% / 52% 44% 56% 48%' }} />
    case 'arc':
      return svg(<path d="M6,50 A44,44 0 0 1 94,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />)
    case 'halfDisc':
      return svg(<path d="M4,52 A48,48 0 0 1 96,52 Z" fill="currentColor" />)
    case 'tri':
      return svg(<polygon points="50,8 94,90 6,90" fill="currentColor" />)
    case 'triOutline':
      return svg(<polygon points="50,8 94,90 6,90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />)
    case 'hex':
      return svg(<polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="currentColor" />)
    case 'hexOutline':
      return svg(<polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />)
    case 'diamond':
      return svg(<polygon points="50,4 96,50 50,96 4,50" fill="currentColor" />)
    case 'plus':
      return svg(<path d="M42,6 h16 v36 h36 v16 h-36 v36 h-16 v-36 h-36 v-16 h36 z" fill="currentColor" />)
    default:
      return null
  }
}

// Words drifting behind the content — half what she does, half who she is.
// Blurred and low-contrast so they read as texture, never as something to read.
const WORDS = [
  { t: 'LIGHTS',         x: '-6%', y: '4%',  size: 13, blur: 5, rate: -0.55, c: 'var(--cool-1)', outline: false },
  { t: 'CAMERA',         x: '58%', y: '10%', size: 11, blur: 4, rate: 0.70,  c: 'var(--cool-2)', outline: true  },
  { t: 'DANCE',          x: '16%', y: '18%', size: 16, blur: 6, rate: 0.42,  c: 'var(--cool-3)', outline: false },
  { t: 'PATIENCE',       x: '60%', y: '25%', size: 10, blur: 4, rate: -0.60, c: 'var(--cool-4)', outline: true  },
  { t: 'CREATIVE',       x: '-8%', y: '32%', size: 11, blur: 3, rate: 0.80,  c: 'var(--cool-2)', outline: false },
  { t: 'DISCIPLINE',     x: '46%', y: '39%', size: 9,  blur: 3, rate: -0.72, c: 'var(--cool-1)', outline: true  },
  { t: 'ENERGETIC',      x: '4%',  y: '46%', size: 12, blur: 5, rate: 0.62,  c: 'var(--cool-3)', outline: false },
  { t: 'NEVER GIVE UP',  x: '52%', y: '53%', size: 8,  blur: 3, rate: 0.95,  c: 'var(--cool-4)', outline: true  },
  { t: 'CURIOUS',        x: '-5%', y: '60%', size: 10, blur: 4, rate: -0.48, c: 'var(--cool-2)', outline: false },
  { t: 'STRONGER',       x: '56%', y: '67%', size: 14, blur: 6, rate: 0.86,  c: 'var(--cool-3)', outline: true  },
  { t: 'KEEP SMILING',   x: '8%',  y: '74%', size: 9,  blur: 3, rate: -0.68, c: 'var(--cool-1)', outline: false },
  { t: 'ENTHUSIASTIC',   x: '50%', y: '81%', size: 8,  blur: 3, rate: 0.55,  c: 'var(--cool-4)', outline: true  },
  { t: 'SELF-MOTIVATED', x: '-4%', y: '88%', size: 9,  blur: 4, rate: -0.82, c: 'var(--cool-2)', outline: false },
  { t: 'RHYTHM',         x: '62%', y: '94%', size: 12, blur: 5, rate: 0.64,  c: 'var(--cool-3)', outline: true  },
]

/**
 * A fixed layer behind the page: the ground colour ramps as you scroll, and a
 * set of large soft objects drift and rotate at their own depths.
 */
export function ScrollBackdrop() {
  const bgRef = useRef(null)
  const objRef = useRef(null)
  const wordRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current
    const host = objRef.current
    if (!bg || !host) return

    const kids = Array.from(host.children)
    const words = Array.from(wordRef.current?.children || [])
    const isDark = () =>
      document.documentElement.classList.contains('dark')

    if (reduced()) {
      bg.style.backgroundColor = sample(isDark() ? RAMP_DARK : RAMP_LIGHT, 0)
      return
    }

    let raf = 0
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const y = window.scrollY
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0

      bg.style.backgroundColor = sample(isDark() ? RAMP_DARK : RAMP_LIGHT, p)

      kids.forEach((el, i) => {
        const o = OBJECTS[i]
        el.style.transform =
          `translate3d(${(Math.sin(y * 0.0007 + i) * 30).toFixed(1)}px, ` +
          `${(-y * o.depth * 0.25).toFixed(1)}px, 0) ` +
          `rotate(${(y * o.spin * 0.008).toFixed(2)}deg)`
      })

      words.forEach((el, i) => {
        const w = WORDS[i]
        el.style.transform =
          `translate3d(${(y * w.rate * 0.35).toFixed(1)}px, ${(-y * 0.06).toFixed(1)}px, 0)`
      })
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Theme toggles need a repaint too.
    const mo = new MutationObserver(paint)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    paint()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="backdrop-layer" aria-hidden="true">
      <div ref={bgRef} className="backdrop-fill" />
      <div ref={wordRef} className="backdrop-objects">
        {WORDS.map((w, i) => (
          <span
            key={i}
            className={`bd-word ${w.outline ? 'bd-outline' : ''}`}
            style={{
              left: w.x,
              top: w.y,
              fontSize: `${w.size}vw`,
              color: w.c,
              filter: `blur(${w.blur}px)`,
            }}
          >
            {w.t}
          </span>
        ))}
      </div>
      <div ref={objRef} className="backdrop-objects">
        {OBJECTS.map((o, i) => (
          <span
            key={i}
            className={`bd-obj bd-anim-${o.anim}`}
            style={{
              left: o.x,
              top: o.y,
              '--drift': `${13 + (i % 7) * 3.5}s`,
              animationDelay: `${-i * 1.9}s`,
            }}
          >
            <Shape o={o} />
          </span>
        ))}
      </div>
    </div>
  )
}
