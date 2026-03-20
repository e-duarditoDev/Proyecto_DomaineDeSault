import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es, fr, enGB, de } from "date-fns/locale";
import "./RoomReservation.css";
import { logout } from "../../utils/auth"; //Importa la función de logout para el cierre de sesión expirado el token


const RoomReservation = () => {
  const { t, i18n } = useTranslation();
  const { idHabitacion } = useParams();//lo coge de la url, se referencia en el app.jsx
  const navigate = useNavigate();

  // ESTADOS
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState(1);
  const [habitacionData, setHabitacionData] = useState(null);

  // Estado para controlar el hover del botón de retroceso
  const [isHovered, setIsHovered] = useState(false);
  // Estado para el popup (Añádelo al principio del componente)
  const [popup, setPopup] = useState({ show: false, message: "", isError: false });

  const formRef = useRef(null);

  // TRADUCCIONES Y LOGICA DE NEGOCIO
  //const roomsObj = t("rooms.list", { returnObjects: true }) || {}; eliminar?
  //const room = roomsObj[roomName]; eliminar?

  const localesMap = { es, fr, en: enGB, de };
  const currentLang = i18n.language.split("-")[0];
  const currentLocale = localesMap[currentLang] || enGB;


  useEffect(() => {

    // Función para cargar la información de la habitación desde el backend
    const fetchHabitacionInfo = async () => {
      try {
        const token = localStorage.getItem("token");// Obtener el token del almacenamiento local
        const response = await fetch(`/api/habitacion/info/${idHabitacion}`, {// Esta ruta coincide con la de tu backend
          headers: {
            "Authorization": `Bearer ${token}`// Incluir el token en la cabecera de autorización
          }
        });

        if (!habitacionData?.idHabitacion) {
          setPopup({
            show: true,
            message: "No se pudo recuperar la habitación. Recarga la página e inténtalo de nuevo.",
            isError: true
          });
          return;
        }

        if (!response.ok)
          throw new Error("No encontrada");

        const data = await response.json();

        setHabitacionData(data);
      } catch (error) {
        console.error("Error cargando info:", error);
      }
    };

    // Solo cargar info si se tiene un nombre valido, evita llamadas innecesarias a la API
    if (roomName) {
      fetchHabitacionInfo();
    }

    // Lógica del click de cerrar el calendario separada
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [roomName]);// Se ejecuta al montar el componente y cada vez que cambia el roomName



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

  // FUNCIONES DE ACCION

  // Función para enviar la reserva (puedes colocarla dentro del componente)
  const enviarReserva = async (accion) => {
    const token = localStorage.getItem("token");

    /*  // Validación previa en cliente antes de enviar. El calendario impide se ejecute
        if (!startDate || !endDate) {
          setModal({ show: true, message: "Por favor, selecciona las fechas.", isError: true });
          return;
        } */

    const reservaRequestDto = {
      // Usar el estado de habitacionData QUE RELLENÓ EL USEEFFECT
      idHabitacion: parseInt(habitacionData?.idHabitacion), // Aseguramos que sea numérico
      numHuespedes: guests,
      fechaEntrada: startDate.toISOString().split('T')[0],
      fechaSalida: endDate.toISOString().split('T')[0],
      accion: accion
    };

    try {
      const response = await fetch("/api/reserva/reservar-habitacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaRequestDto)
      });

      // Sesión expirada: logout automático
      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      // Captura el mensaje del backend
      const responseText = await response.text();

      if (!response.ok) {
        setPopup({
          show: true,
          message: responseText || "Ha ocurrido un error.",
          isError: true
        });
        return;
      }

      // Si la respuesta es OK (200/201)
      setPopup({
        show: true,
        message: responseText || `Reserva ${accion === 'PAGAR' ? 'pagada' : 'guardada'} con éxito.`,
        isError: false
      });

    } catch (error) {
      setPopup({
        show: true,
        message: "Error de conexión: " + error.message,
        isError: true
      });
    }
  };

  const handleGuardar = () => {
    enviarReserva("GUARDAR");
  };

  const handlePagar = () => {
    enviarReserva("PAGAR");
  };

  // Función para manejar el cierre y la navegación
  const manejarCierrePopup = () => {
    const exito = !popup.isError;
    setPopup({ ...popup, show: false });
    if (exito) {
      navigate("/");
    }
  };

  if (!room) {
    return <p className="text-center mt-5 pt-5">Habitación no encontrada.</p>;
  }

  return (
    <div className="room-reservation-page">
      <div className="room-reservation-card" ref={formRef}>
        <button
          className="reservation-back-btn d-flex flex-row align-items-center gap-2"
          onClick={() => navigate(`/room/${roomName}`)}
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
            onClick={() => navigate(`/room/${roomName}`)}
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

      {popup.show && (
        <div className="card d-flex justify-content-center align-items-center vw-100 vh-100 fixed-top">
          <div className="bg-white rounded-4 shadow border-black w-25 d-flex justify-content-center align-items-center flex-column">
            <div className={`reserva-popup-header ${popup.isError ? 'bg-danger' : 'bg-success'} w-100 ps-3 rounded-top-3 py-3`}>
              {/*             <img className="m-1"
                src={popup.isError ? "/icons/yellow-exclamation-mark.svg" : "/icons/success-check.svg"}
                alt={popup.isError ? "Error" : "Éxito"}
                style={{ width: "20px", height: "20px" }} // Ajusta el tamaño a tu gusto
              /> */}
            </div>
            <div className="text-center p-3 bg-body-tertiary w-100">
              <h3>{popup.isError ? 'Atención' : 'Confirmación'}</h3>
              <p>{popup.message}</p>
              <button className="btn btn-outline-dark" onClick={manejarCierrePopup}>
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomReservation;