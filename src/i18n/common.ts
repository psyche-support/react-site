export const common = {
  el: {
    brand: 'Psyche Support',
    nav: [
      { label: 'Υπηρεσίες', href: '/services' },
      { label: 'Συνεδρίες', href: '/sessions' },
      { label: 'Άρθρα', href: '/articles' },
      { label: 'Πληροφορίες', href: '/about' },
    ],
    cta: { label: 'Καλέστε τώρα', href: 'tel:+306940340777' },
    floatingCta: {
      label: "Κλείσε συνεδρία",
      calUrl: "https://cal.com/psyche-support"
    },
    footer: {
      tagline: "Ψυχική υγεία και ψυχοθεραπεία",
      linksTitle: "Σύνδεσμοι",
      follow: "Ακολουθήστε",
      location: "Τοποθεσία",
      viewOnMap: "Προβολή στον χάρτη",
      rights: "Με επιφύλαξη παντός δικαιώματος.",
      // Optional default links if you want them driven from i18n:
      links: [
        { label: "Υπηρεσίες", href: "/services" },
        { label: "Συνεδρίες", href: "/sessions" },
        { label: "Άρθρα", href: "/articles" },
        { label: "Πληροφορίες", href: "/about" },
        { label: "Πολιτική Απορρήτου", href: "/privacy" },
      ],
    },
    consent: {
      title: "Συναίνεση cookies",
      body: "Χρησιμοποιούμε cookies για ανώνυμη ανάλυση επισκεψιμότητας (Google Analytics).",
      accept: "Αποδοχή",
      decline: "Απόρριψη",
      learnMoreLabel: "Περισσότερα",
      learnMoreHref: "/privacy", // ή πλήρες URL
    },
    langToggle: ['GR', 'EN']
  },
  en: {
    brand: 'Psyche Support',
    nav: [
      { label: 'Services', href: '/services' },
      { label: 'Sessions', href: '/sessions' },
      { label: 'Articles', href: '/articles' },
      { label: 'About', href: '/about' },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    cta: { label: 'Reach out now', href: 'tel:+306940340777' },
    floatingCta: {
      label: "Book your session",
      calUrl: "https://cal.com/psyche-support"
    },
    footer: {
      tagline: "Mental health and psychotherapy",
      linksTitle: "Links",
      follow: "Follow",
      location: "Location",
      viewOnMap: "View on Map",
      rights: "All rights reserved.",
      links: [
        { label: "Services", href: "/services" },
        { label: "Sessions", href: "/sessions" },
        { label: "Articles", href: "/articles" },
        { label: "About", href: "/about" },
      ],
    },
    consent: {
      title: "Cookie consent",
      body: "We use cookies for anonymous traffic analytics (Google Analytics).",
      accept: "Accept",
      decline: "Decline",
      learnMoreLabel: "Learn more",
      learnMoreHref: "/privacy",
    },
    langToggle: ['GR', 'EN']
  }
} as const;

export const articles = {
  el: {
    articles: {
      title: "Άρθρα",
      intro: "Τελευταίες δημοσιεύσεις, σκέψεις και πόροι."
    }
  },
  en: {
    articles: {
      title: "Articles",
      intro: "Latest posts, thoughts, and resources."
    }
  }
} as const;