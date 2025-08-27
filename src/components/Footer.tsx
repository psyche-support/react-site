import React from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import PsycheLogo from "./Logo";
import { translations, type LangCode } from "../i18n/translations";

type Badge = {
  img: string;
  href?: string;
  alt?: string;
};

type FooterLink = { label: string; href: string };

interface FooterProps {
  lang: LangCode;
  brand?: string;
  taglineOverride?: string; // if you want to override translated tagline
  address?: string;
  mapUrl?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
  links?: FooterLink[];
  badges?: Badge[];
  showLogo?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  lang,
  brand,
  taglineOverride,
  address = "Thessaloniki, Greece",
  mapUrl = "https://maps.google.com/?q=Thessaloniki",
  socials = {},
  links,
  badges = [],
  showLogo = true,
}) => {
  const t = translations[lang];
  const year = new Date().getFullYear();

  // Defaults come from i18n (can be overridden via props)
  const brandName = brand ?? (t.brand || "Psyche Support");
  const tagline = taglineOverride ?? (t.footer?.tagline || "");

  // If caller didn’t pass links, fall back to translated defaults
  const navLinks: FooterLink[] =
    links ??
    (t.footer?.links || [
      { label: lang === "el" ? "Υπηρεσίες" : "Services", href: "/#services" },
      { label: lang === "el" ? "Συνεδρίες" : "Sessions", href: "/sessions" },
      { label: lang === "el" ? "Άρθρα" : "Articles", href: "/#articles" },
      { label: lang === "el" ? "Πληροφορίες" : "About", href: "/#about" },
      { label: lang === "el" ? "Επικοινωνία" : "Contact", href: "/#contact" },
    ]);

  return (
    <footer className="site-footer" aria-label={lang === "el" ? "Υποσέλιδο" : "Footer"}>
      <div className="footer-container">
        {/* Brand + tagline + large logo */}
        <div className="footer-brand">
          <h3>{brandName}</h3>
          {tagline ? <p>{tagline}</p> : null}
          {showLogo && (
            <div className="footer-logo" style={{ marginTop: "1rem" }}>
              <PsycheLogo size={80} aria-label={`${brandName} logo`} />
            </div>
          )}
        </div>

        {/* Quick Links */}
        <nav className="footer-links" aria-label={t.footer?.linksTitle || (lang === "el" ? "Σύνδεσμοι" : "Links")}>
          <h4>{t.footer?.linksTitle || (lang === "el" ? "Σύνδεσμοι" : "Links")}</h4>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div className="footer-social">
          <h4>{t.footer?.follow || (lang === "el" ? "Ακολουθήστε" : "Follow")}</h4>
          <div className="social-icons">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            )}
            {socials.email && (
              <a href={`mailto:${socials.email}`} aria-label="Email">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Location + Badges */}
        <div className="footer-location">
          <h4>{t.footer?.location || (lang === "el" ? "Τοποθεσία" : "Location")}</h4>
          <p>
            <MapPin size={16} style={{ marginRight: 4 }} aria-hidden="true" />
            {address}
          </p>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            {t.footer?.viewOnMap || (lang === "el" ? "Προβολή στον χάρτη" : "View on Map")}
          </a>

          {badges.length > 0 && (
            <div className="footer-badges" style={{ marginTop: "0.8rem" }}>
              {badges.map((b, i) => (
                <div key={i} style={{ marginBottom: "0.5rem" }}>
                  {b.href ? (
                    <a href={b.href} target="_blank" rel="noopener noreferrer">
                      <img
                        src={b.img}
                        alt={b.alt || (lang === "el" ? "Σήμα πιστοποίησης" : "Certification badge")}
                        style={{ maxWidth: "150px", display: "block" }}
                      />
                    </a>
                  ) : (
                    <img
                      src={b.img}
                      alt={b.alt || (lang === "el" ? "Σήμα πιστοποίησης" : "Certification badge")}
                      style={{ maxWidth: "150px", display: "block" }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom" role="contentinfo">
        <p>
          &copy; {year} {brandName}. {t.footer?.rights || (lang === "el" ? "Με επιφύλαξη παντός δικαιώματος." : "All rights reserved.")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
