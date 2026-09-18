/**
 * The building blocks every inner page is made of.
 *
 * The home route is one pinned GSAP timeline in frame pixels; these pages are
 * not, and should not be. They are ordinary documents that scroll, built from
 * the same vocabulary the sequence uses — the drifting gradient, the glass
 * pill, the photo card with its tag, the Greycliff scale — so the site reads as
 * one product without the inner pages pretending to be a choreographed film.
 *
 * The only motion here is a reveal on enter, and it is the same reveal
 * everywhere: eight pixels and a fade, once, never reversed. Under
 * prefers-reduced-motion nothing moves at all.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { LottieBackground } from '../LottieBackground'
import { STORE } from './content'

gsap.registerPlugin(ScrollTrigger)

/**
 * One reveal, applied to every direct child marked `data-reveal`.
 *
 * Scoped to a container rather than registered per element so a page adds
 * sections without wiring anything up, and so all of a page's triggers are
 * killed together when the route changes — a ScrollTrigger that outlives its
 * element pins a scroll position that no longer exists.
 */
export function useReveal(scopeRef) {
  useEffect(() => {
    const root = scopeRef.current
    if (!root) return
    const targets = root.querySelectorAll('[data-reveal]')
    if (!targets.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [scopeRef])
}

/* ------------------------------------------------------------------ hero */

export function PageHero({ kicker, title, lead, children }) {
  return (
    <header className="ph">
      <div className="ph__bg" aria-hidden="true">
        <LottieBackground />
      </div>
      <div className="ph__inner">
        <p className="ph__kicker">{kicker}</p>
        <h1 className="ph__title">{title}</h1>
        {lead ? <p className="ph__lead">{lead}</p> : null}
        {children}
        <div className="ph__cta">
          <a className="btn btn--dark" href={STORE.appStore} target="_blank" rel="noreferrer">
            Get the app
          </a>
          <Link className="btn btn--ghost" to="/">
            See how it works
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ----------------------------------------------------------------- split */

/** Copy on one side, a device shot on the other. `flip` puts the media first. */
export function Split({ eyebrow, title, body, points, media, mediaAlt, flip, children }) {
  return (
    <section className={flip ? 'split split--flip' : 'split'} data-reveal>
      <div className="split__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="h2">{title}</h2>
        {body ? <p className="lede">{body}</p> : null}
        {points ? (
          <ul className="ticks">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
      {media ? (
        <div className="split__media">
          <img src={media} alt={mediaAlt || ''} loading="lazy" />
        </div>
      ) : null}
    </section>
  )
}

/* ------------------------------------------------------------- icon grid */

export function IconGrid({ eyebrow, title, body, items }) {
  return (
    <section className="band" data-reveal>
      <div className="band__head">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="h2">{title}</h2>
        {body ? <p className="lede">{body}</p> : null}
      </div>
      <ul className="icons">
        {items.map((it) => (
          <li className="icons__item" key={it.title || it.text}>
            {it.icon ? <img className="icons__glyph" src={it.icon} alt="" loading="lazy" /> : null}
            {it.title ? <h3 className="h4">{it.title}</h3> : null}
            <p>{it.body || it.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------- showcase */

/** Four app shots with a caption each — the pattern the live site uses twice. */
export function Showcase({ eyebrow, title, body, items, tall }) {
  return (
    <section className="band" data-reveal>
      <div className="band__head">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="h2">{title}</h2>
        {body ? <p className="lede">{body}</p> : null}
      </div>
      <ul className={tall ? 'shots shots--tall' : 'shots'}>
        {items.map((it) => (
          <li className="shot" key={it.title}>
            <figure className="shot__frame">
              <img src={it.media} alt="" loading="lazy" />
            </figure>
            <h3 className="h4">{it.title}</h3>
            <p>{it.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* --------------------------------------------------------------- reasons */

export function Reasons({ title, items }) {
  return (
    <section className="band" data-reveal>
      <div className="band__head">
        <h2 className="h2">{title}</h2>
      </div>
      <ol className="reasons">
        {items.map((r, i) => (
          <li className="reason" key={r.title}>
            <span className="reason__n">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="h4">{r.title}</h3>
            <p>{r.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* -------------------------------------------------------------- partners */

/**
 * The partner logos ship from pura.ai as PURE WHITE artwork on transparency —
 * they are drawn for that site's dark band. On a white card they are invisible,
 * so the band is dark here too. Recolouring someone's logo is not an option;
 * giving it the background it was drawn for is.
 */
export function PartnerWall({ title, items }) {
  return (
    <section className="band band--dark" data-reveal>
      <div className="band__head">
        <h2 className="h2">{title}</h2>
      </div>
      <ul className="wall">
        {items.map((p) => (
          <li className="wall__cell" key={p.name}>
            <img src={p.logo} alt={p.name} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------- CTA + end */

export function CTABand({ title, body }) {
  return (
    <section className="cta" data-reveal>
      <h2 className="h2">{title}</h2>
      {body ? <p className="lede">{body}</p> : null}
      <div className="cta__row">
        <a className="btn btn--dark" href={STORE.appStore} target="_blank" rel="noreferrer">
          Download on the App Store
        </a>
        <a className="btn btn--ghost" href={STORE.googlePlay} target="_blank" rel="noreferrer">
          Get it on Google Play
        </a>
      </div>
    </section>
  )
}

/** A page is always this shape: hero, bands, CTA. The ref carries the reveal. */
export function Page({ children }) {
  const ref = useRef(null)
  useReveal(ref)
  // A new route starts at the top, and any trigger measured against the old
  // document height is refreshed once this one has laid out.
  useEffect(() => {
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <main className="page" ref={ref}>
      {children}
    </main>
  )
}
