import React from 'react';
import { translations, LangCode } from '../i18n/translations';

interface Props { lang: LangCode; }

const About: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  return (
    <section id="about">
      <div className="container">
        <h2>{t.about.title}</h2>

        <h3>{t.about.platform_title}</h3>
          <p className="preserve-lines">{t.about.platform_text}</p>
        
        <h3>{t.about.founder_title}</h3>
        <p className="preserve-lines">{t.about.founder_text}</p>
      </div>
    </section>
  );
};

export default About;
