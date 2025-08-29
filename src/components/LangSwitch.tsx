// src/components/LangSwitch.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LangCode } from "../i18n/types";

type Props = {
  value: LangCode;                    // current lang
  langs: LangCode[];                  // all supported, e.g. ["el","en","fr"]
  onChange: (lang: LangCode) => void;
  ariaLabel?: string;
  dense?: boolean;
  defaultLang: LangCode;              // which one is at "/" (e.g. "el")
};

function swapLangInPath(
  to: LangCode,
  loc: ReturnType<typeof useLocation>,
  defaultLang: LangCode,
  langs: LangCode[]
) {
  const { pathname, search, hash } = loc;
  const normalize = (s: string) =>
    s.endsWith("/") && s !== "/" ? s.slice(0, -1) : s;
  const path = normalize(pathname);

  // build regex for all non-default langs
  const prefixes = langs.filter((l) => l !== defaultLang).map((l) => `/${l}`);
  const match = prefixes.find(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  let newPath: string;

  if (to === defaultLang) {
    // strip any lang prefix
    newPath = match ? path.slice(match.length) || "/" : path || "/";
  } else {
    const targetPrefix = `/${to}`;
    if (match) {
      // replace existing prefix
      newPath = targetPrefix + path.slice(match.length);
    } else {
      // add new prefix
      newPath = path === "/" ? targetPrefix : `${targetPrefix}${path}`;
    }
  }

  return `${newPath}${search || ""}${hash || ""}`;
}

const LangSwitch: React.FC<Props> = ({
  value,
  langs,
  onChange,
  ariaLabel = "Language",
  dense,
  defaultLang,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const setLang = (lang: LangCode) => {
    if (lang === value) return;
    onChange(lang);
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    const target = swapLangInPath(lang, location, defaultLang, langs);
    navigate(target, { replace: true });
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`lang-switch ${dense ? "lang-switch--dense" : ""}`}
    >
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          className={`lang-switch__btn ${value === lang ? "is-active" : ""}`}
          aria-pressed={value === lang}
          onClick={() => setLang(lang)}
        >
          <span className="lang-switch__label">
            {lang.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LangSwitch;