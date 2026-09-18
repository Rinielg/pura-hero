/**
 * Everything the inner pages say.
 *
 * All of it is lifted from the live site at pura.ai, which is a SINGLE page:
 * its "AI PureScore", "Integrated Health" and "Wellness" menu items are anchor
 * links to sections, not pages. The new navigation has six destinations, so the
 * live site's five sections are redistributed across them rather than copied
 * one to one. That mapping is a judgement and it lives here, in one file, so it
 * can be argued with instead of being spread through the markup.
 *
 *   My Health    <- PureScore, Diabetes           (what Pura knows about you)
 *   Care         <- Online Doctor, consultations  (getting to a clinician)
 *   Wellness     <- Fitness & Wellness, Mental    (what you do day to day)
 *   Pura AI      <- the companion itself
 *   Why Pura     <- partners, the group, the case
 *   For Business <- Partner With Pura, Longevity Clinic
 *
 * Copy is reproduced as written. Where a page needs connective tissue the live
 * site does not have — a section lead, a page kicker — it is marked NEW so the
 * difference between PureHealth's words and this prototype's stays visible.
 */

export const STORE = {
  appStore: 'https://apps.apple.com/ae/app/pura-by-purehealth/id6449597603',
  googlePlay: 'https://play.google.com/store/apps/details?id=ae.purehealth.pura',
}

export const EXTERNAL = {
  group: 'https://purehealth.ae/',
  longevity: 'https://longevityclinic.pura.ai/',
  faqs: 'https://pura.ai/faqs/',
  privacy: 'https://pura.ai/privacy-policy/',
  terms: 'https://pura.ai/terms-and-conditions/',
  email: 'mailto:care.pura@pura.ai',
}

/** The six destinations, in nav order. `path` is the route. */
export const PAGES = [
  { path: '/my-health', label: 'My Health' },
  { path: '/care', label: 'Care' },
  { path: '/wellness', label: 'Wellness' },
  { path: '/pura-ai', label: 'Pura AI' },
  { path: '/why-pura', label: 'Why Pura' },
  { path: '/for-business', label: 'For Business' },
]

/* ------------------------------------------------------------- My Health */

export const MY_HEALTH = {
  kicker: 'My Health',
  title: 'One score for your whole health span.',
  // NEW — the live site leads with the app, not with the section.
  lead: 'Pura brings your lab results, your wearable data and your medical history into one place, then tells you what it means in plain words.',
  sections: [
    {
      id: 'purescore',
      eyebrow: 'PureScore',
      title: 'Unlock and expand your health span',
      body: 'PureScore gives you a personalised view of your health span, not just your lifespan. Based on the information you share, it calculates your healthy years and offers tailored insights just for you.',
      points: [
        'Activity level assessment powered by wearables',
        'BMI, age, gender and health data analysis',
        'Uploaded bloodwork reporting',
      ],
      media: '/assets/site/app/fitness-activity.png',
      mediaAlt: 'The Pura activity widget showing the day’s movement and rest',
    },
    {
      id: 'diabetes',
      eyebrow: 'Diabetes',
      title: 'Early detection and prevention',
      body: 'Navigate your diabetes journey with powerful insights built around your unique needs.',
      cards: [
        {
          title: 'Real-time glucose',
          body: 'Get real-time visibility of blood glucose levels with instant alerts, for any changes outside the normal range.',
          media: '/assets/site/app/diabetes-1.png',
        },
        {
          title: 'Sensors delivered',
          body: 'Diabetes care elevated: order and get CGM sensors delivered to your doorstep in just a few taps.',
          media: '/assets/site/app/diabetes-2.png',
        },
        {
          title: 'Specialists on call',
          body: 'Access specialised doctors 24/7, all from the comfort of your home.',
          media: '/assets/site/app/diabetes-3.png',
        },
        {
          title: 'Nutrition insights',
          body: 'Elevate your nutrition by logging your meals and receiving personalised insights to improve your health.',
          media: '/assets/site/app/diabetes-4.png',
        },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ Care */

export const CARE = {
  kicker: 'Care',
  title: 'A doctor, anytime, anywhere.',
  lead: 'Get access to trusted medical experts with quality care and more from the comfort of your home.',
  sections: [
    {
      id: 'online-doctor',
      eyebrow: 'Online Doctor',
      title: 'Anytime, anywhere',
      body: 'Get access to trusted medical experts with quality care and more from the comfort of your home.',
      media: '/assets/site/app/online-doctor.png',
      mediaAlt: 'The Pura online doctor screen',
      items: [
        { icon: '/assets/site/icons/care-1.png', text: 'Choose from a variety of specialized Doctors.' },
        { icon: '/assets/site/icons/care-2.png', text: 'Receive 24/7 medical care, at your fingertips.' },
        { icon: '/assets/site/icons/care-3.png', text: 'Enjoy an end-to-end journey with medicine delivery.' },
        { icon: '/assets/site/icons/care-4.png', text: 'Consolidate all your medical reports in one convenient place.' },
      ],
    },
    {
      id: 'mental-health',
      eyebrow: 'Mental health',
      title: 'Licensed support, whenever you need it',
      // Reproduced from the SAKINA launch copy on the live site.
      body: 'Book online sessions with licensed psychologists and psychiatrists, whenever, wherever — delivered with SAKINA, the region’s largest mental health network.',
      points: [
        'Direct access to licensed psychologists and psychiatrists',
        'Available across the UAE, wherever you are',
        'Covered for those insured with Daman',
      ],
    },
  ],
}

/* -------------------------------------------------------------- Wellness */

export const WELLNESS = {
  kicker: 'Wellness',
  title: 'Take control of your health.',
  lead: 'Track your workouts, sleep, and nutrition, all in one place, with insights that help you take your fitness to the next level.',
  sections: [
    {
      id: 'fitness',
      eyebrow: 'Fitness',
      title: 'Take control of your health',
      body: 'Track your workouts, sleep, and nutrition, all in one place, with insights that help you take your fitness to the next level.',
      showcase: [
        {
          title: 'Challenges',
          body: 'Join community leaderboards and take on motivating challenges that supercharge your fitness and push you toward peak performance.',
          media: '/assets/site/app/fitness-challenges.png',
        },
        {
          title: 'Get rewarded',
          body: 'Complete challenges, collect FitCoins, and enjoy rewards from a variety of leading brands.',
          media: '/assets/site/app/fitness-rewards.png',
        },
        {
          title: 'Connect your wearable',
          body: 'Sync your wearable or smartphone health app to access full fitness tracking and personalised insights.',
          media: '/assets/site/app/fitness-wearable.png',
        },
        {
          title: 'Track your activity',
          body: 'Track your daily activity, rest, meals and get personalised insights to take your health to the next level.',
          media: '/assets/site/app/fitness-activity.png',
        },
      ],
    },
    {
      id: 'mind',
      eyebrow: 'Mental Wellness',
      title: 'Nurture your mind',
      body: 'Nurture your mind and take care of your mental wellbeing with expert support, calming tools, and a wealth of resources.',
      items: [
        {
          icon: '/assets/site/icons/mind-1.png',
          title: 'Healthy habits',
          body: 'Track, develop and build healthy habits with our intuitive daily tracker, designed to keep you motivated at all times.',
        },
        {
          icon: '/assets/site/icons/mind-2.png',
          title: 'Find inner peace',
          body: 'Discover our guided meditations designed to calm your mind, reduce stress, and help you feel your best.',
        },
        {
          icon: '/assets/site/icons/mind-3.png',
          title: 'Personalised programmes',
          body: 'Explore tailored programmes across sleep, stress, mindfulness and more to enhance your overall energy levels.',
        },
        {
          icon: '/assets/site/icons/mind-4.png',
          title: 'Localized content',
          body: 'Explore mental wellness content in both English and Arabic, designed to help you manage stress and anxiety.',
        },
      ],
    },
  ],
}

/* --------------------------------------------------------------- Pura AI */

export const PURA_AI = {
  kicker: 'Pura AI',
  title: 'A health companion that knows you.',
  lead: 'Pura is your personal AI health companion, dedicated to supporting you every step of your wellness journey. From effortless fitness tracking to instant access to doctors, Pura empowers you to take control of your health and live a longer, fuller life.',
  sections: [
    {
      id: 'ask',
      eyebrow: 'Ask anything',
      title: 'Every answer grounded in your own data',
      // NEW — the agent bar is from the brand work, not from pura.ai.
      body: 'Ask Pura AI anything. Because it reads your record, your labs and your wearable together, the answer is about you rather than about people in general.',
      points: [
        'Answers drawn from your own results, not generic advice',
        'Plain language, with the reasoning shown',
        'Available in English and Arabic',
      ],
    },
    {
      id: 'score',
      eyebrow: 'PureScore',
      title: 'One number, and what moved it',
      body: 'PureScore gives you a personalised view of your health span, not just your lifespan. Based on the information you share, it calculates your healthy years and offers tailored insights just for you.',
      media: '/assets/site/app/fitness-activity.png',
      mediaAlt: 'The PureScore widget',
    },
  ],
}

/* -------------------------------------------------------------- Why Pura */

export const WHY_PURA = {
  kicker: 'Why Pura',
  title: 'The bridge between your data and real care.',
  // NEW — assembled from the brand storyboards and the group positioning.
  lead: 'Pura is built by PureHealth, the largest healthcare group in the Middle East. That is what lets one app hold your labs, your clinicians and your daily habits at once.',
  reasons: [
    {
      title: 'Your data, already here',
      body: 'Your labs, your medical history and your wearable arrive in one place instead of five, because the people who run the labs built the app.',
    },
    {
      title: 'Care that is actually connected',
      body: 'A question in the app can become a consultation, a prescription and a delivery without you starting again somewhere else.',
    },
    {
      title: 'Built on the region’s network',
      body: 'SEHA, SSMC, PureLab, Daman and SAKINA are part of the same group — so the referral is inside the system, not outside it.',
    },
    {
      title: 'Health span, not just lifespan',
      body: 'PureScore measures the years you will feel well, and shows what moves that number.',
    },
    {
      title: 'Yours, in both languages',
      body: 'Content and consultations in English and Arabic, built for the UAE rather than translated into it.',
    },
  ],
  partners: [
    { name: 'SAKINA', logo: '/assets/site/partners/Sakina.png' },
    { name: 'Daman', logo: '/assets/site/partners/Daman.png' },
    { name: 'SEHA Clinics', logo: '/assets/site/partners/SEHA-Clinics.png' },
    { name: 'Dawak', logo: '/assets/site/partners/Dawak.png' },
    { name: 'TMO', logo: '/assets/site/partners/TMO.png' },
    { name: 'PureLab', logo: '/assets/site/partners/PureLab.png' },
    { name: 'SEHA', logo: '/assets/site/partners/SEHA.png' },
    { name: 'SSMC', logo: '/assets/site/partners/SSMC.png' },
    { name: 'Active', logo: '/assets/site/partners/Active.png' },
  ],
}

/* ---------------------------------------------------------- For Business */

export const FOR_BUSINESS = {
  kicker: 'For Business',
  title: 'Transform employee wellness with Pura.',
  lead: 'Interested in enhancing your employee’s health and overall wellness? Find out how Pura can unlock this for you.',
  sections: [
    {
      id: 'partner',
      eyebrow: 'Partner with Pura',
      title: 'Health that shows up at work',
      // NEW — the live site has only the form; these are the benefits it implies.
      body: 'Give your people the same health companion, with the group’s clinicians, labs and pharmacies behind it.',
      points: [
        'PureScore across your workforce, reported in aggregate',
        'Online doctor and mental health consultations included',
        'Challenges, FitCoins and rewards to keep people engaged',
      ],
    },
    {
      id: 'longevity',
      eyebrow: 'Longevity Clinic',
      title: 'Where the data becomes a plan',
      body: 'The Pura Longevity Clinic turns a PureScore into a programme, with the diagnostics and the clinicians to follow it through.',
      link: { href: EXTERNAL.longevity, label: 'Visit the Longevity Clinic' },
    },
  ],
  contact: [
    { icon: '/assets/site/partners/Sakina.png', label: 'care.pura@pura.ai', href: EXTERNAL.email },
  ],
}

export const PAGE_DATA = {
  '/my-health': MY_HEALTH,
  '/care': CARE,
  '/wellness': WELLNESS,
  '/pura-ai': PURA_AI,
  '/why-pura': WHY_PURA,
  '/for-business': FOR_BUSINESS,
}
