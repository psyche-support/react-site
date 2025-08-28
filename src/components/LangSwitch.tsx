import React from "react";
import type { LangCode } from "../i18n/types";

type Props = {
  value: LangCode;
  onChange: (lang: LangCode) => void;
  ariaLabel?: string;
  dense?: boolean; // optional smaller variant
};

const LangSwitch: React.FC<Props> = ({ value, onChange, ariaLabel = "Language", dense }) => {
  const set = (lang: LangCode) => {
    onChange(lang);
    try { localStorage.setItem("lang", lang); } catch {}
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`lang-switch ${dense ? "lang-switch--dense" : ""}`}
    >
      <button
        type="button"
        className={`lang-switch__btn ${value === "el" ? "is-active" : ""}`}
        aria-pressed={value === "el"}
        onClick={() => set("el")}
      >
        <span className="lang-switch__label">ΕΛ</span>
      </button>
      <button
        type="button"
        className={`lang-switch__btn ${value === "en" ? "is-active" : ""}`}
        aria-pressed={value === "en"}
        onClick={() => set("en")}
      >
        <span className="lang-switch__label">EN</span>
      </button>
    </div>
  );
};

export default LangSwitch;