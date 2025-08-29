// src/helpers/Seo.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { OG_LOCALE, OG_LOCALE_ALTERNATES } from "../i18n/types";

type OpenGraph = {
  type?: "website" | "article";
  siteName?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  publishedTime?: string;   // article only
  modifiedTime?: string;    // article only
  author?: string;          // article only
  section?: string;         // article only
  tags?: string[];          // article only
  locale?: string;          // e.g., "el_GR" or "en_US"
  localeAlternate?: string[]; // ["en_US","el_GR"]
};

type JsonLd = Record<string, any>;

type RobotsDirectives = {
  index?: boolean;
  follow?: boolean;
  maxImagePreview?: "none" | "standard" | "large";
  maxSnippet?: number | "none";
  maxVideoPreview?: number | "none";
  noarchive?: boolean;
  nositelinkssearchbox?: boolean;
  notranslate?: boolean;
};

type AlternateHref = { hrefLang: string; href: string };

type Props = {
  lang: "el" | "en";
  title: string;
  description: string;
  path?: string;
  canonicalOverride?: string;
  noindex?: boolean;
  og?: OpenGraph;
  twitterSite?: string;
  twitterCreator?: string;
  jsonLd?: JsonLd | JsonLd[];
  alternates?: AlternateHref[];
  robots?: RobotsDirectives;
  keywords?: string[];
};

const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string)?.replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "https://psyche.support");

function canonicalUrl(path?: string, override?: string) {
  if (override) return override;
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function robotsMeta(noindex?: boolean, robots?: RobotsDirectives) {
  const r: Required<Pick<RobotsDirectives, "index" | "follow">> &
    Omit<RobotsDirectives, "index" | "follow"> = {
    index: noindex ? false : robots?.index ?? true,
    follow: robots?.follow ?? true,
    maxImagePreview: robots?.maxImagePreview,
    maxSnippet: robots?.maxSnippet,
    maxVideoPreview: robots?.maxVideoPreview,
    noarchive: robots?.noarchive,
    nositelinkssearchbox: robots?.nositelinkssearchbox,
    notranslate: robots?.notranslate,
  };

  const parts: string[] = [];
  parts.push(r.index ? "index" : "noindex");
  parts.push(r.follow ? "follow" : "nofollow");
  if (r.maxImagePreview) parts.push(`max-image-preview:${r.maxImagePreview}`);
  if (r.maxSnippet !== undefined)
    parts.push(`max-snippet:${r.maxSnippet === "none" ? -1 : r.maxSnippet}`);
  if (r.maxVideoPreview !== undefined)
    parts.push(`max-video-preview:${r.maxVideoPreview === "none" ? -1 : r.maxVideoPreview}`);
  if (r.noarchive) parts.push("noarchive");
  if (r.nositelinkssearchbox) parts.push("nositelinkssearchbox");
  if (r.notranslate) parts.push("notranslate");

  return parts.join(", ");
}

export default function Seo({
  lang,
  title,
  description,
  path,
  canonicalOverride,
  noindex,
  og,
  twitterSite,
  twitterCreator,
  jsonLd,
  alternates,
  robots,
  keywords,
}: Props) {
  const url = canonicalUrl(path, canonicalOverride);
  const jsonArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  const defaultOgLocale = OG_LOCALE[lang];
  const defaultOgLocaleAlt = OG_LOCALE_ALTERNATES[lang];

  const robotsContent = robotsMeta(noindex, robots);

  // Build a single, comma-separated keywords string for meta + JSON-LD
  const keywordsStr = keywords?.filter(Boolean).join(", ");

  // Don’t mutate user-provided JSON-LD; copy and augment with keywords if present.
  const jsonWithKeywords = keywordsStr
    ? jsonArray.map((obj) =>
        obj && typeof obj === "object" && obj.keywords == null
          ? { ...obj, keywords: keywordsStr }
          : obj
      )
    : jsonArray;

  return (
    <Helmet htmlAttributes={{ lang }}>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordsStr && <meta name="keywords" content={keywordsStr} />}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Hreflang alternates (explicit) */}
      {alternates?.map((a) => (
        <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
      ))}

      {/* Robots */}
      {robotsContent && <meta name="robots" content={robotsContent} />}

      {/* Open Graph */}
      <meta property="og:type" content={og?.type ?? "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {og?.siteName && <meta property="og:site_name" content={og.siteName} />}
      <meta property="og:locale" content={og?.locale || defaultOgLocale} />
      {(og?.localeAlternate || defaultOgLocaleAlt).map((loc) => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}
      {og?.image && <meta property="og:image" content={og.image} />}
      {og?.imageAlt && <meta property="og:image:alt" content={og.imageAlt} />}
      {og?.imageWidth && <meta property="og:image:width" content={String(og.imageWidth)} />}
      {og?.imageHeight && <meta property="og:image:height" content={String(og.imageHeight)} />}

      {/* Article-specific OG */}
      {og?.publishedTime && (
        <meta property="article:published_time" content={og.publishedTime} />
      )}
      {og?.modifiedTime && <meta property="article:modified_time" content={og.modifiedTime} />}
      {og?.author && <meta property="article:author" content={og.author} />}
      {og?.section && <meta property="article:section" content={og.section} />}
      {og?.tags?.map((t) => (
        <meta key={t} property="article:tag" content={t} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {og?.image && <meta name="twitter:image" content={og.image} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* JSON-LD */}
      {jsonWithKeywords.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}