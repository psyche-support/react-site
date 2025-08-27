import React from 'react';
import { translations, LangCode } from '../i18n/translations';

interface Props { lang: LangCode; }

const Articles: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  return (
    <section id="articles">
      <div className="container">
        <h2>{t.articles.title}</h2>
        <p className="muted">{t.articles.intro}</p>
        <div className="grid grid-3">
          <article className="card"><h3>{lang==='el'?'Σχέσεις':'Relationships'}</h3><p className="muted">2 {lang==='el'?'άρθρα':'posts'}</p></article>
          <article className="card"><h3>{lang==='el'?'Εργασία':'Work'}</h3><p className="muted">1 {lang==='el'?'άρθρο':'post'}</p></article>
          <article className="card"><h3>{lang==='el'?'Προσωπικότητα':'Personality'}</h3><p className="muted">1 {lang==='el'?'άρθρο':'post'}</p></article>
        </div>
      </div>
    </section>
  );
};

export default Articles;
