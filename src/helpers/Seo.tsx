// src/helpers/Seo.tsx
import React from "react";
import { Helmet } from "react-helmet-async";

type OpenGraph = {
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
};

type JsonLd = Record<string, any>;

type Props = {
  lang: "el" | "en";
  title: string;
  description: string;
  path?: string;               // e.g. "/articles/slug"
  noindex?: boolean;
  og?: OpenGraph;
  jsonLd?: JsonLd | JsonLd[];
  canonicalOverride?: string;  // full URL if you want to override
};

const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string)?.replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "https://psyche.support");

function canonicalUrl(path?: string, override?: string) {
  if (override) return override;
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function Seo({
  lang,
  title,
  description,
  path,
  noindex,
  og,
  jsonLd,
  canonicalOverride,
}: Props) {
  const url = canonicalUrl(path, canonicalOverride);

  // If you localize via ?lang=, emit hreflang alternates with that query param.
  const baseNoQuery = url.split("?")[0];
  const hrefEl = `${baseNoQuery}?lang=el`;
  const hrefEn = `${baseNoQuery}?lang=en`;

  const ogType = og?.type ?? "website";
  const json = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Hreflang alternates */}
      <link rel="alternate" hrefLang="el" href={hrefEl} />
      <link rel="alternate" hrefLang="en" href={hrefEn} />
      <link rel="alternate" hrefLang="x-default" href={hrefEn} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {og?.image && <meta property="og:image" content={og.image} />}
      {og?.publishedTime && <meta property="article:published_time" content={og.publishedTime} />}
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

      {/* JSON-LD */}
      {json.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}