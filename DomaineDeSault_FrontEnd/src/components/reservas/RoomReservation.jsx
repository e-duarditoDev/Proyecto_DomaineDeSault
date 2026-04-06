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

  //Convertirdor a fecha local
  const formatearFechaLocal = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
  // Estado para mensaje de error sin salir del formulario
  const [alertData, setAlertData] = useState({ show: false, message: "" });//kk

  // Ref para detectar clicks fuera del calendario y cerrarlo
  const formRef = useRef(null);

  //Estado para abrir y cerrar el panel de pago
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  //Para la seleccion del metodo de pago
  const [paymentMethod, setPaymentMethod] = useState("");
  //Simulacion de contacto con la entidad bancaria
  const [processingPayment, setProcessingPayment] = useState(false);
  //Formulario en funcion del metodo de pago elegido, con valores por defecto o estado inicial.
  const [paymentCardForm, setPaymentCardForm] = useState({
    telefonoBizum: "612345678",//informacion que se le muestra al usuario
    cardNumber: "",//vacios, lo rellena el usuario
    cardName: "",
    cardExpiry: "",
    cardCvv: ""
  });



  // TRADUCCIONES
  const localesMap = { es, fr, en: enGB, de };
  const currentLang = i18n.language.split("-")[0];
  const currentLocale = localesMap[currentLang] || enGB;
  const roomsObj = t("rooms.list", { returnObjects: true }) || {};
  const room = Object.values(roomsObj).find(
    (r) =>
      r?.name?.trim()?.toLowerCase() ===
      habitacionData?.nombre?.trim()?.toLowerCase()
  ) || {};

  /*   const roomKeys = Object.keys(roomsObj);
    const roomIndex = Number(idHabitacion) - 1;
    const roomKey = roomKeys[roomIndex];
    const room = roomsObj[roomKey] || {}; */

  //FUNCIONES
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
            message: t("roomReservation.popup.sessionExpired"), //Referencia al json de traduccion
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


  //Funcion para PAGAR reserva, simuala el proceso de pago
  const confirmarPago = async () => {
    const token = localStorage.getItem("token");

    // Validaciones antes de simular (fuera del try)
    //Si falta el idHabitacion (dificil porque no hubiese entrado en el RoomDetail)
    if (!idHabitacion) {
      setPopup({
        show: true,
        message: t("roomReservation.popup.roomNotFound"),
        isError: true,
        redirectTo: "/",
        logoutOnClose: false
      });
      return
    }

    //Si las fechas no son correctas. (dificil porque el calendario obliga)
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

    //Si no se ha seleccionado metodo de pago y se pulsa aceptar
    if (!paymentMethod) {
      setPopup({
        show: true,
        message: t("roomReservation.popup.selectPaymentMethod"),
        isError: true,
        redirectTo: null,
        logoutOnClose: false
      });
      setShowPaymentPanel(false);
      return;
    }

    /*         //Si falta algun campo de la tarjeta y se pulsa aceptar
            if (paymentMethod === "TARJETA") {//kk
        
              if (
                      !paymentCardForm.cardNumber.trim() ||
                      !paymentCardForm.cardName.trim() ||
                      !paymentCardForm.cardExpiry.trim() ||
                      !paymentCardForm.cardCvv.trim()
              
                    ) {
                      setShowPaymentPanel(false);
                      setPopup({
                        show: true,
                        message: "Completa todos los datos de la tarjeta.",
                        isError: true,
                        redirectTo: null,
                        logoutOnClose: false,
                      });
                      return;
                    } 
            } */
    try {
      // Activa mensaje visual de procesamiento
      setProcessingPayment(true);


      //Construccion del DTO ReservaPagoRequestDto recibe el endPoint pagar-reserva
      //Deben coincidir los campos con el DTO que espera recibir el endPoint pagar-reserva
      const payLoad = {
        reservaDto: { //campo dentro del ReservaPagoRequestDto en al back, mismo nombre
          idHabitacion: Number(habitacionData?.idHabitacion), //campos dentro del reservaDto en el back, mismo nombre
          fechaEntrada: formatearFechaLocal(startDate),
          fechaSalida: formatearFechaLocal(endDate),
          numHuespedes: guests,
          accion: "PAGAR"
        },
        pagoDto: {
          idReserva: Number(habitacionData?.idReserva),
          metodo: paymentMethod,
          cantidad: Number(totalPrice),
          fechaPago: new Date().toISOString(),
          estado: "PAGADO"
        }
      };

      //Caso EFECTIVO: 
      //endPoint guardar-reserva, estado reserva PENDIENTE estado pago PENDIENTE
      if (paymentMethod === "EFECTIVO") {
        payLoad.pagoDto.estado = "PENDIENTE";//Guarda el pago como pendiente, ya que se abonara en mostrador a la llegaga
        payLoad.reservaDto.accion = "GUARDAR";
        //console.log("PayLoad: ", JSON.stringify(payLoad, null,2))

        //LLamada a la API
        const response = await fetch("/api/reserva/pagar-reserva", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payLoad) //Cargado el DTO que espera recibir el endPoint
        });

        const responseText = await response.text();//Captura mensajes de la API

        if (response.status === 401) { //si ha expirado el token
          setPopup({
            show: true,
            message: t("roomReservation.popup.sessionExpired"),
            isError: true,
            redirectTo: "/login",
            logoutOnClose: true
          });
          return; //interrumpe el flujo
        }

        if (!response.ok) { //capta mensaje de back o error inesperado
          setPopup({
            show: true,
            message: responseText || t("roomReservation.popup.unexpectedError"),
            isError: true,
            redirectTo: null,
            logoutOnClose: false
          });
          return;
        }

        // Cerrar el formulario de pago
        setShowPaymentPanel(false);

        setPopup({
          show: true,
          message: t("roomReservation.popup.paymentSuccess"),
          isError: false,
          redirectTo: "/",
          logoutOnClose: false
        });
        return;
      };

      // Caso TARJETA y BIZUM: endPoint pagar-reserva, estado reserva CONFIRMADA estado pago PAGADO
      if (paymentMethod !== "EFECTIVO") {

        //Llamada a la API
        const response = await fetch("/api/reserva/pagar-reserva", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payLoad) //Cargado el DTO que espera recibir el endPoint
        });

        const responseText = await response.text();//Captura mensajes de la API

        if (response.status === 401) { //si ha expirado el token
          setPopup({
            show: true,
            message: t("roomReservation.popup.sessionExpired"),
            isError: true,
            redirectTo: "/login",
            logoutOnClose: true
          });
          return; //interrumpe el flujo
        }

        if (!response.ok) { //capta mensaje de back o error inesperado
          setPopup({
            show: true,
            message: responseText || t("roomReservation.popup.unexpectedError"),
            isError: true,
            redirectTo: null,
            logoutOnClose: false
          });
          return;
        }

        // Simulación decomunicacion con la entidad bancaria
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Cerrar el formulario de pago
        setShowPaymentPanel(false);

        setPopup({
          show: true,
          message: "Pago realizado con éxito.",
          isError: false,
          redirectTo: "/",
          logoutOnClose: false
        });
        return;
      };

    } catch (error) {
      setShowPaymentPanel(false);
      setPopup({
        show: true,
        message: `${t("roomReservation.popup.paymentProcessError")} ${error.message}`,//Captura el mensajes del back
        isError: true,
        redirectTo: null,
        logoutOnClose: false
      });
    } finally {
      //Cerrar el formulario pago y simulacion del proceso de pago al saltar la excepcion
      setShowPaymentPanel(false);
      setProcessingPayment(false);
    }
  };


  // FUNCIONES DE ACCION (HANDLER)

  //Modifica los datos por defecto del paymentCardForm
  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;

    //prev es el estado anterior (default) del PaymentForm
    //...paymentCardForm copia todos los campos con el estado default para comparar
    //solo se actualizan los campos del objeto que hayan cambiado ([name]: value - [clave]:valor)
    //evita tener que hacer un onChange en cada campo (input)
    const updatedForm = {
      ...paymentCardForm,
      [name]: value
    };

    setPaymentCardForm(updatedForm);

    if (name === "cardNumber") {
      if (!value || !/^\d{16}$/.test(value)) {
        setAlertData({
          show: true,
          message: t("roomReservation.cardAlert.invalidCardNumber")
        });
      } else {
        setAlertData({
          show: false,
          message: ""
        });
      }
    }; //kk

    if (name === "cardName") {
      if (!value || !/^[A-Za-zÀ-ÿ\s]{2,}$/.test(value)) {
        setAlertData({
          show: true,
          message: t("roomReservation.cardAlert.invalidCardName")
        });
      } else {
        setAlertData({
          show: false,
          message: ""
        });
      }
    };

    if (name === "cardExpiry") {//kk
      const mesForm = parseInt(value.slice(0, 2), 10);
      const agnoForm = parseInt(value.slice(3, 5), 10);

      const hoy = new Date();
      const mesActual = hoy.getMonth() + 1;
      const agnoActual = hoy.getFullYear() % 100;

      if (!value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        setAlertData({
          show: true,
          message: t("roomReservation.cardAlert.invalidExpiry")
        });
      } else if (
        agnoForm < agnoActual ||
        (agnoForm === agnoActual && mesForm < mesActual)
      ) {
        setAlertData({
          show: true,
          message: t("roomReservation.cardAlert.expiredCard")
        });
      } else {
        setAlertData({
          show: false,
          message: ""
        });
      }
    };

    if (name === "cardCvv") {
      if (!value || !/^\d{3}/.test(value)) {
        setAlertData({
          show: true,
          message: t("roomReservation.cardAlert.invalidCvv")
        })
      } else {
        setAlertData({
          show: false,
          message: ""
        });
      }
    };

  };

  // Función para GUARDAR la reserva, construye el DTO y llama a la API guardar-reserva
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

    // Construir el DTO de reserva según lo que el backend espera recibir (mismo DTO que backend)
    // En un principio back recibe la accion GUARDAR o PAGAR,
    // muestra mensaje acorde y guarda la reserva como PENDIENTE o CONFIRMADA
    // luego se toma caminos diferentes para simular plataforma de pago, el service se mantiene igual
    const reservaRequestDto = {
      idHabitacion: Number(habitacionData?.idHabitacion),
      numHuespedes: guests,
      fechaEntrada: formatearFechaLocal(startDate),
      fechaSalida: formatearFechaLocal(endDate),
      accion: accion
    };

    // Enviar la reserva al backend
    try {
      const response = await fetch("/api/reserva/guardar-reserva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaRequestDto)
      });


      // Captura la respuesta del backend
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
    //Si las anteriores validaciones van bien muestra el panel de seleccion de pago
    setShowPaymentPanel(true);
  };

  // Función para manejar el cierre del popup al pulsar el botón de continuar en el popup de mensajes
  const handlePopupClose = () => {
    //Variables almacenan los valores de los atributos del popup
    const redirectTo = popup.redirectTo; //devuelve booleano
    const logoutOnClose = popup.logoutOnClose;

    //prev es el estado primario (anterior) del poppup
    //...prev copia todo lo que habia dentro del objeto, convserva los campos no cambien
    //solo se sobreescribe la propiedad que haya cambiado (show: false)
    //es una forma compacta para no tener hacer onChange en cada campo (input)
    setPopup((prev) => ({ ...prev, show: false })); // Cierra el popup

    if (logoutOnClose) {
      logout(); // Cierra sesión si se indica que el token ha expirado
    }

    if (redirectTo) {
      navigate(redirectTo); // Redirige a la ruta especificada en la variable redirectTo 
    }

  };



  // RENDER

  // Renderizado condicional para manejar los estados de carga, error y datos de la habitación
  if (loadingHabitacion) {
    return <p className="text-center mt-5 pt-5">{t("roomReservation.loadingRoom")}</p>;
  }

  //Render si no se recuperan datos de la habitacion del backEnd
  if (!habitacionData) {
    return popup.show ? (
      <>
        {popup.show && (
          <div className="card d-flex justify-content-center align-items-center vw-100 vh-100 fixed-top">
            <div className="bg-white rounded-4 shadow border-black w-auto d-flex justify-content-center align-items-center flex-column">
              <div className={`reserva-popup-header ${popup.isError ? 'bg-danger' : 'bg-success'} w-100 ps-3 rounded-top-3 py-3`}>
              </div>
              <div className="p-4 text-center">
                <p>{popup.message}</p>
                <button className="btn btn-dark" onClick={handlePopupClose}>
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
    <div className="room-reservation-page" id="formulario-reserva">

      {/* Render popup */}
      {popup.show && ( //si el atributo show es true
        <div className="card d-flex justify-content-center align-items-center vw-100 vh-100 fixed-top">
          <div className="bg-white rounded-4 shadow border-black w-auto d-flex justify-content-center align-items-center flex-column">
            <div className={`reserva-popup-header ${popup.isError ? 'bg-danger' : 'bg-success'} w-100 ps-3 rounded-top-3 py-3`}>
              {/*<img className="m-1"
                src={popup.isError ? "/icons/yellow-exclamation-mark.svg" : "/icons/success-check.svg"}
                alt={popup.isError ? "Error" : "Éxito"}
                style={{ width: "20px", height: "20px" }} // Ajusta el tamaño a tu gusto
              /> */}
            </div>
            <div className="text-center p-3 bg-body-tertiary w-100">
              <h3>{popup.isError ? t("roomReservation.popup.warningTitle") : t("roomReservation.popup.confirmationTitle")}</h3>
              <p>{popup.message}</p>
              <button className="btn btn-outline-dark" onClick={handlePopupClose}>
                {t("roomReservation.continue")}
              </button>
            </div>
          </div>
        </div>
      )
      }

      {/* Render pagina */}
      <div className="room-reservation-card" ref={formRef}>
        <button
          id="boton-atras"
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

        <div className="reservation-header mt-3">
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

        <div className="reservation-form-grid" id="fechas-entrada-salida">
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
            <select id="selector-huespedes" value={guests} onChange={(e) =>
              setGuests(Number(e.target.value))} className="form-switch py-3 focus-ring">
              {Array
                .from({ length: capacity },
                  (_, i) => i + 1)
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
          </label>

          <label>
            {t("roomReservation.nights")}
            <input type="text" readOnly value={nights} className="form-control" id="numero-noches" />
          </label>
        </div>

        {showCalendar && (
          <div className="reservation-calendar" id="mostrar-calendario">
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

        <div className="reservation-summary" id="informacion-habitacion">
          <div>
            <p><strong>{t("roomReservation.maxCapacity")}</strong> {capacity} {t("roomReservation.guests")}</p>
            {/* Aquí se muestra el precio por noche, que se obtiene del objeto de la habitación */}
            <p><strong>{t("roomReservation.pricePerNight")}</strong> {pricePerNight.toFixed(2)} €</p>
          </div>

          <div className="reservation-total-box ">
            <span>{t("roomReservation.total")}</span>
            {/* Aquí se muestra el precio total de la reserva, toFixed conviente numero a texto con 2 decimales*/}
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>
        </div>

        <div className="d-flex gap-3 justify-content-end mt-4">
          <button
            id="boton-cancelar"
            type="button"
            className="btn btn-outline-danger"
            onClick={() => navigate(`/room/${idHabitacion}`)}
          >
            {t("roomReservation.cancel")}
          </button>

          <button
            id="boton-guardar"
            type="button"
            className="btn btn-outline-dark"
            onClick={handleGuardar}
            disabled={!startDate || !endDate}
          >
            {t("roomReservation.save")}
          </button>

          <button
            id="boton-pagar"
            type="button"
            className="btn btn-outline-dark px-4"
            onClick={handlePagar}
            disabled={!startDate || !endDate}
          >
            {t("roomReservation.pay")}
          </button>

          {/* Selector de metodo de pago */}
          {showPaymentPanel && ( //si showPaymentPanel === true

            /* La estructura de los modal sigue:
              1. Modal fade lo que queda por detras (obligado)
              2. Modal-dialog activa la ventana (obligatorio)
              3. Modal content contiene todo 
                3.1. Modal header, title o header -> title
                3.2. Modal body cotiene los formularios, botones, select... 
                3.3. Modal footer
              */

            /* kk */
            <div
              className="modal fade show d-flex justify-content-center align-items-center"
              tabIndex={-1}
              role="dialog"
              /*onClick={() => setShowPaymentPanel(false)}*/
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div //kk
                className="w-50 h-auto bg-body-tertiary rounded-3"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content rounded-3 bg-body-tertiary">
                  <div className="modal-title d-flex justify-content-end p-3">
                    <button
                      id="aspa-cierre-ventana"
                      type="button"
                      className="btn-close bg-danger p-2"
                      aria-label="Close"
                      onClick={() => setShowPaymentPanel(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3 ">
                      <h5 className="text-black mb-3">{t("roomReservation.payment.title")}</h5>
                      <select
                        id="selector-metodo-pago"
                        className="form-select w-50"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="">{t("roomReservation.payment.selectOption")}</option>
                        <option value="BIZUM">Bizum</option>
                        <option value="TARJETA">{t("roomReservation.payment.card")}</option>
                        <option value="EFECTIVO">{t("roomReservation.payment.cash")}</option>
                      </select>
                    </div>
                    {paymentMethod === "BIZUM" && (
                      <div className="alert alert-info text-center rounded-2 pb-0">
                        <p>
                          {t("roomReservation.payment.bizumMessageBefore")}{" "}
                          <strong>{paymentCardForm.telefonoBizum}</strong>.
                          <br />
                          {t("roomReservation.payment.bizumMessageAfter")}
                        </p>
                      </div>
                    )}

                    {paymentMethod === "TARJETA" && ( //kk
                      <div className="row g-3 mt-1">
                        {/* Render Alert personalizado para formularios kk */}
                        {alertData.show && ( //si el atributo show es true
                          <div className="alert alert-warning pb-0 rounded-0 w-100 d-flex justify-content-center align-items-center">
                            <p>{alertData.message}</p>{/* kk */}
                          </div>
                        )}
                        <div className="col-12">
                          <label
                            htmlFor="numero-tarjeta" //si hace clic en el texto de la label hace foco al input id="numero-tarjeta"
                            className="form-label">
                            {t("roomReservation.payment.cardNumber")}
                          </label>
                          <input
                            type="text"
                            maxLength={16}
                            minLength={16}
                            className="form-control"
                            name="cardNumber"//Identifica que campo del handlePaymentFormChange es el imput
                            id="numero-tarjeta"
                            value={paymentCardForm.cardNumber} //valor atributo del objeto paymentCardForm
                            onChange={handlePaymentFormChange} //evento llama a la funcion actualiza datos en el paymentCardForm
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="titular" className="form-label">{t("roomReservation.payment.cardHolder")}</label>
                          <input
                            type="text"
                            minLength={2}
                            maxLength={40} //kk
                            className="form-control"
                            name="cardName"
                            id="titular"
                            value={paymentCardForm.cardName}
                            onChange={handlePaymentFormChange}
                          />
                        </div>

                        <div className="col-6 mb-3">
                          <label htmlFor="fecha-vencimiento" className="form-label">{t("roomReservation.payment.expiryDate")}</label>
                          <input
                            type="text"
                            minLength={5}
                            maxLength={5}
                            className="form-control"
                            name="cardExpiry"
                            id="fecha-vencimiento"
                            placeholder={t("roomReservation.payment.expiryPlaceholder")}
                            value={paymentCardForm.cardExpiry}
                            onChange={handlePaymentFormChange}
                          />
                        </div>

                        <div className="col-6 bg">
                          <label htmlFor="cvv" className="form-label">CVV</label>
                          <input
                            type="text"
                            maxLength={3}
                            minLength={3}
                            className="form-control"
                            name="cardCvv"
                            id="cvv"
                            value={paymentCardForm.cardCvv}
                            onChange={handlePaymentFormChange}
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "EFECTIVO" && (
                      <div className="alert alert-warning rounded-2">
                        {t("roomReservation.payment.cashWarning")}
                      </div>
                    )}
                  </div>

                  {/* Botones del formulario de la tarjeta  kk*/}
                  <div className="modal-footer rounded-0 gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setShowPaymentPanel(false)} //cierra el formulario
                    >
                      {t("roomReservation.payment.cancel")}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={confirmarPago}
                      disabled={processingPayment}
                    >
                      {/*Esto es un IF-ELSE en React */}
                      {
                        paymentMethod === "TARJETA"
                          ? (
                            processingPayment
                              ? t("roomReservation.payment.processingCard")
                              : t("roomReservation.payment.accept")
                          )
                          : (
                            processingPayment
                              ? t("roomReservation.payment.loading")
                              : t("roomReservation.payment.accept")
                          )
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
export default RoomReservation;