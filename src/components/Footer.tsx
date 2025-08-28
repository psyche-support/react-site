import React from "react";
import { Facebook, Instagram, Linkedin, X, Mail, MapPin } from "lucide-react";
import PsycheLogo from "./Logo";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import "../styles/footer.css";

type Badge = {
  img: string;
  href?: string;
  alt?: string;
};

type FooterLink = { label: string; href: string };

interface FooterProps {
  lang: LangCode;
  brand?: string;
  taglineOverride?: string;
  address?: string;
  mapUrl?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
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
  const { dict: t } = useI18n("common", lang);
  const year = new Date().getFullYear();

  const brandName = brand ?? t.brand;
  const tagline = taglineOverride ?? t.footer.tagline;

  const navLinks: FooterLink[] = links ?? t.footer.links;
  const hours = t.footer.hours;

  return (
    <footer className="site-footer" aria-label={lang === "el" ? "Υποσέλιδο" : "Footer"}>
      <div className="footer-container">
        {/* Brand column */}
        <div className="footer-brand">
          <div className="footer-brand__head">
            <h3 className="footer-brand__name">{brandName}</h3>
            {tagline ? <p className="footer-brand__tagline">{tagline}</p> : null}
          </div>

          {showLogo && (
            <div className="footer-logo">
              <PsycheLogo size={90} aria-label={`${brandName} logo`} />
            </div>
          )}

          {/* Working Hours */}
          {hours.items.length ? (
            <section className="footer-hours" aria-labelledby="footer-hours-heading">
              <h4 id="footer-hours-heading" className="footer-hours__title">
                {hours.title}
              </h4>
              <ul className="footer-hours__list">
                {hours.items.map((row: { label: string; value: string }) => (
                  <li key={row.label} className="footer-hours__row">
                    <span className="footer-hours__label">{row.label}</span>
                    <span className="footer-hours__value">{row.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* Social */}
        <div className="footer-social">
          <h4 className="footer-col__title">{t.footer.follow}</h4>
          <div className="social-icons">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                <Facebook size={20} />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                <Instagram size={20} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                <Linkedin size={20} />
              </a>
            )}
            {socials.x && (
              <a href={socials.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="social-icon">
                <X size={20} />
              </a>
            )}
            {socials.email && (
              <a href={`mailto:${socials.email}`} aria-label="Email" className="social-icon">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Links */}
        <nav className="footer-links" aria-label={t.footer.linksTitle}>
          <h4 className="footer-col__title">{t.footer.linksTitle}</h4>
          <ul className="footer-links__list">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Location + Badges */}
        <div className="footer-location">
          <h4 className="footer-col__title">{t.footer.location}</h4>
          <p className="footer-location__line">
            <MapPin size={16} aria-hidden="true" />
            <span>{address}</span>
          </p>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
            {t.footer.viewOnMap}
          </a>

          {badges.length > 0 && (
            <div className="footer-badges">
              {badges.map((b, i) => (
                <div key={i} className="footer-badge">
                  {b.href ? (
                    <a href={b.href} target="_blank" rel="noopener noreferrer">
                      <img src={b.img} alt={b.alt || "Certification badge"} />
                    </a>
                  ) : (
                    <img src={b.img} alt={b.alt || "Certification badge"} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom" role="contentinfo">
        <p>
          &copy; {year} {brandName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;