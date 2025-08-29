// src/components/ConsentBanner.tsx
import React from "react";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import PsycheLogo from "./Logo";
import "../styles/consent-banner.css";

type Props = { lang: LangCode };

const ConsentBanner: React.FC<Props> = ({ lang }) => {
  const { dict: t } = useI18n("common", lang);
  const [visible, setVisible] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("analytics_consent") == null;
    } catch {
      return true;
    }
  });

  const grant = () => {
    try { localStorage.setItem("analytics_consent", "granted"); } catch {}
    setVisible(false);
    window.dispatchEvent(new Event("analytics:consent-granted"));
  };

  const deny = () => {
    try { localStorage.setItem("analytics_consent", "denied"); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="consent-bar"
      role="dialog"
      aria-live="polite"
      aria-label={t.consent?.title || (lang === "el" ? "Συναίνεση cookies" : "Cookie consent")}
    >
      <div className="consent-bar__brand">
        <PsycheLogo size={80} letterSize={2000} />
        <span className="consent-bar__brandName">Psyche Support</span>
      </div>

      <div className="consent-bar__content">
        <strong className="consent-bar__title">
          {t.consent?.title || (lang === "el" ? "Συναίνεση cookies" : "Cookie consent")}
        </strong>
        <p className="consent-bar__text">
          {t.consent?.body ||
            (lang === "el"
              ? "Χρησιμοποιούμε cookies για ανώνυμη ανάλυση επισκεψιμότητας (Google Analytics)."
              : "We use cookies for anonymous traffic analytics (Google Analytics).")}
        </p>
        <div className="consent-bar__links">
          <a href="/privacy" rel="noopener noreferrer">
            {lang === "el" ? "Πολιτική Απορρήτου" : "Privacy Policy"}
          </a>
          <a href="/cookies" rel="noopener noreferrer">
            {lang === "el" ? "Πολιτική Cookies" : "Cookies Policy"}
          </a>
        </div>
      </div>

      <div className="consent-bar__actions">
        <button className="ps-btn ps-btn--ghost ps-btn--lg" onClick={deny}>
          {t.consent?.decline || (lang === "el" ? "Απόρριψη" : "Decline")}
        </button>
        <button className="ps-btn ps-btn--primary ps-btn--lg" onClick={grant}>
          {t.consent?.accept || (lang === "el" ? "Αποδοχή" : "Accept")}
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;