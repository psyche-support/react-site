import React from "react";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import { useBooking } from "../components/BookingModalProvider";
import { track } from "../helpers/events";

interface FloatingBookButtonProps {
  lang: LangCode;
}

const FloatingBookButton: React.FC<FloatingBookButtonProps> = ({ lang }) => {
  const { dict: t } = useI18n("common", lang);
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