import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { X } from "lucide-react";
import { translations, type LangCode } from "../i18n/translations";

type Ctx = {
  openBooking: (href?: string) => void;
  closeBooking: () => void;
  isOpen: boolean;
};

const BookingCtx = createContext<Ctx | null>(null);

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) {
    // Safe no-op fallback if provider not mounted
    return {
      openBooking: (href?: string) => href && (window.location.href = href),
      closeBooking: () => {},
      isOpen: false,
    } as Ctx;
  }
  return ctx;
}

type ProviderProps = {
  lang: LangCode;
  /** default Cal.com URL if none is passed to openBooking */
  defaultHref?: string;
  children: ReactNode;
};

export const BookingModalProvider: React.FC<ProviderProps> = ({ lang, defaultHref, children }) => {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState<string | undefined>(defaultHref);

  const t = translations[lang];

  const value = useMemo<Ctx>(
    () => ({
      openBooking: (h?: string) => {
        if (h) setHref(h);
        setOpen(true);
      },
      closeBooking: () => setOpen(false),
      isOpen: open,
    }),
    [open]
  );

  return (
    <BookingCtx.Provider value={value}>
      {children}

      {open && (
        <div className="floating-cta__overlay" role="dialog" aria-modal="true" aria-label={t.floatingCta.label}>
          <div className="floating-cta__iframeWrap">
            <button
              className="floating-cta__close"
              onClick={() => setOpen(false)}
              aria-label={lang === "el" ? "Κλείσιμο κράτησης" : "Close booking"}
            >
              <X size={20} />
            </button>
            <iframe
              src={href || t.floatingCta.calUrl}
              title={t.floatingCta.label}
              className="floating-cta__iframe"
            />
          </div>
        </div>
      )}
    </BookingCtx.Provider>
  );
};