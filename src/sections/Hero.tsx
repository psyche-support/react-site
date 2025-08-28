// src/sections/Hero.tsx
import React from "react";
import Button from "../components/Button";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
  imageSrc?: string; // overrides time-based pick when provided
  imageAlt?: string;
  photoCreditLabel?: string;
  photoCreditText?: string;
  photoCreditHref?: string;
  minHeight?: string | number; // e.g., "70vh"
};

/** Decide which /public/home/hero-*.jpg to use by local time.
 *  Slots (local):
 *  00:00–04:29 → hero-1 (lone tree)
 *  04:30–08:59 → hero-3 (birds/dawn)
 *  09:00–14:29 → hero-5 (bright arches)  +1h
 *  14:30–19:59 → hero-2 (forest road)    +1h
 *  20:00–01:29 → hero-4 (flowers)        +1h
 */
function pickHeroByMinute(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  if (m < 270) return "/home/hero-1.jpg";                 // 00:00–04:29
  if (m < 540) return "/home/hero-3.jpg";                 // 04:30–08:59
  if (m < 870) return "/home/hero-5.jpg";                 // 09:00–14:29 (+1h)
  if (m < 1200) return "/home/hero-2.jpg";                // 14:30–19:59 (+1h)
  if (m >= 1200 || m < 90) return "/home/hero-4.jpg";     // 20:00–01:29 (+1h)
  return "/home/hero-1.jpg";
}

const Hero: React.FC<Props> = ({
  lang,
  imageSrc, // optional override
  imageAlt = "Counselling / therapy hero",
  photoCreditLabel = "Photo credit:",
  photoCreditText = "Unsplash",
  photoCreditHref = "https://unsplash.com/photos/pine-tree-covered-with-snow-4L-AyDJM-yM",
  minHeight = "70vh",
}) => {
  const { dict: t } = useI18n("homePage", lang);

  // Compute source only once on mount (no re-render loop)
  const computedSrc = React.useMemo(() => {
    if (imageSrc) return imageSrc;
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return pickHeroByMinute(minutes);
  }, [imageSrc]);

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
      {/* Visible LCP image placed behind content */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src={computedSrc}
          alt=""                 // decorative; headline provides context
          width={1600}
          height={900}           // reserves space -> avoids CLS
          loading="eager"        // critical image
          decoding="async"
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

      {/* Photo credit bottom-right (static; optional to vary per image) */}
      <p className="hero__credit">
        {photoCreditLabel}{" "}
        <a href={photoCreditHref} target="_blank" rel="noopener noreferrer">
          {photoCreditText}
        </a>
      </p>
    </section>
  );
};

export default Hero;