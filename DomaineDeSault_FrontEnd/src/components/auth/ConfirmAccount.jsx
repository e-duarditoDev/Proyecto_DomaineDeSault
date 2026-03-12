import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; //para redirigir hacia rutas

const ConfirmAccount = () => {

  //DEFINICION DE ESTADOS
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const called = useRef(false);// para evitar que React ejecute dos veces el useEffect() en desarrollo
  const navigate = useNavigate();//redirige a ruta
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (called.current) return;
    called.current = true; //A la siguiente vuelta called.cuttent = true

    const confirmAccount = async () => {

      try {
        //llamada a la API
        const response = await fetch(`/auth/alta-cliente?token=${token}`);
        const apiMesagge = await response.text();

        if (!response.ok) {
          //Errores controlados
          if (response.status === 400) {
            setMessage(apiMesagge);//mensajes de error del back
            setTimeout(() => navigate("/"), 3000)//redirige pasados 3 seg

          } else {
            setMessage(`Error inesperado. (${response.status})`)
            setTimeout(() => navigate("/"), 3000)

          }

          setStatus("error");
          setTimeout(() => navigate("/"), 3000)
          return;
        }

        setMessage(apiMesagge);//mensajes de exito del back
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000)

      } catch {
        setStatus("error");
      }

    };

    confirmAccount();

  }, [token]);

  return (

    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-50 shadow-lg bg-body-secondary rounded-3 w-50">

      {status === "loading" && <h3>Verificando cuenta...</h3>}

      {status === "success" && (
        <>
          <h4 className="text-success">{message}</h4>
          <div className="d-flex mt-3">
            <span className="text-secondary">Esta siendo redirigido...&nbsp;&nbsp;</span><span className="spinner-border spinner-border-sm text-primary" role="status"></span>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <h3 className="text-danger">Error durante la verificacion.</h3>
          <h4 className="text-secondary">{message}</h4>
          <div className="d-flex mt-3">
            <span className="text-secondary">Volviendo a inicio...&nbsp;&nbsp;</span><span className="spinner-border spinner-border-sm text-primary" role="status"></span>
          </div>
        </>
      )}

    </div>

  );

};

export default ConfirmAccount;
