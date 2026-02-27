import React from "react";
import { useTranslation } from "react-i18next";
import "./LocationSection.css";

const LocationSection = () => {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || "fr";

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.661530866705!2d3.737259076602665!3d45.373268739500816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f677d49d7a483d%3A0xba8dea8d38dfa2e4!2sDomaine%20de%20Sault!5e1!3m2!1s${currentLang}!2sfr!4v1755963387150!5m2!1s${currentLang}!2sfr`;

  return (
    <section id="location" className="location-section">
      <h5 className="location-title">{t("location.title")}</h5>
      <p className="location-description">{t("location.description")}</p>

      <div className="map-container">
        <iframe
          src={mapUrl}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Domaine de Sault"
        ></iframe>
      </div>
    </section>
  );
};

export default LocationSection;
