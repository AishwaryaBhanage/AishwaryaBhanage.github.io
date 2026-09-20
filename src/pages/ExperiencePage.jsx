import { experience } from '../data/content'
import { Page, Entry, Figure, Bullets, Tools } from '../components/editorial'
import ResumeMenu from '../components/ResumeMenu'

/** Headline figures set in the margin, per role. */
const FIGURES = {
  accenture: [
    { label: 'AUROC', value: '0.91', note: '1M+ daily transactions' },
    { label: 'False positives', value: '−20%', note: 'after threshold tuning' },
  ],
  veach: [
    { label: 'Top-5 relevance', value: '+40%', note: 'over the keyword baseline' },
    { label: 'Serving cost', value: '−30%', note: 'at constant quality' },
  ],
  cubit: [
    { label: 'Per participant', value: '→5 min', note: 'was 10–15, across 6 device types' },
  ],
}

export default function ExperiencePage() {
  return (
    <Page
      index={1}
      title="Where the work happened"
      lede="Three years shipping machine learning in production at Accenture, then founding-engineer work on an AI product, and research data infrastructure now."
    >
      {experience.map((job, i) => (
        <Entry
          key={job.id}
          delay={i * 0.04}
          meta={
            <>
              <p className="ed-meta-strong">{job.start}</p>
              <p>– {job.end}</p>
              {job.duration && <p className="mt-2">{job.duration}</p>}
              <p className="mt-2">{job.location}</p>
              {(FIGURES[job.id] || []).map((f) => <Figure key={f.label} {...f} />)}
            </>
          }
        >
          <h2 className="ed-role">{job.role}</h2>
          <p className="ed-org">{job.org}</p>
          {job.progression && <p className="ed-sub">{job.progression}</p>}
          <p className="ed-prose">{job.summary}</p>
          <Bullets items={job.bullets.map((b) => b.text)} />
          <Tools items={job.stack} />
        </Entry>
      ))}

      <div className="mt-14 flex flex-wrap items-center gap-4">
        <ResumeMenu />
        <p className="text-[13px]" style={{ color: 'var(--fg-3)' }}>
          Tailored per role. Pick the one that matches your opening.
        </p>
      </div>
    </Page>
  )
}
