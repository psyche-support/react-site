import React from "react";
import { Suspense, lazy } from "react";
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
import type { LangCode } from "../i18n/types";
import Footer from "./components/Footer";
import FloatingBookButton from "./components/FloatingBookButton";
import { BookingModalProvider } from "./components/BookingModalProvider";
import ScrollManager from "./components/ScrollManager";
import ConsentBanner from "./components/ConsentBanner";
import Analytics from "./components/Analytics";
import Seo from "./helpers/Seo";
import { seoText } from "./i18n/seo";

import SessionsPage from "./pages/SessionsPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import ContactPage from "./pages/ContactPage";
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));


const GA_ID = import.meta.env.VITE_GA_ID as string;
const INSTAGRAM = import.meta.env.VITE_INSTAGRAM as string;
const LINKEDIN = import.meta.env.VITE_LINKEDIN as string;
const TWITTER_X = import.meta.env.VITE_TWITTER_X as string;
const EMAIL = import.meta.env.VITE_EMAIL as string;
const MAPS_URL = import.meta.env.VITE_MAPS_URL as string;

const App: React.FC = () => {
  const { lang, setLang } = useLanguage("el"); // default to Greek
  const s = seoText[lang].home;
  return (
    <>
      <Seo title={s.title} description={s.desc} path="/" lang={lang} />
      <BookingModalProvider lang={lang}>
        <div className="layout">{/* <-- flex column, full height */}
          <ScrollManager /> 
          <NavHeader lang={lang} onChangeLang={setLang} />
          <FloatingBookButton lang={lang} />
          <Suspense fallback={<div style={{padding: '2rem'}}>Loading…</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <main className="site-main">
                    <Hero lang={lang} />
                    <Spotlight
                      lang={lang}
                      photoSrc="/home/profile.jpeg"
                      photoAlt="Portrait of the counselor"
                    />
                    <Services lang={lang} />
                    <Sessions lang={lang} />
                  </main>
                }
              />
              <Route path="/services" element={<main className="site-main"><ServicesPage lang={lang} /></main>} />
              <Route path="/sessions" element={<main className="site-main"><SessionsPage lang={lang} showOnlineIcons={false} /></main>} />
              <Route path="/articles" element={<main className="site-main"><ArticlesPage lang={lang} /></main>} />
              <Route path="/articles/:slug" element={<main className="site-main"><ArticlePage lang={lang} /></main>} />
              <Route path="/about" element={<main className="site-main"><AboutPage lang={lang} /></main>} />
              <Route path="/privacy" element={<main className="site-main"><PrivacyPage lang={lang} /></main>} />
              <Route path="/terms" element={<main className="site-main"><TermsPage lang={lang} /></main>} />
              <Route path="/cookies" element={<main className="site-main"><CookiePolicyPage lang={lang} /></main>} />
              <Route path="/accessibility" element={<main className="site-main"><AccessibilityPage lang={lang} /></main>} />
              <Route path="/contact" element={<main className="site-main"><ContactPage lang={lang} /></main>} />
            </Routes>
          </Suspense>
          <Footer
            lang={lang}
            brand="Psyche Support"
            socials={{ instagram: INSTAGRAM, linkedin: LINKEDIN, x: TWITTER_X, email: EMAIL }}
            address="Thessaloniki, Greece"
            mapUrl={MAPS_URL}
            badges={[
              {
                img: "https://www.milamou.gr/wp-content/uploads/2020/04/logo.png",
                href: "https://www.milamou.gr/oi-ethelontes/",
                alt: "Volunteer",
              },
              // {
              //   img: "https://complicated.life/_next/static/media/logo_text.1120091a.svg",
              //   href: "https://complicated.life/find-a-therapist/thessaloniki/accredited-mental-health-counselor-dimitra-malaki/",
              //   alt: "Accredited Mental Health Counselor",
              // },
              {
                img: "https://www.onlinecounselling.com/members/certified-member-widget-white.jpg",
                href: "https://www.onlinetherapy.com/therapists/greece/",
                alt: "Certified Member",
              },
            ]}
            showLogo={true}
          />
        </div>

        <Analytics gaId={GA_ID} />
        <ConsentBanner lang={lang} position="right" />
      </BookingModalProvider>
    </>
  );
};

export default App;
