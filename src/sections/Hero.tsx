import React from "react";
import Button from "../components/Button";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
  imageSrc?: string;
  imageAlt?: string;
  photoCreditLabel?: string;
  photoCreditText?: string;
  photoCreditHref?: string;
  minHeight?: string | number; // e.g., "70vh"
};

const Hero: React.FC<Props> = ({
  lang,
  imageSrc = "hero.jpg",
  imageAlt = "Counselling / therapy hero",
  photoCreditLabel = "Photo credit:",
  photoCreditText = "Unsplash",
  photoCreditHref = "https://unsplash.com/photos/white-concrete-building-7y4858E8PfA",
  minHeight = "70vh",
}) => {
  const { dict: t } = useI18n("homePage", lang);

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
      {/* Visible LCP image (not lazy) placed behind content */}
      <div className="hero__bg" aria-hidden="true">
        <picture>
          {/* Modern format first (optional) */}
          <source srcSet={`${imageSrc}&fm=webp`} type="image/webp" />
          <img
            src={imageSrc}
            alt=""                  // decorative; headline conveys context
            width={1600}
            height={900}            // reserves space -> no CLS
            loading="eager"         // critical image
            decoding="async"
            fetchpriority="high"    // hint for LCP
            sizes="100vw"
            style={{ display: "block" }}
          />
        </picture>
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="muted hero__overtitle">{t.hero.title}</p>
          <h1 className="hero__title">{t.hero.subtitle}</h1>
          <p className="muted hero__note">{t.hero.note}</p>

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

      {/* Photo credit bottom-right */}
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