import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

import "./RoomDetail.css";

const RoomDetail = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const roomsObj = t("rooms.list", { returnObjects: true }) || {};
  const room = roomsObj[roomId];

  const [lightboxIndex, setLightboxIndex] = useState(null);

  // refs para swipe móvil
  const touchStartX = useRef(null);

  const images = room?.images || [];

  //CONTROL POR TECLADO (← → ESC)
  useEffect(() => {
    if (!room || lightboxIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((lightboxIndex + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
      }
      if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length, room]);

  // SWIPE MÓVIL
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const delta = e.changedTouches[0].clientX - touchStartX.current;

    if (delta > 50) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    } else if (delta < -50) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }

    touchStartX.current = null;
  };

  // Render condicional fuera de Hooks
  if (!room) return <p className="not-found">{t("roomDetail.notFound")}</p>;

  return (
    <div className="room-detail-container">
      {/* Botón atrás */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← {t("roomDetail.back")}
      </button>

      {/* Título */}
      <h1 className="room-title">{room.name}</h1>

      {/* Galería tipo Airbnb */}
      {images.length > 0 && (
        <div className="room-gallery">
          {images.slice(0, 5).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${room.name} ${i + 1}`}
              onClick={() => setLightboxIndex(i)}
              onError={(e) => (e.currentTarget.src = "/photos/placeholder.png")}
            />
          ))}
        </div>
      )}

      {/* Información básica */}
      <div className="room-info">
        {room.size && (
          <p className="info-line">
            <SvgSize />
            {t("roomDetail.size", { size: room.size })}
          </p>
        )}

        {room.rating && (
          <p className="info-line">
            <SvgStar />
            {t("roomDetail.rating", {
              rating: room.rating,
              reviewsCount: room.reviewsCount,
            })}
          </p>
        )}

        <p className="room-summary">{room.summary || room.description}</p>

        {room.price && (
          <p className="info-line room-price">
            <SvgPrice />
            <strong>{t("roomDetail.priceLabel")}:</strong> {room.price}
          </p>
        )}
      </div>

      {/* Secciones */}
      <div className="room-sections">
        {room.views?.length > 0 && (
          <div className="room-section">
            <h3>{t("roomDetail.views")}</h3>
            <ul>
              {room.views.map((v, i) => (
                <li className="section-item" key={i}>
                  <SvgView />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        )}

        {room.amenities?.length > 0 && (
          <div className="room-section">
            <h3>{t("roomDetail.amenities")}</h3>
            <ul>
              {room.amenities.map((a, i) => (
                <li className="section-item" key={i}>
                  <SvgCheck />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {room.bathroom?.length > 0 && (
          <div className="room-section">
            <h3>{t("roomDetail.bathroom")}</h3>
            <ul>
              {room.bathroom.map((item, i) => (
                <li className="section-item" key={i}>
                  <SvgBath />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Información extendida */}
      <div className="room-extra">
        {room.capacity && (
          <p className="info-line">
            <SvgPeople />
            <strong>{t("roomDetail.capacity")}:</strong> {room.capacity}
          </p>
        )}

        {room.bed && (
          <p className="info-line">
            <SvgBed />
            <strong>{t("roomDetail.bed")}:</strong> {room.bed}
          </p>
        )}

        {room.cancellation && (
          <p className="info-line">
            <SvgCancel />
            {room.cancellation}
          </p>
        )}

        {room.payment && (
          <p className="info-line">
            <SvgCard />
            {room.payment}
          </p>
        )}

        {room.breakfast && (
          <p className="info-line">
            <SvgBreakfast />
            {room.breakfast}
          </p>
        )}

        {room.availability && (
          <p className="info-line">
            <SvgPin />
            {room.availability}
          </p>
        )}

        {room.nights && (
          <p className="info-line">
            <SvgMoon />
            {room.nights}
          </p>
        )}

        {room.priceDetail && (
          <p className="info-line">
            <SvgCoin />
            {room.priceDetail}
          </p>
        )}
      </div>

      {/* Botón de reserva */}
      <button
        className="reserve-btn"
        onClick={() => {
          navigate("/");
          setTimeout(() => {
            const bookingForm = document.getElementById("booking-form");
            if (bookingForm) bookingForm.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
      >
        {t("rooms.button")}
      </button>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="lightbox"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cerrar */}
          <span
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
          >
            <span className="close-text">{t("lightbox.close")} </span>
            <svg className="close-icon" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          {/* Flecha izquierda */}
          <span
            className="lightbox-arrow left"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + images.length) % images.length,
              );
            }}
          >
            ‹
          </span>

          {/* Imagen central */}
          <img
            src={images[lightboxIndex]}
            alt="fullsize"
            className="lightbox-image"
          />
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Flecha derecha */}
          <span
            className="lightbox-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
          >
            ›
          </span>

          {/* Miniaturas */}
          <div className="lightbox-thumbnails">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className={
                  "lightbox-thumb " +
                  (i === lightboxIndex ? "lightbox-thumb-active" : "")
                }
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;

// SVG ICONS
const SvgSize = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 3h18v2H3zm0 16h18v2H3zM3 7h2v10H3zm16 0h2v10h-2z" />
  </svg>
);
const SvgStar = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l3 7 7 .6-5 4.9L18 22l-6-3.3L6 22l1-7.5-5-4.9 7-.6z" />
  </svg>
);
const SvgBath = () => (
  <svg viewBox="0 0 24 24">
    <path d="M7 3a3 3 0 016 0v3H7zm13 6v5a5 5 0 01-10 0V9H3v5h2a7 7 0 0014 0h2V9z" />
  </svg>
);
const SvgView = () => (
  <svg viewBox="0 0 32 32">
    <path d="M28 2a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2H4v15.5h.19c.37-.04.72-.17 1-.38l.14-.11A3.98 3.98 0 0 1 8 18c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 18c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 18c.99 0 1.94.35 2.67 1 .35.33.83.5 1.33.5v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 20c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 20c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 20c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1v3h.19c.37-.04.72-.17 1-.38l.14-.11A3.98 3.98 0 0 1 8 23c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 23c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 23c.99 0 1.94.35 2.67 1 .35.33.83.5 1.33.5v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 25c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 25c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 25c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1V28h24zm-6 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
  </svg>
);
const SvgCheck = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 6l-11 11-5-5 2-2 3 3 9-9z" />
  </svg>
);
const SvgPrice = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 1L3 9l9 14 9-14z" />
  </svg>
);
const SvgPeople = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="9" cy="8" r="4" />
    <path d="M17 11a4 4 0 110-8 4 4 0 010 8z" />
    <path d="M2 22a7 7 0 0114 0H2zm16 0a6 6 0 00-6-6" />
  </svg>
);
const SvgBed = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 7h18v10H3zm2 2v3h5V9zm7 0v3h7V9z" />
  </svg>
);
const SvgCancel = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm5 13l-8-8m8 0l-8 8" />
  </svg>
);
const SvgCard = () => (
  <svg viewBox="0 0 24 24">
    <path d="M2 6h20v12H2zm0 4h20" />
  </svg>
);
const SvgBreakfast = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 10h16v2H4zm2 4h12v6H6zM9 4a3 3 0 016 0v2H9z" />
  </svg>
);
const SvgPin = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);
const SvgMoon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2a9 9 0 100 18A7 7 0 0112 2z" />
  </svg>
);
const SvgCoin = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
  </svg>
);
