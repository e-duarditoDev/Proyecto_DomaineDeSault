// Importamos useTranslation para traducir los textos del componente según el idioma activo.
import { useTranslation } from "react-i18next";

// Importamos useNavigate para poder navegar programáticamente a las páginas de detalle de habitación.
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

// Importamos la hoja de estilos específica para esta sección de habitaciones.
// Importamos el componente ImageSlider para mostrar imágenes en un slider.
import "./RoomsSection.css";

import ImageSlider from "./ImageSlider";


// Definimos el componente funcional RoomsSection.
const RoomsSection = () => {

  // Obtenemos la función t para traducir textos en este componente.
  const { t } = useTranslation();

  // Creamos la función navigate para redirigir a la página de detalle de cada habitación.
  const navigate = useNavigate();

  // Estado local para almacenar la lista de habitaciones del bakcend.
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    // Función asíncrona para cargar las habitaciones desde el backend.    
    const cargarHabitaciones = async () => {
      try {

        const response = await fetch("/api/habitacion/todas");

        if (!response.ok) {
          throw new Error(`${response.statusText}`);
        }
        const data = await response.json();

        console.log("Habitaciones cargadas:", data);

        setHabitaciones(data);
      } catch (error) {
        console.error("Error al cargar las habitaciones:", error);
      }
    };
    cargarHabitaciones();
  }, []);

  console.log("Estado habitaciones:", habitaciones);


  // Obtenemos la lista de habitaciones desde las traducciones y la convertimos en objeto.
  // Si no existe, usamos un objeto vacío para evitar errores.
  const roomsObj = t("rooms.list", { returnObjects: true }) || {};

  // Obtenemos las claves de las habitaciones para iterar sobre ellas.
  const roomKeys = Object.keys(roomsObj);


  // Si no hay habitaciones disponibles, mostramos un mensaje informativo.
  if (roomKeys.length === 0) return <p>No hay habitaciones que mostrar.</p>;

  {/* Sección principal de habitaciones */ }
  return (
    <section id="lodging" className="rooms-section">

      {/* Mostramos el título de la sección traducido */}
      <h2 className="rooms-title">{t("rooms.title")}</h2>

      {/* Contenedor en cuadrícula para las tarjetas de las habitaciones */}
      <div className="rooms-grid">

        {roomKeys.map((key, index) => {
          // Obtenemos los datos de la habitación actual según su clave.
          const room = roomsObj[key];

          // Obtenemos el nombre de la habitación en el backend para mapearlo con la clave de i18n.
          const habitacionBackend = habitaciones[index];

          // Obtenemos las características de la habitación, si existen.
          const features = room.features || [];

          {/* Tarjeta individual de la habitación */ }
          return (
            <div key={key} className="room-card">

              {/* <img
                src={room.image || "/photos/placeholder.png"}
                alt={room.name || key}
                className="room-img"
                onClick={() => navigate(`/room/${key}`)}
                onError={(e) => (e.target.src = "/photos/placeholder.png")}
              /> */}

              {/* Imagen de la habitación; si falla, mostramos un placeholder.
                  Al hacer clic navegamos a la página de detalle. */}
              <ImageSlider
                images={
                  room.images || [room.image] || ["/photos/placeholder.png"]
                }
                interval={6000}
                onClick={() => navigate(`/room/${habitacionBackend?.idHabitacion || key}`)}
                onError={(e) => (e.target.src = "/photos/placeholder.png")}
              />

              {/* Contenedor del contenido textual de la tarjeta */}
              <div className="room-content">
                <h3
                  className="room-name"
                  onClick={() => navigate(`/room/${key}`)}
                >
                  
                  {habitacionBackend ?.nombre || room.name || key}
                </h3>

                {/* Mostramos la descripción de la habitación si existe */}
                <p className="room-description">{room.description || ""}</p>

                {/* Si hay características definidas, las mostramos en una lista con iconos. */}
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

                {/* Mostramos el precio de la BBDD, sino el dedl front */}
                {habitacionBackend?.precioNoche ? (
                  <p className="room-price">
                    {habitacionBackend.precioNoche}&nbsp; 
                    {room.price ? room.price.replace(/^\d+/, "") : ""}
                    </p>
                ) :
                room.price && <p className="room-price">{room.price}</p>}
                
                {/* Botón para reservar; al hacer clic navegamos a la página de detalle */}
                <button
                  className="room-btn"
                  onClick={() => navigate(`/room/${habitacionBackend?.idHabitacion || key}`)}
                >
                  {t("rooms.button", "Reservar ahora")}
                </button>
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
