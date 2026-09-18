/**
 * The page furniture that sits outside the scroll sequence: the navigation and
 * the store badges. Both are fixed, both stay put on every page, and neither is
 * touched by the hero timeline.
 *
 * The navigation is built to the Figma `Menu` frame (node 6203:71995), which
 * specifies four states — default, hover, dropdown-item hover, and
 * active/selected — and a dropdown card hanging under the bar. Every top-level
 * item has one.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MENU, STORE } from '../site/content'

export const STORE_LINKS = STORE

/**
 * Which single group owns the current page.
 *
 * Route first: a page belongs to the group whose route it sits under. That
 * settles the cross-links — Pura AI's dropdown points at PureScore and
 * Biomarkers, which live under Your Health, and membership alone would light up
 * two groups at once.
 *
 * Membership is the fallback, for the pages whose route sits outside their
 * group's prefix: /about and /trust belong to Why Pura, /partners to For
 * Business, and everything under More has no route prefix at all. First match
 * wins, so a page can only ever be in one place in the menu.
 */
function ownerOf(pathname) {
  const byRoute = MENU.find(
    (g) => g.to && (pathname === g.to || pathname.startsWith(`${g.to}/`))
  )
  if (byRoute) return byRoute.key
  return MENU.find((g) => g.items.some((i) => i.to === pathname))?.key ?? null
}

/**
 * One dropdown, and the button that opens it.
 *
 * Open on hover, because that is the state Figma draws, but ALSO on focus and
 * on click — a hover-only menu is unusable by keyboard and unreachable by
 * touch. Closing is delayed by a beat so the diagonal move from the label down
 * to the card does not dismiss it halfway.
 */
function MenuGroup({ group, open, onOpen, onClose, onCloseNow }) {
  const { label, to, items } = group
  const { pathname } = useLocation()
  const within = ownerOf(pathname) === group.key

  const Label = to ? Link : 'button'
  const labelProps = to ? { to } : { type: 'button' }

  return (
    <li
      className={`pnav__group${open ? ' is-open' : ''}${within ? ' is-within' : ''}`}
      onPointerEnter={onOpen}
      onPointerLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onCloseNow()
      }}
    >
      <Label
        {...labelProps}
        className="pnav__label"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          // On touch there is no hover: the first tap opens, and only a second
          // one follows the link.
          if (!open && window.matchMedia('(hover: none)').matches) {
            e.preventDefault()
            onOpen()
          }
        }}
      >
        {/* No caret. The file draws one on hover, but it is a 16px box with an
            8px gap, so revealing it widened the item by 24px and slid every
            label to its right along with it. A menu that reflows under the
            cursor is worse than a missing affordance — and the affordance is
            still there for assistive tech in aria-haspopup/aria-expanded. */}
        {label}
      </Label>

      <div className="pnav__card" role="menu" aria-label={label}>
        {items.map((item) => (
          <NavLink
            key={item.to + item.title}
            to={item.to}
            role="menuitem"
            end
            className={({ isActive }) => (isActive ? 'pnav__item is-active' : 'pnav__item')}
          >
            <span className="pnav__item-t">{item.title}</span>
            <small>{item.body}</small>
          </NavLink>
        ))}
      </div>
    </li>
  )
}

export function Nav() {
  const [open, setOpen] = useState(null) // which group's dropdown is showing
  const [sheet, setSheet] = useState(false) // the phone menu
  const { pathname } = useLocation()
  const timer = useRef(null)

  const closeNow = useCallback(() => {
    clearTimeout(timer.current)
    setOpen(null)
  }, [])

  const openGroup = useCallback((key) => {
    clearTimeout(timer.current)
    setOpen(key)
  }, [])

  // A beat of grace, so crossing the gap between the label and the card does
  // not count as leaving.
  const closeSoon = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(null), 120)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  // Navigating anywhere puts both menus away.
  useEffect(() => {
    setSheet(false)
    closeNow()
  }, [pathname, closeNow])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      closeNow()
      setSheet(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeNow])

  return (
    <header className={sheet ? 'nav is-open' : 'nav'} role="banner">
      <nav className="nav__pill" aria-label="Main">
        <Link className="nav__logo" to="/" aria-label="Pura home">
          <img src="/assets/pura-logo.svg" alt="" width="55" height="26" />
        </Link>

        <ul className="pnav">
          {MENU.map((group) => (
            <MenuGroup
              key={group.key}
              group={group}
              open={open === group.key}
              onOpen={() => openGroup(group.key)}
              onClose={closeSoon}
              onCloseNow={closeNow}
            />
          ))}
        </ul>

        <a className="nav__cta" href={STORE.appStore} target="_blank" rel="noreferrer">
          <img src="/assets/pura-sparkle.png" alt="" width="14" height="14" aria-hidden="true" />
          Get the app
        </a>

        {/* Below 980px the bar cannot hold seven labels and their cards. */}
        <button
          type="button"
          className="nav__burger"
          aria-expanded={sheet}
          aria-controls="nav-sheet"
          aria-label={sheet ? 'Close menu' : 'Open menu'}
          onClick={() => setSheet((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* The phone menu: the same tree, flattened into one scrollable sheet. */}
      <div className="nav__sheet" id="nav-sheet" hidden={!sheet}>
        {MENU.map((group) => (
          <section key={group.key}>
            <h2>{group.label}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.to + item.title}>
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                  >
                    {item.title}
                    <small>{item.body}</small>
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
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
