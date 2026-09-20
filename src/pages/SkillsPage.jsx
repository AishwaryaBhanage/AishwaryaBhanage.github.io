import { skills, education, LEVELS, TRACKS } from '../data/content'
import { Page, Entry, Reveal } from '../components/editorial'

const MAX = LEVELS.length

/* Dense by design: seven groups laid out in columns rather than stacked full
   width, so the whole toolkit is roughly one screen instead of seven. */
export default function SkillsPage() {
  return (
    <Page
      index={3}
      title="What I reach for"
      lede="Not what looks good on a résumé. Each level is anchored to evidence. Every 4 and 5 traces to a shipped system or a line on my résumé. Hover a row for the evidence."
    >
      <Reveal className="ed-scale">
        {LEVELS.map((l) => (
          <span key={l.n} className="ed-scale-item">
            <Meter level={l.n} accent="var(--fg-3)" />
            <span>{l.label}</span>
          </span>
        ))}
      </Reveal>

      <div className="sk-grid">
        {skills.map((group, i) => {
          const accent = group.track ? TRACKS[group.track].color : 'var(--fg-2)'
          return (
            <Reveal key={group.group} as="section" className="sk-group" delay={(i % 3) * 0.05}>
              <h2 className="sk-head" style={{ color: accent }}>
                {group.group}
                <span className="sk-count">{group.items.length}</span>
              </h2>
              <ul>
                {group.items.map((it) => (
                  <li key={it.name} title={it.note ? `${it.name}: ${it.note}` : it.name}>
                    <span className="sk-name">{it.name}</span>
                    <Meter level={it.level} accent={accent} />
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}
      </div>

      <h2 className="ed-title mb-8 mt-20 text-[clamp(1.75rem,4vw,2.75rem)]">Education</h2>
      {education.map((e, i) => (
        <Entry
          key={e.school}
          delay={i * 0.04}
          meta={
            <>
              <p className="ed-meta-strong">{e.start}</p>
              <p>– {e.end}</p>
              <p className="mt-2">{e.detail}</p>
              <p className="mt-2">{e.location}</p>
            </>
          }
        >
          <h3 className="ed-role text-[clamp(1.35rem,2.4vw,1.75rem)]">{e.degree}</h3>
          <p className="ed-org">{e.school}</p>
          <p className="ed-tools mt-5"><b>Coursework</b>{'  '}{e.coursework.join('  ·  ')}</p>
        </Entry>
      ))}
    </Page>
  )
}

/** Five segments; the last lit one reads brighter so the level scans at a glance. */
function Meter({ level, accent }) {
  const label = LEVELS.find((l) => l.n === level)?.label
  return (
    <span className="ed-meter" role="img" aria-label={`${label} (${level} of ${MAX})`}>
      {Array.from({ length: MAX }, (_, i) => {
        const on = i < level
        const tip = on && i === level - 1
        return (
          <span
            key={i}
            style={{
              background: on
                ? (tip ? accent : `color-mix(in srgb, ${accent} 45%, transparent)`)
                : 'var(--rule)',
            }}
          />
        )
      })}
    </span>
  )
}
