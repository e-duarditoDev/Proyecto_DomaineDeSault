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
  // Estado para el número de huéspedes, inicializado en 1
  const [guests, setGuests] = useState(1);
  // Estado para almacenar la información de la habitación obtenida del backend
  const [habitacionData, setHabitacionData] = useState(null);
  // Estado para controlar el hover del botón de retroceso
  const [isHovered, setIsHovered] = useState(false);
  // Estado para el popup (Añádelo al principio del componente)
  const [popup, setPopup] = useState({ show: false, message: "", isError: false, redirectTo: null, logoutOnClose: false });
  // Estado para controlar la carga del popup de mensajes de error y éxito
  const [loadingHabitacion, setLoadingHabitacion] = useState(true);
  // Estado para redirigir al login si el token ha expirado
  //const [redirectToLogin, setRedirectToLogin] = useState(false);
  // Ref para detectar clicks fuera del calendario y cerrarlo
  const formRef = useRef(null);

  // TRADUCCIONES Y LOGICA DE NEGOCIO
  const localesMap = { es, fr, en: enGB, de };
  const currentLang = i18n.language.split("-")[0];
  const currentLocale = localesMap[currentLang] || enGB;
  const roomsObj = t("rooms.list", { returnObjects: true }) || {};
  const roomKeys = Object.keys(roomsObj);
  const roomIndex = Number(idHabitacion) - 1;
  const roomKey = roomKeys[roomIndex];
  const room = roomsObj[roomKey] || {};


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

        // Si el token ha expirado o es inválido
        if (response.status === 401) {
          setPopup({
            show: true,
            message: t("roomReservation.popup.sessionExpired"),
            isError: true,
            redirectTo: "/login",
            logoutOnClose: true // Indica que se debe hacer logout al cerrar el popup 
          });
          return;
        }

        // Captura el mensaje del backend en caso de error
        if (!response.ok) {
          const errorText = await response.text();
          setPopup({
            show: true,
            message: errorText || t("roomReservation.popup.unexpectedError"),
            isError: true,
            redirectTo: "/",
            logoutOnClose: false
          });
          setHabitacionData(null);
          return;
        }

        const data = await response.json();

        setHabitacionData(data);

      } catch (error) {// Manejo de errores de conexión u otros errores inesperados
        setPopup({
          show: true,
          message: `${t("roomReservation.popup.loadRoomError")} ${error.message}`,
          isError: true
        });
        setHabitacionData(null); // Asegura que el estado de la habitación se limpie si hay un error
      } finally {
        setLoadingHabitacion(false);// Asegura que el estado de carga se actualice incluso si hay un error
      }
    };

    // Solo intentar cargar la información si se tiene un idHabitacion válido
    if (idHabitacion) {
      fetchHabitacionInfo();
    } else {
      setPopup({
        show: true,
        message: t("roomReservation.popup.roomNotFound"),
        isError: true,
        redirectTo: "/",
        logoutOnClose: false
      });
      setLoadingHabitacion(false);
    }


    // Lógica del click de cerrar el calendario separada
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [idHabitacion]);// La funcion se ejecuta solo cuando cambia el idHabitacion, evitando recargas innecesarias de la información de la habitación


  const capacity = Number(habitacionData?.capacidad) || 1;// Asegura que la capacidad sea un número válido, capacidad mismo nombre que el backend
  const pricePerNight = Number(habitacionData?.precioNoche) || 0;// Asegura que el precio por noche sea un número válido, precioNoche mismo nombre que el backend

  // Calcular noches y precio total usando useMemo para optimizar rendimiento
  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diffTime = endDate - startDate;// Diferencia en milisegundos
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;// Comprueba que la diferencia sea positiva para evitar resultados negativos si las fechas se ingresan en orden incorrecto
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    return nights > 0 ? pricePerNight * nights : 0;
  }, [nights, pricePerNight]);


  // FUNCIONES DE ACCION
  // Función para enviar la reserva (puedes colocarla dentro del componente)
  const enviarReserva = async (accion) => {
    const token = localStorage.getItem("token");

    if (!habitacionData) {
      setPopup({
        show: true,
        message: t("roomReservation.popup.roomNotFound"),
        isError: true,
        redirectTo: "/",
        logoutOnClose: false
      });
      return;
    }

    if (!startDate || !endDate) {
      setPopup({
        show: true,
        message: t("roomReservation.popup.selectDates"),
        isError: true,
        redirectTo: null,
        logoutOnClose: false
      });
      return;
    }

    // Construir el DTO de reserva según lo que tu backend espera recibir (mismo DTO que backend)
    const reservaRequestDto = {
      idHabitacion: Number(habitacionData?.idHabitacion),
      numHuespedes: guests,
      fechaEntrada: startDate.toISOString().split('T')[0],
      fechaSalida: endDate.toISOString().split('T')[0],
      accion: accion
    };

    // Enviar la reserva al backend
    try {
      const response = await fetch("/api/reserva/reservar-habitacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaRequestDto)
      });


      // Captura el mensaje del backend
      const responseText = await response.text();

      if (response.status === 401) {
        setPopup({
          show: true,
          message: t("roomReservation.popup.sessionExpired"),
          isError: true,
          redirectTo: "/login",
          logoutOnClose: true
        });
        return;
      }

      if (!response.ok) {
        setPopup({
          show: true,
          message: responseText || t("roomReservation.popup.unexpectedError"),
          isError: true,
          redirectTo: null,
          logoutOnClose: false
        });
        return;
      }

      // Si la respuesta es OK (200/201)
      setPopup({
        show: true,
        message:
          responseText ||
          (accion === "PAGAR"
            ? t("roomReservation.popup.paySuccess")
            : t("roomReservation.popup.saveSuccess")),
        isError: false,
        redirectTo: accion === "PAGAR" ? "/" : "/mis-reservas",// Operador ternario para redirigir a la página principal después de pagar o a mis reservas después de guardar
        logoutOnClose: false
      });

    } catch (error) {
      setPopup({
        show: true,
        message: `${t("roomReservation.popup.connectionError")} ${error.message}`,
        isError: true,
        redirectTo: null,
        logoutOnClose: false
      });
    }
  };

  const handleGuardar = () => {
    enviarReserva("GUARDAR");
  };

  const handlePagar = () => {
    enviarReserva("PAGAR");
  };

  // Función para manejar el cierre del popup al pulsar el botón de continuar
  const manejarCierrePopup = () => {
    const redirectTo = popup.redirectTo;
    const logoutOnClose = popup.logoutOnClose;

    setPopup((prev) => ({ ...prev, show: false })); // Cierra el popup

    if (logoutOnClose) {
      logout(); // Cierra sesión si se indica que el token ha expirado
    }

    if (redirectTo) {
      navigate(redirectTo); // Redirige a la ruta especificada
    }

  };

  // Renderizado condicional para manejar los estados de carga, error y datos de la habitación
  if (loadingHabitacion) {
    return <p className="text-center mt-5 pt-5">{t("roomReservation.loadingRoom")}</p>;
  }

  if (!habitacionData) {
    return popup.show ? (
      <>
        {popup.show && (
          <div className="card d-flex justify-content-center align-items-center vw-100 vh-100 fixed-top">
            <div className="bg-white rounded-4 shadow border-black w-25 d-flex justify-content-center align-items-center flex-column">
              <div className={`reserva-popup-header ${popup.isError ? 'bg-danger' : 'bg-success'} w-100 ps-3 rounded-top-3 py-3`}>
              </div>
              <div className="p-4 text-center">
                <p>{popup.message}</p>
                <button className="btn btn-dark" onClick={manejarCierrePopup}>
                  {t("roomReservation.continue")}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    ) : null;
  }

  // Render de la pagina de reserva de habitación
  return (
    <div className="room-reservation-page">
      <div className="room-reservation-card" ref={formRef}>
        <button
          className="reservation-back-btn d-flex flex-row align-items-center gap-2"
          onClick={() => navigate(`/room/${idHabitacion}`)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="icon-container">
            <img src="/icons/lean-left-arrow-grey.svg"
              className={`back-icon ${isHovered ? 'hidden' : 'visible'}`}
              alt="flecha atras gris" />

            <img src="/icons/lean-left-arrow-black.svg"
              className={`back-icon ${isHovered ? 'visible' : 'hidden'}`}
              alt="flecha atras negra" />
          </div>
          <span className="text-grey">{t("roomReservation.back")}</span>
        </button>

        <div className="reservation-header">
          <div>
            <h1>{habitacionData?.nombre}</h1>
            <p className="reservation-subtitle">
              {t("roomReservation.title")}
            </p>
          </div>

          {room?.image || room?.images?.[0] ? (
            <img
              src={room?.image || room?.images?.[0]}
              alt={room?.habitacionData?.nombre}
              className="reservation-room-image"
            />
          ) : null}
        </div>

        <div className="reservation-form-grid">
          <label>
            {t("roomReservation.checkIn")}
            <input className="form-control"
              type="text"
              readOnly
              value={startDate ? startDate.toLocaleDateString(currentLang) : t("roomReservation.selectDate")}
              onClick={() => setShowCalendar(true)}
            />
          </label>

          <label>
            {t("roomReservation.checkOut")}
            <input className="form-control"
              type="text"
              readOnly
              value={endDate ? endDate.toLocaleDateString(currentLang) : t("roomReservation.selectDate")}
              onClick={() => setShowCalendar(true)}
            />
          </label>

          <label>
            {t("roomReservation.guests")}
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="form-switch py-3 focus-ring">
              {Array.from({ length: capacity }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t("roomReservation.nights")}
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
            <p><strong>{t("roomReservation.maxCapacity")}</strong> {capacity} {t("roomReservation.guests")}</p>
            {/* Aquí se muestra el precio por noche, que se obtiene del objeto de la habitación */}
            <p><strong>{t("roomReservation.pricePerNight")}</strong> {pricePerNight.toFixed(2)} €</p>
          </div>

          <div className="reservation-total-box">
            <span>{t("roomReservation.total")}</span>
            {/* Aquí se muestra el precio total de la reserva */}
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>
        </div>

        <div className="reservation-actions">
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(`/room/${idHabitacion}`)}
          >
            {t("roomReservation.cancel")}
          </button>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={handleGuardar}
            disabled={!startDate || !endDate}
          >
            {t("roomReservation.save")}
          </button>

          <button
            type="button"
            className="btn btn-dark px-4"
            onClick={handlePagar}
            disabled={!startDate || !endDate}
          >
            {t("roomReservation.pay")}
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
                {t("roomReservation.continue")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default RoomReservation;