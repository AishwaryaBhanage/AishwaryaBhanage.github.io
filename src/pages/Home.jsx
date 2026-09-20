import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { Github, Linkedin } from '../components/BrandIcons'
import { profile, metrics } from '../data/content'
import ResumeMenu from '../components/ResumeMenu'
import EmbeddingSpace from '../components/EmbeddingSpace'
import { Reveal, Count } from '../components/editorial'

const CONTENTS = [
  { to: '/experience', n: '01', label: 'Experience', hint: 'Three years of ML in production, plus founding-engineer work' },
  { to: '/projects',   n: '02', label: 'Projects',   hint: 'Agentic tooling, RAG, forecasting, full-stack' },
  { to: '/skills',     n: '03', label: 'Skills',     hint: 'Anchored to evidence, not self-assessment' },
  { to: '/about',      n: '04', label: 'About',      hint: 'Leadership, awards, and the short version' },
  { to: '/creative',   n: '05', label: 'Creative',   hint: 'The world-cup stage, and everything off the clock' },
]

export default function Home() {
  return (
    <div className="ed-page">
      {/* --- masthead ------------------------------------------------------ */}
      <div className="ed-head">
        <span className="ed-num">{profile.location}</span>
        <span className="ed-rule" />
        <span className="ed-num">{profile.availability}</span>
      </div>

      <h1 className="ed-title text-[clamp(2.75rem,8vw,6rem)]">
        Aishwarya Bhanage
      </h1>
      <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--accent-ink)' }}>
        Machine Learning &amp; AI Engineer
      </p>

      <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-[1fr_minmax(0,420px)]">
        {/* the standfirst */}
        <div>
          <p className="ed-lede max-w-[54ch] text-[clamp(1.1rem,1.9vw,1.4rem)] leading-[1.55]">
            {profile.headline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ResumeMenu />
            <Link
              to="/experience"
              className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em] transition-opacity hover:opacity-65"
              style={{ color: 'var(--accent-ink)' }}
            >
              Start reading <ArrowRight size={13} />
            </Link>
            <span className="flex items-center gap-4">
              {[
                { href: profile.github, icon: Github, label: 'GitHub' },
                { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: `mailto:${profile.email}`, icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="transition-opacity hover:opacity-60"
                  style={{ color: 'var(--fg-3)' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </span>
          </div>

          {/* the figures, set as a row of margin notes */}
          <Reveal className="mt-14 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className="ed-figure-label">{m.label}</p>
                <p className="ed-figure-value">
                  <MetricValue value={m.value} />
                  <span className="ml-1 font-mono text-[0.55em]" style={{ color: 'var(--fg-3)' }}>{m.unit}</span>
                </p>
                <p className="ed-figure-note">{m.detail}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* the one moment of life on this side */}
        <Reveal delay={0.08}>
          <EmbeddingSpace className="h-[240px] w-full" />
          <p className="mt-3 font-mono text-[10px] leading-relaxed" style={{ color: 'var(--fg-3)' }}>
            A retrieval pipeline running the loop I build: encode, recall, rerank, promote.
          </p>
        </Reveal>
      </div>

      {/* --- contents ------------------------------------------------------ */}
      <Reveal className="mt-24">
        <div className="ed-head">
          <span className="ed-num">Contents</span>
          <span className="ed-rule" />
        </div>
        <ul>
          {CONTENTS.map((c) => (
            <li key={c.to}>
              <Link to={c.to} className="ed-toc group">
                <span className="ed-toc-n">{c.n}</span>
                <span className="ed-toc-label">{c.label}</span>
                <span className="ed-toc-hint">{c.hint}</span>
                <ArrowRight size={14} className="ed-toc-arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <p className="mt-16 flex items-center gap-1.5 font-mono text-[11px]" style={{ color: 'var(--fg-3)' }}>
        <MapPin size={11} /> {profile.location} · {profile.email}
      </p>
    </div>
  )
}

/** Counts whole numbers; leaves decimals like 0.91 alone. */
function MetricValue({ value }) {
  if (/^\d+$/.test(value)) return <Count to={Number(value)} />
  return <>{value}</>
}
