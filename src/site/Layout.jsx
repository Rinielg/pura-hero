/**
 * What wraps an inner page: the shared nav, the page, and the footer.
 *
 * The home route does NOT use this. It owns the whole viewport, runs
 * ScrollSmoother, and has its own fixed layer stack — wrapping it in a document
 * layout would give it a second scroller. It renders the same `Nav` directly
 * instead, which is what keeps the menu identical across the site.
 */

import { Link, Outlet } from 'react-router-dom'
import { AppStores, Nav } from '../hero/Chrome'
import { EXTERNAL, PAGES } from './content'

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__brand">
          <img src="/assets/pura-logo.svg" alt="Pura" width="72" height="34" />
          <p>Your health, simplified.</p>
        </div>

        <nav className="foot__col" aria-label="Sections">
          <h2>Explore</h2>
          <ul>
            {PAGES.map((p) => (
              <li key={p.path}>
                <Link to={p.path}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="foot__col" aria-label="More">
          <h2>More</h2>
          <ul>
            <li>
              <a href={EXTERNAL.longevity} target="_blank" rel="noreferrer">
                Longevity Clinic
              </a>
            </li>
            <li>
              <a href={EXTERNAL.group} target="_blank" rel="noreferrer">
                PureHealth Group
              </a>
            </li>
            <li>
              <a href={EXTERNAL.faqs} target="_blank" rel="noreferrer">
                FAQs
              </a>
            </li>
          </ul>
        </nav>

        <nav className="foot__col" aria-label="Legal">
          <h2>Legal</h2>
          <ul>
            <li>
              <a href={EXTERNAL.privacy} target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href={EXTERNAL.terms} target="_blank" rel="noreferrer">
                Terms and Conditions
              </a>
            </li>
            <li>
              <a href={EXTERNAL.email}>care.pura@pura.ai</a>
            </li>
          </ul>
        </nav>
      </div>

      <p className="foot__fine">
        Prototype for PureHealth. Content and imagery from pura.ai.
      </p>
    </footer>
  )
}

export function SiteLayout() {
  return (
    <div className="site">
      <Nav />
      <Outlet />
      <SiteFooter />
      <AppStores />
    </div>
  )
}
