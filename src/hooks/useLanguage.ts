import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LangCode } from "../i18n/translations";

const VALID: LangCode[] = ["el", "en"];

function normalize(code: any): LangCode | null {
  return VALID.includes(code) ? (code as LangCode) : null;
}

export function useLanguage(fallback: LangCode = "el") {
  const location = useLocation();
  const navigate = useNavigate();

  const [lang, _setLang] = React.useState<LangCode>(fallback);

  // Read from URL (?lang=), else localStorage, else browser
  React.useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const qp = normalize(sp.get("lang"));
    if (qp) {
    _setLang(qp);
    try { localStorage.setItem("lang", qp); } catch {}
    // Remove the param once consumed:
    const sp2 = new URLSearchParams(location.search);
    sp2.delete("lang");
    navigate({ pathname: location.pathname, search: sp2.toString() ? `?${sp2.toString()}` : "", hash: location.hash }, { replace: true });
    return;
    }

    try {
      const stored = normalize(localStorage.getItem("lang"));
      if (stored) {
        _setLang(stored);
        return;
      }
    } catch {}

    const browser: LangCode = navigator.language?.toLowerCase().startsWith("el") ? "el" : "en";
    _setLang(browser);
  }, [location.search]);

  // Setter that also updates URL (keeps hash) and localStorage
  const setLang = React.useCallback(
    (code: LangCode, updateUrl: boolean = true) => {
      _setLang(code);
      try { localStorage.setItem("lang", code); } catch {}

      if (updateUrl) {
        const sp = new URLSearchParams(location.search);
        sp.set("lang", code);
        navigate(
          { pathname: location.pathname, search: `?${sp.toString()}`, hash: location.hash },
          { replace: true }
        );
      }
    },
    [location.pathname, location.search, location.hash, navigate]
  );

  return { lang, setLang };
}
