import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
 * The gate.
 *
 * Her name fills the screen on two lines. Three scroll steps fly the camera
 * into the counter of the capital A — the triangular hole — until it is the
 * whole viewport, and the portfolio begins on the other side of it.
 *
 * The runway is a plain spacer and the card is a fixed overlay — the page must
 * not live inside a pin, or the whole site would be clipped to one viewport.
 * The gesture is taken directly, so it is exactly three scrolls in and three
 * back out.
 * ------------------------------------------------------------------------- */

/* The card never borrows the page's tokens. It is the front door and should
   look the same every time — not shift with the theme or with whichever side
   you happen to be on. */
const CARD_BG = '#FAF1E6'   // cream
const CARD_FG = '#33231B'   // espresso

const STEPS = 3            // how many scrolls it takes to get in
const SNAP_VH = 34         // one ordinary scroll gesture covers a step
const MAX_SCALE = 380      // far enough that the counter alone fills the view
const FOCUS_LINE = 0       // "AISHWARYA"
const FOCUS_CHAR = 0       // the leading A

/* Exponential, not eased: doubling the scroll doubles the magnification, which
   is how the eye reads a zoom. A cubic ease saves almost all the movement for
   the last third and feels like nothing is happening until then. */
const zoomAt = (p) => Math.pow(MAX_SCALE, p)

/* Per page load: once you have navigated off the home route you are inside the
   site. The door stays in place — your name is always one scroll up — but you
   land below it rather than being walked through it again. */
let hasEntered = false

/** Has the visitor already been inside this session? */
export const gateSpent = () => hasEntered
/** Height of the entrance runway, in vh. */
export const GATE_VH = STEPS * SNAP_VH

export default function ZoomIntro({ lines = ['AISHWARYA', 'BHANAGE'], enabled = true, children }) {
  // Computed every render — holding it in state froze it at mount, so the
  // card kept rendering over Projects and Experience.
  const on =
    enabled &&
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!enabled) hasEntered = true
  }, [enabled])

  const runwayRef = useRef(null)
  const groupRef = useRef(null)
  const cardRef = useRef(null)
  const textRefs = useRef([])

  const [box, setBox] = useState({ w: 0, h: 0 })
  const [sizes, setSizes] = useState([0, 0])
  const focus = useRef({ x: 0, y: 0 })
  // Returning visitors arrive past the door, so the card starts hidden.
  const [through, setThrough] = useState(() => hasEntered)
  const [step, setStep] = useState(0)

  /* --- 1. learn the viewport ---------------------------------------------- */
  useLayoutEffect(() => {
    if (!on) return
    const onResize = () => setBox({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* --- 2. size the lines, then locate the A -------------------------------- */
  /* Split from step 1 deliberately: the <svg> only renders once box.w is known,
     so the text nodes do not exist on the first pass and cannot be measured.

     Fitting the name is done by watching rather than by listening. The obvious
     approach, measuring once document.fonts.ready resolves, is a race: that
     promise reports the font system currently idle, and at first paint the
     cross-origin Google Fonts stylesheet has often not been parsed yet, so
     nothing is pending and it resolves before Sora has even been asked for.
     The name then stays sized to the fallback face, whose glyphs are narrower,
     and the real font runs off both edges of the window. So instead the fit is
     re-checked each frame for the first few seconds and corrected whenever the
     measured width drifts — whenever the font actually lands, and however it
     gets there. */
  useLayoutEffect(() => {
    if (!on || !box.w) return
    let live = true
    let raf = 0
    const deadline = performance.now() + 4000

    // Rather than filling the window edge to edge, leave a clear margin: the
    // name should look placed, not crammed.
    const FILL = 0.86
    const TALLEST = 0.38   // of the window, per line

    /* Measure at whatever size the node is already showing, then scale that
       reading to the target width. The obvious version — write a rough guess,
       measure it, solve — is wrong: getComputedTextLength() read straight after
       writing font-size can still report the previous layout, so the solve uses
       a length that belongs to a different size and settles about 10% too big.
       Reading first and writing after means the length always belongs to the
       size it was taken at, and the correction is exact. */
    const fit = () => lines.map((line, i) => {
      const t = textRefs.current[i]
      if (!t) return 0
      const cur = parseFloat(t.getAttribute('font-size')) || 10
      const len = t.getComputedTextLength()
      if (!len) return 0
      const size = Math.min(cur * ((box.w * FILL) / len), box.h * TALLEST)
      t.setAttribute('font-size', String(size))
      return size
    })

    // Everything zooms about the counter of the A, so a wrong point magnifies
    // blank ground instead of the letter. Ask until the glyph answers.
    const locate = (sized) => {
      const t = textRefs.current[FOCUS_LINE]
      if (!t) return
      try {
        const a = t.getStartPositionOfChar(FOCUS_CHAR)
        const b = t.getEndPositionOfChar(FOCUS_CHAR)
        if (b.x > a.x) {
          focus.current = { x: (a.x + b.x) / 2, y: a.y - sized[FOCUS_LINE] * 0.26 }
          return
        }
      } catch { /* not laid out yet */ }
      // Last resort: the left of the first line, where the A lives. Never the
      // middle of the card, which is the gap between the two lines.
      if (!focus.current.x) focus.current = { x: box.w * 0.07, y: box.h * 0.42 }
    }

    let applied = [0, 0]
    const tick = () => {
      if (!live) return
      const next = fit()
      if (next && next.some(Boolean)) {
        // Only disturb React when the answer has actually moved.
        const moved = next.some((n, i) => Math.abs(n - applied[i]) > applied[i] * 0.004 + 0.5)
        if (moved) {
          applied = next
          setSizes(next)
          requestAnimationFrame(() => { locate(next); paint() })
        } else {
          // Sizes are settled but the glyph may still be unmeasured.
          if (!focus.current.x) { locate(next); paint() }
        }
      }
      if (performance.now() < deadline) raf = requestAnimationFrame(tick)
    }
    tick()

    return () => { live = false; cancelAnimationFrame(raf) }
  }, [on, box.w, box.h, lines.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  /* --- drive it from scroll ------------------------------------------------ */
  const paint = () => {
    const runway = runwayRef.current
    const g = groupRef.current
    const card = cardRef.current
    if (!runway || !g || !card) return

    // A plain spacer: scrolling its full height is the whole journey.
    const r = runway.getBoundingClientRect()
    const p = r.height > 0 ? Math.min(1, Math.max(0, -r.top / r.height)) : 0

    const { x, y } = focus.current
    g.setAttribute('transform', `translate(${x} ${y}) scale(${zoomAt(p)}) translate(${-x} ${-y})`)

    // Only the last stretch fades, and by then the viewport is filled by the
    // counter — flat ground colour — so there is no visible cut.
    card.style.opacity = String(Math.max(0, p > 0.92 ? 1 - (p - 0.92) / 0.08 : 1))

    setStep(p <= 0 ? 0 : Math.min(STEPS, Math.ceil(p * STEPS)))
    const done = p >= 0.999
    setThrough(done)
    // Spent as soon as you are through, not only when you navigate away —
    // otherwise moving straight from the technical side to the creative one
    // walked you through the door a second time.
    if (done) hasEntered = true

    // Chrome that would sit on top of the title card hides until we are through.
    document.documentElement.dataset.gate = done ? 'passed' : 'open'
  }

  /* --- one gesture, one step ---------------------------------------------- */
  /* CSS scroll-snap would not commit reliably in both directions — a gesture
     could land between steps, or refuse to move at all once the runway had
     un-pinned. Taking the gesture directly makes it exact: three scrolls in,
     two back out, and the page released the moment you are past either end so
     nothing is ever trapped. */
  useEffect(() => {
    if (!on) return

    const stepPx = () => (SNAP_VH / 100) * window.innerHeight
    const runwayTop = () => {
      const el = runwayRef.current
      return el ? el.getBoundingClientRect().top + window.scrollY : 0
    }
    const current = () => Math.round((window.scrollY - runwayTop()) / stepPx())

    let busy = false
    let release = 0

    /* Leaving the page back into the entrance needs intent. Without this, one
       flick at the top of the site yanked you out of the content and into the
       name — and you had to scroll all the way back in again. A deliberate,
       sustained pull crosses the threshold; a fast flick does not. */
    const PULL_TO_EXIT = 260   // px of upward travel needed to re-enter
    let pull = 0
    let pullAt = 0

    const insideGate = () => {
      if (!runwayRef.current) return false
      const rel = window.scrollY - runwayTop()
      return rel >= -2 && rel <= STEPS * stepPx() + 2
    }

    /* Going in is a slow reveal, so it earns three beats. Coming back out is a
       retreat and wants to be quicker, so the runway is divided differently in
       each direction: thirds on the way down, halves on the way up. Rounding
       away from the current position means a gesture always lands on the next
       stop of whichever grid it is travelling on, never skips one, and never
       stalls between the two. */
    const OUT_STEPS = 2

    const go = (dir) => {
      const top = runwayTop()
      const total = STEPS * stepPx()
      const stride = dir > 0 ? stepPx() : total / OUT_STEPS
      // Smooth scrolling settles on whole pixels, so a step of 185.33px leaves
      // you at 185 — a hair short of the stop. Without a real tolerance the
      // next gesture floors back to the stop you are already standing on and
      // the gate refuses to move at all.
      const raw = (window.scrollY - top) / stride
      const near = Math.round(raw)
      const at = Math.abs(raw - near) < 0.05 ? near : raw
      const next = dir > 0
        ? (Math.floor(at) + 1) * stride
        : (Math.ceil(at) - 1) * stride
      const target = Math.max(0, Math.min(total, next))
      busy = true
      window.scrollTo({ top: top + target, behavior: 'smooth' })
      clearTimeout(release)
      release = setTimeout(() => { busy = false }, 620)
    }

    // The gate owns the scroll wheel, which means it must stand down whenever
    // something else has the user's attention: a text field, or any open
    // dialog such as the command palette or the lightbox.
    const busyElsewhere = () => {
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return true
      return Boolean(document.querySelector('[role="dialog"]'))
    }

    const guard = (dir, e, force = 0) => {
      if (!insideGate() || busyElsewhere()) return
      const at = current()
      // Past either end, hand the page back to normal scrolling.
      if ((dir > 0 && at >= STEPS) || (dir < 0 && at <= 0)) return

      // Standing at the foot of the runway, looking at the page: only a
      // sustained pull goes back up into the name.
      if (dir < 0 && at >= STEPS) {
        const now = performance.now()
        if (now - pullAt > 400) pull = 0   // let go, and it resets
        pullAt = now
        pull += force || 60
        if (pull < PULL_TO_EXIT) return
        pull = 0
      }

      e.preventDefault()
      if (!busy) go(dir)
    }

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 4) return
      guard(e.deltaY > 0 ? 1 : -1, e, Math.min(Math.abs(e.deltaY), 120))
    }
    const onKey = (e) => {
      // Never swallow a shortcut — ⌘K and friends must reach their handler.
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) guard(1, e)
      else if (['ArrowUp', 'PageUp'].includes(e.key)) guard(-1, e)
    }
    let touchY = 0
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      const dy = touchY - e.touches[0].clientY
      if (Math.abs(dy) < 24) return
      touchY = e.touches[0].clientY
      guard(dy > 0 ? 1 : -1, e, Math.min(Math.abs(dy), 120))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      clearTimeout(release)
    }
  }, [])

  useEffect(() => {
    if (!on) return
    let raf = 0
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { paint(); raf = 0 }) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    paint()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      delete document.documentElement.dataset.gate
    }
  }, [])

  if (!on) return children

  // A card with no measured text would be a full-screen block of flat colour.
  // It is hidden until it has something to draw, but with opacity rather than
  // display: the SVG must stay laid out or getComputedTextLength() returns 0,
  // the sizes never resolve, and the card can never become ready at all.
  const ready = box.w > 0 && sizes.some(Boolean)

  const { w, h } = box
  // A single line height for both rows — using each row's own size would let
  // them drift apart, and a zero size would stack them.
  const lead = Math.max(...sizes, 0) * 0.9
  const lineY = (i) => h / 2 + (i - (lines.length - 1) / 2) * lead

  return (
    <>
      {/* pure scroll distance — nothing renders inside it, so the page below
          keeps its natural height and is never boxed in */}
      <div ref={runwayRef} className="zoom-runway" style={{ height: `${STEPS * SNAP_VH}vh` }} aria-hidden="true" />

      <div ref={cardRef} className="zoom-card" data-through={through} data-ready={ready} style={{ background: CARD_BG }}>
        {w > 0 && (
          <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
            <rect x="0" y="0" width={w} height={h} fill={CARD_BG} />
            <g ref={groupRef}>
              {lines.map((line, i) => (
                <text
                  key={line}
                  ref={(el) => { textRefs.current[i] = el }}
                  x={w / 2}
                  y={lineY(i)}
                  fontSize={sizes[i] || 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={CARD_FG}
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, letterSpacing: '-0.045em' }}
                >
                  {line}
                </text>
              ))}
            </g>
          </svg>
        )}

        <div className="zoom-hint" data-hide={through}>
          <span className="zoom-beats">
            {Array.from({ length: STEPS }, (_, i) => (
              <span key={i} className="zoom-beat" data-on={i < step} />
            ))}
          </span>
          <span className="zoom-label">scroll to enter</span>
        </div>
      </div>

      {children}
    </>
  )
}
