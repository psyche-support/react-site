import React from "react";
import { translations, type LangCode } from "../i18n/translations";

interface Props { lang: LangCode; }
type Item = { title: string; text: string };

const Services: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const items: Item[] = t.services.list || [];

  // Multi-open accordion + Expand/Collapse all
  const [open, setOpen] = React.useState<Set<number>>(() => new Set());
  const isOpen = (i: number) => open.has(i);
  const toggle = (i: number) =>
    setOpen(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const allOpen = open.size === items.length && items.length > 0;
  const toggleAll = () => {
    setOpen(allOpen ? new Set() : new Set(items.map((_, i) => i)));
  };

  return (
    <section id="services">
      <div className="container">
        {/* Headline with ONLY title + intro */}
        <div className="services__headline">
          <div className="services__introWrap">
            <h2>{t.services.title}</h2>
            <p className="muted">{t.services.intro}</p>
          </div>
        </div>

        {/* Button on its OWN line, right-aligned, below intro */}
        <div className="services__controls">
          <button
            type="button"
            className="btn btn-ghost services__toggleAll"
            onClick={toggleAll}
            aria-expanded={allOpen}
            aria-controls="home-services-list"
          >
            {allOpen
              ? (lang === "el" ? "Σύμπτυξη όλων" : "Collapse all")
              : (lang === "el" ? "Ανάπτυξη όλων" : "Expand all")}
          </button>
        </div>

        {/* Accordion list */}
        <ul id="home-services-list" className="grid grid-3 services__grid" role="list">
          {items.map((item, i) => {
            const btnId = `home-svc-btn-${i}`;
            const panelId = `home-svc-panel-${i}`;
            const openNow = isOpen(i);
            return (
              <li className="card services__item" key={item.title} role="listitem">
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
                  <p className="muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Services;