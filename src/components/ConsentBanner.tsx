// src/components/ConsentBanner.tsx
import React from "react";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
};

const ConsentBanner: React.FC<Props> = ({ lang }) => {
  const { dict: t } = useI18n("common", lang);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("analytics_consent") == null; // show if not decided
    } catch {
      return true;
    }
  });

  // Helper: set CSS var with current bar height and toggle a root class
  const setBarHeightVar = React.useCallback(() => {
    const h = barRef.current?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--consent-bar-h", `${h}px`);
  }, []);

  React.useEffect(() => {
    if (!visible) {
      document.documentElement.classList.remove("consent-open");
      document.documentElement.style.removeProperty("--consent-bar-h");
      return;
    }
    document.documentElement.classList.add("consent-open");
    setBarHeightVar();
    const ro = new ResizeObserver(setBarHeightVar);
    if (barRef.current) ro.observe(barRef.current);
    const onResize = () => setBarHeightVar();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [visible, setBarHeightVar]);

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
      ref={barRef}
      className="consent-bar"
      role="dialog"
      aria-live="polite"
      aria-label={t.consent?.title || (lang === "el" ? "Συναίνεση cookies" : "Cookie consent")}
    >
      <div className="consent-bar__content">
        <strong className="consent-bar__title">
          {t.consent?.title || (lang === "el" ? "Συναίνεση cookies" : "Cookie consent")}
        </strong>
        <p className="consent-bar__text">
          {t.consent?.body ||
            (lang === "el"
              ? "Χρησιμοποιούμε cookies για ανώνυμη ανάλυση επισκεψιμότητας (Google Analytics)."
              : "We use cookies for anonymous traffic analytics (Google Analytics).")}
          {t.consent?.learnMoreHref && (
            <>
              {" "}
              <a
                className="consent-bar__link"
                href={t.consent.learnMoreHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.consent.learnMoreLabel || (lang === "el" ? "Περισσότερα" : "Learn more")}
              </a>
            </>
          )}
        </p>
      </div>

      <div className="consent-bar__actions">
        <button className="ps-btn ps-btn--ghost" onClick={deny}>
          {t.consent?.decline || (lang === "el" ? "Απόρριψη" : "Decline")}
        </button>
        <button className="ps-btn ps-btn--primary" onClick={grant}>
          {t.consent?.accept || (lang === "el" ? "Αποδοχή" : "Accept")}
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
