import React from "react";
import About from "../sections/About";
import Seo from "../helpers/Seo";
import { seoText } from "../i18n/seo";
import type { LangCode } from "../i18n/translations";

interface Props {
  lang: LangCode;
}

const AboutPage: React.FC<Props> = ({ lang }) => {
  const s = seoText[lang].about;
  return (
    <>
    <Seo
        lang={lang}
        title={s.title}
        description={s.desc}
        path="/about"
        og={{ type: "website", image: s.image }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Psyche Support",
          url: "https://psyche.support/about",
          sameAs: [], // add socials if you want
        }}
    />
    <main style={{ padding: "2rem" }}>
      <About lang={lang} />
    </main>
    </>
  );
};

export default AboutPage;
