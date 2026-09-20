import { useEffect, useRef, useState } from 'react'

/**
 * Signature hero visual: a 2-D embedding space running the retrieval loop
 * Aishwarya actually builds — drift → query → ANN recall → rerank → promote.
 *
 * Canvas + rAF, DPR-aware, reads theme colours from CSS vars so it follows
 * light and dark. Falls back to a static frame under prefers-reduced-motion.
 */

const N = 78           // corpus points
const RECALL = 16      // "top-100" stand-in, scaled to the visual
const TOPK = 5         // promoted after rerank

const PHASES = [
  { id: 'idle',    label: 'corpus',  detail: 'embedded · normalized', ms: 1100 },
  { id: 'query',   label: 'query',   detail: 'encode · 1536-d',       ms: 900  },
  { id: 'recall',  label: 'retrieve', detail: `ANN recall · top-${RECALL}`, ms: 1500 },
  { id: 'rerank',  label: 'rerank',  detail: 'cross-encoder',         ms: 1500 },
  { id: 'promote', label: 'top-k',   detail: `${TOPK} passed to the model`, ms: 1700 },
]

function cssVar(el, name, fallback) {
  const v = getComputedStyle(el).getPropertyValue(name).trim()
  return v || fallback
}

export default function EmbeddingSpace({ className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- corpus --------------------------------------------------------------
    // Three loose clusters so recall has visible structure to find.
    const centers = [
      { x: 0.30, y: 0.34 }, { x: 0.70, y: 0.30 }, { x: 0.52, y: 0.72 },
    ]
    const pts = Array.from({ length: N }, (_, i) => {
      const c = centers[i % centers.length]
      const a = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.65) * 0.22
      return {
        x: c.x + Math.cos(a) * r,
        y: c.y + Math.sin(a) * r * 0.9,
        // gentle drift
        vx: (Math.random() - 0.5) * 0.00022,
        vy: (Math.random() - 0.5) * 0.00022,
        r: 1.6 + Math.random() * 1.9,
        seed: Math.random() * Math.PI * 2,
        score: 0,     // rerank score
        rank: -1,     // final position
        lit: 0,       // 0..1 recall highlight
      }
    })

    let query = { x: 0.5, y: 0.5, on: 0 }
    let recalled = []
    let ranked = []

    let w = 0, h = 0, dpr = 1
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width; h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // --- phase machine -------------------------------------------------------
    let pi = 0
    let phaseStart = performance.now()

    const enter = (i) => {
      pi = i
      phaseStart = performance.now()
      setPhase(i)
      const id = PHASES[i].id

      if (id === 'query') {
        // Fire the query somewhere near a cluster, not dead centre.
        const c = centers[Math.floor(Math.random() * centers.length)]
        query = { x: c.x + (Math.random() - 0.5) * 0.18, y: c.y + (Math.random() - 0.5) * 0.18, on: 0 }
        pts.forEach((p) => { p.lit = 0; p.score = 0; p.rank = -1 })
        recalled = []; ranked = []
      }
      if (id === 'recall') {
        recalled = [...pts]
          .map((p) => ({ p, d: Math.hypot(p.x - query.x, p.y - query.y) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, RECALL)
          .map((o) => o.p)
      }
      if (id === 'rerank') {
        // The point of a reranker: cosine order is not final order.
        recalled.forEach((p) => { p.score = Math.random() })
        ranked = [...recalled].sort((a, b) => b.score - a.score)
        ranked.forEach((p, n) => { p.rank = n })
      }
    }

    // --- draw ----------------------------------------------------------------
    const draw = (now) => {
      const root = document.documentElement
      const accent = cssVar(root, '--accent', '#9C4430')
      const fg3 = cssVar(root, '--fg-3', '#7A6A58')
      const rule = cssVar(root, '--rule', 'rgba(0,0,0,.12)')

      const el = PHASES[pi]
      const t = (now - phaseStart) / el.ms
      if (t >= 1) enter((pi + 1) % PHASES.length)
      const ease = Math.min(1, Math.max(0, t))

      ctx.clearRect(0, 0, w, h)

      const X = (v) => v * w
      const Y = (v) => v * h

      // faint grid — reads as "a space", not decoration
      ctx.strokeStyle = rule
      ctx.lineWidth = 1
      const step = 44
      ctx.beginPath()
      for (let gx = step; gx < w; gx += step) { ctx.moveTo(gx, 0); ctx.lineTo(gx, h) }
      for (let gy = step; gy < h; gy += step) { ctx.moveTo(0, gy); ctx.lineTo(w, gy) }
      ctx.globalAlpha = 0.5
      ctx.stroke()
      ctx.globalAlpha = 1

      // drift
      if (!reduce) {
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy
          if (p.x < 0.06 || p.x > 0.94) p.vx *= -1
          if (p.y < 0.06 || p.y > 0.94) p.vy *= -1
        }
      }

      const id = el.id

      // recall rays
      if (id === 'recall' || id === 'rerank' || id === 'promote') {
        recalled.forEach((p, n) => {
          const appear = id === 'recall' ? Math.min(1, Math.max(0, ease * RECALL - n)) : 1
          if (appear <= 0) return
          p.lit = Math.max(p.lit, appear)
          ctx.strokeStyle = accent
          ctx.globalAlpha = 0.16 * appear
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(X(query.x), Y(query.y))
          ctx.lineTo(X(p.x), Y(p.y))
          ctx.stroke()
        })
        ctx.globalAlpha = 1
      }

      // promoted top-k: pull them onto a ring around the query
      if (id === 'promote') {
        const k = ranked.slice(0, TOPK)
        k.forEach((p, n) => {
          const a = (-Math.PI / 2) + (n / TOPK) * Math.PI * 2
          const R = 0.17
          const tx = query.x + Math.cos(a) * R
          const ty = query.y + Math.sin(a) * R * 0.92
          const e = 1 - Math.pow(1 - ease, 3)
          const px = p.x + (tx - p.x) * e
          const py = p.y + (ty - p.y) * e

          ctx.strokeStyle = accent
          ctx.globalAlpha = 0.5 * e
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(X(query.x), Y(query.y))
          ctx.lineTo(X(px), Y(py))
          ctx.stroke()
          ctx.globalAlpha = 1

          ctx.fillStyle = accent
          ctx.beginPath()
          ctx.arc(X(px), Y(py), 3.4 + 1.6 * e, 0, Math.PI * 2)
          ctx.fill()

          // rank label
          ctx.globalAlpha = e
          ctx.fillStyle = accent
          ctx.font = '600 9px ui-monospace, monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`${n + 1}`, X(px), Y(py) - 8)
          ctx.globalAlpha = 1
        })
      }

      // corpus points
      const promoted = id === 'promote' ? new Set(ranked.slice(0, TOPK)) : new Set()
      for (const p of pts) {
        if (promoted.has(p)) continue
        const pulse = reduce ? 0 : Math.sin(now / 900 + p.seed) * 0.35 + 0.65
        const isLit = p.lit > 0 && (id === 'recall' || id === 'rerank')
        ctx.beginPath()
        ctx.arc(X(p.x), Y(p.y), p.r + (isLit ? 1.2 : 0), 0, Math.PI * 2)
        if (isLit) {
          ctx.fillStyle = accent
          ctx.globalAlpha = 0.35 + 0.45 * p.lit
        } else {
          ctx.fillStyle = fg3
          ctx.globalAlpha = 0.18 + 0.16 * pulse
        }
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // query marker + expanding search radius
      if (id !== 'idle') {
        const qx = X(query.x), qy = Y(query.y)
        if (id === 'recall') {
          const rr = ease * Math.min(w, h) * 0.42
          ctx.strokeStyle = accent
          ctx.globalAlpha = 0.35 * (1 - ease)
          ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.arc(qx, qy, rr, 0, Math.PI * 2); ctx.stroke()
          ctx.globalAlpha = 1
        }
        ctx.fillStyle = accent
        ctx.beginPath(); ctx.arc(qx, qy, 4.6, 0, Math.PI * 2); ctx.fill()
        ctx.strokeStyle = accent
        ctx.globalAlpha = 0.45
        ctx.lineWidth = 1.2
        ctx.beginPath(); ctx.arc(qx, qy, 9 + (reduce ? 0 : Math.sin(now / 320) * 2), 0, Math.PI * 2); ctx.stroke()
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(draw)
    }

    let raf = requestAnimationFrame(draw)
    enter(0)

    // Pause when scrolled away — no wasted frames.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw) }
      else { cancelAnimationFrame(raf); raf = 0 }
    }, { threshold: 0 })
    io.observe(wrap)

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])

  const el = PHASES[phase]

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-xl border ${className}`}
      style={{ borderColor: 'var(--rule)', background: 'var(--bg-elev)' }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3.5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
          retrieval · rerank
        </p>
        <p className="font-mono text-[10px]" style={{ color: 'var(--fg-3)' }}>
          {N} vectors
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 px-3.5 py-3">
        <p className="font-mono text-[11px] font-medium" style={{ color: 'var(--accent)' }}>
          {el.label}
        </p>
        <p className="truncate font-mono text-[10px]" style={{ color: 'var(--fg-3)' }}>
          {el.detail}
        </p>
      </div>

      {/* phase ticks */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-[2px]">
        {PHASES.map((p, i) => (
          <span
            key={p.id}
            className="h-full flex-1 transition-colors duration-300"
            style={{ background: i === phase ? 'var(--accent)' : 'var(--rule)' }}
          />
        ))}
      </div>

      <span className="sr-only">
        An animation of a vector retrieval pipeline: a query is encoded, nearest neighbours are recalled,
        a reranker reorders them, and the top {TOPK} are promoted.
      </span>
    </div>
  )
}
