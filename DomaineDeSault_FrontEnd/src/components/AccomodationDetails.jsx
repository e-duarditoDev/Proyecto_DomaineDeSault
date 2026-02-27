import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = t("accommodation.sections", { returnObjects: true }) || [];
  const currentSection = sections.find((item) => item.slug === section);

  if (!currentSection) {
    return (
      <section className="accommodation-detail">
        <p>Sección no encontrada</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </section>
    );
  }

  return (
    <section className="accommodation-detail">
      {/* HERO */}
      <div className="accommodation-detail-hero">
        <img
          src={currentSection.images?.[0]}
          alt={currentSection.title}
        />
        <div className="accommodation-detail-hero-text">
          <h1>{currentSection.title}</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="accommodation-detail-content">
        <p className="accommodation-detail-description">
          {currentSection.description}
        </p>
      </div>

      {/* GALLERY */}
      {currentSection.images?.length > 1 && (
        <div className="accommodation-detail-gallery">
          {currentSection.images.slice(1).map((img, idx) => (
            <img key={idx} src={img} alt={'${currentSection.title} ${idx + 1}'} />
          ))}
        </div>
      )}

      {/* NAV */}
      <div className="accommodation-detail-nav">
        <button onClick={() => navigate("/#accommodation")}>
          ← Volver a Alojamiento
        </button>
      </div>
    </section>
  );
};

export default AccommodationDetails;