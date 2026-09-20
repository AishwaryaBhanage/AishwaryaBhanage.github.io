import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
 * The name, choreographed as a real crossword.
 *
 *   1. "Aishwarya" stacks into a vertical column
 *   2. "Bhanage" runs in horizontally and crosses it ON A SHARED "a" —
 *      Aishwary(a) index 5 sits exactly on Bh(a)nage index 2
 *   3. the cross holds
 *   4. the column unfolds; the two settle as two stacked lines, flush left
 *
 * Then it rests and runs again every ten seconds. Letter positions are measured
 * from the live DOM, so the intersection lands on the glyph, not on an estimate.
 * ------------------------------------------------------------------------- */

const P = { HIDDEN: 0, COLUMN: 1, CROSS: 2, HOLD: 3, REST: 4 }

const BEATS = [160, 950, 750, 950]
const LOOP_MS = 10000

const LINE_EM = 0.78      // spacing inside the vertical column
const ROW_EM = 1.02       // spacing between the two resting lines
const CROSS_SCALE = 0.42  // the cross is drawn small enough to fit

export default function NameChoreo({
  first = 'Aishwarya',
  last = 'Bhanage',
  // Which letter the two words share. Aishwary(a)=5, Bh(a)nage=2.
  crossFirst = 5,
  crossLast = 2,
  className = '',
}) {
  const [phase, setPhase] = useState(P.HIDDEN)
  const stageRef = useRef(null)
  const aRef = useRef(null)
  const bRef = useRef(null)
  const m = useRef(null)

  /* --- measure ------------------------------------------------------------ */
  useLayoutEffect(() => {
    const measure = () => {
      const A = aRef.current, B = bRef.current, S = stageRef.current
      if (!A || !B || !S) return
      const read = (host) =>
        Array.from(host.querySelectorAll('.nc-l')).map((el) => ({
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
        }))
      m.current = {
        a: read(A), b: read(B),
        wA: A.offsetWidth, hA: A.offsetHeight,
        wB: B.offsetWidth, hB: B.offsetHeight,
        em: parseFloat(getComputedStyle(S).fontSize) || 16,
        stageW: S.offsetWidth,
      }
      paint(phase)
    }

    measure()
    window.addEventListener('resize', measure)

    // Measure again once the web font has actually arrived. The first pass runs
    // against the fallback face, whose glyph widths differ from Sora's — which
    // is what threw the two "a"s out of register.
    let live = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { if (live) measure() })
    }

    return () => {
      live = false
      window.removeEventListener('resize', measure)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* --- paint -------------------------------------------------------------- */
  const paint = (ph) => {
    const A = aRef.current, B = bRef.current, S = stageRef.current
    if (!A || !B || !S || !m.current) return
    const { a, b, wA, hA, wB, hB, em, stageW } = m.current

    const crossing = ph === P.COLUMN || ph === P.CROSS || ph === P.HOLD
    S.style.transform = `scale(${crossing ? CROSS_SCALE : 1})`

    A.style.opacity = ph >= P.COLUMN ? '1' : '0'
    B.style.opacity = ph >= P.CROSS ? '1' : '0'

    // Words are centred by default, so stage-centre is (0, 0) for each.
    if (crossing) {
      // The shared letter sits on the origin. The column hangs from it, and the
      // horizontal word slides so its own "a" lands on exactly the same spot —
      // on both axes, since the two line boxes need not share a baseline.
      A.style.transform = 'translate3d(0, 0, 0)'
      const dx = wB / 2 - b[crossLast].x
      const dy = (a[crossFirst].y - hA / 2) - (b[crossLast].y - hB / 2)
      B.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
    } else {
      // At rest: two stacked lines sharing a left edge.
      const left = -stageW / 2
      A.style.transform =
        `translate3d(${(left + wA / 2).toFixed(1)}px, ${(-ROW_EM * em / 2).toFixed(1)}px, 0)`
      B.style.transform =
        `translate3d(${(left + wB / 2).toFixed(1)}px, ${(ROW_EM * em / 2).toFixed(1)}px, 0)`
    }

    // First word: a vertical column hinged on its shared letter.
    const step = LINE_EM * em
    Array.from(A.querySelectorAll('.nc-l')).forEach((el, i) => {
      if (crossing) {
        el.style.transform =
          `translate3d(${(wA / 2 - a[i].x).toFixed(2)}px, ${((i - crossFirst) * step).toFixed(2)}px, 0)`
        el.style.transitionDelay = `${Math.abs(i - crossFirst) * 0.04}s`
      } else {
        el.style.transform = 'translate3d(0, 0, 0)'
        el.style.transitionDelay = `${i * 0.022}s`
      }
    })

    // Second word stays horizontal; it only slides in from the right.
    Array.from(B.querySelectorAll('.nc-l')).forEach((el, i) => {
      el.style.transform = ph >= P.CROSS
        ? 'translate3d(0, 0, 0)'
        : `translate3d(${(wB * 0.85).toFixed(2)}px, 0, 0)`
      el.style.transitionDelay = `${i * 0.03}s`
      // A crossword shares one cell, not two stacked glyphs — while the words
      // are crossed the column owns the shared letter and this one steps aside.
      el.style.opacity = crossing && i === crossLast ? '0' : '1'
    })
  }

  useEffect(() => { paint(phase) })

  /* --- run ---------------------------------------------------------------- */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(P.REST)
      return
    }
    let timers = []
    const run = () => {
      timers.forEach(clearTimeout)
      timers = []
      setPhase(P.HIDDEN)
      let t = 0
      BEATS.forEach((d, i) => {
        t += d
        timers.push(setTimeout(() => setPhase(i + 1), t))
      })
    }
    run()
    const loop = setInterval(run, LOOP_MS)
    return () => { timers.forEach(clearTimeout); clearInterval(loop) }
  }, [])

  const letters = (word, share) =>
    Array.from(word).map((ch, i) => (
      <span key={i} className={`nc-l ${i === share ? 'nc-share' : ''}`} aria-hidden="true">{ch}</span>
    ))

  return (
    <h1 className={`name-choreo ${className}`} aria-label={`${first} ${last}`}>
      <span ref={stageRef} className="nc-stage">
        <span ref={aRef} className="nc-word">{letters(first, crossFirst)}</span>
        <span ref={bRef} className="nc-word">{letters(last, crossLast)}</span>
      </span>
    </h1>
  )
}
