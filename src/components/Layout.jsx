import { useEffect, useLayoutEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Menu, X, Command } from 'lucide-react'
import { Github, Linkedin } from './BrandIcons'
import { profile } from '../data/content'
import { CursorLayer } from './interactive'
import PillNav from './PillNav'
import ZoomIntro, { gateSpent, GATE_VH } from './ZoomIntro'

export const TECH_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const CREATIVE_NAV = [
  { to: '/creative', label: 'Creative', end: true },
  { to: '/contact', label: 'Contact' },
]

/* The name is the shell of the whole site: scrolling all the way out returns
   to it from either side, so both roots carry the entrance. */
const GATED = ['/', '/creative']

export default function Layout({ children, onOpenPalette }) {
  const { pathname } = useLocation()
  const isCreative = pathname.startsWith('/creative')
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('ab_dark')
      if (saved !== null) return saved === '1'
    } catch { /* storage blocked */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('ab_dark', dark ? '1' : '0') } catch { /* storage blocked */ }
  }, [dark])

  useEffect(() => {
    document.documentElement.dataset.world = isCreative ? 'creative' : 'tech'
  }, [isCreative])

  // Layout effect, not a plain one: the scroll must land before the first paint
  // or the entrance card flashes on the way back to the home route.
  useLayoutEffect(() => {
    setOpen(false)
    // Coming home after you have already been inside lands below the entrance,
    // so the door is still there to scroll up into but never replays.
    const past = GATED.includes(pathname) && gateSpent()
    // `behavior: 'instant'` matters: html has `scroll-behavior: smooth`, which
    // makes a bare scrollTo *animate*. On a route change that meant travelling
    // through 102vh of empty runway — and if anything interrupted the tween you
    // were left parked in it, looking at nothing.
    const target = past ? (GATE_VH / 100) * window.innerHeight : 0
    window.scrollTo({ top: target, behavior: 'instant' })
    // The new page's height is not final yet (fonts, images), so the browser
    // may clamp that scroll short and leave you parked inside the runway
    // looking at nothing. Re-apply once layout has settled.
    const again = requestAnimationFrame(() =>
      window.scrollTo({ top: target, behavior: 'instant' })
    )
    return () => cancelAnimationFrame(again)
  }, [pathname])

  // Reveal-on-scroll for anything tagged .reveal, re-scanned per route.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // A route change drops any section-driven accent override.
  useEffect(() => {
    const root = document.documentElement
    root.style.removeProperty('--accent')
    root.style.removeProperty('--accent-soft')
    root.style.removeProperty('--wash')
  }, [pathname])

  const links = isCreative ? CREATIVE_NAV : TECH_NAV

  return (
    <div className="grain flex min-h-screen flex-col">
      <CursorLayer />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Skip to content
      </a>

      {isCreative && <PillNav dark={dark} setDark={setDark} />}

      <header
        className="fixed inset-x-0 top-0 z-50 border-b"
        style={{
          display: isCreative ? 'none' : undefined,
          background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
          backdropFilter: 'blur(12px) saturate(1.4)',
          borderColor: 'var(--rule)',
        }}
      >
        <nav className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between gap-4 px-6 md:px-12">
          <Link to="/" className="font-display text-[17px] leading-none" style={{ color: 'var(--fg)' }}>
            Aishwarya Bhanage
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className="font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
                style={({ isActive }) => ({ color: isActive ? 'var(--accent-ink)' : 'var(--fg-3)' })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors sm:flex"
              style={{ borderColor: 'var(--rule)', color: 'var(--fg-3)' }}
            >
              <Command size={11} /> K
            </button>


            <WorldSwitch isCreative={isCreative} />

            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-md border"
              style={{ borderColor: 'var(--rule)', color: 'var(--fg-2)' }}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-md border md:hidden"
              style={{ borderColor: 'var(--rule)', color: 'var(--fg-2)' }}
            >
              {open ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t md:hidden" style={{ borderColor: 'var(--rule)', background: 'var(--bg)' }}>
            <div className="mx-auto max-w-6xl px-5 py-3">
              <div className="mb-3 sm:hidden">
                <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--fg-3)' }}>
                  World
                </p>
                <div className="flex gap-1.5 px-3">
                  {[{ to: '/', label: 'Technical', on: !isCreative }, { to: '/creative', label: 'Creative', on: isCreative }].map((o) => (
                    <Link
                      key={o.to}
                      to={o.to}
                      className="rounded-md border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider"
                      style={{
                        borderColor: o.on ? 'var(--accent)' : 'var(--rule)',
                        background: o.on ? 'var(--accent-soft)' : 'transparent',
                        color: o.on ? 'var(--accent)' : 'var(--fg-3)',
                      }}
                    >
                      {o.label}
                    </Link>
                  ))}
                </div>
              </div>

              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className="block rounded-md px-3 py-2.5 text-sm"
                  style={({ isActive }) => ({ color: isActive ? 'var(--fg)' : 'var(--fg-2)' })}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* keyed on pathname so each route animates in */}
      <ZoomIntro enabled={GATED.includes(pathname)}>
        <main id="main" key={pathname} className="page-in flex-1">{children}</main>
      </ZoomIntro>

      <footer className="relative z-[2] border-t" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Link
              to={isCreative ? '/' : '/creative'}
              className="group inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              {isCreative ? 'Switch to the technical world' : 'Switch to the creative world'}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <div className="flex items-center gap-3">
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={{ color: 'var(--fg-3)' }} className="transition-opacity hover:opacity-70">
                <Github size={16} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ color: 'var(--fg-3)' }} className="transition-opacity hover:opacity-70">
                <Linkedin size={16} />
              </a>
              <span className="font-mono text-[11px]" style={{ color: 'var(--fg-3)' }}>
                © {new Date().getFullYear()} {profile.name}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/** TECHNICAL | CREATIVE segmented switch — the two worlds. */
function WorldSwitch({ isCreative }) {
  const opts = [
    { to: '/', label: 'Technical', on: !isCreative },
    { to: '/creative', label: 'Creative', on: isCreative },
  ]
  return (
    <div
      role="group"
      aria-label="Switch world"
      className="hidden items-center gap-0.5 rounded-lg border p-0.5 sm:flex"
      style={{ borderColor: 'var(--rule)', background: 'var(--bg-elev)' }}
    >
      {opts.map((o) => (
        <Link
          key={o.to}
          to={o.to}
          aria-current={o.on ? 'true' : undefined}
          className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all"
          style={{
            background: o.on ? 'var(--accent-soft)' : 'transparent',
            color: o.on ? 'var(--accent)' : 'var(--fg-3)',
            fontWeight: o.on ? 600 : 400,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: o.on ? 'var(--accent)' : 'var(--fg-3)' }} />
          {o.label}
        </Link>
      ))}
    </div>
  )
}
