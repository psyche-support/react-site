// src/sections/Hero.tsx
import React from "react";
import Button from "../components/Button";
import { translations, type LangCode } from "../i18n/translations";

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
  imageSrc = "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  imageAlt = "Counselling / therapy hero",
  photoCreditLabel = "Photo credit:",
  photoCreditText = "Unsplash",
  photoCreditHref = "https://unsplash.com/",
  minHeight = "70vh",
}) => {
  const t = translations[lang];
  return (
    <section
      id="home"
      className="hero hero--bg"
      aria-label={lang === "el" ? "Εισαγωγή" : "Hero"}
      style={
        {
          // Full-bleed background image
          ["--hero-bg" as any]: `url('${imageSrc}')`,
          ["--hero-min-h" as any]: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        } as React.CSSProperties
      }
    >
      {/* decorative img for a11y only if you want it announced; usually empty alt so it's decorative */}
      <img src={imageSrc} alt="" aria-hidden="true" className="sr-only" />

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="muted hero__overtitle">{t.hero.title}</p>
          <h1 className="hero__title">{t.hero.subtitle}</h1>
          <p className="muted hero__note">
            {t.hero.note}
          </p>

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
      {/* Photo credit positioned bottom right */}
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
