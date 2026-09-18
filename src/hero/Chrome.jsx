/**
 * The page furniture that sits outside the scroll sequence: the navigation and
 * the store badges. Both are fixed, both stay put on every page, and neither is
 * touched by the hero timeline.
 *
 * The nav is now a real router nav — the same component on the home sequence
 * and on every inner page, so there is one place where the site's shape is
 * described.
 */

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { EXTERNAL, PAGES, STORE } from '../site/content'

/** The live UAE listings for Pura by PureHealth. */
export const STORE_LINKS = STORE

const MORE_LINKS = [
  { label: 'FAQs', href: EXTERNAL.faqs },
  { label: 'Longevity Clinic', href: EXTERNAL.longevity },
  { label: 'PureHealth Group', href: EXTERNAL.group },
]

/**
 * Fixed to the top, with a blurred backdrop.
 *
 * Figma has `backdrop-blur` on this pill at a radius of 0 — the control is
 * there but never turned up, because a static frame has nothing to blur. On a
 * page where a phone and a dozen chips travel underneath it, it does, so this
 * is the one place the implementation deliberately exceeds the file. See
 * `.nav__pill` in styles.css for why the fill had to come down with it.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // The sheet closes when the route changes — otherwise tapping a link leaves
  // it covering the page it just navigated to.
  useEffect(() => setOpen(false), [pathname])

  // And on Escape, because a full-screen overlay that only closes by tapping
  // its own button is a trap for anyone on a keyboard.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={open ? 'nav is-open' : 'nav'} role="banner">
      <nav className="nav__pill" aria-label="Main">
        <Link className="nav__logo" to="/" aria-label="Pura home">
          <img src="/assets/pura-logo.svg" alt="" width="55" height="26" />
        </Link>

        <ul className="nav__links">
          {PAGES.map(({ path, label }) => (
            <li key={path}>
              <NavLink to={path} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                {label}
              </NavLink>
            </li>
          ))}

          {/* Secondary destinations that live on the real pura.ai rather than
              in this prototype. They open there rather than being invented. */}
          <li className="nav__more">
            <button type="button" aria-haspopup="true">
              More
              <img src="/assets/caret-down.svg" alt="" width="7" height="5" aria-hidden="true" />
            </button>
            <ul className="nav__menu">
              {MORE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <a className="nav__cta" href={STORE.appStore} target="_blank" rel="noreferrer">
          Get the app
        </a>

        {/* Below 820px the link row is hidden — six labels do not fit a phone
            and shrinking them to fit makes them untappable. Now that those
            links go somewhere, the phone needs its own way in. */}
        <button
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className="nav__sheet" id="nav-sheet" hidden={!open}>
        <ul>
          {PAGES.map(({ path, label }) => (
            <li key={path}>
              <NavLink to={path} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="nav__sheet-more">
          {MORE_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

/** Fixed to the bottom-right, above everything, for the whole page. */
export function AppStores() {
  return (
    <div className="stores">
      <a
        className="stores__badge"
        href={STORE.appStore}
        target="_blank"
        rel="noreferrer"
        aria-label="Download Pura on the App Store"
      >
        <img className="stores__glyph" src="/assets/store-apple.svg" alt="" aria-hidden="true" />
        <span className="stores__text">
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </a>

      <a
        className="stores__badge"
        href={STORE.googlePlay}
        target="_blank"
        rel="noreferrer"
        aria-label="Get Pura on Google Play"
      >
        <img
          className="stores__glyph"
          src="/assets/store-playstore.svg"
          alt=""
          aria-hidden="true"
        />
        <span className="stores__text">
          <small className="stores__caps">Get it on</small>
          <img
            className="stores__wordmark"
            src="/assets/store-googleplay-wordmark.svg"
            alt=""
            aria-hidden="true"
          />
        </span>
      </a>
    </div>
  )
}
