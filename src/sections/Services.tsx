import React from 'react';
import { translations, LangCode } from '../i18n/translations';

interface Props { lang: LangCode; }

const Services: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  return (
    <section id="services">
      <div className="container">
        <h2>{t.services.title}</h2>
        <p className="muted">{t.services.intro}</p>
        <div className="grid grid-3">
          {t.services.list.map(item => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
