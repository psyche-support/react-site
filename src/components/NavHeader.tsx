// src/components/NavHeader.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PsycheLogo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import "../styles/nav-header.css";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import LangSwitch from "./LangSwitch";
import { getLangFromPath, replaceLangInPath } from "../helpers/langPath";

interface Props {
  lang: LangCode;
  onChangeLang: (code: LangCode) => void; // keep for app state if you use it elsewhere
}

const ALL_LANGS: LangCode[] = ["el", "en"];
const DEFAULT_LANG: LangCode = "el";

const NavHeader: React.FC<Props> = ({ lang, onChangeLang }) => {
  const { dict: t } = useI18n("common", lang);
  const [open, setOpen] = React.useState(false);
  const [elevated, setElevated] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const brandTo = lang === "el" ? "/" : `/${lang}`;

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

  const handleBrandClick = React.useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      setOpen(false);
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [location.pathname]
  );

  // 🔑 Canonical language setter: rewrite the URL deterministically.
  const setLang = (target: LangCode) => {
    if (target === lang) return; // no-op if same
    const nextPath = replaceLangInPath(location.pathname + location.search + location.hash, target, DEFAULT_LANG, ALL_LANGS);
    // If the current path already includes a lang, `replaceLangInPath` handles it.
    navigate(nextPath, { replace: false });
    onChangeLang(target); // update your app state if you still keep it
    try { localStorage.setItem("lang", target); } catch {}
    setOpen(false);
  };

  return (
    <header
      className={`ps-header ${elevated ? "ps-header--elevated" : ""} ${open ? "ps-header--menuOpen" : ""}`}
      style={{ ["--header-h" as any]: "64px" }}
    >
      <div className="ps-container ps-header__inner">
        {/* Brand */}
        <Link className="ps-brand" to={brandTo} onClick={handleBrandClick} aria-label={t.brand}>
          <PsycheLogo size={80} letterSize={2000} />
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
            {t.nav.map((item: { href: string; label: string }) => (
              <li key={item.href} className="ps-nav__item">
                <Link className="ps-nav__link" to={resolveTo(item.href) as any}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="ps-nav__item">
              <LangSwitch
                value={lang}
                langs={ALL_LANGS}
                defaultLang={DEFAULT_LANG}
                onChange={setLang}
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
            to={brandTo}
            onClick={() => setOpen(false)}
            aria-label={t.brand}
            className="ps-nav-panel__brandLink"
          >
            <PsycheLogo size={60} />
            <span className="ps-nav-panel__brandName">{t.brand}</span>
          </Link>
        </div>

        <ul className="ps-nav-panel__list">
          {t.nav.map((item: { href: string; label: string }) => (
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

          <li className="ps-nav-panel__item ps-nav-panel__langs">
            <div className="ps-nav-panel__langsRow">
              <LangSwitch
                value={lang}
                langs={ALL_LANGS}
                defaultLang={DEFAULT_LANG}
                onChange={(code) => setLang(code)}
                ariaLabel={lang === "el" ? "Επιλογή γλώσσας" : "Select language"}
              />
              <div className="ps-nav-panel__theme">
                <ThemeToggle />
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavHeader;