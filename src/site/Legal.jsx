/**
 * The two legal documents, built to the file's `Privacy Policy` frame
 * (node 6448:258800).
 *
 * The frame is deliberately plain: the nav, a 262px cream band carrying a
 * centred 32px title and the last-updated line, and then one 800px column of
 * 16px body text. No hero, no photograph, no store badges, no footer — so this
 * route sits OUTSIDE `SiteLayout`, which would add the seven-column footer and
 * the fixed badges to a page the file draws without them.
 *
 * The copy is not written here. It comes from `legal-copy.js`, which is
 * generated from the two signed PDFs — see the header of that file. This
 * component only decides how each kind of block is drawn.
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Nav } from '../hero/Chrome'
import { PRIVACY, TERMS } from './legal-copy'

/** The two documents, with the header the frame puts above each. */
export const LEGAL_PAGES = {
  '/privacy-policy': {
    title: 'Privacy Policy',
    updated: 'Last updated: 17 August 2026',
    blocks: PRIVACY,
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions',
    updated: 'Last updated: 20 August 2026',
    blocks: TERMS,
  },
}

const EMAIL = 'care.pura@pura.ai'

/**
 * Make the one address in these documents clickable.
 *
 * Both texts tell the reader to contact us and then print the address as plain
 * text, because their source is a PDF. On a web page that is a dead end for
 * anyone reading on a phone. Nothing about the copy changes — the same
 * characters, in the same order, with an anchor around them.
 */
function linkEmails(text) {
  if (!text.includes(EMAIL)) return text
  return text.split(EMAIL).flatMap((part, i) =>
    i === 0 ? [part] : [<a key={i} href={`mailto:${EMAIL}`}>{EMAIL}</a>, part]
  )
}

/** A clause number, set in its own column so the text hangs off it. */
function N({ n }) {
  return n ? <span className="legal__n">{n}</span> : null
}

function Block({ b }) {
  if (b.k === 'h') {
    return (
      <h2 className="legal__h">
        <N n={`${b.n}.`} />
        {b.t}
      </h2>
    )
  }

  if (b.k === 'links') {
    return (
      <p className="legal__links">
        {b.items.map(([label, href]) => (
          <a key={href} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))}
      </p>
    )
  }

  const cls = b.k === 'sub' ? 'legal__p legal__p--sub' : 'legal__p'

  // A clause the source titles in bold keeps that title on its own line.
  if (b.title) {
    return (
      <div className="legal__clause">
        <h3 className="legal__t">
          <N n={b.n} />
          {b.title}
        </h3>
        <p className={cls}>{linkEmails(b.t)}</p>
      </div>
    )
  }

  return (
    <p className={b.n ? cls : `${cls} legal__p--flush`}>
      <N n={b.n} />
      {linkEmails(b.t)}
    </p>
  )
}

/**
 * Consecutive bullets become one list, and consecutive rights-table rows one
 * definition list. The generated blocks are a flat sequence — grouping them
 * here keeps `legal-copy.js` a transcript rather than a tree.
 */
function render(blocks) {
  const out = []
  let run = null

  const close = () => {
    if (!run) return
    out.push(
      run.k === 'li' ? (
        <ul className="legal__ul" key={`ul${out.length}`}>
          {run.items.map((b, i) => (
            <li key={i}>
              {b.lead ? <strong>{b.lead}</strong> : null}
              {b.lead ? ' ' : null}
              {linkEmails(b.t)}
            </li>
          ))}
        </ul>
      ) : (
        <dl className="legal__dl" key={`dl${out.length}`}>
          {run.items.map((b, i) => (
            <div className="legal__row" key={i}>
              <dt>{b.lead}</dt>
              <dd>
                {b.ps.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )
    )
    run = null
  }

  for (const b of blocks) {
    if (b.k === 'li' || b.k === 'dt') {
      if (run && run.k !== b.k) close()
      run = run ?? { k: b.k, items: [] }
      run.items.push(b)
      continue
    }
    close()
    out.push(<Block b={b} key={out.length} />)
  }
  close()
  return out
}

export function LegalPage() {
  const { pathname } = useLocation()
  const doc = LEGAL_PAGES[pathname]

  // These are long documents reached from a dropdown, so they must open at the
  // top however the reader arrived.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="site">
      <Nav />
      <main className="legal">
        <header className="legal__head">
          <h1 className="legal__title">{doc.title}</h1>
          <p className="legal__updated">{doc.updated}</p>
        </header>
        <div className="legal__body">{render(doc.blocks)}</div>
      </main>
    </div>
  )
}
