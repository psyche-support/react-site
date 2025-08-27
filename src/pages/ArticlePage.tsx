// src/pages/ArticlePage.tsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { getArticle } from "../helpers/articles";
import { type LangCode, translations } from "../i18n/translations";
import Seo from "../helpers/Seo";
import { getTopTermsForArticle } from "../helpers/seoKeywords"; // extracted terms for SEO only

type Props = { lang: LangCode };

function useQueryLang(fallback: LangCode): LangCode {
  const loc = useLocation();
  const sp = new URLSearchParams(loc.search);
  const v = (sp.get("lang") || "").toLowerCase();
  return v === "el" || v === "en" ? (v as LangCode) : fallback;
}

const ArticlePage: React.FC<Props> = ({ lang: fallbackLang }) => {
  const { slug = "" } = useParams<{ slug: string }>();
  const lang = useQueryLang(fallbackLang);

  const article = React.useMemo(() => getArticle(lang as any, slug), [lang, slug]);

  // Load extracted keywords for SEO ONLY (not shown in UI)
  const [extractedTerms, setExtractedTerms] = React.useState<string[]>([]);
  React.useEffect(() => {
    let alive = true;
    getTopTermsForArticle(slug, (lang as "el" | "en") || "el", 8).then((terms) => {
      if (alive) setExtractedTerms(terms);
    });
    return () => {
      alive = false;
    };
  }, [slug, lang]);

  if (!article) {
    return (
      <main className="container" style={{ padding: "2rem 0" }}>
        <h1>{lang === "el" ? "Το άρθρο δεν βρέθηκε" : "Article not found"}</h1>
        <p className="muted">{lang === "el" ? "Ελέγξτε τον σύνδεσμο." : "Please check the link."}</p>
      </main>
    );
  }

  const fm = article.frontmatter;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const t = translations[lang];
  const desc = fm.summary || (article.plain.slice(0, 180) + "…");
  const image = fm.banner;

  // Build SEO-only tags: merge fm.tags + extracted terms, but DO NOT show them in UI
  const seoTags = React.useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    const push = (v?: string) => {
      if (!v) return;
      const k = v.trim().toLowerCase();
      if (!k || seen.has(k)) return;
      seen.add(k);
      out.push(v);
    };
    (fm.tags || []).forEach(push);
    extractedTerms.forEach(push);
    return out.slice(0, 12);
  }, [fm.tags, extractedTerms]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: desc,
    datePublished: fm.date,
    dateModified: fm.date,
    author: fm.author ? { "@type": "Person", name: fm.author } : undefined,
    image: image ? [image] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://psyche.support/articles/${fm.slug}`,
    },
    keywords: seoTags.join(", "), // SEO only
  };

  return (
    <>
      <Seo
        lang={lang}
        title={fm.title}
        description={desc}
        path={`/articles/${fm.slug}`}
        og={{
          type: "article",
          image,
          publishedTime: fm.date,
          author: fm.author,
          section: fm.tags?.[0],
          tags: seoTags, // SEO only (article:tag). UI tags remain fm.tags below.
        }}
        jsonLd={jsonLd}
      />

      <article className="article">
        {/* Full-bleed banner hero */}
        <header
          className="article-hero"
          style={
            { ["--article-hero" as any]: `url(${fm.banner || ""})` } as React.CSSProperties
          }
        >
          <div className="article-hero__overlay" />
          {/* Photo credit bottom-right */}
          {fm.photoCreditText && (
            <span className="article-hero__credit">
              <a href={fm.photoCreditHref} target="_blank" rel="noopener noreferrer">
                {fm.photoCreditText}
              </a>
            </span>
          )}
          <div className="container article-hero__inner">
            <div className="article-hero__meta">
              <time dateTime={fm.date}>
                {new Date(fm.date).toLocaleDateString(lang, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </time>
              {fm.author && <span>• {fm.author}</span>}
              <span>• {article.readMinutes} {lang === "el" ? "λεπτά" : "min"}</span>
            </div>
            <h1 className="article-hero__title">{fm.title}</h1>

            {/* Visible tag chips = ONLY what you set in the MD file */}
            <div className="article-hero__tags">
              {(fm.tags || []).map((tag) => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="container article-body">
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.html }} />

          {/* Share row */}
          <div className="article-share">
            <span className="muted">{lang === "el" ? "Κοινοποίησε:" : "Share:"}</span>
            <div className="article-share__buttons">
              <a target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>Facebook</a>
              <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fm.title)}`}>X</a>
              <a target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(fm.title)}`}>LinkedIn</a>
              <a target="_blank" rel="noopener noreferrer" href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(fm.title)}`}>Reddit</a>
              <a target="_blank" rel="noopener noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fm.title)}`}>Telegram</a>
              <a target="_blank" rel="noopener noreferrer" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(fm.title + " " + shareUrl)}`}>WhatsApp</a>
              <a href={`mailto:?subject=${encodeURIComponent(fm.title)}&body=${encodeURIComponent(shareUrl)}`}>Email</a>
              <button onClick={() => navigator.clipboard?.writeText(shareUrl)}>
                {lang === "el" ? "Αντιγραφή συνδέσμου" : "Copy link"}
              </button>
            </div>
          </div>

          {/* References */}
          {fm.references?.length ? (
            <section className="article-refs">
              <h3>{lang === "el" ? "Βιβλιογραφία" : "References"}</h3>
              <ul>
                {fm.references.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </section>
          ) : null}
        </main>
      </article>
    </>
  );
};

export default ArticlePage;