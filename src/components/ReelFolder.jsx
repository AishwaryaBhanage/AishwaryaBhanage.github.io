import { useEffect, useRef, useState } from 'react'
import { Play, X, ArrowUpRight, Film } from 'lucide-react'

/* ---------------------------------------------------------------------------
 * The reel: a folder that opens into the individual clips.
 *
 * Closed, it reads as one object with a count on it. Clicking it drops the
 * front panel and fans the clips up out of the sleeve; picking one opens an
 * inline player. Everything is driven from `creative.videos`, so adding an
 * entry there adds a row here.
 * ------------------------------------------------------------------------- */

/** Accepts a bare YouTube id or any normal YouTube URL. */
export function youTubeId(v) {
  if (!v) return null
  const raw = v.id || v.url || ''
  if (/^[\w-]{11}$/.test(raw)) return raw
  const m = raw.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : null
}

export default function ReelFolder({ videos = [] }) {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(null)
  const count = videos.length

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* ---- the folder ---- */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close the reel' : `Open the reel, ${count} clip${count === 1 ? '' : 's'}`}
        className="folder group mx-auto block w-full max-w-sm"
        data-open={open}
      >
        <span className="folder-stage">
          {/* back sleeve */}
          <span className="folder-back">
            <span className="folder-tab" />
          </span>

          {/* the clips, tucked inside */}
          <span className="folder-slips">
            {Array.from({ length: Math.min(3, Math.max(count, 2)) }, (_, i) => (
              <span key={i} className="folder-slip" style={{ '--i': i }} />
            ))}
          </span>

          {/* front panel */}
          <span className="folder-front">
            <span className="flex h-full w-full items-center justify-between px-6">
              <span className="flex items-center gap-2.5">
                <Film size={16} />
                <span className="text-[15px] font-semibold">
                  {open ? 'Close the reel' : 'Open the reel'}
                </span>
              </span>
              <span className="font-mono text-[11px] opacity-75">
                {count} {count === 1 ? 'clip' : 'clips'}
              </span>
            </span>
          </span>
        </span>
      </button>

      {/* ---- the clips ---- */}
      <div className="reel-list" data-open={open}>
        {count === 0 ? (
          <p
            className="rounded-xl border px-5 py-6 text-center text-[13px] leading-relaxed"
            style={{ borderColor: 'var(--rule)', color: 'var(--fg-3)' }}
          >
            No clips in here yet. Add YouTube links to{' '}
            <code className="font-mono" style={{ color: 'var(--accent)' }}>creative.videos</code>{' '}
            and each one becomes a row.
          </p>
        ) : (
          <ul className="space-y-2">
            {videos.map((v, i) => (
              <li key={v.id || v.url || i} className="reel-row" style={{ '--i': i }}>
                <button
                  onClick={() => setPlaying(v)}
                  className="group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors hover:border-[var(--accent)]"
                  style={{ borderColor: 'var(--rule)', background: 'var(--bg-elev)' }}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform group-hover:scale-110"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <Play size={14} fill="currentColor" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold" style={{ color: 'var(--fg)' }}>
                      {v.title}
                    </span>
                    {v.note && (
                      <span className="mt-0.5 block truncate text-[12px]" style={{ color: 'var(--fg-3)' }}>
                        {v.note}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--fg-3)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {playing && <Player video={playing} onClose={() => setPlaying(null)} />}
    </div>
  )
}

/** Inline player. Esc closes, background scroll is frozen while open. */
function Player({ video, onClose }) {
  const id = youTubeId(video)
  const ref = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="fade fixed inset-0 z-[80] flex items-center justify-center px-4"
      style={{ background: 'rgba(10,7,16,.93)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-white">{video.title}</p>
            {video.note && <p className="mt-0.5 truncate text-[12px] text-white/60">{video.note}</p>}
          </div>
          <button
            ref={ref}
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/20 text-white/80 transition-colors hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {id ? (
          <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : (
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-5 py-4 text-sm text-white"
          >
            Open on YouTube <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </div>
  )
}
