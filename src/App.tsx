import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLanguage } from "./hooks/useLanguage";
import NavHeader from "./components/NavHeader";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Sessions from "./sections/Sessions";
import Articles from "./sections/Articles";
import Spotlight from "./sections/Spotlight";
import About from "./sections/About";
import Contact from "./sections/Contact";
import SessionsPage from "./pages/SessionsPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import type { LangCode } from "./i18n/translations";
import Footer from "./components/Footer";
import FloatingBookButton from "./components/FloatingBookButton";
import { BookingModalProvider } from "./components/BookingModalProvider";
import ConsentBanner from "./components/ConsentBanner";
import Analytics from "./components/Analytics";
import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import Seo from "./helpers/Seo";
import { seoText } from "./i18n/seo";

const App: React.FC = () => {
  const { lang, setLang } = useLanguage("el"); // default to Greek
  const s = seoText[lang].home;
  return (
    <>
    <Seo
      title={s.title}
      description={s.desc}
      path="/"
      lang={lang}
    />
    <BookingModalProvider lang={lang}>
      <NavHeader lang={lang} onChangeLang={setLang} />
      <FloatingBookButton lang={lang} />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero lang={lang} />
              <Spotlight
                lang={lang}
                photoSrc="/profile.jpeg"
                photoAlt="Portrait of the counselor"
              />
              <Services lang={lang} />
              <Sessions lang={lang} />
            </main>
          }
        />
        <Route path="/services" element={<ServicesPage lang={lang} />} />
        <Route path="/sessions" element={<SessionsPage lang={lang} showOnlineIcons={false} />} />
        <Route path="/articles" element={<ArticlesPage lang={lang} />} />
        <Route path="/articles/:slug" element={<ArticlePage lang={lang} />} />
        <Route path="/about" element={<AboutPage lang={lang} />} />
      </Routes>
      <Footer
        lang={lang}
        brand="Psyche Support"
        socials={{
          // facebook: "https://facebook.com/yourpage",
          instagram: "https://instagram.com/psyche.support",
          linkedin: "https://www.linkedin.com/in/dimitra-malaki-6222021b8",
          email: "malaki.dimitra@gmail.com",
        }}
        address="Thessaloniki, Greece"
        mapUrl="https://maps.google.com/?q=Thessaloniki"
        badges={[
          {
            img: "https://www.onlinecounselling.com/members/certified-member-widget-white.jpg",
            href: "https://www.onlinetherapy.com/online-counsellor/?pdb=6338",
            alt: "Certified Member",
          },
        ]}
        showLogo={true}
      />
      <Analytics gaId="G-F4FF69N6NX" />
      <ConsentBanner lang={lang} position="right" />
    </BookingModalProvider>
    </>
  );
};

export default App;
