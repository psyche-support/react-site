import React from "react";
import Seo from "../helpers/Seo";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";

type Props = { lang: LangCode; lastUpdated?: string };

const CookiePolicyPage: React.FC<Props> = ({ lang, lastUpdated = "2025-08-27" }) => {
  const { dict: t } = useI18n("cookiesPage", lang);
  return (
    <>
      <Seo
        lang={lang}
        title={`${t.pageTitle} – Psyche Support`}
        description={lang === "el"
          ? "Πολιτική cookies για το psyche.support."
          : "Cookie policy for psyche.support."}
        path="/cookies"
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
          <h2>{t.what.title}</h2>
          <p>{t.what.body}</p>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.types.title}</h2>
          <ul>{t.types.items.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>{t.manage.title}</h2>
          <p>{t.manage.body}</p>
        </section>
      </main>
    </>
  );
};

export default CookiePolicyPage;