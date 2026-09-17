/**
 * The page furniture that sits outside the scroll sequence: the navigation and
 * the store badges. Both are fixed, both stay put for the whole page, and
 * neither is touched by the timeline.
 */

const NAV_LINKS = ['My Health', 'Care', 'Wellness', 'Pura AI', 'Why Pura', 'For Business']

/** The live UAE listings for Pura by PureHealth. */
export const STORE_LINKS = {
  appStore: 'https://apps.apple.com/ae/app/pura-by-purehealth/id6449597603',
  googlePlay: 'https://play.google.com/store/apps/details?id=ae.purehealth.pura',
}

/**
 * Fixed to the top, with a blurred backdrop.
 *
 * Figma has `backdrop-blur` on this pill at a radius of 0 — the control is
 * there but never turned up, because a static frame has nothing to blur. On a
 * page where a phone and a dozen chips travel underneath it, it does, so this
 * is the one place the implementation deliberately exceeds the file.
 */
export function Nav() {
  return (
    <header className="nav" role="banner">
      <nav className="nav__pill" aria-label="Main">
        <a className="nav__logo" href="#top" aria-label="Pura home">
          <img src="/assets/pura-logo.svg" alt="" width="55" height="26" />
        </a>

        <ul className="nav__links">
          {NAV_LINKS.map((label) => (
            <li key={label}>
              <a href="#top">{label}</a>
            </li>
          ))}
          <li className="nav__more">
            <a href="#top">
              More
              <img src="/assets/caret-down.svg" alt="" width="7" height="5" aria-hidden="true" />
            </a>
          </li>
        </ul>

        <a className="nav__cta" href={STORE_LINKS.appStore}>
          Get the app
        </a>
      </nav>
    </header>
  )
}

/** Fixed to the bottom-right, above everything, for the whole page. */
export function AppStores() {
  return (
    <div className="stores">
      <a
        className="stores__badge"
        href={STORE_LINKS.appStore}
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
        href={STORE_LINKS.googlePlay}
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
