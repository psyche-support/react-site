import React from "react";
import Seo from "../helpers/Seo";
import { translations, type LangCode } from "../i18n/translations";

type Props = { lang: LangCode };

const AccessibilityPage: React.FC<Props> = ({ lang }) => {
  const t = translations[lang].accessibilityPage;
  return (
    <>
      <Seo
        lang={lang}
        title={`${t.pageTitle} – Psyche Support`}
        description={lang === "el"
          ? "Δήλωση προσβασιμότητας του psyche.support."
          : "Accessibility statement of psyche.support."}
        path="/accessibility"
        og={{ type: "website" }}
      />
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <h1>{t.pageTitle}</h1>
        <p>{t.intro}</p>
        <ul style={{ marginTop: "1rem" }}>{t.items.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
        <p style={{ marginTop: "1rem" }}>{t.contact}</p>
      </main>
    </>
  );
};

export default AccessibilityPage;