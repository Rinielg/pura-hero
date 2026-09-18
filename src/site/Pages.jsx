/**
 * One page component for the whole site.
 *
 * Every inner page on the source site is the same template — hero, definition,
 * three steps, four proof points, questions, a regulatory note, siblings, and a
 * download call to action — so it is built once here and filled from `PAGES` in
 * `content.js`. A page that has no `steps` simply does not render that band.
 *
 * The consequence worth keeping: adding a page is an entry in `content.js` and
 * a line in `main.jsx`. No new markup.
 */

import { useLocation } from 'react-router-dom'
import { MENU, PAGES, PROOF_FOOTNOTE } from './content'
import {
  CTABand,
  FAQs,
  Page,
  PageHero,
  Proof,
  Reasons,
  RelatedCards,
  Split,
  Steps,
  TextBand,
} from './Sections'

/** Which menu group a path belongs to, for the "more in…" band at the foot. */
function siblingsOf(path) {
  const group = MENU.find((g) => g.items.some((i) => i.to === path))
  if (!group) return null
  return { group, items: group.items.filter((i) => i.to !== path) }
}

export function SitePage() {
  const { pathname } = useLocation()
  const data = PAGES[pathname]
  if (!data) return <NotFound />

  const sibs = siblingsOf(pathname)
  const hasProof = data.proof?.length
  const footnote = hasProof && JSON.stringify(data.proof).includes('†')

  return (
    <Page key={pathname}>
      <PageHero kicker={data.kicker} title={data.h1} lead={data.lead} />

      {data.whatIs ? (
        <Split
          eyebrow="What it is"
          title={data.whatIs.h}
          body={data.whatIs.p}
          media={data.media}
          mediaAlt=""
          flip
        />
      ) : data.media ? (
        <Split eyebrow={data.kicker} title={data.h1} body={data.lead} media={data.media} flip />
      ) : null}

      {data.children?.length ? (
        <RelatedCards
          eyebrow="Explore"
          title="Everything in this pillar"
          items={data.children.map((to) => {
            const c = PAGES[to]
            return { to, title: c.kicker, body: c.lead, media: c.media }
          })}
        />
      ) : null}

      {data.steps?.length ? <Steps items={data.steps} /> : null}

      {hasProof ? <Proof items={data.proof} footnote={footnote ? PROOF_FOOTNOTE : null} /> : null}

      {data.reasons?.length ? <Reasons title="What makes the difference" items={data.reasons} /> : null}

      {data.sections?.length ? <TextBand items={data.sections} /> : null}

      {data.faqs?.length ? <FAQs items={data.faqs} /> : null}

      {/* Reproduced verbatim from the source, which marks it as a locked slot
          subject to Regulatory sign-off. Do not reword it here. */}
      {data.note ? (
        <section className="regnote" data-reveal>
          <p>{data.note}</p>
        </section>
      ) : null}

      {sibs?.items.length ? (
        <RelatedCards
          eyebrow={`More in ${sibs.group.label}`}
          title="Every part connects to the next."
          items={sibs.items.map((i) => ({ to: i.to, title: i.title, body: i.body, media: PAGES[i.to]?.media }))}
          compact
        />
      ) : null}

      <CTABand
        title={data.cta?.title || `${data.kicker} lives in the app.`}
        body={data.cta ? null : 'Download Pura to get started in minutes.'}
        link={data.cta}
      />
    </Page>
  )
}

export function NotFound() {
  return (
    <Page>
      <PageHero
        kicker="404"
        title="That page isn’t here."
        lead="It may not have been built yet — this is a prototype, and the site is still being assembled."
      />
      <RelatedCards
        eyebrow="Try one of these"
        title="Where you can go"
        items={MENU.flatMap((g) => g.items)
          .filter((i) => PAGES[i.to])
          .slice(0, 8)
          .map((i) => ({ to: i.to, title: i.title, body: i.body, media: PAGES[i.to]?.media }))}
        compact
      />
    </Page>
  )
}
