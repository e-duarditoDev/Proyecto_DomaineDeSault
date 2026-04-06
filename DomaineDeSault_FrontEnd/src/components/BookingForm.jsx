import React, { useState, useRef, useEffect } from "react";
// Importamos React y los hooks useState (para manejar estados), useRef (para referencias a elementos del DOM) y useEffect (para ejecutar efectos secundarios).

import DatePicker from "react-datepicker";
// Importamos el componente DatePicker, que nos permite seleccionar fechas de forma visual.

import "react-datepicker/dist/react-datepicker.css";
// Importamos los estilos por defecto del calendario de react-datepicker.

import "./BookingForm.css";
// Importamos los estilos personalizados del formulario de reserva.

import { useTranslation } from "react-i18next";
// Importamos el hook de traducción useTranslation, para usar textos multilenguaje desde los archivos de i18next.

import { es, fr, enGB, de } from "date-fns/locale";
// Importamos los idiomas (locales) disponibles para el DatePicker desde date-fns.

// ---------------------------------------------
// Componente principal BookingForm
// ---------------------------------------------
const BookingForm = ({ onSearch }) => {
  const { t, i18n } = useTranslation();
  // Obtenemos la función de traducción "t" y el objeto "i18n" que maneja el idioma actual.

  const [dateRange, setDateRange] = useState([null, null]);
  // Creamos un estado que almacena el rango de fechas seleccionado (check-in y check-out).

  const [startDate, endDate] = dateRange;
  // Desestructuramos el array anterior en dos variables: fecha de inicio y fecha final.

  const [hoveredDate, setHoveredDate] = useState(null);
  // Estado que almacena la fecha sobre la que el usuario pasa el ratón (para mostrar tooltip de noches).

  const [showCalendar, setShowCalendar] = useState(false);
  // Estado que controla si el calendario está visible o no.

  const [guests, setGuests] = useState(1);
  // Estado que guarda el número de huéspedes seleccionados.

/*   const [children, setChildren] = useState(0);
  // Estado que guarda el número de niños seleccionados. */

  const [rooms, setRooms] = useState(1);
  // Estado que guarda el número de habitaciones seleccionadas.

  // const [promoCode, setPromoCode] = useState("");
  // Estado que guarda el texto del código promocional ingresado.

  // Fechas ocupadas de todas las habitaciones y total de habitaciones (para disponibilidad general)
  const [todasFechasOcupadas, setTodasFechasOcupadas] = useState([]);
  const [totalHabitaciones, setTotalHabitaciones] = useState(0);

  const formRef = useRef();
  // Creamos una referencia al formulario, para detectar clics fuera del mismo y cerrar el calendario.

  const localesMap = { es, fr, en: enGB, de };
  // Mapa de idiomas: relaciona los códigos ISO de idioma con los objetos de configuración importados.

  const currentLang = i18n.language.split("-")[0];
  // Extraemos el código de idioma actual (por ejemplo, "es" de "es-ES").

  const currentLocale = localesMap[currentLang] || enGB;
  // Seleccionamos el locale correspondiente al idioma actual, o inglés por defecto.

  useEffect(() => {
    // useEffect se ejecuta cuando el componente se monta.
    const handleClickOutside = (event) => {
      // Esta función se ejecuta al hacer clic en cualquier parte de la página.
      if (formRef.current && !formRef.current.contains(event.target)) {
        // Si el clic ocurre fuera del formulario, cerramos el calendario.
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // Agregamos el evento "mousedown" al documento para detectar clics fuera.
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // Limpiamos el evento cuando el componente se desmonta.
  }, []);
  // El array vacío hace que este efecto se ejecute solo una vez (al montar y desmontar).

  // Carga la disponibilidad general al montar el componente
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const [resFechas, resHabitaciones] = await Promise.all([
          fetch("/api/habitacion/disponibilidad/todas"),
          fetch("/api/habitacion/todas")
        ]);
        if (resFechas.ok) {
          const fechas = await resFechas.json();
          setTodasFechasOcupadas(fechas);
        }
        if (resHabitaciones.ok) {
          const habitaciones = await resHabitaciones.json();
          setTotalHabitaciones(habitaciones.length);
        }
      } catch (error) {
        console.error("Error cargando disponibilidad:", error);
      }
    };
    fetchDisponibilidad();
  }, []);

  const handleSearch = () => {
    if (!startDate || !endDate) return;

    // Calcular qué habitaciones tienen solapamiento con el rango seleccionado
    const unavailableIds = new Set();
    for (const slot of todasFechasOcupadas) {
      const entrada = parseBackendDate(slot.fechaEntrada);
      const salida = parseBackendDate(slot.fechaSalida);
      // Solapamiento: la reserva empieza antes de que termine la búsqueda
      // y termina después de que empiece la búsqueda
      if (entrada < endDate && salida > startDate) {
        unavailableIds.add(Number(slot.idHabitacion));
      }
    }

    onSearch?.({ active: true, unavailableIds: [...unavailableIds] });

    // Desplazar a la sección de habitaciones
    document.getElementById("lodging")?.scrollIntoView({ behavior: "smooth" });
    setShowCalendar(false);
  };

  // Convierte fecha del backend (array [a,m,d] o string "YYYY-MM-DD") a Date
  const parseBackendDate = (d) => {
    if (Array.isArray(d)) return new Date(d[0], d[1] - 1, d[2]);
    return new Date(d + "T00:00:00");
  };


  const isDateAvailable = (date) => {
    // No permitir fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    // Si aún no hay datos del backend, permitir todas las fechas
    if (totalHabitaciones === 0) return true;

    // Contar cuántas habitaciones distintas están ocupadas ese día
    const ocupadas = new Set();
    for (const slot of todasFechasOcupadas) {
      const entrada = parseBackendDate(slot.fechaEntrada);
      const salida = parseBackendDate(slot.fechaSalida);
      // entrada <= date < salida (el día de salida queda libre para nuevas entradas)
      if (date >= entrada && date < salida) {
        ocupadas.add(slot.idHabitacion);
      }
    }
    // El día está bloqueado solo si TODAS las habitaciones están ocupadas
    return ocupadas.size < totalHabitaciones;
  };

  const calculateNights = (start, end) => {
    // Función que calcula la cantidad de noches entre dos fechas.
    if (!start || !end) return 0;
    // Si falta una fecha, devolvemos 0 noches.
    const diffTime = end - start;
    // Calculamos la diferencia en milisegundos.
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    // Convertimos la diferencia a días (noches) y redondeamos hacia arriba.
  };

  return (
    // Estructura visual del componente:
    <section className="booking-form section" id="book" ref={formRef}>
      {/* Título invisible para lectores de pantalla (accesibilidad) */}
      {/* <h2 className="screen-reader-text">{t("book.titleh2")}</h2> */}

      <div className="booking-controls">
        {/* Campos de entrada principales del formulario */}

        {/* Fecha de entrada */}
        <label>
          {t("book.checkInLabel")}
          <input
            type="text"
            readOnly
            value={
              startDate
                ? startDate.toLocaleDateString(currentLang)
                : t("book.checkIn")
            }
            // Mostramos la fecha seleccionada o el texto por defecto si no hay fecha.
            onClick={() => setShowCalendar(true)}
            // Al hacer clic, mostramos el calendario.
          />
        </label>

        {/* Fecha de salida */}
        <label>
          {t("book.checkOutLabel")}
          <input
            type="text"
            readOnly
            value={
              endDate
                ? endDate.toLocaleDateString(currentLang)
                : t("book.checkOut")
            }
            // Mostramos la fecha de salida o el texto por defecto.
            onClick={() => setShowCalendar(true)}
            // Al hacer clic, también abrimos el calendario.
          />
        </label>

        {/* Número de noches */}
        {/* <label>
          {t("book.nights")}
          <input
            type="text"
            readOnly
            value={calculateNights(startDate, endDate)}
          />
        </label> */}
        {/* Campo que muestra automáticamente cuántas noches hay entre ambas fechas */}

        {/* Número de habitaciones */}
        <label>
          {t("book.rooms")}
          <select
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
          >
            {/* Generamos 5 opciones de 1 a 5 habitaciones */}
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        {/* Número de huéspedes */}
        <label>
          {t("book.guests")}
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {/* Generamos 5 opciones de 1 a 5 huéspedes */}
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        {/* Número de niños */}
        {/*<label>
          {t("book.children")}
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          >*/}
            {/* Generamos 5 opciones de 0 a 4 niños */}
            {/*{[...Array(5)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>*/}

        {/* Código promocional */}
        {/* <label>
          {t("book.promoCode")}
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder={t("book.promoCode")}
          />
        </label> */}

        {/* Botón de búsqueda */}
        <button className="booking-search-btn" onClick={handleSearch}>
          {t("book.search")}
        </button>
      </div>

      {/* Si showCalendar es true, mostramos el calendario superpuesto */}
      {showCalendar && (
        <div className="calendar-overlay">
          <DatePicker
            locale={currentLocale}
            // Configuramos el idioma del calendario según el idioma actual.
            selectsRange
            // Activamos el modo de selección de rango (entrada y salida).
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              // Cada vez que cambia la selección, actualizamos el estado de fechas.
              setDateRange(update);
              if (update[1]) setShowCalendar(false);
              // Si el usuario ya seleccionó la fecha final, cerramos el calendario.
            }}
            filterDate={isDateAvailable}
            // Aplicamos la función que bloquea fechas no disponibles.
            inline
            // Mostramos el calendario embebido (no como popup).
            onDayMouseEnter={(date) => setHoveredDate(date)}
            // Guardamos la fecha sobre la que el usuario pasa el ratón.
            onDayMouseLeave={() => setHoveredDate(null)}
            // Limpiamos el estado cuando deja de pasar el ratón.
            renderDayContents={(day, date) => {
              // Personalizamos cómo se muestra cada día en el calendario.
              const nights =
                startDate && !endDate && hoveredDate
                  ? calculateNights(startDate, date)
                  : 0;
              // Calculamos las noches si el usuario está eligiendo aún la fecha final.
              return (
                <div
                  className="day-with-tooltip"
                  data-tooltip={
                    nights > 0 ? t("nights", { count: nights }) : ""
                  }
                >
                  {day}
                </div>
              );
            }}
          />
        </div>
      )}
    </section>
  );
};

// Exportamos el componente para que pueda ser utilizado en otros archivos.
export default BookingForm;
