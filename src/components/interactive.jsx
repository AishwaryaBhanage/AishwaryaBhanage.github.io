import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/* ---------------------------------------------------------------------------
 * Interactive motion: cursor-reactive and scroll-reactive behaviour.
 *
 * Everything here writes CSS custom properties from a single rAF loop instead
 * of setting React state, so pointer movement never triggers a re-render.
 * ------------------------------------------------------------------------- */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fine = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/** Custom cursor: exact dot, lagging ring, trailing spotlight. */
export function CursorLayer() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    if (!fine() || reduced()) return

    const root = document.documentElement
    root.dataset.cursor = 'on'

    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let gx = mx, gy = my
    let raf = 0

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      root.style.setProperty('--mx', `${mx}px`)
      root.style.setProperty('--my', `${my}px`)
    }

    const onOver = (e) => {
      const hit = e.target.closest('a, button, [role="button"], input, summary')
      root.dataset.cursorHot = hit ? 'on' : 'off'
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      gx += (mx - gx) * 0.06
      gy += (my - gy) * 0.06

      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      delete root.dataset.cursor
      delete root.dataset.cursorHot
    }
  }, [])

  // Portalled to <body>: any ancestor with transform/filter/backdrop-filter
  // would turn these position:fixed layers into absolutely-positioned ones,
  // and the 520px glow would then widen the document every time the pointer
  // moved right — which is exactly the runaway horizontal scroll we hit.
  return createPortal(
    <div className="cursor-layer" aria-hidden="true">
      <div ref={glowRef} className="cursor-glow" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>,
    document.body
  )
}

/** Pulls its child toward the pointer when the pointer is close. */
export function Magnetic({ children, strength = 0.35, radius = 90, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!fine() || reduced()) return
    const el = ref.current
    if (!el) return
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        tx = dx * strength
        ty = dy * strength
      } else {
        tx = 0; ty = 0
      }
    }
    const tick = () => {
      cx += (tx - cx) * 0.16
      cy += (ty - cy) * 0.16
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [strength, radius])

  return <span ref={ref} className={`inline-block will-change-transform ${className}`}>{children}</span>
}

/** 3-D tilt toward the pointer, with a moving sheen. */
export function Tilt({ children, max = 9, className = '', style }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!fine() || reduced()) return
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`)
      el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`)
      el.style.setProperty('--sx', `${px * 100}%`)
      el.style.setProperty('--sy', `${py * 100}%`)
    }
    const onLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  }, [max])

  return (
    <div ref={ref} className={`tilt ${className}`} style={style}>
      <div className="tilt-inner">{children}</div>
    </div>
  )
}

/** Recolors the whole page while this section owns the middle of the viewport. */
export function SectionTheme({ accent, wash, children, className = '', id }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        root.style.setProperty('--accent', accent)
        root.style.setProperty('--accent-soft', `color-mix(in srgb, ${accent} 13%, transparent)`)
        if (wash) root.style.setProperty('--wash', wash)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [accent, wash])

  return <section id={id} ref={ref} className={className}>{children}</section>
}

/** Letters scatter away from the cursor as it sweeps across them. */
export function ScatterText({ text, className = '', as: Tag = 'span' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!fine() || reduced()) return
    const el = ref.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll('[data-ch]'))
    let raf = 0

    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        for (const s of spans) {
          const r = s.getBoundingClientRect()
          const dx = (r.left + r.width / 2) - e.clientX
          const dy = (r.top + r.height / 2) - e.clientY
          const d = Math.hypot(dx, dy)
          const R = 130
          if (d < R && d > 0) {
            const f = (1 - d / R) ** 2
            s.style.transform = `translate(${(dx / d) * f * 22}px, ${(dy / d) * f * 22}px) rotate(${f * 10}deg)`
          } else {
            s.style.transform = ''
          }
        }
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {Array.from(text).map((ch, i) =>
        ch === ' ' ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span key={i} data-ch className="scatter-ch" aria-hidden="true">{ch}</span>
        )
      )}
    </Tag>
  )
}
