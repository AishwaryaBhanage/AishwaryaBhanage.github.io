import { profile, leadership, awards, campus } from '../data/content'
import { Page, Entry, Bullets, Reveal } from '../components/editorial'

export default function AboutPage() {
  return (
    <Page index={4} title="Short version">
      <Reveal className="mb-6 grid items-start gap-x-12 gap-y-8 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          {profile.about.map((para, i) => (
            <p key={i} className="ed-prose">{para}</p>
          ))}
        </div>
        <span className="portrait portrait-md">
          <img src="/images/aishwarya.jpg" alt="Aishwarya Bhanage" />
        </span>
      </Reveal>

      {[...leadership, ...campus].map((r, i) => (
        <Entry
          key={r.id}
          delay={(i % 4) * 0.04}
          meta={
            <>
              <p className="ed-meta-strong">{r.period}</p>
              <p className="mt-2">{r.org}</p>
            </>
          }
        >
          <h2 className="ed-role text-[clamp(1.35rem,2.4vw,1.85rem)]">{r.role}</h2>
          <Bullets items={r.bullets} />
        </Entry>
      ))}

      <h2 className="ed-title mb-8 mt-20 text-[clamp(1.75rem,4vw,2.75rem)]">Awards &amp; certifications</h2>
      <Reveal>
        <ul className="ed-awards">
          {awards.map((a) => (
            <li key={a.title}>
              <span className="ed-award-year">{a.year}</span>
              <span className="ed-award-title">{a.title}</span>
              <span className="ed-award-note">{a.detail}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Page>
  )
}
