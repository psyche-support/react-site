import React from "react";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import { track } from "../helpers/events";

type Props = {
  lang: LangCode;
  id?: string;
};

const Sessions: React.FC<Props> = ({ lang, id = "sessions" }) => {
  const { dict: t } = useI18n("homePage", lang);
  const online = t.sessions.online;
  const inPerson = t.sessions.inPerson;
  const duration = t.sessions.duration;

  return (
    <section id={id} className="sessions">
      <div className="container">
        <header className="sessions__header">
          <h2 className="sessions__title">{t.sessions.title}</h2>
          {t.sessions.subtitle ? (
            <p className="muted sessions__subtitle">{t.sessions.subtitle}</p>
          ) : null}
        </header>

        <div className="sessions__columns">
          {/* Column 1: Online options */}
          <div className="card sessions__col">
            <h3 className="sessions__colTitle">{online.title}</h3>
            {online.note ? <p className="muted">{online.note}</p> : null}

            <ul className="sessions__grid sessions__grid--icons">
              {online.services.map((s) => (
                <li key={s.key} className="sessions__item">
                  <a
                    href={s.href}
                    target={(s.href !== "" ? "_blank" : "_self")}
                    rel="noopener noreferrer"
                    className="sessions__link"
                    aria-label={s.aria ?? s.label}
                    onClick={() => track.serviceClick(s.key, s.href)}
                  >
                    <span className={`sessions__icon sessions__icon--${s.key}`} aria-hidden="true" />
                    <div className="sessions__content">
                      <span className="sessions__label">{s.label}</span>
                      {s.helper ? <span className="sessions__helper">{s.helper}</span> : null}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: In-person */}
          <div className="card sessions__col">
            <h3 className="sessions__colTitle">{inPerson.title}</h3>
            {inPerson.subtitle ? <p className="muted">{inPerson.subtitle}</p> : null}
            {inPerson.address ? (
              <p className="sessions__address">
                <strong>{inPerson.addressLabel || (lang === "el" ? "Διεύθυνση:" : "Address:")}</strong>{" "}
                {inPerson.address}
              </p>
            ) : null}
            {Array.isArray(inPerson.points) && inPerson.points.length > 0 && (
              <ul className="sessions__list">
                {inPerson.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 3: Duration (and optional fees) */}
          <div className="card sessions__col">
            <h3 className="sessions__colTitle">{duration.title}</h3>
            <ul className="sessions__list sessions__list--duration">
              {duration.items.map((d, i) => (
                <li key={i}>
                  <span className="sessions__durLabel">{d.label}</span>
                  {d.length ? <span className="sessions__durDot">•</span> : null}
                  {d.length ? <span className="sessions__durValue">{d.length}</span> : null}
                  {d.fee ? (
                    <>
                      <span className="sessions__durDot">•</span>
                      <span className="sessions__durFee">{d.fee}</span>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
            {duration.note ? <p className="muted sessions__note">{duration.note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sessions;
