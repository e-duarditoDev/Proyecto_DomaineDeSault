import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Accommodation.css";

const Accommodation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = t("accommodation.sections", { returnObjects: true }) || [];

  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <section className="accommodation-section" id="accommodation">
      <h2 className="accommodation-title">{t("nav.accommodation")}</h2>

      <div className="accommodation-container">
        {sections.map((section) => (
          <div key={section.slug} className="accommodation-card">
            <div className="accommodation-text">
              <h3
                className="accommodation-name"
                onClick={() => navigate(`/accommodation/${section.slug}`)}
              >
                {section.title}
              </h3>

              <p className="accommodation-description">{section.description}</p>

              <button
                className="accommodation-btn"
                onClick={() => navigate(`/accommodation/${section.slug}`)}
              >
                Saber más
              </button>
            </div>

            <div
              className="accommodation-img-wrapper"
              onClick={() => navigate(`/accommodation/${section.slug}`)}
            >
              <img
                src={section.images?.[0]}
                alt={section.title}
                className="accommodation-img"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accommodation;
