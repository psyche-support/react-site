// src/pages/AboutPage.tsx
import React from "react";
import { useI18n } from "../i18n/useI18n";
import Seo from "../helpers/Seo";
import { localizedPath, buildAlternates } from "../helpers/paths";
import { defaults } from "../helpers/defaults";
import { seoText } from "../i18n/seo";            // adjust path if needed
import { OG_LOCALE, OG_LOCALE_ALTERNATES } from "../i18n/types";
import type { LangCode } from "../i18n/types";

type Props = { lang: LangCode };

const AboutPage: React.FC<Props> & { route?: string } = ({ lang }) => {
  const { dict: t } = useI18n("aboutPage", lang);
  const s = seoText[lang].about;
  const basePath = AboutPage.route || "/about";
  const path = localizedPath(basePath, lang);
  const alternates = buildAlternates(basePath);
  // JSON-LD (Person). Adjust fields as you like.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.person_name,
    jobTitle: s.job_title,
    url: defaults.url,
    image: `${defaults.url}/logo.svg`,
    sameAs: (defaults.socials || []).filter(Boolean),
    worksFor: {
      "@type": "Organization",
      name: defaults.site_name,
      url: defaults.url,
      logo: defaults.logo,
    },
  };

  return (
    <>
      <Seo
        lang={lang}
        title={s.title}
        description={s.desc}
        path={path}
        alternates={alternates}
        keywords={s.keywords}
        og={{
          type: "website",
          siteName: defaults.site_name,
          image: defaults.logo,        // fallback brand image
          imageAlt: defaults.site_name,
          locale: OG_LOCALE[lang],
          localeAlternate: OG_LOCALE_ALTERNATES[lang],
        }}
        jsonLd={[personJsonLd]}
        robots={{ index: true, follow: true, maxImagePreview: "large" }}
      />

      <main className="container about-page" style={{ padding: "2rem 1rem" }}>
        <header className="about-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1>{t.pageTitle}</h1>
          <p className="muted">{t.pageKicker}</p>
        </header>

        <section className="about-section">
          <h2>{t.intro.title}</h2>
          {t.intro.body
            .split(/\n\s*\n/)
            .map((para, i) => <p key={i}>{para.trim()}</p>)}
        </section>

        <section className="about-section">
          <h2>{t.approach.title}</h2>
          {t.approach.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <ul>{t.approach.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
        </section>

        <section className="about-section">
          <h2>{t.training.title}</h2>
          <ul>{t.training.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </section>

        <section className="about-section">
          <h2>{t.values.title}</h2>
          <ul>{t.values.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </section>

        <section className="about-section">
          <h2>{t.closing.title}</h2>
          <p>{t.closing.body}</p>
        </section>
      </main>
    </>
  );
};

export default AboutPage;