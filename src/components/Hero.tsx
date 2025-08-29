// src/sections/Hero.tsx
import React from "react";
import Button from "./Button";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
  imageSrc?: string;          // optional override (keeps credit fallback)
  imageAlt?: string;
  photoCreditLabel?: string;  // default "Photo:"
  photoCreditText?: string;   // overrides per-image credit
  photoCreditHref?: string;   // overrides per-image credit link
  minHeight?: string | number;
};

/** Local-time slots:
 *  00:00–04:29 → hero.jpeg (tree)
 *  04:30–08:59 → hero-3.jpeg (birds / dawn)
 *  09:00–15:29 → hero-5.jpeg (bright arches)   (+1h vs original)
 *  15:30–21:59 → hero-2.jpeg (forest road)     (+1h vs original)
 *  22:00–01:29 → hero-4.jpeg (painted flowers) (+1h vs original)
 */
function pickHeroByMinute(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  if (m < 270) return "/home/hero-1.jpg";        // 00:00–04:29
  if (m < 540) return "/home/hero-3.jpg";      // 04:30–08:59
  if (m < 930) return "/home/hero-5.jpg";      // 09:00–15:29 (+1h)
  if (m < 1320) return "/home/hero-2.jpg";     // 15:30–21:59 (+1h)
  // 22:00–23:59 or 00:00–01:29
  return "/home/hero-4.jpg";                   // (+1h)
}

/** Per-file alt + credit (Unsplash) */
const HERO_META: Record<
  string,
  { alt: string; creditText: string; creditHref: string }
> = {
  "/home/hero-1.jpg": {
    alt: "Lone evergreen tree standing in a snowy field",
    creditText: "Unsplash",
    creditHref: "https://unsplash.com/photos/4L-AyDJM-yM",
  },
  "/home/hero-2.jpg": {
    alt: "Curving forest road on a misty day",
    creditText: "Unsplash",
    creditHref: "https://unsplash.com/photos/qZQriezeRcc",
  },
  "/home/hero-3.jpg": {
    alt: "Birds flying across a soft dawn sky",
    creditText: "Unsplash",
    creditHref: "https://unsplash.com/photos/UQaht0LBiYc",
  },
  "/home/hero-4.jpg": {
    alt: "Whimsical watercolor painting of flowers",
    creditText: "Unsplash",
    creditHref: "https://unsplash.com/photos/6dY9cFY-qTo",
  },
  "/home/hero-5.jpg": {
    alt: "Bright white arches and steps in a minimal corridor",
    creditText: "Unsplash",
    creditHref: "https://unsplash.com/photos/7y4858E8PfA",
  },
};

const Hero: React.FC<Props> = ({
  lang,
  imageSrc,
  imageAlt,
  photoCreditLabel = lang === "el" ? "Φωτογραφία:" : "Photo:",
  photoCreditText,
  photoCreditHref,
  minHeight = "70vh",
}) => {
  const { dict: t } = useI18n("homePage", lang);

  // Decide dynamic hero based on current local time (minutes since midnight)
  const chosenSrc = React.useMemo(() => {
    if (imageSrc) return imageSrc; // explicit override
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return pickHeroByMinute(minutes);
  }, [imageSrc]);

  // Lookup per-image metadata (with safe fallbacks)
  const meta = HERO_META[chosenSrc] || {
    alt: imageAlt || "Hero background",
    creditText: photoCreditText || "Unsplash",
    creditHref: photoCreditHref || "https://unsplash.com/",
  };

  const finalAlt = meta.alt;
  const finalCreditText = meta.creditText;
  const finalCreditHref = meta.creditHref;

  return (
    <section
      id="home"
      className="hero"
      aria-label={lang === "el" ? "Εισαγωγή" : "Hero"}
      style={
        {
          ["--hero-min-h" as any]:
            typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        } as React.CSSProperties
      }
    >
      {/* LCP image */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src={chosenSrc}
          alt=""                 // decorative (title conveys context)
          width={1600}
          height={900}
          loading="eager"
          decoding="async"
          fetchpriority="high"
          sizes="100vw"
          style={{ display: "block" }}
        />
      </div>

      <div className="container hero__inner">
        <div className="hero__content hero__content--overlay">
          <p className="hero__overtitle">{t.hero.title}</p>
          <h1 className="hero__title">{t.hero.subtitle}</h1>
          <p className="hero__note">{t.hero.note}</p>

          <div className="hero__actions">
            <Button href={t.cta.href} className="ps-btn ps-btn--primary">
              {t.cta.label}
            </Button>
            <Button href="#services" variant="outline">
              {lang === "el" ? "Μάθε περισσότερα" : "Learn more"}
            </Button>
          </div>
        </div>
      </div>

      {/* Photo credit (linked) */}
      <p className="hero__credit">
        {photoCreditLabel}{" "}
        <a href={finalCreditHref} target="_blank" rel="noopener noreferrer">
          {finalCreditText}
        </a>
      </p>
    </section>
  );
};

export default Hero;