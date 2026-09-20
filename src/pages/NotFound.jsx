import { Link } from 'react-router-dom'
import { Page } from '../components/editorial'

export default function NotFound() {
  return (
    <Page title="No such page" lede="That route doesn't exist. It may never have.">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-opacity hover:opacity-65"
        style={{ color: 'var(--accent-ink)' }}
      >
        Back to the start →
      </Link>
    </Page>
  )
}
