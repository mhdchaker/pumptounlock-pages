// Facts used on more than one page. Change them here, not in the pages.

export const site = {
  name: 'PumpToUnlock',
  url: 'https://pumptounlock.com',
  email: 'pumptounlock@gmail.com',
  appStoreUrl: 'https://apps.apple.com/app/id6802252587',
  eulaUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  downloadLine: 'Free to download. For iPhone with iOS 16 or later.',

  // Google Search Console: the content of the "google-site-verification" tag, if the site is
  // verified with a tag (a DNS record at the domain provider needs nothing here).
  googleSiteVerification: '',

  // Who articles are by. The name in the articles' front matter, Lisa Perlmann, is a pen name.
  // The owner decided on Nov 15, 2026 to keep it, as a plain name: no author page, biography,
  // role, credentials, picture or link for it.
  // `kind` says how the pages' search data names the author:
  //   'none'         the name is shown on the page only (right for a pen name, since the data
  //                  would otherwise state that a person of that name exists)
  //   'person'       a real person
  //   'organization' the app itself
  // If `decided` is false, scripts/prepublish-check.mjs stops a deploy that would publish an article.
  blogAuthor: {
    decided: true,
    kind: 'none' as 'none' | 'person' | 'organization',
  },

  // The language button shows only when there is more than one language.
  languages: [{ code: 'en', label: 'English', href: '/' }],

  review: {
    quote: '“Instead of just blocking apps, it gives you a reason to move before opening them.”',
    // The name the App Store shows for this review (US, German and British store pages,
    // read Nov 15, 2026). Decided by the owner on Nov 15, 2026.
    by: 'Willl483 on the App Store',
    // scripts/prepublish-check.mjs stops a deploy while this is false.
    byConfirmed: true,
  },

  mockup: {
    name: 'iPhone 15 Pro 3D Mockups',
    url: 'https://www.figma.com/community/file/1303247171848616022/iphone-15-pro-3d-mockups',
    licenseName: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
};

export const nav = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Blog', href: '/blog/', blog: true },
  { label: 'Support', href: '/support/' },
];

export const footerLinks = [
  ...nav,
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms of Use', href: '/terms/' },
];

// Questions used on the home page and on Support.
export const faq = {
  account: {
    q: 'Do I need an account?',
    a: 'No. PumpToUnlock works without an account, and we never ask for your name or email.',
  },
  camera: {
    q: 'Does the camera record me?',
    a: 'The camera picture that counts your push-ups is processed on your iPhone and is never uploaded.',
  },
  apps: {
    q: 'Which apps can I lock?',
    a: 'Any app or category on your iPhone. You pick them from Apple’s Screen Time list, and everything else stays open.',
  },
  intensity: {
    q: 'How many push-ups does a minute cost?',
    a: 'You decide. The setting is called Intensity.',
  },
  cancel: {
    q: 'How do I cancel Elite?',
    a: 'In the App Store, under your name, then Subscriptions. Elite stays active until the end of the period you paid for.',
  },
  android: {
    q: 'Is there an Android version?',
    a: 'No. PumpToUnlock is for iPhone only.',
  },
  counting: {
    q: 'The app does not count my push-ups.',
    a: 'Place your iPhone on the floor in front of you, with the front camera facing you. Make sure your whole upper body is visible and the room has enough light.',
  },
  locking: {
    q: 'My blocked apps do not lock.',
    a: 'Check that PumpToUnlock has Screen Time access in your iPhone settings.',
  },
};
