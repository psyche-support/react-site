import React from "react";
import Seo from "../helpers/Seo";
import { translations, type LangCode } from "../i18n/translations";

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string;
const PHONE_E164 = import.meta.env.VITE_PHONE_E164 as string;
const EMAIL_TO = import.meta.env.VITE_EMAIL_TO as string;
const TELEGRAM_USER = import.meta.env.VITE_TELEGRAM_USER as string;

type Props = { lang: LangCode };

const IconWrap: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
  <span aria-hidden="true" title={label} style={{ display: "inline-flex", width: 22, height: 22 }}>
    {children}
  </span>
);

// Simple inline SVG icons (no deps)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="WhatsApp">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.01 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.15 1.6 5.95L0 24l6.2-1.59A11.98 11.98 0 0 0 12 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 22a10 10 0 0 1-5.1-1.4l-.36-.22-3.61.92.96-3.52-.23-.37A10 10 0 1 1 22 12c0 5.52-4.48 10-10 10zm5.52-7.48c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.19.3-.76.97-.93 1.16-.17.19-.34.21-.64.06-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.51l-.56-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.02 2.82 1.17 3.01.15.19 2 3.05 4.84 4.28.68.29 1.21.46 1.63.59.68.22 1.3.19 1.79.12.55-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.08-.13-.27-.2-.57-.35z"/>
  </svg>
);
const ViberIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Viber">
    <path d="M17.472 3.337C15.623 2.857 8.39 1.76 5.799 3.77c-2.59 2.01-2.813 7.522-1.23 10.66l.016.032-.886 3.294 3.376-.884.032.017c3.116 1.56 8.6 1.433 10.645-1.2 2.045-2.633 1.03-9.785.725-11.352-.306-1.566-1.724-1.806-1.996-2zM12.03 5.875c4.387.003 4.373 4.42 4.373 4.42h-1.02s.025-3.408-3.39-3.408V5.875zm2.934 4.44h-1.017s.087-1.897-1.906-1.897V7.4c3.107.01 2.923 2.915 2.923 2.915zm-1.36 2.747s.056-.698-.287-1.012c-.343-.313-1.398-.584-2.067-.573-.669.01-.803.096-.803.096s-.8.315-1.104 1.207c0 0-.263.723.513 1.403.776.68 1.64 1.05 1.64 1.05s.532.184 1.267-.14c.734-.323.842-.917.842-.917zm-5.676 2.12c-.4-.183-1.62-.755-2.14-1.463-.52-.707-.772-1.366-.772-1.366s-.4-1.44.897-2.54c1.297-1.1 2.79-.864 2.79-.864h.498s.12-.01.305.34c.186.347.606 1.56.606 1.56s.17.29-.12.59c-.29.3-.45.48-.45.48s-.25.23-.09.55c.16.32.74 1.22 1.64 1.65 0 0 .33.16.56.01.23-.15.84-.64.84-.64s.24-.2.54-.02c.3.18 1.44.68 1.44.68s.29.1.33.43c.04.34.04 1.33-.81 2.19-.85.86-2.56.79-2.56.79s-2.05-.08-3.09-.55z"/>
  </svg>
);
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Telegram">
    <path d="M9.036 15.501l-.373 5.265c.534 0 .764-.229 1.039-.503l2.496-2.394 5.175 3.792c.948.522 1.622.25 1.885-.877l3.417-15.98.001-.001c.304-1.422-.513-1.976-1.428-1.63L1.13 9.38c-1.353.526-1.332 1.28-.23 1.62l4.998 1.559 11.6-7.317c.545-.36 1.041-.162.634.198"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Email">
    <path d="M2 4h20a2 2 0 0 1 2 2v.4l-12 7.2L0 6.4V6a2 2 0 0 1 2-2zm0 4.8l10 6 10-6V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.8z"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Phone">
    <path d="M6.6 10.8c1.5 3 3.9 5.4 6.9 6.9l2.3-2.3c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 .9V21c0 .6-.4 1-1 1C10.5 22 2 13.5 2 3c0-.6.4-1 1-1h4.4c.5 0 .9.4.9 1 0 1.2.2 2.5.6 3.7.1.4 0 .8-.3 1.1L6.6 10.8z"/>
  </svg>
);

const ContactPage: React.FC<Props> = ({ lang }) => {
  const t = translations[lang].contactPage;
  const [status, setStatus] = React.useState<"idle" | "sending" | "success" | "error">("idle");

  // Simple client validation + honeypot
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot (hidden field "company")
    if ((data.get("company") as string)?.trim()) {
      setStatus("success"); // silently succeed to trap bots
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Seo
        lang={lang}
        title={`${t.pageTitle} – Psyche Support`}
        description={lang === "el"
          ? "Φόρμα επικοινωνίας και τρόποι επικοινωνίας (Viber, WhatsApp, Telegram, Email, Τηλέφωνο)."
          : "Contact form and ways to reach out (Viber, WhatsApp, Telegram, Email, Phone)."}
        path="/contact"
        og={{ type: "website" }}
      />

      <main className="container" style={{ padding: "2.5rem 0", maxWidth: 900 }}>
        <h1>{t.pageTitle}</h1>
        <p className="muted" style={{ marginTop: "-0.25rem" }}>{t.intro}</p>

        {/* Contact form */}
        <form className="card" onSubmit={onSubmit} style={{ marginTop: "1rem" }}>
          {/* Honeypot */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off"
                 style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
                 aria-hidden="true" />
          <div className="grid" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <label htmlFor="name" className="muted">{t.form.name}</label>
              <input id="name" name="name" required placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="email" className="muted">{t.form.email}</label>
              <input id="email" name="email" type="email" required placeholder="jane@example.com" />
            </div>
            <div>
              <label htmlFor="phone" className="muted">{t.form.phone}</label>
              <input id="phone" name="phone" placeholder="+30 …" />
            </div>
            <div>
              <label htmlFor="subject" className="muted">{t.form.subject}</label>
              <input id="subject" name="subject" required placeholder="Sessions / Question" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="message" className="muted">{t.form.message}</label>
              <textarea id="message" name="message" rows={6} required placeholder="…"/>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? t.form.sending : t.form.submit}
            </button>
            {status === "success" && (
              <span className="muted" style={{ marginLeft: "0.75rem" }}>
                ✅ <strong>{t.form.successTitle}</strong> — {t.form.successBody}
              </span>
            )}
            {status === "error" && (
              <span className="muted" style={{ marginLeft: "0.75rem" }}>
                ❌ <strong>{t.form.errorTitle}</strong> — {t.form.errorBody}
              </span>
            )}
          </div>
        </form>

        {/* Other contact methods */}
        <section className="card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>{t.otherWays.title}</h2>
        <p className="muted" style={{ marginTop: "-0.25rem" }}>{t.otherWays.subtitle}</p>

        <ul
            style={{
            listStyle: "none",
            padding: 0,
            margin: "1rem 0 0",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            }}
        >
            <li>
            <a
                className="btn btn-ghost"
                href={`https://wa.me/${PHONE_E164.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center" }}
            >
                <IconWrap label="WhatsApp"><WhatsAppIcon /></IconWrap>
                <span style={{ marginLeft: 6 }}>{t.otherWays.whatsapp}</span>
            </a>
            </li>
            <li>
            <a
                className="btn btn-ghost"
                href={`viber://chat?number=${encodeURIComponent(PHONE_E164)}`}
                style={{ display: "flex", alignItems: "center" }}
            >
                <IconWrap label="Viber"><ViberIcon /></IconWrap>
                <span style={{ marginLeft: 6 }}>{t.otherWays.viber}</span>
            </a>
            </li>
            <li>
            {/* <a
                className="btn btn-ghost"
                href={TELEGRAM_USER ? `https://t.me/${TELEGRAM_USER}` : `https://t.me/share/url?url=https://psyche.support`}
                style={{ display: "flex", alignItems: "center" }}
            >
                <IconWrap label="Telegram"><TelegramIcon /></IconWrap>
                <span style={{ marginLeft: 6 }}>{t.otherWays.telegram}</span>
            </a> */}
            </li>
            <li>
            <a
                className="btn btn-ghost"
                href={`mailto:${EMAIL_TO}`}
                style={{ display: "flex", alignItems: "center" }}
            >
                <IconWrap label="Email"><MailIcon /></IconWrap>
                <span style={{ marginLeft: 6 }}>{t.otherWays.email}</span>
            </a>
            </li>
            <li>
            <a
                className="btn btn-ghost"
                href={`tel:${PHONE_E164}`}
                style={{ display: "flex", alignItems: "center" }}
            >
                <IconWrap label="Phone"><PhoneIcon /></IconWrap>
                <span style={{ marginLeft: 6 }}>{t.otherWays.call}</span>
            </a>
            </li>
        </ul>
        </section>
      </main>
    </>
  );
};

export default ContactPage;