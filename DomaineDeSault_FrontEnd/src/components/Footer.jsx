// Importamos React, necesario para crear componentes
import React from "react";
// Importamos la función de traducción del paquete i18next
import { useTranslation } from "react-i18next";
// Importamos los estilos del footer
import "./Footer.css";

// Definimos el componente funcional Footer
const Footer = () => {
  // Obtenemos la función de traducción "t"
  const { t } = useTranslation();

  // Retornamos la estructura del pie de página
  return (
    <footer className="footer">
      {" "}
      {/* Contenedor principal del footer */}
      <div className="footer-container">
        {" "}
        {/* Contenedor de columnas del footer */}
        {/*Columna de navegación*/}
        <div className="footer-column">
          <h6>{t("footer.navigation")}</h6> {/* Título traducido */}
          <ul>
            {/* Enlaces de navegación interna */}
            <li>
              <a href="#book">{t("nav.book")}</a>
            </li>
            <li>
              <a href="#lodging">{t("nav.lodging")}</a>
            </li>
            <li>
              <a href="#reviews">{t("nav.review")}</a>
            </li>
            <li>
              <a href="#location">{t("nav.location")}</a>
            </li>
            <li>
              <a href="#contact">{t("nav.contact")}</a>
            </li>
          </ul>
        </div>
        {/*Columna de contacto rápido*/}
        <div className="footer-column">
          <h6>{t("footer.contact")}</h6>

          <p>
            {/* Teléfono fijo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: "6px", verticalAlign: "middle" }}
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.61a1 1 0 01-.91 1A19 19 0 013 5.92a1 1 0 011-0.91H7.6a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.01l-2.33 2.33z" />
            </svg>
            +33 683 335 914
          </p>

          <p>
            {/* Email */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: "6px", verticalAlign: "middle" }}
            >
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5z" />
            </svg>
            lesault@wanadoo.fr
          </p>
        </div>
        {/*Columna de socios / partners */}
        <div className="footer-column">
          <h6>{t("footer.partners")}</h6> {/* Título traducido */}
          <div className="partners-logos">
            {/* Cada enlace lleva a una página asociada y muestra su logo */}
            <a
              href="https://www.auvergne-livradois-forez.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/brands/livradois.svg"
                alt="Maison du tourisme du Livradois-Forez"
              />
            </a>
            <a
              href="https://https://www.craponnesurarzon.fr/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/brands/craponne.png"
                alt="Office de tourisme Craponne-sur-Arzon"
              />
            </a>
            <a
              href="https://www.ambertlivradoisforez.fr/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/brands/Logo_Ambert_Livradois_Forez-RVB.jpg"
                alt="Communauté de commune du Pays d'Arlanc"
              />
            </a>
            <a
              href="https://wwww.lepuyenvelay-tourisme.fr/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/brands/lepuylogo.jpg"
                alt="Office de tourisme du Puy-en-Velay"
              />
            </a>
            <a
              href="https://www.chaisedieu.fr/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/brands/chaisedieu.svg"
                alt="Office de tourisme de La Chaise-Dieu"
              />
            </a>
            <a
              href="https://www.wwf.fr/qui-sommes-nous/entreprises-partenaires/gites-de-france"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/brands/WWF_Logo.jpg" alt="WWF France" />
            </a>
            <a
              href="https://www.gites-de-france.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/brands/Gîtes_de_France_(logo).svg.png"
                alt="Gîtes de France"
              />
            </a>
          </div>
        </div>
        {/*Columna de redes sociales y enlaces adicionales*/}
        <div className="footer-column">
          <h6>{t("footer.more")}</h6> {/* Título traducido */}
          <div className="social-icons">
            {/* Enlace a Facebook */}
            <a
              href="https://www.facebook.com/p/Chambres-dH%C3%B4tes-Domaine-de-Sault-100063718922969/?locale=fr_FR&_rdr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/brands/facebook-icon.svg" alt="Facebook logo" />
            </a>
            {/* Enlace a Instagram */}
            <a
              href="https://www.instagram.com/domainedesault/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/brands/instagram-icon.svg" alt="Instagram logo" />
            </a>
          </div>
        </div>
      </div>
      {/* Pie final con derechos de autor */}
      <div className="footer-bottom">
        <p>© 2025 Domaine de Sault — All rights reserved.</p>
      </div>
    </footer>
  );
};

// Exportamos el componente para usarlo en la aplicación
export default Footer;
