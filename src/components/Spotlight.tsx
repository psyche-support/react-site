import React from "react";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
  /** Optional overrides; falls back to translations[lang].spotlight.* */
  title?: string;
  text?: string;
  authorName?: string;
  authorRole?: string;
  photoSrc: string;
  photoAlt?: string;
  id?: string;
  /** If true: image on the LEFT, text on the RIGHT */
  reverse?: boolean;
};

const Spotlight: React.FC<Props> = ({
  lang,
  id = "spotlight",
  title,
  text,
  authorName,
  authorRole,
  photoSrc,
  photoAlt,
  reverse = false,
}) => {
  const { dict: t } = useI18n("homePage", lang);
  const i18n = {
    title: (t.spotlight?.title),
    text: (t.spotlight?.text),
    authorName: (t.spotlight?.authorName),
    authorRole: (t.spotlight?.authorRole),
    photoAlt: (t.spotlight?.photoAlt)
  };

  return (
    <section id={id} className="spotlight">
      <div className={`container spotlight__grid${reverse ? " reverse" : ""}`}>
        {/* Text (2/3) */}
        <div className="card spotlight__text">
          <h2 className="spotlight__title">{i18n.title}</h2>
          <p className="spotlight__body">{i18n.text}</p>

          <div className="spotlight__author">
            <div className="spotlight__author-meta">
              <div className="spotlight__author-name">{i18n.authorName}</div>
              <div className="spotlight__author-role">{i18n.authorRole}</div>
            </div>
          </div>
        </div>

        {/* Image (1/3) */}
        <div className="spotlight__image-wrap">
          <img className="spotlight__image" src={photoSrc} alt={i18n.photoAlt} />
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
