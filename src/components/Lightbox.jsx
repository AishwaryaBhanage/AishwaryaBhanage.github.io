import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

/** Full-size viewer for the creative gallery. Arrow keys and Esc work. */
export default function Lightbox({ items, index, setIndex, onClose, base }) {
  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + items.length) % items.length),
    [items.length, setIndex]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    // Freeze the page behind the overlay.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [go, onClose])

  if (index == null) return null
  const item = items[index]

  return (
    <div
      className="fade fixed inset-0 z-[80] flex flex-col"
      style={{ background: 'rgba(8,6,5,.94)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] text-white/50">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-3 sm:gap-4 sm:px-6">
        <button
          onClick={(e) => { e.stopPropagation(); go(-1) }}
          aria-label="Previous"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>

        <img
          src={`${base}/${item.src}`}
          alt={item.caption || item.title}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full min-h-0 max-w-full rounded-lg object-contain"
        />

        <button
          onClick={(e) => { e.stopPropagation(); go(1) }}
          aria-label="Next"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="px-5 py-5 text-center sm:px-8 sm:py-6">
        <p className="font-display text-xl text-white">{item.title}</p>
        {item.caption && <p className="mx-auto mt-1 max-w-xl text-[13px] text-white/60">{item.caption}</p>}
      </div>
    </div>
  )
}
