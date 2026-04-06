import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MisReservas.css";
import { logout } from "../../utils/auth";

const MisReservas = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    isError: false,
    redirectTo: null,
    logoutOnClose: false,
  });

  const [deleteRoomModal, setDeleteRoomModal] = useState({
    show: false,
    idReserva: null,
    idHabitacion: null,
    nombreHabitacion: "",
    numHuespedesActual: 1,
    nuevaCapacidadMaxima: 1,
    nuevoNumHuespedes: 1,
  });

  const [paymentCardForm, setPaymentCardForm] = useState({
    telefonoBizum: "612345678",
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentReservation, setPaymentReservation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  // Estado para mensaje de error sin salir del formulario
  const [alertData, setAlertData] = useState({ show: false, message: "" });

  const roomsObj = t("rooms.list", { returnObjects: true }) || {};

  const habitacionesTraducidas = useMemo(() => {
    return Object.values(roomsObj);
  }, [roomsObj]);

  const reservasAgrupadas = useMemo(() => {
    const map = new Map();

    reservas.forEach((reserva) => {
      const idReserva = reserva.idReserva;

      if (!map.has(idReserva)) {
        map.set(idReserva, {
          idReserva: reserva.idReserva,
          fechaEntrada: reserva.fechaEntrada,
          fechaSalida: reserva.fechaSalida,
          precioTotal: reserva.precioTotal,
          estadoReserva: reserva.estadoReserva,
          idCliente: reserva.idCliente,
          numHuespedes: reserva.numHuespedes,
          habitaciones: [],
        });
      }

      map.get(idReserva).habitaciones.push({
        idHabitacion: reserva.idHabitacion,
        nombreHabitacion: reserva.nombreHabitacion,
        tipoHabitacion: reserva.tipoHabitacion,
        capacidad: reserva.capacidad,
      });
    });

    return Array.from(map.values());
  }, [reservas]);

  const eliminacionHabitacion = async ({//kk
    idReserva,
    idHabitacion,
    numHuespedes,
  }) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/reserva/eliminar-habitacion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          idReserva,
          idHabitacion,
          numHuespedes,
        }),
      });

      const responseText = await response.text();

      if (response.status === 401) {
        setPopup({
          show: true,
          message: "Tu sesión ha expirado. Vuelve a iniciar sesión.",
          isError: true,
          redirectTo: "/login",
          logoutOnClose: true,
        });
        return;
      }

      if (!response.ok) {
        setPopup({
          show: true,
          message: responseText || "No se pudo eliminar la habitación.",
          isError: true,
          redirectTo: null,
          logoutOnClose: false,
        });
        return;
      }

      // Recargar reservas desde backend
      window.location.reload();
    } catch (error) {
      setPopup({
        show: true,
        message: `Error de conexión: ${error.message}`,
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
    }
  };

  //HANDLERS
  const handleBuscarImagenHabitacion = (nombreHabitacion) => {
    if (!nombreHabitacion) return "/photos/logo.svg";

    const habitacion = habitacionesTraducidas.find(
      (room) =>
        room?.name?.trim()?.toLowerCase() ===
        nombreHabitacion.trim().toLowerCase()
    );

    return (
      habitacion?.image ||
      habitacion?.images?.[0] ||
      "/photos/logo.svg"
    );
  };

  const obtenerBadgeEstado = (estadoReserva) => {
    switch (estadoReserva) {
      case "CONFIRMADA":
        return "bg-success-subtle text-success border border-success-subtle";
      case "COMPROMETIDA":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "CANCELADA":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      case "GUARDADA":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      default:
        return "bg-secondary-subtle text-secondary border border-secondary-subtle";
    }
  };

  const obtenerTextoEstadoReserva = (estadoReserva) => {
    switch (estadoReserva) {
      case "CONFIRMADA":
        return t("misReservas.estadoReserva.confirmada");
      case "COMPROMETIDA":
        return t("misReservas.estadoReserva.comprometida");
      case "CANCELADA":
        return t("misReservas.estadoReserva.cancelada");
      case "GUARDADA":
        return t("misReservas.estadoReserva.guardada");
      default:
        return "N/D";
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/D";
    return new Date(`${fecha}T00:00:00`).toLocaleDateString(
      i18n.language || "es-ES",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const handleCierrePopup = () => {
    const { redirectTo, logoutOnClose } = popup;

    setPopup((prev) => ({ ...prev, show: false }));

    if (logoutOnClose) {
      logout();
    }

    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  const handleEliminarHabitacion = (reserva, habitacionAEliminar) => {
    const habitacionesRestantes = reserva.habitaciones.filter(
      (h) => h.idHabitacion !== habitacionAEliminar.idHabitacion
    );

    const nuevaCapacidadMaxima = habitacionesRestantes.reduce(
      (acc, h) => acc + Number(h.capacidad || 0),
      0
    );

    // Si al borrar no quedaría ninguna habitación
    if (habitacionesRestantes.length === 0) {
      setPopup({
        show: true,
        message: "No puedes dejar una reserva sin habitaciones. Puede cancelar la reserva si lo desea.",
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
      return;
    }

    // Si el número de huéspedes actual supera la nueva capacidad
    if (reserva.numHuespedes > nuevaCapacidadMaxima) {
      setDeleteRoomModal({
        show: true,
        idReserva: reserva.idReserva,
        idHabitacion: habitacionAEliminar.idHabitacion,
        nombreHabitacion: habitacionAEliminar.nombreHabitacion,
        numHuespedesActual: reserva.numHuespedes,
        nuevaCapacidadMaxima,
        nuevoNumHuespedes: nuevaCapacidadMaxima,
      });
      return;
    }

    // Si no hay conflicto, se puede enviar directamente
    eliminacionHabitacion({
      idReserva: reserva.idReserva,
      idHabitacion: habitacionAEliminar.idHabitacion,
      numHuespedes: reserva.numHuespedes,
    });
  };

  const handleCancelarReserva = async (idReserva) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/reserva/cancelar-reserva/${idReserva}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const responseText = await response.text();

      if (response.status === 401) {
        setPopup({
          show: true,
          message: "Su sesión ha expirado. Vuelva a iniciar sesión.",
          isError: true,
          redirectTo: "/login",
          logoutOnClose: true,
        });
        return;
      }

      if (!response.ok) {
        setPopup({
          show: true,
          message: responseText || "No se pudo cancelar la reserva.",
          isError: true,
          redirectTo: null,
          logoutOnClose: false,
        });
        return;
      }

      setPopup({
        show: true,
        message: responseText || "Reserva cancelada con éxito.",
        isError: false,
        redirectTo: "/mis-reservas",
        logoutOnClose: false,
      });

      setReservas((prev) => prev.filter((r) => r.idReserva !== idReserva));

    } catch (error) {
      setPopup({
        show: true,
        message: `Error de conexión: ${error.message}`,
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
    }
  };

  const handleActualizarHuespedes = async (idReserva, nuevoNumHuespedes) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/reserva/actualizar-huespedes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          idReserva,
          numHuespedes: nuevoNumHuespedes,
        }),
      });

      const responseText = await response.text();

      if (response.status === 401) {
        setPopup({
          show: true,
          message: "Tu sesión ha expirado. Vuelve a iniciar sesión.",
          isError: true,
          redirectTo: "/login",
          logoutOnClose: true,
        });
        return;
      }

      if (!response.ok) {
        setPopup({
          show: true,
          message: responseText || "No se pudieron actualizar los huéspedes.",
          isError: true,
          redirectTo: null,
          logoutOnClose: false,
        });
        return;
      }

      setReservas((prev) =>
        prev.map((r) =>
          r.idReserva === idReserva
            ? { ...r, numHuespedes: nuevoNumHuespedes }
            : r
        )
      );

      setPopup({
        show: true,
        message: responseText || "Número de huéspedes actualizado con éxito.",
        isError: false,
        redirectTo: null,
        logoutOnClose: false,
      });
    } catch (error) {
      setPopup({
        show: true,
        message: `Error de conexión: ${error.message}`,
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
    }
  };

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
          message: "Numero de tarjeta no valido."
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
          message: "El nombre del titular incorrecto."
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
          message: "Fecha incorrecta."
        });
      } else if (
        agnoForm < agnoActual ||
        (agnoForm === agnoActual && mesForm < mesActual)
      ) {
        setAlertData({
          show: true,
          message: "Tarjeta caducada. Pruebe con otra tarjeta."
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
          message: "CVV no válido."
        })
      } else {
        setAlertData({
          show: false,
          message: ""
        });
      }
    };

  };

  const handleAbrirPago = (reserva) => {
    if (!reserva?.idReserva) {
      setPopup({
        show: true,
        message: "No se ha recuperado la reserva.",
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
      return;
    }

    setPaymentReservation(reserva);
    setPaymentMethod("");
    setProcessingPayment(false);
    setPaymentCardForm({
      telefonoBizum: "612345678",
      cardNumber: "",
      cardHolder: "",
      cardExpiry: "",
      cardCvv: "",
    });
    setShowPaymentPanel(true);
  };

  const confirmarPago = async () => {
    const token = localStorage.getItem("token");

    if (!paymentReservation?.idReserva) {
      setPopup({
        show: true,
        message: "No se ha recuperado el id de la reserva.",
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
      return;
    }

    if (!paymentMethod) {
      setPopup({
        show: true,
        message: "Selecciona un método de pago.",
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
      return;
    }

    try {
      setProcessingPayment(true);

      const pagoDto = {
        idReserva: Number(paymentReservation.idReserva),
        metodo: paymentMethod,
        cantidad: Number(paymentReservation.precioTotal),
        fechaPago: new Date().toISOString(),
        estado: paymentMethod === "EFECTIVO" ? "PENDIENTE" : "PAGADO",
      };

      if (paymentMethod === "TARJETA") {
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }

      const response = await fetch("/api/reserva/pagar-reserva-existente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(pagoDto),
      });

      const responseText = await response.text();

      if (response.status === 401) {
        setShowPaymentPanel(false);
        setPopup({
          show: true,
          message: "Tu sesión ha expirado. Vuelve a iniciar sesión.",
          isError: true,
          redirectTo: "/login",
          logoutOnClose: true,
        });
        return;
      }

      if (!response.ok) {
        setPopup({
          show: true,
          message: responseText || "No se pudo procesar el pago.",
          isError: true,
          redirectTo: null,
          logoutOnClose: false,
        });
        return;
      }

      setShowPaymentPanel(false);

      setReservas((prev) =>
        prev.map((r) =>
          r.idReserva === paymentReservation.idReserva
            ? {
              ...r,
              estadoReserva: paymentMethod === "EFECTIVO" ? "COMPROMETIDA" : "CONFIRMADA",
            }
            : r
        )
      );

      setPopup({
        show: true,
        message: responseText || "Pago registrado con éxito.",
        isError: false,
        redirectTo: null,
        logoutOnClose: false,
      });

    } catch (error) {
      setPopup({
        show: true,
        message: `Error al procesar el pago: ${error.message}`,
        isError: true,
        redirectTo: null,
        logoutOnClose: false,
      });
    } finally {
      setProcessingPayment(false);
      setShowPaymentPanel(false);
    }
  };


  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/cliente/mis-reservas", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setPopup({
            show: true,
            message: "Tu sesión ha expirado. Vuelve a iniciar sesión.",
            isError: true,
            redirectTo: "/login",
            logoutOnClose: true,
          });
          return;
        }

        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
          const errorText = await response.text();
          setPopup({
            show: true,
            message: errorText || "No se han podido recuperar tus reservas.",
            isError: true,
            redirectTo: null,
            logoutOnClose: false,
          });
          setReservas([]);
          return;
        }

        if (!contentType.includes("application/json")) {
          setPopup({
            show: true,
            message: "La respuesta del servidor no es válida.",
            isError: true,
            redirectTo: null,
            logoutOnClose: false,
          });
          setReservas([]);
          return;
        }

        const data = await response.json();
        setReservas(Array.isArray(data) ? data : []);
      } catch (error) {
        setPopup({
          show: true,
          message: `Error de conexión: ${error.message}`,
          isError: true,
          redirectTo: null,
          logoutOnClose: false,
        });
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5 mt-5 d-flex justify-content-center">
        <span className="text-center fs-5">Cargando reservas...&nbsp;&nbsp;&nbsp;</span>
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">

      <div className="mx-auto w-75">

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold mb-1">{t("misReservas.header.title")}</h1>
            <p className="text-secondary mb-0">
              {t("misReservas.header.subtitle")}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate("/")}
          >
            {t("misReservas.header.backHome")}
          </button>
        </div>

        {reservas.length === 0 ? (
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <p className="mb-2 fs-5 fw-semibold">No tienes reservas registradas.</p>
            <p className="text-secondary mb-0">
              Cuando guardes o pagues una reserva, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {reservasAgrupadas.map((reserva) => {
              const capacidadTotalReserva = reserva.habitaciones.reduce(
                (acc, habitacion) => acc + Number(habitacion.capacidad || 0),
                0
              );
              return (
                <div
                  key={reserva.idReserva}
                  className="card shadow-sm border-1 rounded-4 overflow-hidden"
                >
                  <div>
                    <span
                      className={`badge rounded-0 px-3 p-2 fs-6 align-content-center w-100 ${obtenerBadgeEstado(
                        reserva.estadoReserva
                      )}`}
                    >
                      {obtenerTextoEstadoReserva(reserva.estadoReserva)}
                    </span>
                  </div>

                  <div className="row g-0 align-items-stretch">
                    <div className="col-md-7 mb-2 pb-2">
                      <div className="card-body p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex align-items-start flex-column mb-3">

                            <div className="d-flex w-100">
                              <p className="h3 fw-bold mb-2 me-5">
                                {t("misReservas.card.bookingNumber")} #{reserva.idReserva}
                              </p>
                            </div>

                            <div className="d-flex gap-5 align-items-center">{/* kk */}
                              <p className="text-secondary mb-0">
                                {reserva.habitaciones.length} {t("misReservas.card.rooms")}
                              </p>

                              <div className="d-flex align-items-center gap-2">
                                <label
                                  htmlFor={`selector-huespedes-${reserva.idReserva}`}
                                  className="text-secondary mb-0"
                                >
                                  {t("misReservas.card.guestsLabel")}
                                </label>

                                <select
                                  id={`selector-huespedes-${reserva.idReserva}`}
                                  value={reserva.numHuespedes}
                                  onChange={(e) =>
                                    handleActualizarHuespedes(
                                      reserva.idReserva,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="form-select form-select-sm shadow-sm w-auto "
                                  disabled={reserva.estadoReserva === "CONFIRMADA"}
                                >
                                  {Array.from(
                                    { length: capacidadTotalReserva },
                                    (_, i) => i + 1
                                  ).map((n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="mb-3 w-100 mt-3">
                              <div className="d-flex flex-column gap-3">
                                {reserva.habitaciones.map((habitacion, index) => (
                                  <div
                                    key={`${reserva.idReserva}-${habitacion.idHabitacion}-${index}`}
                                    className="p-3 bg-body-tertiary rounded-3 border"
                                  >
                                    <div className="fw-semibold">
                                      {habitacion.nombreHabitacion || t("misReservas.card.roomFallback")}
                                    </div>

                                    <div className="d-flex gap-4">
                                      <div className="text-secondary small mb-3">
                                        {t("misReservas.card.type")} {habitacion.tipoHabitacion || "N/D"}
                                      </div>

                                      <div className="text-secondary small mb-3">
                                        {t("misReservas.card.capacity")} {habitacion.capacidad}
                                      </div>
                                    </div>

                                    {reserva.estadoReserva !== "CONFIRMADA" && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() =>
                                          handleEliminarHabitacion(reserva, habitacion)
                                        }
                                      >
                                        {t("misReservas.card.deleteRoom")}
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>

                            </div>

                            <div className="row gy-3  justify-align-content-between mx-auto w-100">
                              <div className="col-sm-6 ps-0">
                                <div className="p-3 bg-body-tertiary rounded-3">
                                  <div className="small text-secondary">Check-in</div>
                                  <div className="fw-semibold">
                                    {formatearFecha(reserva.fechaEntrada)}
                                  </div>
                                </div>
                              </div>

                              <div className="col-sm-6 pe-0">
                                <div className="p-3 bg-body-tertiary rounded-3">
                                  <div className="small text-secondary">Check-out</div>
                                  <div className="fw-semibold">
                                    {formatearFecha(reserva.fechaSalida)}
                                  </div>
                                </div>
                              </div>

                              <div className="col-sm-6 ps-0">
                                <div className="p-3 bg-body-tertiary rounded-3">
                                  <div className="small text-secondary">{t("misReservas.card.bookingId")}</div>
                                  <div className="fw-semibold">
                                    {reserva.idReserva ?? "N/D"}
                                  </div>
                                </div>
                              </div>

                              <div className="col-sm-6 pe-0">
                                <div className="p-3 bg-body-tertiary rounded-3">
                                  <div className="small text-secondary">{t("misReservas.card.totalPrice")}</div>
                                  <div className="fw-semibold">
                                    {Number(reserva.precioTotal).toFixed(2)} €
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-5 py-4 pe-4 my-auto">
                      <img
                        src={handleBuscarImagenHabitacion(reserva.habitaciones[0]?.nombreHabitacion)}
                        alt={reserva.habitaciones[0]?.nombreHabitacion || "Habitación reservada"}
                        className="img-fluid h-100 w-100 object-fit-cover rounded-4 mis-reservas-img"
                        onError={(e) => {
                          e.currentTarget.src = "/photos/logo.svg";
                        }}
                      />
                    </div>

                    <div className="d-flex gap-3 justify-content-center mb-4 ">
                      <button
                        type="button"
                        className="btn btn-outline-danger pe-2 ps-2"
                        onClick={() => handleCancelarReserva(reserva.idReserva)}
                      >
                        {t("misReservas.card.cancelBooking")}
                      </button>

                      {reserva.estadoReserva !== "CONFIRMADA" && (
                        <button
                          type="button"
                          className="btn btn-outline-dark px-5"
                          onClick={() => handleAbrirPago(reserva)}
                        >
                          {t("misReservas.card.pay")}
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
        }
      </div>

      {deleteRoomModal.show && (
        <div className="card d-flex justify-content-center align-items-center vw-100 vh-100 fixed-top bg-dark bg-opacity-25">
          <div className="bg-white rounded-4 shadow border-black d-flex justify-content-center align-items-center flex-column"
            style={{ width: "420px" }}>
            <div className="w-100 rounded-top-4 py-3 bg-warning"></div>

            <div className="text-center p-4 w-100">
              <h3>{t("misReservas.updateGuestsModal.title")}</h3>

              <p>
                {t("misReservas.updateGuestsModal.removeRoomMessageBefore")}{" "}
                <strong>{deleteRoomModal.nombreHabitacion}</strong>,
                {" "}{t("misReservas.updateGuestsModal.removeRoomMessageMiddle")}{" "}
                <strong>{deleteRoomModal.nuevaCapacidadMaxima}</strong>{" "}
                {t("misReservas.updateGuestsModal.removeRoomMessageAfter")}
              </p>

              <p className="mb-3">
                {t("misReservas.updateGuestsModal.selectNewGuests")}
              </p>

              <select
                className="form-select mb-3"
                value={deleteRoomModal.nuevoNumHuespedes}
                onChange={(e) =>
                  setDeleteRoomModal((prev) => ({
                    ...prev,
                    nuevoNumHuespedes: Number(e.target.value),
                  }))
                }
              >
                {Array.from(
                  { length: deleteRoomModal.nuevaCapacidadMaxima },
                  (_, i) => i + 1
                ).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() =>
                    setDeleteRoomModal({
                      show: false,
                      idReserva: null,
                      idHabitacion: null,
                      nombreHabitacion: "",
                      numHuespedesActual: 1,
                      nuevaCapacidadMaxima: 1,
                      nuevoNumHuespedes: 1,
                    })
                  }
                >
                  {t("misReservas.updateGuestsModal.cancel")}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={() => {
                    eliminacionHabitacion({
                      idReserva: deleteRoomModal.idReserva,
                      idHabitacion: deleteRoomModal.idHabitacion,
                      numHuespedes: deleteRoomModal.nuevoNumHuespedes,
                    });

                    setDeleteRoomModal({
                      show: false,
                      idReserva: null,
                      idHabitacion: null,
                      nombreHabitacion: "",
                      numHuespedesActual: 1,
                      nuevaCapacidadMaxima: 1,
                      nuevoNumHuespedes: 1,
                    });
                  }}
                >
                  {t("misReservas.updateGuestsModal.accept")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <h5 className="text-black mb-3">{t("misReservas.paymentPanel.title")}</h5>
                  <select
                    id="selector-metodo-pago"
                    className="form-select w-50"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">{t("misReservas.paymentPanel.selectOption")}</option>
                    <option value="BIZUM">Bizum</option>
                    <option value="TARJETA">{t("misReservas.paymentPanel.card")}</option>
                    <option value="EFECTIVO">{t("misReservas.paymentPanel.cash")}</option>
                  </select>
                </div>
                {paymentMethod === "BIZUM" && (
                  <div className="alert alert-info text-center rounded-2 pb-0">
                    <p>
                      {t("misReservas.paymentPanel.bizumMessageBefore")}{" "}
                      <strong>{paymentCardForm.telefonoBizum}</strong>.
                      <br />
                      {t("misReservas.paymentPanel.bizumMessageAfter")}
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
                        {t("misReservas.paymentPanel.cardNumber")}
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
                      <label htmlFor="titular" className="form-label">{t("misReservas.paymentPanel.cardHolder")}</label>
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
                      <label htmlFor="fecha-vencimiento" className="form-label">{t("misReservas.paymentPanel.expiryDate")}</label>
                      <input
                        type="text"
                        minLength={5}
                        maxLength={5}
                        className="form-control"
                        name="cardExpiry"
                        id="fecha-vencimiento"
                        placeholder={t("misReservas.paymentPanel.expiryPlaceholder")}
                        value={paymentCardForm.cardExpiry}
                        onChange={handlePaymentFormChange}
                      />
                    </div>

                    <div className="col-6">
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
                    {t("misReservas.paymentPanel.cashWarning")}
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
                  {t("misReservas.paymentPanel.cancel")}
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
                          ? t("misReservas.paymentPanel.processingCard")
                          : t("misReservas.paymentPanel.accept")
                      )
                      : (
                        processingPayment
                          ? t("misReservas.paymentPanel.loading")
                          : t("misReservas.paymentPanel.accept")
                      )
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {popup.show && (
        <div className="card d-flex justify-content-center align-items-center vw-100 vh-100 fixed-top bg-dark bg-opacity-25">
          <div className="bg-white rounded-4 shadow border-black w-25 d-flex justify-content-center align-items-center flex-column">
            <div
              className={`w-100 rounded-top-4 py-3 ${popup.isError ? "bg-danger" : "bg-success"
                }`}
            ></div>
            <div className="text-center p-4 w-100">
              <h3>
                {popup.isError
                  ? t("misReservas.popup.warningTitle")
                  : t("misReservas.popup.confirmationTitle")}
              </h3>
              <p>{popup.message}</p>
              <button className="btn btn-outline-dark" onClick={handleCierrePopup}>
                {t("misReservas.popup.continue")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisReservas;