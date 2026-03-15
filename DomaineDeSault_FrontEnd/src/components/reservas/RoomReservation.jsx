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


  const handleGuardar = () => {
    console.log("Guardar reserva pendiente", {
      roomId,
      guests,
      fechaEntrada: startDate,
      fechaSalida: endDate,
      accion: "ACEPTAR",
    });
  };

  const handlePagar = () => {
    console.log("Pagar reserva", {
      roomId,
      guests,
      fechaEntrada: startDate,
      fechaSalida: endDate,
      accion: "PAGAR",
    });
  };

  return (
    <div className="room-reservation-page">
      <div className="room-reservation-card" ref={formRef}>
        <button className="reservation-back-btn" onClick={() => navigate(`/room/${roomId}`)}>
          ← Volver a la habitación
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
            <input
              type="text"
              readOnly
              value={startDate ? startDate.toLocaleDateString(currentLang) : "Selecciona fecha"}
              onClick={() => setShowCalendar(true)}
            />
          </label>

          <label>
            Fecha de salida
            <input
              type="text"
              readOnly
              value={endDate ? endDate.toLocaleDateString(currentLang) : "Selecciona fecha"}
              onClick={() => setShowCalendar(true)}
            />
          </label>

          <label>
            Huéspedes
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: capacity }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label>
            Noches
            <input type="text" readOnly value={nights} />
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
            <p><strong>Precio/noche:</strong> €{pricePerNight.toFixed(2)}</p>
          </div>

          <div className="reservation-total-box">
            <span>Total</span>
            <strong>€{totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="reservation-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
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
            className="btn btn-dark"
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