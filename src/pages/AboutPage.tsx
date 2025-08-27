import React from "react";
import { translations, type LangCode } from "../i18n/translations";

type Props = { lang: LangCode };

const AboutPage: React.FC<Props> = ({ lang }) => {
  const t = translations[lang].aboutPage;

  return (
    <main className="container about-page" style={{ padding: "2rem 1rem" }}>
      <header className="about-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>{t.pageTitle}</h1>
        <p className="muted">{t.pageKicker}</p>
      </header>

      <section className="about-section">
        <h2>{t.intro.title}</h2>
        {t.intro.body
          .split(/\n\s*\n/) // split on empty lines
          .map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
      </section>

      <section className="about-section">
        <h2>{t.approach.title}</h2>
        {t.approach.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <ul>
          {t.approach.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2>{t.training.title}</h2>
        <ul>
          {t.training.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2>{t.values.title}</h2>
        <ul>
          {t.values.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2>{t.closing.title}</h2>
        <p>{t.closing.body}</p>
      </section>
    </main>
  );
};

export default AboutPage;