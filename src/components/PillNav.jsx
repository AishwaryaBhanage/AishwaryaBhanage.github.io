import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'

/* ---------------------------------------------------------------------------
 * The creative banner.
 *
 * Three destinations rather than a list of every section, named for what a
 * visitor wants rather than for how the page is built, plus the switch between
 * the two sides and the day/night toggle. One pill, not two.
 * ------------------------------------------------------------------------- */

const LINKS = [
  { id: 'about',   label: 'Get to know me' },
  { id: 'photos',  label: 'See my work' },
  { id: 'contact', label: 'Collaborate' },
]

/* Sections that light each link: "See my work" covers photos and videos. */
const COVERS = {
  about: ['top', 'about', 'practise'],
  photos: ['photos', 'leading', 'videos'],
  contact: ['contact'],
}

export default function PillNav({ dark, setDark }) {
  const [active, setActive] = useState('about')

  useEffect(() => {
    const ids = Object.values(COVERS).flat()
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (!vis[0]) return
        const id = vis[0].target.id
        const owner = Object.keys(COVERS).find((k) => COVERS[k].includes(id))
        if (owner) setActive(owner)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="pill-bar">
      <nav className="pill-shell" aria-label="Sections">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="pill-item"
            data-on={active === l.id}
            aria-current={active === l.id ? 'true' : undefined}
          >
            {l.label}
          </a>
        ))}

        <span className="pill-sep" aria-hidden="true" />

        <Link to="/" className="pill-item" aria-label="Switch to the technical side">Technical</Link>
        <span className="pill-item" data-on="true" aria-current="true">Creative</span>

        <button
          onClick={() => setDark(!dark)}
          className="pill-icon"
          aria-label={dark ? 'Switch to day' : 'Switch to night'}
          title={dark ? 'Day' : 'Night'}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </nav>
    </div>
  )
}
