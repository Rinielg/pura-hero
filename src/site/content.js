/**
 * The site's shape and everything it says.
 *
 * SOURCE: https://pura-website-upload-1.vercel.app — the current Pura website
 * build. Copy, structure and imagery are taken from there, not from pura.ai,
 * which is the older single-page site.
 *
 * NAVIGATION: the seven top-level items, their order and their labels come from
 * the Figma `Menu` frame (node 6203:71995). Note it says "Your Health" where
 * the source site says "My Health", and "Pura AI" where the source says
 * "Ask Pura" — the Figma nav is the spec for the nav, so its labels win.
 *
 * Figma draws only the Your Health dropdown. The other six are built from the
 * source site's own menu, which has the same shape: an Overview that points at
 * the section root, then its children, each with a one-line description.
 *
 * `Why Pura` is top level in Figma and nested under More on the source site.
 * Its dropdown is therefore assembled from the source's More group — the four
 * items that are about the company rather than about the product.
 */

import { NAVIGATION } from '../config'

/**
 * The two store listings. Every App Store badge, Play badge and Get the app
 * button on the site goes through here, so there is one place to change them.
 */
export const STORE = {
  appStore: 'https://apps.apple.com/us/app/pura-by-purehealth/id6449597603',
  googlePlay: 'https://play.google.com/store/apps/details?id=ae.purehealth.pura',
}

/**
 * Which store a "Get the app" button should send THIS visitor to.
 *
 * The two badges stay explicit — someone clicking the Play badge wants Play.
 * This is only for the button that does not name a store, where the visitor's
 * own platform is the best guess at what they can actually install.
 *
 *   iPhone, iPad, iPod  ->  App Store
 *   Android             ->  Play
 *   Mac                 ->  App Store   (Riniel's rule: the iOS listing)
 *   anything else       ->  Play        (Windows, Linux, ChromeOS)
 *
 * Order matters. iOS user agents contain the string "like Mac OS X", so a naive
 * test for Mac matches every iPhone — the device tests have to run first, and
 * the Mac test reads `platform` rather than the full user agent.
 *
 * iPadOS 13+ in its default desktop mode reports itself as a Macintosh, which
 * this does NOT try to unpick: an iPad falls through to the Mac branch and gets
 * the App Store, which is the right answer for an iPad anyway.
 *
 * Read once, at module load. A visitor does not change platform mid-visit, and
 * evaluating it per render would only invite a hydration mismatch.
 */
export function storeForPlatform(
  // `userAgentData` is Chromium-only and `platform` is deprecated, so neither
  // can be relied on alone — but between them they cover every browser, and the
  // user agent is the fallback that always exists. Both are arguments so the
  // rules can be checked against a table of real user agents rather than only
  // against whatever machine happens to be running.
  ua = typeof navigator === 'undefined' ? '' : navigator.userAgent || '',
  platform = typeof navigator === 'undefined'
    ? ''
    : navigator.userAgentData?.platform || navigator.platform || ''
) {
  if (/Android/i.test(ua)) return STORE.googlePlay
  if (/iPhone|iPad|iPod/i.test(ua)) return STORE.appStore
  if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return STORE.appStore
  return STORE.googlePlay
}

/** The resolved answer, so every button agrees and nothing is recomputed. */
export const APP_STORE_LINK = storeForPlatform()

export const EXTERNAL = {
  group: 'https://purehealth.ae/',
  email: 'mailto:care.pura@pura.ai',
  longevity: 'https://longevityclinic.pura.ai',
  /** The three ways to reach the partnerships team, from the Menu MVP page. */
  whatsapp: 'https://web.whatsapp.com/',
  phone: 'tel:123456789',
  partner: 'mailto:care.pura@pura.ai?subject=Pura',
}

/**
 * The menu. `to` on a group is where its own label navigates; `items` is the
 * dropdown. Every group has one, because the brief asks for dropdowns on all of
 * them — including More, which has no page of its own and so has no `to`.
 *
 * KEPT, not shipped. The first release runs `MENU_MVP` below — see
 * `NAVIGATION` in config.js. This one still drives the FOOTER and the "more in
 * this pillar" band at the foot of every inner page, so the 23 pages remain a
 * connected site behind a two-item bar.
 */
export const MENU = [
  {
    key: 'health',
    label: 'Your Health',
    to: '/health',
    items: [
      { to: '/health', title: 'Overview', body: 'Know your numbers' },
      { to: '/health/biomarkers', title: 'Biomarkers', body: 'All your health data, finally in one place.' },
      { to: '/health/purescore', title: 'PureScore', body: 'One number that tells you how you’re really doing.' },
      { to: '/health/goals', title: 'Goals', body: 'From knowing to doing.' },
    ],
  },
  {
    key: 'care',
    label: 'Care',
    to: '/care',
    items: [
      { to: '/care', title: 'Overview', body: 'Healthcare that comes to you' },
      { to: '/care/online-doctor', title: 'Online Doctor', body: 'See a doctor in minutes, not waiting rooms.' },
      { to: '/care/pharmacy', title: 'Pharmacy', body: 'Your prescription, delivered to your door.' },
      { to: '/care/lab-tests', title: 'At-Home Lab Tests', body: 'Lab tests without the lab.' },
      { to: '/care/care-plans', title: 'Care Plans', body: 'Ongoing care, not one-off visits.' },
    ],
  },
  {
    key: 'well',
    label: 'Wellness',
    to: '/well',
    items: [
      { to: '/well', title: 'Overview', body: 'Healthy habits, actually rewarded' },
      { to: '/well/challenges', title: 'Challenges', body: 'Get moving. Together.' },
      { to: '/well/fitcoins', title: 'FitCoins', body: 'Your effort, banked.' },
      { to: '/well/rewards', title: 'Rewards', body: 'Spend FitCoins on things you actually want.' },
    ],
  },
  {
    key: 'ai',
    label: 'Pura AI',
    to: '/pura-ai',
    items: [
      { to: '/pura-ai', title: 'Overview', body: 'The AI that orchestrates your health.' },
      { to: '/health/purescore', title: 'PureScore', body: 'What the AI turns your data into.' },
      { to: '/health/biomarkers', title: 'Biomarkers', body: 'The data it reads.' },
    ],
  },
  {
    key: 'why',
    label: 'Why Pura',
    to: '/why-pura',
    items: [
      { to: '/why-pura', title: 'Why Pura', body: 'What makes us different' },
      { to: '/mission', title: 'Our Mission', body: 'Why Pura exists' },
      { to: '/about', title: 'About', body: 'Who we are' },
      { to: '/trust', title: 'Trust & Safety', body: 'How your data is handled' },
    ],
  },
  {
    key: 'business',
    label: 'For Business',
    to: '/for-business',
    items: [
      { to: '/for-business', title: 'For Employers & Insurers', body: 'A healthcare partner for your people' },
      { to: '/partners', title: 'For Healthcare Partners', body: 'Join the Pura ecosystem' },
    ],
  },
  {
    key: 'more',
    label: 'More',
    items: [
      { to: '/education', title: 'Education', body: 'Blogs, guides & articles' },
      { to: '/support', title: 'Support', body: 'Help & FAQs' },
      { to: '/privacy-policy', title: 'Privacy Policy' },
      { to: '/terms-and-conditions', title: 'Terms & Conditions' },
    ],
  },
]

/** Flat list of every route the menu points at, for the footer and the 404. */
export const ALL_ROUTES = [...new Set(MENU.flatMap((g) => g.items.map((i) => i.to)))]

/**
 * The feature-page template, as the source site uses it: a hero, a definition,
 * three steps, four proof points, and a link back to the rest of the pillar.
 * Every `PAGES` entry below fills that shape.
 *
 * `note` is the regulatory line the source locks onto its clinical pages. It is
 * reproduced verbatim and must not be reworded here — the source marks it as
 * subject to Regulatory sign-off.
 */
export const REG_NOTE =
  'Please note: Pura does not provide emergency services — in an emergency, call 998. Information on this page is general in nature and is not a substitute for professional medical advice, diagnosis or treatment. (Locked regulatory slot — final wording subject to Regulatory sign-off.)'

/**
 * The first release's menu, built to the Figma `Menu MVP` page.
 *
 * The same bar as `MENU` — same pill, same dropdown card, same hover — with two
 * items instead of seven. Which is the point of keeping it as data: nothing
 * about the navigation's behaviour changes, only what is in it.
 *
 * `Partner with us` is the one group with a dropdown, and its three items leave
 * the site: WhatsApp, a phone number and an email. They are `href` rather than
 * `to`, and that is what tells the bar to render an anchor instead of a route
 * link — see `MenuGroup`.
 *
 * Longevity Clinic has no dropdown in the file. It leaves the site entirely,
 * so like the Partner with us items it carries an `href` rather than a `to`.
 */
export const MENU_MVP = [
  { key: 'longevity', label: 'Longevity Clinic', href: EXTERNAL.longevity },
  {
    key: 'partner',
    label: 'Partner with us',
    items: [
      { title: 'Whatsapp', icon: 'whatsapp', href: EXTERNAL.whatsapp },
      { title: 'Phone', icon: 'phone', href: EXTERNAL.phone },
      { title: 'Email', icon: 'email', href: EXTERNAL.partner },
    ],
  },
  {
    // The file's third label, added with the two legal documents. Its dropdown
    // carries no icons and no descriptions — just the two titles, which is
    // what the Menu MVP frame draws.
    key: 'more',
    label: 'More',
    items: [
      { to: '/privacy-policy', title: 'Privacy Policy' },
      { to: '/terms-and-conditions', title: 'Terms & Conditions' },
    ],
  },
]

/** What the bar actually renders. The footer and the inner pages keep `MENU`. */
export const NAV_MENU = NAVIGATION === 'mvp' ? MENU_MVP : MENU

export const PROOF_FOOTNOTE =
  '† Illustrative figure for prototype — replace with verified data before publication.'

const step = (n, h, p) => ({ n, h, p })

export const PAGES = {
  /* ------------------------------------------------------------- pillars */
  '/health': {
    kicker: 'Your Health',
    h1: 'Know your numbers.',
    lead: 'Your wearable data, your lab results and your vitals in one continuously updated picture — with one score on top that tells you how you are actually doing.',
    media: '/assets/site/biomarkers.webp',
    children: ['/health/biomarkers', '/health/purescore', '/health/goals'],
  },
  '/care': {
    kicker: 'Care',
    h1: 'Healthcare that comes to you.',
    lead: 'Pura’s Care pillar brings medical care to your phone: video consultations with UAE-licensed doctors, prescriptions dispensed by licensed pharmacies and delivered home, lab tests collected at your door, and doctor-led care plans for ongoing conditions. Each service connects to the next, so a consultation can flow into a prescription, a delivery or a test without re-entering anything — one closed loop of care rather than four disconnected apps.',
    media: '/assets/site/online-doctor.webp',
    children: ['/care/online-doctor', '/care/pharmacy', '/care/lab-tests', '/care/care-plans'],
    note: REG_NOTE,
  },
  '/well': {
    kicker: 'Wellness',
    h1: 'Healthy habits, actually rewarded.',
    lead: 'Challenges to keep you moving, FitCoins for the effort, and a catalogue of real rewards to spend them on. Your wearable does the counting.',
    media: '/assets/site/challenges.webp',
    children: ['/well/challenges', '/well/fitcoins', '/well/rewards'],
  },

  /* -------------------------------------------------------------- Care */
  '/care/online-doctor': {
    kicker: 'Online Doctor',
    h1: 'See a doctor in minutes, not waiting rooms.',
    lead: 'Video consultations with licensed doctors across the UAE — from wherever you are, with your prescription issued straight into the app.',
    media: '/assets/site/online-doctor.webp',
    whatIs: {
      h: 'What is Online Doctor?',
      p: 'Pura’s online doctor service connects you with UAE-licensed physicians over secure video, so everyday health concerns can be assessed, diagnosed and prescribed for without a trip to the clinic. You choose a doctor by specialty, language and availability, consult from home or work, and receive any prescription directly in the app — ready to send to Pura Pharmacy for delivery. It is built for common conditions, follow-ups and quick medical questions where an in-person visit is not needed.',
    },
    steps: [
      step('01', 'Choose your doctor', 'Browse by specialty, language, and next availability. Every doctor is licensed to practice in the UAE.'),
      step('02', 'Book a time that works', 'Pick a slot that suits you. Insurance eligibility is checked in-app before you pay, so there are no surprises.'),
      step('03', 'Consult, and get your prescription', 'Talk face-to-face from your phone. If you need medication, your e-prescription lands in the app the moment the call ends.'),
    ],
    proof: [
      { n: 'UAE-licensed', l: 'Every doctor is licensed to practise in the UAE' },
      { n: 'In minutes', l: 'Consult without a trip to the clinic' },
      { n: 'Insurance checked', l: 'Eligibility confirmed in-app before you pay' },
      { n: 'E-prescription', l: 'Issued to the app the moment the call ends' },
    ],
    faqs: [
      { q: 'What can an online doctor help with?', a: 'Common conditions, follow-ups and quick medical questions where an in-person visit is not needed.' },
      { q: 'Is my consultation covered by insurance?', a: 'Eligibility is checked in the app before you pay, so you know where you stand before the consultation starts.' },
      { q: 'How do I get my medication?', a: 'Your e-prescription lands in the app and can be sent to Pura Pharmacy for delivery in two taps.' },
    ],
    note: REG_NOTE,
    pillar: '/care',
  },
  '/care/pharmacy': {
    kicker: 'Pharmacy',
    h1: 'Your prescription, delivered to your door.',
    lead: 'Medication ordered in two taps from your consultation — dispensed by licensed pharmacies and delivered to wherever you are.',
    media: '/assets/site/pharmacy.webp',
    whatIs: {
      h: 'What is Pharmacy?',
      p: 'Pura Pharmacy fulfils your prescriptions through licensed UAE pharmacies and delivers them to your door, with insurance applied where you are covered. Because your e-prescription flows straight from a Pura consultation, there is nothing to re-enter and no queue to stand in. Recurring medication comes with refill reminders, so you reorder before you run out.',
    },
    steps: [
      step('01', 'Your prescription arrives', 'After your consultation, your e-prescription appears automatically. No paper, nothing to re-type.'),
      step('02', 'Confirm and pay', 'Check the order, choose your address and delivery window, and pay — with insurance applied where covered.'),
      step('03', 'It comes to you', 'A licensed pharmacy dispenses your medication and it’s delivered the same day† in major cities.'),
    ],
    proof: [
      { n: 'Licensed', l: 'Dispensed by licensed UAE pharmacies' },
      { n: 'Same day†', l: 'Delivered the same day in major cities' },
      { n: 'Insurance applied', l: 'Where you are covered, it is applied at checkout' },
      { n: 'Refill reminders', l: 'Reorder before you run out' },
    ],
    faqs: [
      { q: 'Do I need a paper prescription?', a: 'No. Your e-prescription flows straight from a Pura consultation into the order.' },
      { q: 'Where do you deliver?', a: 'Across the UAE, with same-day delivery† in major cities.' },
    ],
    note: REG_NOTE,
    pillar: '/care',
  },
  '/care/lab-tests': {
    kicker: 'At-Home Lab Tests',
    h1: 'Lab tests without the lab.',
    lead: 'Book a test, have a certified professional collect your sample at home, and get results explained in plain language — inside the app.',
    media: '/assets/site/lab-tests.webp',
    whatIs: {
      h: 'What is At-Home Lab Tests?',
      p: 'Pura’s at-home lab tests let you book blood work and health panels and have a certified phlebotomist collect your sample wherever you are. Results are returned in the app with plain-language explanations and flow automatically into your Biomarkers, so every test deepens your health picture instead of sitting in a PDF. It is ideal for routine screening, follow-up testing and wellness panels.',
    },
    steps: [
      step('01', 'Book your test', 'Choose a single test or a health package, pick a time, and confirm — at home or at work.'),
      step('02', 'A professional comes to you', 'A certified phlebotomist comes to you. The visit takes minutes, not a morning off.'),
      step('03', 'Results you can read', 'Results arrive in the app in 24–48 hours† — with plain-language explanations, and they flow straight into your Biomarkers.'),
    ],
    proof: [
      { n: 'At home', l: 'A certified phlebotomist collects your sample' },
      { n: '24–48 hours†', l: 'Results returned to the app' },
      { n: 'Plain language', l: 'Explained, not just reported' },
      { n: 'Auto-filed', l: 'Flows straight into your Biomarkers' },
    ],
    faqs: [
      { q: 'Which tests can I book?', a: 'Single tests and health packages, for routine screening, follow-up testing and wellness panels.' },
      { q: 'What happens to my results?', a: 'They arrive in the app with plain-language explanations and flow automatically into your Biomarkers.' },
    ],
    note: REG_NOTE,
    pillar: '/care',
  },
  '/care/care-plans': {
    kicker: 'Care Plans',
    h1: 'Ongoing care, not one-off visits.',
    lead: 'Doctor-led programs that turn consultations, medication, and tests into one managed journey — for chronic conditions, recovery, or a health goal that needs structure.',
    media: '/assets/site/care-plans.webp',
    whatIs: {
      h: 'What is Care Plans?',
      p: 'Pura Care Plans turn one-off consultations, medication and tests into a single doctor-led programme — for managing a chronic condition, recovering after treatment, or working toward a specific health goal. A licensed clinician designs your plan around your health picture, then coordinates check-ins, prescriptions and lab tests in one place. Your care team monitors progress between visits and adjusts the plan as your numbers change.',
    },
    steps: [
      step('01', 'Start with an assessment', 'A doctor reviews your health picture — consultations, biomarkers, history — and designs a plan around you.'),
      step('02', 'Follow a clear plan', 'Scheduled check-ins, medication on time, lab tests on cadence — everything organized in the app, nothing for you to chase.'),
      step('03', 'Adjust as you go', 'Your care team monitors how you’re doing between visits and adjusts the plan as your numbers change.'),
    ],
    proof: [
      { n: 'Doctor-led', l: 'Plans designed and supervised by licensed clinicians' },
      { n: 'Connected', l: 'Consults, pharmacy & labs coordinated in one plan' },
      { n: 'Check-ins', l: 'Scheduled follow-ups so nothing slips' },
      { n: 'Adaptive', l: 'Plans adjust as your biomarkers change' },
    ],
    faqs: [
      { q: 'Who is a Care Plan for?', a: 'Anyone managing a chronic condition, recovering after treatment, or working toward a health goal that needs structure.' },
      { q: 'Who designs the plan?', a: 'A licensed clinician, around your own health picture — consultations, biomarkers and history.' },
    ],
    note: REG_NOTE,
    pillar: '/care',
  },

  /* ------------------------------------------------------- Your Health */
  '/health/biomarkers': {
    kicker: 'Biomarkers',
    h1: 'All your health data, finally in one place.',
    lead: 'Wearable data, lab results, and vitals — pulled together automatically, tracked over time, and explained in language you don’t need a medical degree to read.',
    media: '/assets/site/biomarkers.webp',
    whatIs: {
      h: 'What is Biomarkers?',
      p: 'Pura Biomarkers brings your wearable data, lab results and vitals together into one continuously updated view, tracked over time and explained in plain language. Instead of one app for your watch and a folder of lab PDFs, you see sleep, heart rate, activity, glucose and cholesterol in a single timeline. Each marker comes with context on what it means and what tends to move it.',
    },
    steps: [
      step('01', 'Connect your sources', 'Link your wearables and health apps, and let your Pura lab results flow in automatically.'),
      step('02', 'See everything in one place', 'Sleep, heart rate, activity, glucose, cholesterol — organized into one timeline instead of five apps.'),
      step('03', 'Understand what it means', 'Every marker comes with plain-language context: what it is, where you stand, and what tends to move it.'),
    ],
    proof: [
      { n: 'Wearables + labs', l: 'Both sides of your health, together at last' },
      { n: 'Auto-synced', l: 'Pura lab results appear without lifting a finger' },
      { n: 'Trends', l: 'Months of history, not just today’s snapshot' },
      { n: 'Plain language', l: 'Explanations, not just numbers' },
    ],
    faqs: [
      { q: 'Which devices and apps can I connect?', a: 'Your wearables and phone health apps; Pura lab results flow in on their own.' },
      { q: 'Do I have to enter data manually?', a: 'No — connected sources sync themselves, and Pura lab results appear automatically.' },
      { q: 'Is my health data safe?', a: 'All Pura health data is stored and processed inside the UAE, under UAE data protection law.' },
    ],
    pillar: '/health',
  },
  '/health/purescore': {
    kicker: 'PureScore',
    h1: 'One number that tells you how you’re really doing.',
    lead: 'PureScore distills your sleep, activity, vitals, and lab results into a single daily score — so you always know where you stand, and what to do next.',
    media: '/assets/site/purescore.webp',
    whatIs: {
      h: 'What is PureScore?',
      p: 'PureScore distils your sleep, activity, vitals and lab biomarkers into one daily health score, so you always know where you stand and what to do next. Unlike a wearable’s recovery score, it includes your clinical markers — which is why it can surface things a watch alone cannot. Tap into any day’s score to see exactly what lifted it, what dragged it down, and the highest-impact change to make.',
    },
    steps: [
      step('01', 'Your data flows in', 'Wearables, activity, and lab results feed the score automatically — the more you connect, the sharper it gets.'),
      step('02', 'One score, every day', 'PureScore weighs what matters across sleep, movement, vitals, and biomarkers into a number you can actually act on.'),
      step('03', 'See what moves it', 'Tap into your score to see exactly what’s lifting it, what’s dragging it, and the highest-impact thing to work on next.'),
    ],
    proof: [
      { n: 'Multi-domain', l: 'Sleep, activity, vitals & lab biomarkers — not just steps' },
      { n: 'Daily', l: 'Updated every morning with fresh data' },
      { n: 'Explainable', l: 'Always see why your score is what it is' },
      { n: 'Actionable', l: 'Each score comes with your next best move' },
    ],
    faqs: [
      { q: 'How is PureScore different from my watch’s score?', a: 'It includes your clinical markers, not just wearable data — which is why it can surface things a watch alone cannot.' },
      { q: 'Can my score go down even if I exercise?', a: 'Yes. It weighs sleep, vitals and biomarkers too, so a hard week with poor sleep can still move it down.' },
      { q: 'Is PureScore a medical diagnosis?', a: 'No. It is a health score, not a diagnosis, and is not a substitute for professional medical advice.' },
    ],
    pillar: '/health',
  },
  '/health/goals': {
    kicker: 'Goals',
    h1: 'From knowing to doing.',
    lead: 'Turn your score and biomarkers into targets you can hit — broken into weekly steps, tracked automatically, and rewarded when you get there.',
    media: '/assets/site/goals.webp',
    whatIs: {
      h: 'What is Goals?',
      p: 'Pura Goals turn your score and biomarkers into targets you can actually hit — more sleep, more movement, a healthier weight, or a specific marker — broken into weekly steps that adapt to how you are doing. Connected data updates your progress automatically, so there is nothing to log, and every target you reach earns FitCoins. Your doctor can also set goals with you as part of a Care Plan.',
    },
    steps: [
      step('01', 'Pick what matters', 'Sleep more, move more, improve a biomarker, reach a weight — choose a goal tied to your real data.'),
      step('02', 'Get a weekly path', 'Pura breaks your goal into achievable weekly targets that adapt to how you’re actually doing.'),
      step('03', 'Progress tracks itself', 'Connected data updates your progress automatically — and hitting targets earns FitCoins along the way.'),
    ],
    proof: [
      { n: 'Data-linked', l: 'Goals tied to your actual biomarkers & score' },
      { n: 'Weekly targets', l: 'Big goals, broken into winnable weeks' },
      { n: 'Auto-tracked', l: 'No manual logging for connected data' },
      { n: 'Rewarded', l: 'Every target hit earns FitCoins' },
    ],
    faqs: [
      { q: 'What kinds of goals can I set?', a: 'Sleep, movement, weight or a specific biomarker — anything tied to your real data.' },
      { q: 'What if I fall behind?', a: 'Weekly targets adapt to how you are actually doing rather than holding you to a plan that stopped fitting.' },
      { q: 'Do goals connect to rewards?', a: 'Yes — every target you hit earns FitCoins.' },
    ],
    pillar: '/health',
  },

  /* ---------------------------------------------------------- Wellness */
  '/well/challenges': {
    kicker: 'Challenges',
    h1: 'Get moving. Together.',
    lead: 'Step battles, streaks, and community challenges that make consistency feel like a game — solo, with friends, or with the whole Pura community.',
    media: '/assets/site/challenges.webp',
    whatIs: {
      h: 'What is Challenges?',
      p: 'Pura Challenges make consistency feel like a game, with step battles, streaks and community challenges you can join solo, with friends, or across the whole Pura community. Your connected wearable counts everything automatically, and finishing a challenge credits FitCoins to your balance. It is a low-effort way to stay motivated and turn everyday movement into rewards.',
    },
    steps: [
      step('01', 'Join a challenge', 'Pick from live community challenges or start one with friends — steps, workouts, sleep streaks and more.'),
      step('02', 'Compete and keep streaks', 'Leaderboards and streaks keep it interesting. Your connected wearable does the counting.'),
      step('03', 'Finish and earn', 'Complete a challenge and the FitCoins land in your balance automatically.'),
    ],
    proof: [
      { n: 'Community', l: 'Emirate-wide challenges everyone can join†' },
      { n: 'With friends', l: 'Private challenges with your own crew' },
      { n: 'Auto-counted', l: 'Your wearable tracks it — no screenshots' },
      { n: 'Paid in FitCoins', l: 'Every completed challenge earns' },
    ],
    faqs: [
      { q: 'Do I need a wearable to join?', a: 'A connected wearable does the counting automatically, which is the easiest way to take part.' },
      { q: 'Can I create private challenges?', a: 'Yes — private challenges with your own crew, as well as the community ones.' },
      { q: 'What do I win?', a: 'FitCoins, mostly — plus the occasional featured challenge with boosted rewards from Pura partners.' },
    ],
    pillar: '/well',
  },
  '/well/fitcoins': {
    kicker: 'FitCoins',
    h1: 'Your effort, banked.',
    lead: 'FitCoins are Pura’s reward currency. Steps, streaks, goals, and challenges all earn — automatically — and your balance is yours to spend.',
    media: '/assets/site/fitcoins.webp',
    whatIs: {
      h: 'What is FitCoins?',
      p: 'FitCoins are Pura’s reward currency, earned automatically for daily activity, hitting goal targets and completing challenges. There is nothing to claim — connected data credits your balance as you go — and every coin is spendable on real rewards in the app. It is designed to make healthy habits pay off in something tangible.',
    },
    steps: [
      step('01', 'Do the healthy thing', 'Move, sleep well, hit your weekly targets, finish challenges — normal healthy life, nothing extra.'),
      step('02', 'Earn automatically', 'Connected data means FitCoins credit themselves. Watch the balance grow without logging anything.'),
      step('03', 'Spend on real rewards', 'Redeem in the Rewards catalogue — from fitness and lifestyle perks to partner offers.'),
    ],
    proof: [
      { n: 'Every day counts', l: 'Daily activity earns, not just big milestones' },
      { n: 'Automatic', l: 'No logging, no claiming — it just credits' },
      { n: 'Real value', l: 'Spendable on real products & experiences' },
      { n: 'Boosts†', l: 'Streaks and featured challenges multiply earnings' },
    ],
    faqs: [
      { q: 'How do I earn FitCoins?', a: 'Daily activity, hitting goal targets and completing challenges — all credited automatically.' },
      { q: 'Do FitCoins expire?', a: 'Your balance is yours to spend in the Rewards catalogue; terms are shown in the app.' },
      { q: 'Can I convert FitCoins to partner points?', a: 'Where Pura has live partnerships, conversion options appear in the app. Available options are always shown in your Rewards tab.' },
    ],
    pillar: '/well',
  },
  '/well/rewards': {
    kicker: 'Rewards',
    h1: 'Spend FitCoins on things you actually want.',
    lead: 'A catalogue of real rewards from Pura and partner brands — fitness, lifestyle, dining, and wellness perks, redeemable straight from the app.',
    media: '/assets/site/rewards.webp',
    whatIs: {
      h: 'What is Rewards?',
      p: 'The Pura Rewards catalogue lets you spend FitCoins on real perks from Pura and partner brands across fitness, dining, lifestyle and wellness. Redemptions are delivered to the app instantly, every reward shows its FitCoin price upfront, and the catalogue refreshes regularly with new offers. It is the tangible pay-off for the healthy habits you have already built.',
    },
    steps: [
      step('01', 'Browse the catalogue', 'Rewards across fitness, dining, lifestyle and wellness — updated regularly with new partner drops†.'),
      step('02', 'Redeem with FitCoins', 'Found something you like? Redeem it in-app in seconds with your balance.'),
      step('03', 'Enjoy it in real life', 'Vouchers and perks are delivered to your app instantly, ready to use.'),
    ],
    proof: [
      { n: 'Partner brands†', l: 'Rewards from names you know across the UAE' },
      { n: 'Instant', l: 'Redemptions delivered to your app in seconds' },
      { n: 'Fresh drops†', l: 'Catalogue refreshed with new rewards regularly' },
      { n: 'Transparent', l: 'Every reward shows its FitCoin price upfront' },
    ],
    faqs: [
      { q: 'What kind of rewards are there?', a: 'Fitness, dining, lifestyle and wellness perks from Pura and partner brands.' },
      { q: 'Is there a catch?', a: 'No hidden tiers. Every reward shows its FitCoin cost, availability, and terms before you redeem.' },
    ],
    pillar: '/well',
  },

  /* ----------------------------------------------------------- Pura AI */
  '/pura-ai': {
    kicker: 'Pura AI',
    h1: 'The AI that orchestrates your health.',
    lead: 'Pura AI is a standalone intelligence layer. It reads your care, wellness, wearable and medical-record data, turns it into your PureScore, insights and next best action — then answers your questions about all of it, right here.',
    media: '/assets/site/ai.webp',
    whatIs: {
      h: 'One module that connects everything.',
      p: 'Every other part of Pura feeds it and is fed by it: Care supplies consultations, prescriptions and lab results; Your Health supplies biomarkers and your score; Wellness supplies activity, goals and streaks. Pura AI is what turns those four streams into one answer rather than four dashboards.',
    },
    steps: [
      step('01', 'It reads everything', 'Care, wellness, wearable and medical-record data — the whole picture, not one slice of it.'),
      step('02', 'It turns data into meaning', 'Your PureScore, your insights and your next best action, recalculated as the data changes.'),
      step('03', 'You just ask', 'Ask anything about your health and get an answer grounded in your own record.'),
    ],
    proof: [
      { n: 'Every stream', l: 'Care, wellness, wearables and records together' },
      { n: 'Explainable', l: 'Answers that show what they are based on' },
      { n: 'Next best action', l: 'Not just a number — what to do about it' },
      { n: 'In the UAE', l: 'Processed under UAE data protection law' },
    ],
    note: REG_NOTE,
  },

  /* -------------------------------------------------------- the company */
  '/why-pura': {
    kicker: 'Why Pura',
    h1: 'Health apps track. Pura treats.',
    lead: 'Four things make the difference between an app that watches your health and one that does something about it.',
    media: '/assets/site/why.webp',
    reasons: [
      { n: '01', title: 'Backed by PureHealth', body: 'Pura is built by PureHealth — the region’s largest healthcare group. Behind every feature sits a real network of hospitals, clinics, labs and pharmacies.' },
      { n: '02', title: 'An AI that sees everything', body: 'Your watch sees your workouts. Pura AI sees your labs, your consultations, your prescriptions and your habits — and reads them together.' },
      { n: '03', title: 'Real care, not just data', body: 'Pura is where you do something about it: a video consultation, medication delivered, a home lab test, a doctor-led plan.' },
      { n: '04', title: 'Your data stays in the UAE', body: 'All Pura health data is stored and processed inside the UAE, under UAE data protection law.' },
    ],
  },
  '/mission': {
    kicker: 'Our Mission',
    h1: 'Healthcare is a human right, not a luxury.',
    lead: 'Simplify today. Prevent tomorrow.',
    media: '/assets/site/about.webp',
    sections: [
      { h: 'What Pura always is — and never will be.', p: 'Pura is a companion and a route into real care. It is not a replacement for your doctor, and it will not pretend to be one.' },
      { h: 'Simplify today. Prevent tomorrow.', p: 'Make the health you already have legible, then use what that shows to stop the things that can be stopped.' },
      { h: 'Technology has limits. We build around them.', p: 'Where a model cannot be trusted to decide, a clinician decides. The technology carries the work to them, not past them.' },
      { h: 'Built by PureHealth. Kept in the UAE.', p: 'The region’s largest healthcare group, with all health data stored and processed inside the UAE.' },
    ],
  },
  '/about': {
    kicker: 'About Pura',
    h1: 'Healthcare shouldn’t start when you get sick.',
    lead: 'Pura is built by PureHealth, the largest healthcare group in the Middle East — which is what lets one app hold your labs, your clinicians and your daily habits at once.',
    media: '/assets/site/team.webp',
    sections: [
      { h: 'Built on the region’s largest health network.', p: 'Hospitals, clinics, laboratories and pharmacies already connected to each other — and now to you.' },
    ],
  },
  '/trust': {
    kicker: 'Trust & Safety',
    h1: 'Your health data. Your country. Your rules.',
    lead: 'All Pura health data is stored and processed inside the UAE, under UAE data protection law.',
    media: '/assets/site/trust.webp',
    sections: [
      { h: 'Stored in the UAE', p: 'Health data is stored and processed inside the UAE, under UAE data protection law.' },
      { h: 'Yours to control', p: 'You choose what you connect and what you share, and you can disconnect a source at any time.' },
      { h: 'Clinician in the loop', p: 'Anything clinical is reviewed by a licensed professional rather than decided by a model.' },
    ],
  },

  /* ------------------------------------------------------- for business */
  '/for-business': {
    kicker: 'For Employers & Insurers',
    h1: 'A healthcare partner, proven in the numbers.',
    lead: 'Give your people the same health companion, with the group’s clinicians, labs and pharmacies behind it.',
    media: '/assets/site/biz.webp',
    sections: [
      { h: 'Three services, one partner.', p: 'Care, Your Health and Wellness delivered together, under one agreement, with one point of contact.' },
      { h: 'Organisations already investing in their people.', p: 'Employers and insurers across the UAE already use Pura to reach their members where they are.' },
      { h: 'Before Pura, and after.', p: 'Utilisation, engagement and outcomes reported in aggregate, so the investment is legible.' },
    ],
    cta: { title: 'Let’s build a healthier organisation.', href: EXTERNAL.email, label: 'care.pura@pura.ai' },
  },
  '/partners': {
    kicker: 'For Healthcare Partners',
    h1: 'Plug into the health platform the UAE relies on.',
    lead: 'Join the Pura ecosystem — devices, clinics, laboratories and pharmacies, connected into one loop of care.',
    media: '/assets/site/biz.webp',
    sections: [
      { h: 'Every part of care, in one ecosystem.', p: 'Consultations, prescriptions, diagnostics and devices, connected rather than adjacent.' },
      { h: 'Three steps to going live.', p: 'Apply, integrate, and appear where your patients already are.' },
      { h: 'More than a listing. A place in the loop.', p: 'Partners are part of the journey the app carries a patient through, not an entry in a directory.' },
    ],
    cta: { title: 'Let’s build the connected loop together.', href: EXTERNAL.email, label: 'care.pura@pura.ai' },
  },

  /* -------------------------------------------------------------- more */
  '/education': {
    kicker: 'Education',
    h1: 'Health, worth understanding.',
    lead: 'Blogs, guides and articles from the Pura journal.',
    media: '/assets/site/why.webp',
    sections: [{ h: 'From the Pura journal.', p: 'Explainers on the things the app measures, and what to do about them.' }],
  },
  '/support': {
    kicker: 'Support',
    h1: 'We’re here. How can we help?',
    lead: 'Help and FAQs, or talk to a person.',
    faqs: [
      { q: 'How do I get started?', a: 'Download Pura, connect a wearable or upload a lab result, and your first PureScore follows.' },
      { q: 'Is Pura covered by my insurance?', a: 'Eligibility is checked in the app before you pay for a consultation.' },
      { q: 'How do I contact someone?', a: 'Email care.pura@pura.ai and a person will come back to you.' },
    ],
    cta: { title: 'Still stuck?', href: EXTERNAL.email, label: 'care.pura@pura.ai' },
  },
  '/legal': {
    kicker: 'Legal',
    h1: 'Privacy & Terms',
    lead: 'How Pura handles your data, and the terms you agree to when you use it.',
    sections: [
      { h: 'Privacy Policy', p: 'All Pura health data is stored and processed inside the UAE, under UAE data protection law. The full policy is published with the app.' },
      { h: 'Terms of Use', p: 'Pura is a health companion and a route into regulated care. It does not provide emergency services.' },
    ],
    note: REG_NOTE,
  },
}
