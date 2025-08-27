// src/pages/PrivacyPage.tsx
import React from "react";
import { type LangCode, translations } from "../i18n/translations";
import Seo from "../helpers/Seo";

type Props = { lang: LangCode; lastUpdated?: string };

const PrivacyPage: React.FC<Props> = ({ lang, lastUpdated = "2025-08-27" }) => {
  const t = translations[lang].privacyPage;

  return (
    <>
      <Seo
        lang={lang}
        title={t.pageTitle + " – Psyche Support"}
        description={
          lang === "el"
            ? "Πολιτική απορρήτου για το psyche.support: τι δεδομένα συλλέγουμε, πώς τα χρησιμοποιούμε και τα δικαιώματά σας."
            : "Privacy policy for psyche.support: what data we collect, how we use it, and your rights."
        }
        path="/privacy"
        og={{ type: "website", image: "/assets/og/privacy.jpg" }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t.pageTitle,
          url: "https://psyche.support/privacy",
          inLanguage: lang,
        }}
      />

      <main className="container" style={{ padding: "2.5rem 0" }}>
        <h1>{t.pageTitle}</h1>
        <p className="muted" style={{ marginTop: "-0.25rem" }}>
          {t.updatedOn}: {lastUpdated}
        </p>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.intro.title}</h2>
          <p>{t.intro.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.whatWeCollect.title}</h2>
          <ul>
            {t.whatWeCollect.items.map((x: string, i: number) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.howWeUse.title}</h2>
          <ul>
            {t.howWeUse.items.map((x: string, i: number) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.lawfulBasis.title}</h2>
          <ul>
            {t.lawfulBasis.items.map((x: string, i: number) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.retention.title}</h2>
          <p>{t.retention.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.sharing.title}</h2>
          <p>{t.sharing.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.cookies.title}</h2>
          <p>{t.cookies.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.rights.title}</h2>
          <ul>
            {t.rights.items.map((x: string, i: number) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>
        </section>

        <p className="muted" style={{ marginTop: "1rem" }}>
          {t.disclaimer}
        </p>
      </main>
    </>
  );
};

export default PrivacyPage;