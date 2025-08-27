// src/pages/ArticlesPage.tsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import type { LangCode } from "../i18n/types";
import { searchArticles, uniqueTags } from "../helpers/articles";
import Seo from "../helpers/Seo";
import { seoText } from "../i18n/seo";

type Props = { lang: LangCode };

const PAGE_SIZE = 3;

function normalizeTag(val: string) {
  return (val || "").trim().toLowerCase();
}

const ArticlesPage: React.FC<Props> = ({ lang }) => {
  const { dict: t } = useI18n("articlesPage", lang);
  const s = seoText[lang].articles;
  const [params, setParams] = useSearchParams();

  // composition-safe search input (Greek tonos)
  const [queryRaw, setQueryRaw] = React.useState(params.get("q") || "");
  const [isComposing, setIsComposing] = React.useState(false);
  const inputLang = lang === "el" ? "el" : "en";

  // URL-derived filters
  const tagParam = params.get("tag") || "";
  const qParam = params.get("q") || "";
  const pageParam = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

  // keep input in sync with URL changes
  React.useEffect(() => {
    if (qParam !== queryRaw) setQueryRaw(qParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]);

  // commit search input to URL (debounced), reset page to 1
  React.useEffect(() => {
    if (isComposing) return;
    const timer = setTimeout(() => {
      const currentQ = params.get("q") || "";
      const nextQ = queryRaw.trim();
      if (nextQ === currentQ) return;
      const next = new URLSearchParams(params);
      if (nextQ) next.set("q", nextQ);
      else next.delete("q");
      next.set("page", "1");
      setParams(next, { replace: true });
    }, 250);
    return () => clearTimeout(timer);
  }, [queryRaw, isComposing, params, setParams]);

  // TAGS (async)
  const [tags, setTags] = React.useState<string[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await uniqueTags(lang as any);
      if (!cancelled) setTags(list);
    })();
    return () => { cancelled = true; };
  }, [lang]);

  // RESULTS (async, paginated at source)
  const [items, setItems] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { total, items } = await searchArticles({
        lang: lang as any,
        query: qParam,
        tag: tagParam,
        page: pageParam,
        perPage: PAGE_SIZE,
      });
      if (!cancelled) {
        setTotal(total);
        setItems(items);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [lang, qParam, tagParam, pageParam]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(pageParam, totalPages);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setQueryRaw(e.target.value);
  const onCompStart = () => setIsComposing(true);
  const onCompEnd = () => setIsComposing(false);

  const onTagClick = (val: string) => {
    const next = new URLSearchParams(params);
    const cur = normalizeTag(tagParam);
    const nval = normalizeTag(val);
    if (cur === nval) next.delete("tag");
    else next.set("tag", val);
    next.set("page", "1");
    setParams(next, { replace: true });
  };

  const goToPage = (p: number) => {
    const page = String(Math.min(Math.max(1, p), totalPages));
    const next = new URLSearchParams(params);
    next.set("page", page);
    setParams(next, { replace: true });
  };

  // compact pager list
  const pages = React.useMemo(() => {
    const arr: (number | "…")[] = [];
    const add = (n: number | "…") => arr.push(n);

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) add(i);
      return arr;
    }
    add(1);
    add(2);
    if (currentPage > 4) add("…");
    const mids = [currentPage - 1, currentPage, currentPage + 1]
      .filter((n) => n > 2 && n < totalPages - 1) as number[];
    mids.forEach(add);
    if (currentPage < totalPages - 3) add("…");
    add(totalPages - 1);
    add(totalPages);
    return arr;
  }, [currentPage, totalPages]);

  return (
    <>
      <Seo
        lang={lang}
        title={s.title}
        description={s.desc}
        path="/articles"
        og={{ type: "website", image: s.image }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: s.title,
          url: "https://psyche.support/articles",
        }}
      />

      <main className="articles-page container">
        <header className="articles__header">
          <h1 className="articles__title">
            {t.articles?.title || (lang === "el" ? "Άρθρα" : "Articles")}
          </h1>
          <p className="muted">
            {t.articles?.intro ||
              (lang === "el"
                ? "Τελευταίες δημοσιεύσεις, σκέψεις και πόροι."
                : "Latest posts, thoughts, and resources.")}
          </p>
        </header>

        {/* Filters */}
        <section className="articles__filters">
          <input
            className="articles__search"
            type="search"
            inputMode="search"
            lang={inputLang}
            placeholder={lang === "el" ? "Αναζήτηση άρθρων..." : "Search articles..."}
            value={queryRaw}
            onChange={onSearchChange}
            onCompositionStart={onCompStart}
            onCompositionEnd={onCompEnd}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="articles__tags">
            {tags.map((tg) => (
              <button
                key={tg}
                className={`tag ${normalizeTag(tg) === normalizeTag(tagParam) ? "is-active" : ""}`}
                onClick={() => onTagClick(tg)}
              >
                #{tg}
              </button>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="articles__list">
          {loading && <p className="muted">{lang === "el" ? "Φόρτωση…" : "Loading…"}</p>}

          {!loading && items.map((a) => (
            <article key={`${a.slug}-${a.lang}`} className="card article-card">
              {a.banner && (
                <Link
                  to={`/articles/${a.slug}?lang=${lang}`}
                  className="article-card__banner-wrap"
                  aria-label={a.title}
                >
                  <img className="article-card__banner" src={a.banner} alt={a.title || ""} />
                  {/* Photo credit (optional)
                  {a.photoCreditText && (
                    <span className="article-card__credit">
                      <a href={a.photoCreditHref} target="_blank" rel="noopener noreferrer">
                        {a.photoCreditText}
                      </a>
                    </span>
                  )} */}
                </Link>
              )}

              <div className="article-card__body">
                <div className="article-card__meta">
                  {a.date && (
                    <time dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString(lang, {
                        year: "numeric", month: "short", day: "2-digit",
                      })}
                    </time>
                  )}
                  {a.author && <span>• {a.author}</span>}
                  {/* readMinutes exists only on detail; omit here or compute from summary if needed */}
                </div>

                <h2 className="article-card__title">
                  <Link to={`/articles/${a.slug}?lang=${lang}`}>{a.title}</Link>
                </h2>

                {a.summary && <p className="article-card__summary">{a.summary}</p>}

                <div className="article-card__tags">
                  {(a.tags || []).map((tg: string) => (
                    <button key={tg} className="tag" onClick={() => onTagClick(tg)}>
                      #{tg}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {!loading && items.length === 0 && (
            <p className="muted">
              {lang === "el" ? "Δεν βρέθηκαν άρθρα." : "No articles found."}
            </p>
          )}
        </section>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <nav className="articles__pagination" aria-label={lang === "el" ? "Σελιδοποίηση" : "Pagination"}>
            <button
              className="pager-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              {lang === "el" ? "Προηγούμενη" : "Previous"}
            </button>

            <ul className="pager-list">
              {pages.map((p, i) =>
                p === "…" ? (
                  <li key={`gap-${i}`} className="pager-gap">…</li>
                ) : (
                  <li key={p as number}>
                    <button
                      className={`pager-page ${currentPage === p ? "is-active" : ""}`}
                      onClick={() => goToPage(p as number)}
                      aria-current={currentPage === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  </li>
                )
              )}
            </ul>

            <button
              className="pager-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              {lang === "el" ? "Επόμενη" : "Next"}
            </button>
          </nav>
        )}
      </main>
    </>
  );
};

export default ArticlesPage;