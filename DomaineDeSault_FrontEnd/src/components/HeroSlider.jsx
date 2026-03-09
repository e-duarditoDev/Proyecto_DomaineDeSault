// Importamos React y los hooks useState y useEffect
import React, { useState, useEffect } from "react";
// Importamos el hook de traducción i18next
import { useTranslation } from "react-i18next";
// Importamos los estilos CSS del slider
import "./HeroSlider.css";
import BookingForm from "./BookingForm";

// Array de imágenes que se mostrarán en el carrusel
const images = [
  "/photos/slider/piscina2.png",
  "/photos/piscina.jpg",
  "/photos/paisaje.jpg",
  "/photos/fuente.jpg",
];

// Componente principal del slider
const HeroSlider = () => {
  // Obtenemos la función de traducción
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0); // Estado que controla qué imagen está activa en el momento
  const [isVisible, setIsVisible] = useState(true);// transicion entre imagenes

  //const [prevIndex, setPrevIndex] = useState(0);

  // useEffect: se ejecuta al montar el componente
  useEffect(() => {
    // Intervalo que cambia la imagen cada 5 segundos
    const interval = setInterval(() => {
      setIsVisible(false);

      //setPrevIndex(currentIndex);

      setTimeout(() =>{
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsVisible(true);
      }, 350);
  }, 6000);

  // Limpia el intervalo cuando el componente se desmonta
  return () => clearInterval(interval);
}, []); // Solo se ejecuta una vez al montar

// Renderizado del slider
return (
  <div className="hero-slider">
    {/* Contenedor principal del slider */}
    <img
      src={images[currentIndex]} // Muestra la imagen actual
      alt={`Slide ${currentIndex + 1}`} // Texto alternativo dinámico
      className={`hero-image ${isVisible ? "fade-in-image" : "fade-out-image"}`}
    />

    <div className="hero-booking-form">
      <BookingForm />
    </div>

    <div className="hero-text">
      {" "}
      {/* Texto superpuesto en la imagen */}
      <h1>{t("mainTitle")}</h1> {/* Título traducido */}
      <h2>{t("welcome")}</h2> {/* Subtítulo traducido */}
    </div>
  </div>
);
};

// Exportamos el componente para usarlo en otras partes
export default HeroSlider;
