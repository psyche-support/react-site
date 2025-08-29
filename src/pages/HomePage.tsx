// src/pages/HomePage.tsx
import React from "react";
import Hero from "../components/Hero";
import Spotlight from "../components/Spotlight";
import Services from "../components/Services";
import Sessions from "../components/Sessions";
import type { LangCode } from "../i18n/types";

type Props = {
  lang: LangCode;
};

const HomePage: React.FC<Props> = ({ lang }) => {
  return (
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
  );
};

export default HomePage;