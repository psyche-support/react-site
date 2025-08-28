// src/components/NavHeader.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import PsycheLogo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import "../styles/nav-header.css";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import LangSwitch from "./LangSwitch";

interface Props {
  lang: LangCode;
  onChangeLang: (code: LangCode) => void;
}

const NavHeader: React.FC<Props> = ({ lang, onChangeLang }) => {
  const { dict: t } = useI18n("common", lang);
  const [open, setOpen] = React.useState(false);
  const [elevated, setElevated] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, location.hash]);

  const resolveTo = (href: string) =>
    href.startsWith("#") ? ({ pathname: "/", hash: href }) : href;

  const handleBrandClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    setOpen(false);
    if (location.pathname === "/") {
      // stay on the same route, just scroll up
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`ps-header ${elevated ? "ps-header--elevated" : ""} ${open ? "ps-header--menuOpen" : ""}`}
      style={{ ["--header-h" as any]: "64px" }}
    >
      <div className="ps-container ps-header__inner">
        {/* Brand */}
        <Link className="ps-brand" to="/" onClick={handleBrandClick} aria-label={t.brand}>
          <PsycheLogo size={80} />
          <span className="ps-brand__name">{t.brand}</span>
        </Link>

        {/* Burger (mobile) */}
        <button
          className="ps-burger"
          aria-controls="primary-nav"
          aria-expanded={open ? "true" : "false"}
          aria-label={lang === "el" ? "Άνοιγμα μενού" : "Toggle menu"}
          onClick={() => setOpen(v => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        {/* Desktop nav row */}
        <nav className="ps-nav" aria-label={lang === "el" ? "Κύρια πλοήγηση" : "Primary navigation"}>
          <ul className="ps-nav__row">
            {t.nav.map((item) => (
              <li key={item.href} className="ps-nav__item">
                <Link className="ps-nav__link" to={resolveTo(item.href) as any}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="ps-nav__item">
              {/* ✅ Replaced <select> with LangSwitch */}
              <LangSwitch
                value={lang}
                onChange={onChangeLang}
                ariaLabel={lang === "el" ? "Επιλογή γλώσσας" : "Select language"}
              />
            </li>
            <li className="ps-nav__item">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile panel */}
      <nav
        id="primary-nav"
        className={`ps-nav-panel ${open ? "is-open" : ""}`}
        aria-label={lang === "el" ? "Μενού κινητού" : "Mobile menu"}
      >
        <div className="ps-nav-panel__brand">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            aria-label={t.brand}
            className="ps-nav-panel__brandLink"
          >
            <PsycheLogo size={60} />
            <span className="ps-nav-panel__brandName">{t.brand}</span>
          </Link>
        </div>
        
        <ul className="ps-nav-panel__list">
          {t.nav.map((item) => (
            <li key={item.href} className="ps-nav-panel__item">
              <Link
                to={resolveTo(item.href) as any}
                className="ps-nav-panel__link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Language + Theme in one row */}
          <li className="ps-nav-panel__item ps-nav-panel__langs">
            <div className="ps-nav-panel__langsRow">
              <div className="lang-switch">
                <button
                  onClick={() => { onChangeLang("el"); setOpen(false); }}
                  className={`lang-switch__btn ${lang === "el" ? "is-active" : ""}`}
                >
                  Ελληνικά
                </button>
                <button
                  onClick={() => { onChangeLang("en"); setOpen(false); }}
                  className={`lang-switch__btn ${lang === "en" ? "is-active" : ""}`}
                >
                  English
                </button>
              </div>
              <ThemeToggle />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavHeader;