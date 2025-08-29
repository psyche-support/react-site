const INSTAGRAM = import.meta.env.VITE_INSTAGRAM as string;
const LINKEDIN = import.meta.env.VITE_LINKEDIN as string;
const TWITTER_X = import.meta.env.VITE_TWITTER_X as string;

export const defaults = {
  site_name: "Psyche Support",
  url: "https://psyche.support",
  logo: "https://psyche.support/logo.svg",
  socials: [
    INSTAGRAM, LINKEDIN, TWITTER_X
  ]
} as const;
export default defaults;