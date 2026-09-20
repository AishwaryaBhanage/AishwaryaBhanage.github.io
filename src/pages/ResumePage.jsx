import { profile, resume } from '../data/content'

/* ---------------------------------------------------------------------------
 * The résumé, as a page.
 *
 * One document rather than five variants, and the same source of truth the rest
 * of the site reads from — so it cannot drift. Styled for paper: the print
 * rules in index.css drop the site chrome and set it on A4.
 * ------------------------------------------------------------------------- */

export default function ResumePage() {
  return (
    <div className="cv">
      <header className="cv-head">
        <h1>{profile.full}</h1>
        <p className="cv-title">{resume.title}</p>
        <p className="cv-contact">
          {profile.email} · {profile.phone} · {profile.location}
          {' · '}
          <a href={profile.linkedin}>linkedin.com/in/aishwaryabhanage</a>
          {' · '}
          <a href={profile.github}>github.com/AishwaryaBhanage</a>
        </p>
      </header>

      <section>
        <h2>Experience</h2>
        {resume.experience.map((e) => (
          <article key={e.role} className="cv-entry">
            <div className="cv-entry-head">
              <h3>{e.role}</h3>
              <span className="cv-period">{e.period}</span>
            </div>
            <p className="cv-org">
              {e.org} · {e.place}
              {e.note && <span className="cv-note">  {e.note}</span>}
            </p>
            <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Selected projects</h2>
        {resume.projects.map((p) => (
          <article key={p.name} className="cv-entry">
            <div className="cv-entry-head">
              <h3>{p.name}</h3>
              <span className="cv-period">{p.stack}</span>
            </div>
            <p className="cv-text">{p.text}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        <dl className="cv-skills">
          {resume.skills.map((s) => (
            <div key={s.k}>
              <dt>{s.k}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Education</h2>
        {resume.education.map((e) => (
          <div key={e.degree} className="cv-entry-head cv-edu">
            <div>
              <h3>{e.degree}</h3>
              <p className="cv-org">{e.school} · {e.note}</p>
            </div>
            <span className="cv-period">{e.period}</span>
          </div>
        ))}
      </section>

      <section>
        <h2>Leadership &amp; awards</h2>
        <ul>{resume.leadership.map((l, i) => <li key={i}>{l}</li>)}</ul>
      </section>
    </div>
  )
}
