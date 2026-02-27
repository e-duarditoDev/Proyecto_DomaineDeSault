import React from "react";
import { useTranslation } from "react-i18next";
import "./ContactSection.css";

const FORM_ACTION = "https://formspree.io/f/xwpakdab";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="contact-wrapper">
      <h2 className="contact-main-title">{t("contact.title")}</h2>

      <div className="contact-card">
        {/* LADO IZQUIERDO */}
        <div className="contact-info">
          <h3 className="contact-subtitle">
            Chambres d'Hôtes Domaine de Sault
          </h3>

          <div className="contact-lines">
            <p>Philippe et Sylvie Roussel</p>
            <p>Le Sault</p>
            <p>63220 Dore l'Eglise</p>
          </div>

          <p className="contact-phone">
            Tél. <a href="tel:+33683335914">+33 683335914</a>
          </p>

          <p className="contact-email">
            Email: <a href="mailto:lesault@wanadoo.fr">lesault@wanadoo.fr</a>
          </p>

          <div className="contact-social">
            <a
              href="https://www.facebook.com/p/Chambres-dH%C3%B4tes-Domaine-de-Sault-100063718922969/?locale=fr_FR&_rdr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='black'><path d='M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495V14.708h-3.13v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.465.099 2.797.143v3.24l-1.92.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z'/></svg>"
                alt="Facebook"
              />
              Facebook
            </a>

            <a
              href="https://www.instagram.com/domainedesault/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/brands/instagram.svg" alt="Instagram" />
              Instagram
            </a>
          </div>
        </div>

        {/* FORMULARIO */}
        <form className="contact-form" action={FORM_ACTION} method="POST">
          <div className="form-row">
            <div className="form-field">
              <label>{t("contactForm.name")} *</label>
              <input
                type="text"
                name="name"
                required
                placeholder={t("contactForm.namePlaceholder")}
              />
            </div>

            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="exemple@email.com"
              />
            </div>
          </div>

          <div className="form-field">
            <label>{t("contactForm.message")} *</label>
            <textarea
              name="message"
              rows="5"
              required
              placeholder={t("contactForm.messagePlaceholder")}
            />
          </div>

          <button type="submit" className="contact-btn">
            {t("contactForm.send")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
