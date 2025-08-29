// src/pages/HomePage.tsx
import React from "react";
import Hero from "../components/Hero";
import Spotlight from "../components/Spotlight";
import Services from "../components/Services";
import Sessions from "../components/Sessions";
import Seo from "../helpers/Seo";
import { localizedPath, buildAlternates } from "../helpers/paths";
import { defaults } from "../helpers/defaults";
import { seoText } from "../i18n/seo";
import { OG_LOCALE, OG_LOCALE_ALTERNATES } from "../i18n/types";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
};

const HomePage: React.FC<Props> & { route?: string } = ({ lang }) => {
  const t = seoText[lang].home;

  const basePath = HomePage.route || "/";
  const path = localizedPath(basePath, lang);
  const alternates = buildAlternates(basePath);

  return (
    <>
      <Seo
        lang={lang}
        title={t.title}
        description={t.desc}
        path={path}
        alternates={alternates}
        og={{
          type: "website",
          siteName: defaults.site_name,
          image: defaults.logo,
          imageAlt: defaults.site_name,
          locale: OG_LOCALE[lang],
          localeAlternate: OG_LOCALE_ALTERNATES[lang],
        }}
        keywords={t.keywords}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: defaults.site_name,
            url: defaults.url,
            logo: defaults.logo,
            sameAs: (defaults.socials || []).filter(Boolean),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: defaults.site_name,
            url: defaults.url,
            inLanguage: lang,
            potentialAction: {
              "@type": "SearchAction",
              target: `${defaults.url}/articles?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
        robots={{
          index: true,
          follow: true,
          maxImagePreview: "large",
        }}
      />
      <main className="site-main">
      <Hero lang={lang} />
      <Spotlight
          lang={lang}
          photoSrc="/home/profile.jpeg"
          photoAlt={lang === "el" ? "Πορτρέτο της θεραπεύτριας" : "Portrait of the counselor"}
      />
      <Services lang={lang} />
      <Sessions lang={lang} />
      </main>
    </>
  );
};

export default HomePage;