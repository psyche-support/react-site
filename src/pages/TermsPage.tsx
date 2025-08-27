import React from "react";
import { translations, type LangCode } from "../i18n/translations";
import Seo from "../helpers/Seo";

type Props = { lang: LangCode; lastUpdated?: string };

const TermsPage: React.FC<Props> = ({ lang, lastUpdated = "2025-08-27" }) => {
  const t = translations[lang].termsPage;

  return (
    <>
      <Seo
        lang={lang}
        title={`${t.pageTitle} – Psyche Support`}
        description={lang === "el"
          ? "Όροι χρήσης για το psyche.support."
          : "Terms of service for psyche.support."}
        path="/terms"
        og={{ type: "website" }}
      />
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <h1>{t.pageTitle}</h1>
        <p className="muted" style={{ marginTop: "-0.25rem" }}>
          {t.updatedOn}: {lastUpdated}
        </p>

        <section className="card" style={{ marginTop: "1rem" }}>
          <p>{t.intro}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.useOfSite.title}</h2>
          <ul>{t.useOfSite.items.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.bookings.title}</h2>
          <p>{t.bookings.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.liability.title}</h2>
          <p>{t.liability.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.ip.title}</h2>
          <p>{t.ip.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.changes.title}</h2>
          <p>{t.changes.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>
        </section>
      </main>
    </>
  );
};

export default TermsPage;