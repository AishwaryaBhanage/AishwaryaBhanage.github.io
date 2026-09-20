import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { Github, Linkedin } from '../components/BrandIcons'
import { profile } from '../data/content'
import { Page, Reveal } from '../components/editorial'
import ResumeMenu from '../components/ResumeMenu'

const ROWS = [
  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { icon: Github, label: 'GitHub', value: 'AishwaryaBhanage', href: profile.github },
  { icon: Linkedin, label: 'LinkedIn', value: 'aishwaryabhanage', href: profile.linkedin },
  { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^+\d]/g, '')}` },
  { icon: MapPin, label: 'Based in', value: profile.location, href: null },
]

export default function ContactPage() {
  return (
    <Page
      index={5}
      title="Let's build something"
      lede={`${profile.availability}. If you're hiring for ML, AI, data or platform work, or you want to argue about evaluation harnesses, I'd like to hear from you.`}
    >
      <Reveal>
        <ul className="ed-contact">
          {ROWS.map(({ icon: Icon, label, value, href }) => {
            const body = (
              <>
                <span className="ed-contact-label"><Icon size={12} /> {label}</span>
                <span className="ed-contact-value">
                  {value}
                  {href?.startsWith('http') && <ArrowUpRight size={12} className="ml-1 inline opacity-60" />}
                </span>
              </>
            )
            return (
              <li key={label}>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{body}</a>
                ) : (
                  <span>{body}</span>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>

      <div className="mt-12">
        <p className="ed-figure-label mb-4">Résumé</p>
        <ResumeMenu />
      </div>
    </Page>
  )
}
