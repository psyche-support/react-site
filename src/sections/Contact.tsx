import React from 'react';
import Button from '../components/Button';
import { translations, LangCode } from '../i18n/translations';

interface Props { lang: LangCode; }

const Contact: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  return (
    <section id="contact">
      <div className="container">
        <h2>{t.contact.title}</h2>
        <p className="muted">{t.contact.intro}</p>
        <div className="grid">
          <div className="card">
            <form onSubmit={(e)=>e.preventDefault()}>
              <label>Όνομα<input type="text" required/></label>
              <label>Email<input type="email" required/></label>
              <label>Μήνυμα<textarea rows={4} /></label>
              <button className="ps-btn ps-btn--primary" type="submit">{lang==='el'?'Αποστολή':'Send'}</button>
            </form>
          </div>
          <div className="card">
            <h3>{lang==='el'?'Κράτηση':'Booking'}</h3>
            <p className="muted">{lang==='el'?'Συνδέστε Calendly/Cal.com.':'Connect Calendly/Cal.com.'}</p>
            <Button href="#" variant="outline">{lang==='el'?'Άνοιγμα σελίδας κράτησης':'Open booking page'}</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
