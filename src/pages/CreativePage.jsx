import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Users } from 'lucide-react'
import { creative, campus, profile } from '../data/content'
import { Card } from '../components/primitives'
import Lightbox from '../components/Lightbox'
import ReelFolder from '../components/ReelFolder'
import NameChoreo from '../components/NameChoreo'
import { Magnetic } from '../components/interactive'
import { ScrollDriver, ScrollBackdrop, Move, ScrollTicker } from '../components/scrollmotion'
import {
  Blooms, Flecks, MaskReveal, Odometer, GiantWord, useParallax,
} from '../components/motion'

const IMG = '/images/creative'

const TRAITS = [
  { icon: '🌟', label: 'Optimistic' },
  { icon: '🎯', label: 'Goal-oriented' },
  { icon: '💃', label: 'Creative' },
  { icon: '🤝', label: 'Collaborative' },
  { icon: '📚', label: 'Lifelong learner' },
  { icon: '🌍', label: 'Cultural explorer' },
]

const NUMBERS = [
  { value: '10+',   label: 'Years dancing',  note: 'Bharatanatyam, Bollywood and hip-hop' },
  { value: '50+',   label: 'Stage shows',    note: 'and counting' },
  { value: '35',    label: 'Days in Qatar',  note: 'FIFA World Cup 2022, representing India' },
  { value: '$900K', label: 'Budget managed', note: 'for 8,000 graduate students' },
]

export default function CreativePage() {
  const [lb, setLb] = useState(null)
  const galleryRef = useRef(null)
  useParallax(galleryRef)

  return (
    <div className="relative z-[2]">
      <ScrollDriver />
      <ScrollBackdrop />
      <span className="scroll-bar" aria-hidden="true" />
      <BeatRail />

      {/* ══ 01 · OPENING ════════════════════════════════════════════════ */}
      <section id="top" className="relative flex h-full flex-col justify-center overflow-hidden">
        <Blooms />
        <Flecks count={16} />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--fg-3)' }}>
              Aishwarya Bhanage · Off stage · 2026
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--fg-3)' }}>
              Stage · Lens · Service
            </p>
          </div>

          {/* the same name, now as the crossword the site is built around */}
          <div className="mt-8">
            <NameChoreo
              first="Aishwarya"
              last="Bhanage"
              className="min-w-0 text-[clamp(2.5rem,10vw,7.5rem)]"
            />
          </div>

          <MaskReveal dir="left" delay={0.12} className="mt-8">
            <p className="max-w-2xl text-[clamp(1.05rem,2.2vw,1.4rem)] leading-[1.45]" style={{ color: 'var(--fg-2)' }}>
              Ten years of Bharatanatyam, Bollywood and hip-hop. A world-cup stage in Qatar
              for thirty-five days. A camera that comes everywhere, and a budget for eight
              thousand students. None of it was quick, and that is the point.
            </p>
          </MaskReveal>
        </div>
      </section>

      {/* scroll-driven bands — they only move while you do */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: 'var(--rule)', background: 'var(--bg-sunk)' }}>
        <ScrollTicker
          items={['BHARATANATYAM', 'BOLLYWOOD', 'HIP-HOP', 'FIFA WORLD CUP 2022', 'PHOTOGRAPHY']}
          speed={0.6}
          className="kinetic text-[clamp(1.1rem,3vw,2rem)]"
          sep="✳"
        />
        <ScrollTicker
          items={['50+ SHOWS', '10+ YEARS', '35 DAYS IN QATAR', '$900K BUDGET', '8,000 STUDENTS']}
          speed={0.95}
          reverse
          className="mt-2 font-mono text-[clamp(.7rem,1.5vw,.95rem)] opacity-55"
        />
      </div>

      {/* ══ 02 · THE NUMBERS ════════════════════════════════════════════ */}
      <section id="about" className="relative overflow-hidden">
        <Flecks count={12} />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <p className="mb-14 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-3)' }}>
            01 / About
          </p>

          {/* In her own words, before any of the numbers. */}
          <div className="mb-20 grid gap-x-14 gap-y-9 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
            <MaskReveal dir="left">
              <h2 className="kinetic text-[clamp(2.25rem,6vw,4rem)] leading-[0.95]">Who am I?</h2>
              <p className="mt-4 text-[clamp(1.05rem,2vw,1.3rem)] italic" style={{ color: 'var(--fg-3)' }}>
                Beyond the data and algorithms
              </p>
            </MaskReveal>

            <MaskReveal dir="right" delay={0.1}>
              <div className="space-y-5 text-[clamp(1.05rem,1.7vw,1.25rem)] leading-[1.6]" style={{ color: 'var(--fg-2)' }}>
                <p>
                  I'm <b style={{ color: 'var(--fg)' }}>Aishwarya Bhanage</b>, a passionate and free
                  spirited happy soul who finds beauty in both data patterns and life's rhythms.
                  While my professional world revolves around artificial intelligence and machine
                  learning, my heart beats to the rhythm of dance, cultural expression, and human
                  connection.
                </p>
                <p>
                  I believe in living life with purpose, embracing challenges with a smile, and
                  finding joy in every small victory. Whether I'm debugging code at 2 AM or
                  performing on stage, I bring the same energy, dedication, and love for what I do.
                </p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {TRAITS.map((t, i) => (
                  <li key={t.label} className="trait" style={{ '--i': i }}>
                    <span aria-hidden="true">{t.icon}</span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </MaskReveal>
          </div>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {NUMBERS.map((n, i) => (
              <Move key={n.label} y={i % 2 ? 26 : -26} rotate={i % 2 ? 1 : -1}>
                <BigNumber {...n} />
              </Move>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 03 · WHAT I PRACTISE ════════════════════════════════════════ */}
      <section id="practise" className="relative overflow-hidden border-t" style={{ borderColor: 'var(--rule)' }}>
        <Blooms />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-3)' }}>
              02 / Four things I keep coming back to
            </p>
            <p className="mx-auto mt-6 max-w-lg text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug" style={{ color: 'var(--fg-2)' }}>
              I stay with things long after the novelty wears off.
            </p>
            <div className="mt-8 overflow-hidden">
              <Move x={-40} className="flex justify-center">
                <GiantWord word="practise." />
              </Move>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {creative.passions.map((p, i) => (
              <Move key={p.id} y={i % 2 ? 30 : -18} className="h-full">
                <MaskReveal dir={i % 2 ? 'right' : 'left'} delay={i * 0.06} className="h-full">
                  <Card className="flex h-full flex-col p-7 sm:p-8">
                    <p className="font-mono text-[11px]" style={{ color: 'var(--fg-3)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.5rem,3.2vw,2rem)] font-bold leading-tight tracking-tight" style={{ color: 'var(--fg)' }}>
                      {p.title.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="script italic font-normal" style={{ color: 'var(--accent)' }}>
                        {p.title.split(' ').slice(-1)}
                      </span>
                    </h3>
                    <p className="mt-4 max-w-md flex-1 text-[14px] leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                      {p.body}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider"
                          style={{ borderColor: 'var(--rule)', color: 'var(--fg-3)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Card>
                </MaskReveal>
              </Move>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 04 · THE STAGE ══ deep brown ════════════════════════════════ */}
      <section id="photos" className="invert relative overflow-hidden">
        <Blooms />
        <Flecks count={26} />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mb-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-ink)' }}>
              03 / Photographs
            </p>
            <p className="mx-auto mt-6 max-w-xl text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug" style={{ color: 'var(--fg-2)' }}>
              Thirty-five days in Qatar, fifty-odd shows, and a lot of rehearsal rooms.
            </p>
            <div className="mt-8 overflow-hidden">
              <Move x={40} className="flex justify-center">
                <GiantWord word="stage." />
              </Move>
            </div>
          </div>

          <div ref={galleryRef} className="columns-2 gap-3 sm:gap-4 md:columns-3">
            {creative.gallery.map((g, i) => (
              <MaskReveal key={g.src} dir={i % 2 ? 'up' : 'left'} delay={(i % 3) * 0.05}>
                <button
                  onClick={() => setLb(i)}
                  data-par={(i % 3) - 1}
                  className="photo-card group mb-3 block w-full rounded-xl sm:mb-4"
                  style={{ background: 'var(--bg-sunk)' }}
                  aria-label={`Open ${g.title}`}
                >
                  <img
                    src={`${IMG}/thumb/${g.src}`}
                    alt={g.caption || g.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full"
                  />
                  <span
                    className="absolute inset-0 z-[3] flex flex-col justify-end p-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ background: 'linear-gradient(to top, rgba(20,10,4,.92), rgba(20,10,4,0) 58%)' }}
                  >
                    <span className="text-left text-[17px] font-bold leading-tight tracking-tight text-white">{g.title}</span>
                    <span className="mt-0.5 text-left text-[11px] leading-snug text-white/70">{g.caption}</span>
                  </span>
                </button>
              </MaskReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 05 · OFF STAGE ══════════════════════════════════════════════ */}
      <section id="leading" className="relative overflow-hidden">
        <Flecks count={10} />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-14 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-3)' }}>
              04 / Off stage
            </p>
            <p className="mx-auto mt-6 max-w-xl text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug" style={{ color: 'var(--fg-2)' }}>
              A $900K budget, 1,300 applications, and 5,000 women represented on campus safety.
            </p>
            <div className="mt-8 overflow-hidden">
              <Move x={-30} className="flex justify-center">
                <GiantWord word="lead." />
              </Move>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {campus.map((c, i) => (
              <MaskReveal key={c.id} dir={i % 2 ? 'right' : 'left'} delay={i * 0.06}>
                <Card className="h-full p-5 sm:p-6">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      <Users size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--fg)' }}>{c.role}</h3>
                      <p className="mt-0.5 text-[12px]" style={{ color: 'var(--fg-3)' }}>{c.org} · {c.period}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {c.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 text-[13px] leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                        <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: 'var(--accent)' }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </MaskReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 06 · CLOSE ══════════════════════════════════════════════════ */}
      {/* ══ 05 · VIDEOS ═════════════════════════════════════════════════ */}
      <section id="videos" className="relative overflow-hidden border-t" style={{ borderColor: 'var(--rule)' }}>
        <Blooms />
        <div className="relative mx-auto w-full max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-ink)' }}>
            05 / Videos
          </p>
          <h2 className="kinetic mt-4 text-[clamp(2rem,6vw,4rem)] leading-[0.95]" style={{ color: 'var(--fg)' }}>
            Want to see the{' '}
            <span className="script italic font-normal" style={{ color: 'var(--accent)' }}>whole reel?</span>
          </h2>

          <div className="mt-12">
            <ReelFolder videos={creative.videos} />
          </div>
        </div>
      </section>

      {/* ══ 06 · CONTACT ════════════════════════════════════════════════ */}
      <section id="contact" className="relative overflow-hidden border-t" style={{ borderColor: 'var(--rule)' }}>
        <div className="relative mx-auto w-full max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-ink)' }}>
            06 / Contact
          </p>
          <h2 className="kinetic mt-4 text-[clamp(1.75rem,4.5vw,3rem)] leading-[1]" style={{ color: 'var(--fg)' }}>
            Say hello.
          </h2>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-[16px] font-semibold"
                style={{ background: 'var(--fg)', color: 'var(--bg)' }}
              >
                {profile.email} <ArrowUpRight size={16} />
              </a>
            </Magnetic>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[12px] uppercase tracking-[0.16em]">
            <a href="/resume/Aishwarya_Bhanage_Campus_Leadership.pdf" download className="transition-opacity hover:opacity-60" style={{ color: 'var(--fg-3)' }}>
              Campus résumé
            </a>
            {creative.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60" style={{ color: 'var(--fg-3)' }}>
                {l.label}
              </a>
            ))}
            <Link to="/" className="transition-opacity hover:opacity-60" style={{ color: 'var(--accent-ink)' }}>
              The technical side →
            </Link>
          </div>
        </div>
      </section>

      {lb != null && (
        <Lightbox items={creative.gallery} index={lb} setIndex={setLb} onClose={() => setLb(null)} base={IMG} />
      )}
    </div>
  )
}

/** A headline figure, with the digits rolling into place. */
function BigNumber({ value, label, note }) {
  return (
    <div>
      <p className="kinetic text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.82]" style={{ color: 'var(--fg)' }}>
        <Odometer value={value} />
      </p>
      <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--fg)' }}>
        {label}
      </p>
      {note && <p className="mt-1 max-w-[22ch] text-[12px] leading-snug" style={{ color: 'var(--fg-3)' }}>{note}</p>}
    </div>
  )
}

/** Beat-marked progress rail down the right edge. */
function BeatRail() {
  const ref = useRef(null)
  useEffect(() => {
    const host = ref.current
    if (!host) return
    const ticks = Array.from(host.children)
    let raf = 0
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      const lit = Math.round(p * (ticks.length - 1))
      ticks.forEach((t, i) => t.classList.toggle('on', i <= lit))
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
  }, [])
  return (
    <div ref={ref} className="beat-rail" style={{ color: 'var(--fg-3)' }} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => <span key={i} className="tickmark" />)}
    </div>
  )
}
