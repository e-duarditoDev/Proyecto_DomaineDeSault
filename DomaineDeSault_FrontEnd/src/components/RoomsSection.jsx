import { useTranslation } from "react-i18next";
// Importamos useTranslation para traducir los textos del componente según el idioma activo.

import { useNavigate } from "react-router-dom";
// Importamos useNavigate para poder navegar programáticamente a las páginas de detalle de habitación.

import "./RoomsSection.css";
// Importamos la hoja de estilos específica para esta sección de habitaciones.
// Importamos el componente ImageSlider para mostrar imágenes en un slider.
import ImageSlider from "./ImageSlider";

const RoomsSection = () => {
  // Definimos el componente funcional RoomsSection.

  const { t } = useTranslation();
  // Obtenemos la función t para traducir textos en este componente.

  const navigate = useNavigate();
  // Creamos la función navigate para redirigir a la página de detalle de cada habitación.

  const roomsObj = t("rooms.list", { returnObjects: true }) || {};
  // Obtenemos la lista de habitaciones desde las traducciones y la convertimos en objeto.
  // Si no existe, usamos un objeto vacío para evitar errores.

  const roomKeys = Object.keys(roomsObj);

  // Obtenemos un arreglo con todas las claves de las habitaciones para iterarlas.

  if (roomKeys.length === 0) return <p>No hay habitaciones disponibles.</p>;
  // Si no hay habitaciones, mostramos un mensaje y detenemos la renderización.

  return (
    <section id="lodging" className="rooms-section">
      {/* Sección principal de habitaciones */}
      <h2 className="rooms-title">{t("rooms.title")}</h2>
      {/* Mostramos el título de la sección traducido */}

      <div className="rooms-grid">
        {/* Contenedor en cuadrícula para las tarjetas de las habitaciones */}
        {roomKeys.map((key) => {
          const room = roomsObj[key];
          // Obtenemos los datos de la habitación actual según su clave.

          const features = room.features || [];
          // Obtenemos las características de la habitación, si existen.

          return (
            <div key={key} className="room-card">
              {/* Tarjeta individual de la habitación */}
              {/* <img
                src={room.image || "/photos/placeholder.png"}
                alt={room.name || key}
                className="room-img"
                onClick={() => navigate(`/room/${key}`)}
                onError={(e) => (e.target.src = "/photos/placeholder.png")}
              /> */}
              <ImageSlider
                images={
                  room.images || [room.image] || ["/photos/placeholder.png"]
                }
                interval={6000}
                onClick={() => navigate(`/room/${key}`)}
                onError={(e) => (e.target.src = "/photos/placeholder.png")}
              />

              {/* Imagen de la habitación; si falla, mostramos un placeholder.
                  Al hacer clic navegamos a la página de detalle. */}

              <div className="room-content">
                {/* Contenedor del contenido textual de la tarjeta */}
                <h3
                  className="room-name"
                  onClick={() => navigate(`/room/${key}`)}
                >
                  {room.name || key}
                </h3>
                {/* Mostramos el nombre de la habitación; al hacer clic navegamos a su detalle */}

                <p className="room-description">{room.description || ""}</p>
                {/* Mostramos la descripción de la habitación si existe */}

                {features.length > 0 && (
                  <ul className="room-features">
                    {/* {console.log(features)}  */}
                    {features.map((feat, idx) => (
                      <li key={idx} className="feature-item">
                        <img
                          src={feat.icon}
                          alt={feat.text}
                          className="feature-icon"
                        />
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Mostramos una lista de características si existen */}

                {room.price && <p className="room-price">{room.price}</p>}
                {/* Mostramos el precio de la habitación si está definido */}

                <button
                  className="room-btn"
                  onClick={() => navigate(`/room/${key}`)}
                >
                  {t("rooms.button", "Reservar ahora")}
                </button>
                {/* Botón para reservar; al hacer clic navegamos a la página de detalle */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RoomsSection;
// Exportamos el componente RoomsSection para usarlo en otras partes de la aplicación.
