import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es, fr, enGB, de } from "date-fns/locale";
import "./RoomReservation.css";

const RoomReservation = () => {
  const { t, i18n } = useTranslation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const roomsObj = t("rooms.list", { returnObjects: true }) || {};
  const room = roomsObj[roomId];

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState(1);

  const formRef = useRef(null);

  const localesMap = { es, fr, en: enGB, de };
  const currentLang = i18n.language.split("-")[0];
  const currentLocale = localesMap[currentLang] || enGB;

  // Estado para controlar el hover del botón de retroceso
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const parseCapacity = (capacityText) => {
    if (!capacityText) return 1;
    const match = String(capacityText).match(/\d+/);
    return match ? Number(match[0]) : 1;
  };

  const parsePrice = (priceText) => {
    if (!priceText) return 0;
    const match = String(priceText).replace(",", ".").match(/(\d+(\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  };

  const capacity = parseCapacity(room?.capacity);
  const pricePerNight = parsePrice(room?.price);

  // Calcular noches y precio total usando useMemo para optimizar rendimiento
  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diffTime = endDate - startDate;
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    return nights > 0 ? pricePerNight * nights : 0;
  }, [nights, pricePerNight]);

  if (!room) {
    return <p className="text-center mt-5 pt-5">Habitación no encontrada.</p>;
  }

  if (!room) {
    return <p className="text-center mt-5 pt-5">Habitación no encontrada.</p>;
  }

  // Función para enviar la reserva al backend
  const enviarReserva = async (accion) => {
    const token = localStorage.getItem("token"); // Recuperamos token

    const reservaRequestDto = {
      idHabitacion: 1,//parseInt(roomId), // Aseguramos que sea numérico
      numHuespedes: guests,
      fechaEntrada: startDate.toISOString().split('T')[0],
      fechaSalida: endDate.toISOString().split('T')[0],
      accion: accion
    };

    try {
      // Ajusta la URL "/api/reserva/reservar-habitacion" a la que tengas configurada en tu Spring Boot
      const response = await fetch("/api/reserva/reservar-habitacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaRequestDto)
      });

      if (!response.ok) {
        // Si Spring devuelve una excepción, la capturamos aquí
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al procesar la reserva");
      }

      // Si todo va bien
      alert(`Reserva ${accion === 'PAGAR' ? 'pagada' : 'guardada'} con éxito`);
      navigate("/mis-reservas"); // Redirigimos a la ruta del cliente

    } catch (error) {
      alert(error.message);
    }
  };


  const handleGuardar = () => {
    enviarReserva("GUARDAR");
  };

  const handlePagar = () => {
    enviarReserva("PAGAR");
  };

  return (
    <div className="room-reservation-page">
      <div className="room-reservation-card" ref={formRef}>
        <button
          className="reservation-back-btn d-flex flex-row align-items-center gap-2"
          onClick={() => navigate(`/room/${roomId}`)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="icon-container">
            <img src="/icons/left-arrow-previous-black.svg"
              className={`back-icon ${isHovered ? 'hidden' : 'visible'}`}
              alt="flecha atras negra" />

            <img src="/icons/left-arrow-previous-blue.svg"
              className={`back-icon ${isHovered ? 'visible' : 'hidden'}`}
              alt="flecha atras azul" />
          </div>
          Atras
        </button>

        <div className="reservation-header">
          <div>
            <h1>{room.name}</h1>
            <p className="reservation-subtitle">Configura tu reserva</p>
          </div>

          {room.image || room.images?.[0] ? (
            <img
              src={room.image || room.images[0]}
              alt={room.name}
              className="reservation-room-image"
            />
          ) : null}
        </div>

        <div className="reservation-form-grid">
          <label>
            Fecha de entrada
            <input className="form-control"
              type="text"
              readOnly
              value={startDate ? startDate.toLocaleDateString(currentLang) : "Selecciona fecha"}
              onClick={() => setShowCalendar(true)}
            />
          </label>

          <label>
            Fecha de salida
            <input className="form-control"
              type="text"
              readOnly
              value={endDate ? endDate.toLocaleDateString(currentLang) : "Selecciona fecha"}
              onClick={() => setShowCalendar(true)}
            />
          </label>

          <label>
            Huéspedes
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="form-switch py-3 focus-ring">
              {Array.from({ length: capacity }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label>
            Noches
            <input type="text" readOnly value={nights} className="form-control" />
          </label>
        </div>

        {showCalendar && (
          <div className="reservation-calendar">
            <DatePicker
              locale={currentLocale}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
                if (update[1]) setShowCalendar(false);
              }}
              minDate={new Date()}
              inline
            />
          </div>
        )}

        <div className="reservation-summary">
          <div>
            <p><strong>Capacidad máxima:</strong> {capacity} huésped(es)</p>
            {/* Aquí se muestra el precio por noche, que se obtiene del objeto de la habitación */}
            <p><strong>Precio/noche:</strong> €{pricePerNight.toFixed(2)}</p>
          </div>

          <div className="reservation-total-box">
            <span>Total</span>
            {/* Aquí se muestra el precio total de la reserva */}
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>
        </div>

        <div className="reservation-actions">
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(`/room/${roomId}`)}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={handleGuardar}
            disabled={!startDate || !endDate}
          >
            Guardar
          </button>

          <button
            type="button"
            className="btn btn-dark px-4"
            onClick={handlePagar}
            disabled={!startDate || !endDate}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomReservation;