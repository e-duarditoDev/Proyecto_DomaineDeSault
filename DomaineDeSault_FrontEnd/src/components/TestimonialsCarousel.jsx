import React, { useState, useEffect } from "react";
// Importamos React y los hooks useState y useEffect para manejar estado y efectos secundarios.

import { useTranslation } from "react-i18next";
// Importamos useTranslation para traducir textos según el idioma activo.

import "./TestimonialsCarousel.css";
// Importamos la hoja de estilos específica para este carrusel de testimonios.

const ratings = [
  {
    site: "Booking.com",
    score: "⭐ 9.6/10",
    link: "https://www.booking.com/hotel/fr/domaine-de-sault.es.html?...",
  },
  {
    site: "LastMinute",
    score: "⭐ 9.6/10",
    link: "https://www.fr.lastminute.com/hotel/france/dore-l-eglise/domaine-de-sault_hid-10504416",
  },
  {
    site: "TripAdvisor",
    score: "⭐ 4.7/5",
    link: "https://www.tripadvisor.fr/Hotel_Review-g2545280-d5049482-Reviews-Domaine_De_Sault-Dore_l_Eglise_Puy_de_Dome_Auvergne_Rhone_Alpes.html?m=19905",
  },
  {
    site: "Google",
    score: "⭐ 4.6/5",
    link: "https://www.google.com/travel/search?q=Domaine%20de%20Sault&hl=es-FR&gl=fr&...",
  },
];
// Creamos un arreglo con las puntuaciones de distintas plataformas, incluyendo el sitio, la puntuación y el enlace.

const testimonials = [
  {
    text: "Breakfast is excellent! Everything like a dream!",
    author: "Juichun, Switzerland",
  },
  {
    text: "Fabulous old buildings in an idyllic setting with great view. The rooms are full of character and beautifully decorated. The hostess is extremely friendly and helpful. The pool is gorgeous with an idyllic view. The breakfast was wonderful",
    author: "Kathy, United Kingdom",
  },
  {
    text: "Eine wunderschöne Oase mitten in der Auvergne. Tolle individuelle Zimmer mit großem Komfort. Sehr schöner Swimmingpool und toller Außenbereich mit Open Air Gästeküche. Das Frühstück ist großartig. Sylvie und Philippe sind die besten Gastgeber, die man sich wünschen kann. Super großzügig und hilfsbereit als wir eine Autopanne hatten. Dickes Dankeschön für alles! Wir kommen gerne wieder.",
    author: "Shirin, Deutschland",
  },
  {
    text: "Sylvie et Philippe feront de votre séjour un véritable moment de détente. Entre la piscine, le confort des lieux, les prestations proposées et celles suggérées, nous avons vécu trois jours exceptionnels.",
    author: "Anne, France",
  },
  {
    text: "Très bon accueil. Site magnifique et très calme. Excellent petit dejeuner et chambre très agréable avec une vue magnifique !",
    author: "Hervé, France",
  },
  {
    text: "Tout. Une Très belle chambre dans une ancienne maison de pays en pierre. Magnifique terrasse pour petit déjeuner avec une cuisine à dispo pour dîner sur place.",
    author: "Ptilie, France",
  },
  {
    text: "Jedem zu empfehlen, der einen Urlaub in der Natur machen möchte. Aussergewöhnliche Lage in der Natur.",
    author: "Rolf, Deutschland",
  },
  {
    text: "Ambiance fantastique, très belle piscine et chambres confortables et calmes. Très bon accueil et petit déjeuner savoureux.",
    author: "Avis LastMinute, France",
  },
  {
    text: "La belleza del lugar, el trato. El desayuno un 10",
    author: "Carlota, España",
  },
];
// Creamos un arreglo de testimonios con texto y autor para mostrar en el carrusel.

const TestimonialsCarousel = () => {
  // Definimos el componente funcional del carrusel de testimonios.

  const { t } = useTranslation();
  // Obtenemos la función t para traducir textos según el idioma.

  const [current, setCurrent] = useState(0);
  // Creamos un estado para almacenar el índice del testimonio que se muestra actualmente.

  // Auto slide cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
    // Creamos un efecto para cambiar automáticamente el testimonio cada 6 segundos.
    // Limpiamos el intervalo cuando el componente se desmonta.
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  // Función para pasar al siguiente testimonio de forma circular.

  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  // Función para retroceder al testimonio anterior de forma circular.

  return (
    <section id="reviews" className="reviews-section">
      {/* Sección principal de testimonios */}
      <h4 className="reviews-title">
        {t("reviews.title", "Opiniones de nuestros huéspedes")}
      </h4>
      {/* Mostramos el título de la sección traducido */}

      {/* Ratings */}
      <div className="ratings-summary">
        {ratings.map((r, idx) => (
          <a
            key={idx}
            href={r.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rating-card"
          >
            <strong>{r.score}</strong>
            <span>{r.site}</span>
          </a>
        ))}
      </div>
      {/* Mostramos las puntuaciones de distintos sitios con enlace a la plataforma correspondiente */}

      {/* Carrusel */}
      <div className="testimonials-carousel">
        <div className="carousel-container">
          <button className="nav-btn left" onClick={prev}>
            ❮
          </button>
          {/* Botón para ir al testimonio anterior */}

          <div className="testimonial-card">
            <p className="testimonial-text">“{testimonials[current].text}”</p>
            <span className="testimonial-author">
              — {testimonials[current].author}
            </span>
          </div>
          {/* Mostramos el testimonio actual con su autor */}

          <button className="nav-btn right" onClick={next}>
            ❯
          </button>
          {/* Botón para ir al siguiente testimonio */}
        </div>

        <div className="dots">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === current ? "active" : ""}`}
              onClick={() => setCurrent(idx)}
            ></span>
          ))}
        </div>
        {/* Indicadores tipo “punto” para seleccionar un testimonio directamente */}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
// Exportamos el componente para poder usarlo en otras partes de la aplicación.
