import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { translations, type LangCode } from "../i18n/translations";
import { searchArticles, uniqueTags } from "../helpers/articles";
import Seo from "../helpers/Seo";
import { seoText } from "../i18n/seo";

type Props = { lang: LangCode };

const PAGE_SIZE = 3;

function normalizeTag(val: string) {
  return (val || "").trim().toLowerCase();
}

const ArticlesPage: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const s = seoText[lang].articles;
  const [params, setParams] = useSearchParams();

  // composition-safe search input (Greek tonos)
  const [queryRaw, setQueryRaw] = React.useState(params.get("q") || "");
  const [isComposing, setIsComposing] = React.useState(false);
  const inputLang = lang === "el" ? "el" : "en";

  // read filters from URL
  const tagParam = params.get("tag") || "";
  const qParam = params.get("q") || "";
  const pageParam = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

  // keep queryRaw in sync if URL changes externally (back/forward, links)
  React.useEffect(() => {
    if (qParam !== queryRaw) setQueryRaw(qParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]);

  // commit queryRaw to URL ONLY when it actually changes (guard),
  // and reset page to 1 in that case
  React.useEffect(() => {
    if (isComposing) return;
    const timer = setTimeout(() => {
      const currentQ = params.get("q") || "";
      const nextQ = queryRaw.trim();
      if (nextQ === currentQ) return; // <-- guard: do nothing if same query
      const next = new URLSearchParams(params);
      if (nextQ) next.set("q", nextQ);
      else next.delete("q");
      next.set("page", "1"); // reset page only on real query change
      setParams(next, { replace: true });
    }, 250);
    return () => clearTimeout(timer);
  }, [queryRaw, isComposing, params, setParams]);

  const tags = React.useMemo(() => uniqueTags(lang as any), [lang]);

  // filtered list
  const results = React.useMemo(
    () => searchArticles(lang as any, { query: qParam, tag: tagParam }),
    [lang, qParam, tagParam]
  );

  // pagination
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(pageParam, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paged = results.slice(start, start + PAGE_SIZE);

  // handlers
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryRaw(e.target.value);
  };
  const onCompStart = () => setIsComposing(true);
  const onCompEnd = () => setIsComposing(false);

  const onTagClick = (val: string) => {
    const next = new URLSearchParams(params);
    const cur = normalizeTag(tagParam);
    const nval = normalizeTag(val);
    if (cur === nval) next.delete("tag");
    else next.set("tag", val);
    next.set("page", "1"); // reset page on tag change
    setParams(next, { replace: true });
  };

  const goToPage = (p: number) => {
    const page = String(Math.min(Math.max(1, p), totalPages));
    const next = new URLSearchParams(params);
    next.set("page", page);
    setParams(next, { replace: true });
  };

  // compact page list
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
            (lang === "el" ? "Τελευταίες δημοσιεύσεις, σκέψεις και πόροι." : "Latest posts, thoughts, and resources.")}
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

      {/* Results (paged) */}
      <section className="articles__list">
        {paged.map((a) => (
          <article key={`${a.frontmatter.slug}-${a.lang}`} className="card article-card">
            {a.frontmatter.banner && (
              <Link
                to={`/articles/${a.frontmatter.slug}?lang=${lang}`}
                className="article-card__banner-wrap"
                aria-label={a.frontmatter.title}
              >
                <img
                  className="article-card__banner"
                  src={a.frontmatter.banner}
                  alt={a.frontmatter.title || ""}
                />
                {/* {a.frontmatter.photoCreditText && (
                  <span className="article-card__credit">
                    <a
                      href={a.frontmatter.photoCreditHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {a.frontmatter.photoCreditText}
                    </a>
                  </span>
                )} */}
              </Link>
            )}

            <div className="article-card__body">
              <div className="article-card__meta">
                <time dateTime={a.frontmatter.date}>
                  {new Date(a.frontmatter.date).toLocaleDateString(lang, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </time>
                {a.frontmatter.author && <span>• {a.frontmatter.author}</span>}
                <span>
                  • {a.readMinutes} {lang === "el" ? "λεπτά" : "min"}
                </span>
              </div>

              <h2 className="article-card__title">
                <Link to={`/articles/${a.frontmatter.slug}?lang=${lang}`}>
                  {a.frontmatter.title}
                </Link>
              </h2>

              {a.frontmatter.summary && (
                <p className="article-card__summary">{a.frontmatter.summary}</p>
              )}

              <div className="article-card__tags">
                {(a.frontmatter.tags || []).map((tg) => (
                  <button key={tg} className="tag" onClick={() => onTagClick(tg)}>
                    #{tg}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}

        {paged.length === 0 && (
          <p className="muted">
            {lang === "el" ? "Δεν βρέθηκαν άρθρα." : "No articles found."}
          </p>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
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
                <li key={p}>
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