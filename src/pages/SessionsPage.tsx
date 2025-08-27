import React from "react";
import Button from "../components/Button";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import { track } from "../helpers/events";
import { useBooking } from "../components/BookingModalProvider";
import Seo from "../helpers/Seo";
import { seoText } from "../i18n/seo";

type Props = {
  lang: LangCode;
  /** Toggle the online icons row inside the lead card */
  showOnlineIcons?: boolean;
};

const SessionsPage: React.FC<Props> = ({ lang, showOnlineIcons = true }) => {
  const { dict: t } = useI18n("sessionsPage", lang);
  const { openBooking } = useBooking();

  // Guard if translations not merged yet
  const sections = t?.sections ?? [];
  const lead = t?.lead;
  const onlineServices = t?.online?.services ?? [];
  const faq = t?.faq;
  const s = seoText[lang].sessions;
  

  return (
    <>
    <Seo
        lang={lang}
        title={s.title}
        description={s.desc}
        path="/sessions"
        og={{ type: "website", image: s.image }}
        jsonLd={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.desc,
            provider: {
                "@type": "Organization",
                name: "Psyche Support",
                url: "https://psyche.support",
            },
            areaServed: {
                "@type": "Place",
                name: "Worldwide" // or "Greece" if limited
            },
            serviceType: "Counseling and Psychotherapy",
            availableChannel: [
                {
                    "@type": "ServiceChannel",
                    serviceLocation: {
                        "@type": "Place",
                        name: "Online"
                    },
                    availableLanguage: ["el", "en"]
                }
            ]
        }}
    />
    <main className="sessions-page container" id="sessions">
      {/* Title */}
      <header className="sessionsPage__header">
        <h1 className="sessionsPage__title">{t?.title ?? (lang === "el" ? "Συνεδρίες" : "Sessions")}</h1>
      </header>

      {/* Main article sections first */}
      {sections.map((sec) => (
        <section key={sec.title} className="sessionsPage__section">
          <h2 className="sessionsPage__h3">{sec.title}</h2>
          {sec.paragraphs.map((p: string, i: number) => (
            <p key={i} className="sessionsPage__p">{p}</p>
          ))}
        </section>
      ))}

      {/* Lead card moved to the bottom (before FAQ) */}
      {lead && (
        <section className="sessionsPage__section">
          <div className="card sessionsPage__leadCard sessionsPage__leadCard--bottom">
            <h2 className="sessionsPage__h2">{lead.title}</h2>
            {lead.text && <p className="sessionsPage__lead muted">{lead.text}</p>}

            {showOnlineIcons && onlineServices.length > 0 && (
              <ul className="sessions__grid sessions__grid--icons sessionsPage__icons">
                {onlineServices.map((s: any) => (
                  <li key={s.key} className="sessions__item">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sessions__link"
                      aria-label={s.aria ?? s.label}
                      onClick={() => track.serviceClick(s.key, s.href)}
                    >
                      <span className={`sessions__icon sessions__icon--${s.key}`} aria-hidden="true" />
                      <div className="sessions__content">
                        <span className="sessions__label">{s.label}</span>
                        {s.helper && <span className="sessions__helper">{s.helper}</span>}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {lead.bookHref && lead.bookCta && (
              <div className="sessionsPage__actions">
                <Button
                  href="#"
                  className="ps-btn ps-btn--primary"
                  onClick={(e) => {
                    e.preventDefault();
                    openBooking(lead.bookHref); // ← opens shared iframe modal
                    track.cta("sessions_book_first_modal", lead.bookHref);
                  }}
                >
                  {lead.bookCta}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ at the very end */}
      {faq?.items?.length ? (
        <section className="sessionsPage__section">
          <h2 className="sessionsPage__faqTitle">{faq.title}</h2>
          <div className="sessionsPage__faq">
            {faq.items.map((q: { q: string; a: string }) => (
              <details key={q.q} className="card sessionsPage__faqItem">
                <summary className="sessionsPage__faqQ">{q.q}</summary>
                <div className="sessionsPage__faqA">{q.a}</div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
    </>
  );
};

export default SessionsPage;