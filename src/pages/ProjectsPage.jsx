import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Github } from '../components/BrandIcons'
import { projects, TRACKS } from '../data/content'
import { Page, Entry, Tools } from '../components/editorial'

const FILTERS = [{ id: 'all', short: 'all' }, ...Object.values(TRACKS)]

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? projects : projects.filter((p) => p.tracks.includes(filter))

  return (
    <Page
      index={2}
      title="Things I built, and what I learned"
      lede="Each one starts with the problem, not the stack. The last line of every entry is the part worth talking about in an interview."
    >
      <div className="mb-2 flex flex-wrap gap-x-5 gap-y-2 border-b pb-4" style={{ borderColor: 'var(--rule)' }}>
        {FILTERS.map((f) => {
          const on = filter === f.id
          const n = f.id === 'all' ? projects.length : projects.filter((p) => p.tracks.includes(f.id)).length
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={on}
              className="font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
              style={{ color: on ? 'var(--accent-ink)' : 'var(--fg-3)' }}
            >
              {f.short} <span className="opacity-55">{n}</span>
              
            </button>
          )
        })}
      </div>

      {list.map((p, i) => (
        <Entry
          key={p.id}
          delay={(i % 4) * 0.04}
          meta={
            <>
              <p className="ed-meta-strong">{String(i + 1).padStart(3, '0')}</p>
              <p className="mt-2">{p.period}</p>
              <p className="mt-2">{p.tracks.map((t) => TRACKS[t].short).join(' · ')}</p>
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 transition-opacity hover:opacity-65"
                  style={{ color: 'var(--accent-ink)' }}
                >
                  <Github size={11} /> source
                </a>
              )}
            </>
          }
        >
          <h2 className="ed-role">{p.name}</h2>
          <p className="ed-org">{p.tagline}</p>

          <p className="ed-prose"><i>{p.problem}</i></p>
          <p className="ed-prose">{p.what}</p>
          <p className="ed-prose" style={{ color: 'var(--fg)' }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--accent-ink)' }}>
              The interesting part:{' '}
            </span>
            {p.insight}
          </p>

          <Tools label="Stack" items={p.stack} />
        </Entry>
      ))}

      <div className="mt-14">
        <a
          href="https://github.com/AishwaryaBhanage?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[12px] transition-opacity hover:opacity-65"
          style={{ color: 'var(--accent-ink)' }}
        >
          <Github size={13} /> everything else on github <ArrowUpRight size={12} />
        </a>
      </div>
    </Page>
  )
}
