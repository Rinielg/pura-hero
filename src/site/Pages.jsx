/**
 * The six destinations behind the navigation.
 *
 * Each one is assembled from `content.js` and the blocks in `Sections.jsx`, so
 * a page is a short, readable arrangement rather than a wall of markup. When
 * real designs land for any of these, the block is what changes — not the copy,
 * which stays in one file, and not the route, which stays here.
 */

import { Link } from 'react-router-dom'
import {
  CARE,
  EXTERNAL,
  FOR_BUSINESS,
  MY_HEALTH,
  PAGES,
  PURA_AI,
  WELLNESS,
  WHY_PURA,
} from './content'
import { CTABand, IconGrid, Page, PageHero, PartnerWall, Reasons, Showcase, Split } from './Sections'

/* ------------------------------------------------------------- My Health */

export function MyHealth() {
  const [score, diabetes] = MY_HEALTH.sections
  return (
    <Page>
      <PageHero kicker={MY_HEALTH.kicker} title={MY_HEALTH.title} lead={MY_HEALTH.lead} />
      <Split
        eyebrow={score.eyebrow}
        title={score.title}
        body={score.body}
        points={score.points}
        media={score.media}
        mediaAlt={score.mediaAlt}
      />
      <Showcase
        eyebrow={diabetes.eyebrow}
        title={diabetes.title}
        body={diabetes.body}
        items={diabetes.cards}
        tall
      />
      <CTABand title="Start with the number that matters." body="Your health span, in one score." />
    </Page>
  )
}

/* ------------------------------------------------------------------ Care */

export function Care() {
  const [doctor, mind] = CARE.sections
  return (
    <Page>
      <PageHero kicker={CARE.kicker} title={CARE.title} lead={CARE.lead} />
      <Split
        eyebrow={doctor.eyebrow}
        title={doctor.title}
        body={doctor.body}
        media={doctor.media}
        mediaAlt={doctor.mediaAlt}
        flip
      >
        <ul className="ticks ticks--icon">
          {doctor.items.map((it) => (
            <li key={it.text}>
              <img src={it.icon} alt="" loading="lazy" />
              {it.text}
            </li>
          ))}
        </ul>
      </Split>
      <Split eyebrow={mind.eyebrow} title={mind.title} body={mind.body} points={mind.points} />
      <CTABand title="A clinician, without the waiting room." />
    </Page>
  )
}

/* -------------------------------------------------------------- Wellness */

export function Wellness() {
  const [fitness, mind] = WELLNESS.sections
  return (
    <Page>
      <PageHero kicker={WELLNESS.kicker} title={WELLNESS.title} lead={WELLNESS.lead} />
      <Showcase
        eyebrow={fitness.eyebrow}
        title={fitness.title}
        body={fitness.body}
        items={fitness.showcase}
      />
      <IconGrid eyebrow={mind.eyebrow} title={mind.title} body={mind.body} items={mind.items} />
      <CTABand title="Every day adds up." body="Track it, and the days start to count for something." />
    </Page>
  )
}

/* --------------------------------------------------------------- Pura AI */

export function PuraAI() {
  const [ask, score] = PURA_AI.sections
  return (
    <Page>
      <PageHero kicker={PURA_AI.kicker} title={PURA_AI.title} lead={PURA_AI.lead}>
        {/* The agent bar from the brand work, as a static prop rather than the
            live control it is inside the app. */}
        <div className="ph__agent" aria-hidden="true">
          <img src="/assets/pura-sparkle.png" alt="" width="18" height="18" />
          <span>Ask Pura AI anything</span>
          <span className="ph__agent-btn">
            <img src="/assets/agent-plus.svg" alt="" />
          </span>
          <span className="ph__agent-btn">
            <img src="/assets/agent-voice.svg" alt="" />
          </span>
        </div>
      </PageHero>
      <Split eyebrow={ask.eyebrow} title={ask.title} body={ask.body} points={ask.points} />
      <Split
        eyebrow={score.eyebrow}
        title={score.title}
        body={score.body}
        media={score.media}
        mediaAlt={score.mediaAlt}
        flip
      />
      <CTABand title="Ask it anything about your health." />
    </Page>
  )
}

/* -------------------------------------------------------------- Why Pura */

export function WhyPura() {
  return (
    <Page>
      <PageHero kicker={WHY_PURA.kicker} title={WHY_PURA.title} lead={WHY_PURA.lead} />
      <Reasons title="Five reasons it works" items={WHY_PURA.reasons} />
      <PartnerWall title="Our partners" items={WHY_PURA.partners} />
      <CTABand title="One place for your whole health." />
    </Page>
  )
}

/* ---------------------------------------------------------- For Business */

export function ForBusiness() {
  const [partner, longevity] = FOR_BUSINESS.sections
  return (
    <Page>
      <PageHero
        kicker={FOR_BUSINESS.kicker}
        title={FOR_BUSINESS.title}
        lead={FOR_BUSINESS.lead}
      />
      <Split
        eyebrow={partner.eyebrow}
        title={partner.title}
        body={partner.body}
        points={partner.points}
      />
      <Split eyebrow={longevity.eyebrow} title={longevity.title} body={longevity.body} flip>
        <a className="btn btn--dark" href={longevity.link.href} target="_blank" rel="noreferrer">
          {longevity.link.label}
        </a>
      </Split>
      {/* The live site puts a Formidable form here. A prototype should not
          collect anyone's details, so this is the same call to action pointed
          at the address the form ends up in. */}
      <section className="cta" data-reveal>
        <h2 className="h2">Talk to us about your workforce</h2>
        <p className="lede">{FOR_BUSINESS.lead}</p>
        <div className="cta__row">
          <a className="btn btn--dark" href={EXTERNAL.email}>
            care.pura@pura.ai
          </a>
        </div>
      </section>
    </Page>
  )
}

/* ------------------------------------------------------------- not found */

export function NotFound() {
  return (
    <Page>
      <PageHero
        kicker="404"
        title="That page isn’t here."
        lead="It may not have been built yet — this is a prototype, and the site is still being assembled."
      />
      <section className="band" data-reveal>
        <div className="band__head">
          <h2 className="h2">Try one of these</h2>
        </div>
        <ul className="ticks ticks--links">
          {PAGES.map((p) => (
            <li key={p.path}>
              <Link to={p.path}>{p.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
