import React from "react";
import { translations, type LangCode } from "../i18n/translations";
import { useBooking } from "../components/BookingModalProvider";
import { track } from "../helpers/events";

interface FloatingBookButtonProps {
  lang: LangCode;
}

const FloatingBookButton: React.FC<FloatingBookButtonProps> = ({ lang }) => {
  const t = translations[lang];
  const { openBooking } = useBooking();

  const handleOpen = () => {
    openBooking(t.floatingCta.calUrl);
    track.bookOpen("floating_button");
  };

  return (
    <button
      className="floating-cta"
      onClick={handleOpen}
      aria-label={t.floatingCta.label}
    >
      {t.floatingCta.label}
    </button>
  );
};

export default FloatingBookButton;