import React from "react";
import Button from "../components/Button";
import { translations, type LangCode } from "../i18n/translations";
import { track } from "../helpers/events";
import { useBooking } from "../components/BookingModalProvider";
import Seo from "../helpers/Seo";
import { seoText } from "../i18n/seo";

type Props = { lang: LangCode };

const ServicesPage: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const sp = t.servicesPage;
  const { openBooking } = useBooking();
  const s = seoText[lang].services;

  // ---- Accordion state (multi-open) ----
  const [open, setOpen] = React.useState<Set<number>>(() => new Set());
  const items = sp.helpWith.items as { title: string; text: string }[];
  const isOpen = (i: number) => open.has(i);
  const toggle = (i: number) =>
    setOpen(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  // Expand/Collapse all control
  const allOpen = open.size === items.length && items.length > 0;
  const handleToggleAll = () => {
    if (allOpen) {
      setOpen(new Set());
    } else {
      setOpen(new Set(items.map((_, i) => i)));
    }
  };

  return (
    <>
      <Seo
        lang={lang}
        title={s.title}
        description={s.desc}
        path="/services"
        og={{ type: "website", image: s.image }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          areaServed: ["GR", "EU"],
          provider: { "@type": "Organization", name: "Psyche Support" },
        }}
      />

      <main className="services-page container" id="services">
        {/* Title + Intro */}
        <header className="services__header">
          <h1 className="services__title">{sp.title}</h1>
          <p className="services__intro muted">{sp.intro}</p>
          {sp.intro2 ? <p className="services__intro muted">{sp.intro2}</p> : null}
        </header>

        {/* How I can help (Accordion, multi-open + Expand/Collapse all) */}
        <section className="services__section">
          <div className="services__headline">
            <h2 className="services__subtitle">{sp.helpWith.title}</h2>
            <button
              type="button"
              className="btn btn-ghost services__toggleAll"
              onClick={handleToggleAll}
              aria-expanded={allOpen}
              aria-controls="services-helpwith-list"
            >
              {allOpen
                ? (lang === "el" ? "Σύμπτυξη όλων" : "Collapse all")
                : (lang === "el" ? "Ανάπτυξη όλων" : "Expand all")}
            </button>
          </div>

          <ul id="services-helpwith-list" className="services__grid" role="list">
            {items.map((item, i) => {
              const btnId = `svc-btn-${i}`;
              const panelId = `svc-panel-${i}`;
              const openNow = isOpen(i);
              return (
                <li key={item.title} className="card services__item" role="listitem">
                  <h3 className="services__itemTitle" style={{ margin: 0 }}>
                    <button
                      id={btnId}
                      className="services__accordionTrigger"
                      aria-expanded={openNow}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                    >
                      <span>{item.title}</span>
                      <span className="services__chevron" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!openNow}
                    className="services__accordionPanel"
                  >
                    <p className="services__itemText">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Audience */}
        <section className="services__section">
          <h2 className="services__subtitle">{sp.audience.title}</h2>
          <p className="services__text">{sp.audience.text}</p>
        </section>

        {/* Session details */}
        <section className="services__section">
          <h2 className="services__subtitle">{sp.details.title}</h2>
          <div className="card services__details">
            <ul className="services__list">
              <li>
                <strong>{sp.details.formLabel}</strong> {sp.details.form}
              </li>
              <li>
                <strong>{sp.details.languageLabel}</strong> {sp.details.language}
              </li>
              <li>
                <strong>{sp.details.durationLabel}</strong> {sp.details.duration}
              </li>
              <li>
                <strong>{sp.details.frequencyLabel}</strong> {sp.details.frequency}
              </li>
            </ul>
            {sp.details.footnote ? (
              <p className="services__footnote muted">{sp.details.footnote}</p>
            ) : null}

            <div className="services__actions">
              <Button
                href="#"
                className="ps-btn ps-btn--primary"
                onClick={(e) => {
                  e.preventDefault();
                  openBooking(sp.details.bookHref);
                  track.cta("sessions_book_first_modal", sp.details.bookHref);
                }}
              >
                {sp.details.bookCta}
              </Button>
              {sp.firstStep?.ctaHref && (
                <Button
                  href="#"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    openBooking(sp.firstStep.ctaHref);
                    track.cta("sessions_book_first_modal", sp.firstStep.ctaHref);
                  }}
                >
                  {sp.firstStep.ctaLabel}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* First step (optional blurb) */}
        {sp.firstStep?.title && (
          <section className="services__section">
            <h2 className="services__subtitle">{sp.firstStep.title}</h2>
            <p className="services__text">{sp.firstStep.text}</p>
          </section>
        )}
      </main>
    </>
  );
};

export default ServicesPage;