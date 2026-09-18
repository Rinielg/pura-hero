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
import { EXTERNAL, MENU } from './content'

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__brand">
          <img src="/assets/pura-logo.svg" alt="Pura" width="72" height="34" />
          <p>Your health, simplified.</p>
        </div>

        {/* The same tree as the menu, so the two cannot disagree. */}
        {MENU.map((group) => (
          <nav className="foot__col" key={group.key} aria-label={group.label}>
            <h2>{group.label}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.to + item.title}>
                  <Link to={item.to}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="foot__fine">
        Prototype for PureHealth ·{' '}
        <a href={EXTERNAL.group} target="_blank" rel="noreferrer">
          PureHealth Group
        </a>{' '}
        ·{' '}
        <a href={EXTERNAL.email}>care.pura@pura.ai</a>
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
