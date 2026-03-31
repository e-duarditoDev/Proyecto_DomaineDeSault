import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  //Para redirigir 
  const navigate = useNavigate();
  //Para indicar la ruta de referencia, usada para redirigir en funcion donde se este
  //const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);


    try {
      //Evita hacer la peticion a la API si faltan campos
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos.");
      }

      //llamada a la API para autenticarse
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      // Manejo de errores
      if (response.status.toString().startsWith("5")) {
        throw new Error("Error del servidor. Por favor, inténtalo de nuevo más tarde.");
      }

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      // Capturar y guardar token JSON en localStorage
      const data = await response.json();
      localStorage.setItem("token", data.token);

      // Comprobar si el perfil del cliente está completo
      const perfilResponse = await fetch("/api/cliente/perfil-completo", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${data.token}`
        }
      });

      //Si la API tiene algun error
      if (!perfilResponse.ok) {
        throw new Error("No se pudo comprobar el perfil del usuario.");
      }

      const perfilCompleto = await perfilResponse.json();

      //aqui hay que recuperar el rol y mandar a un sitio u otro (cliente, trabajador)

      //Redirigir segun este o no cumplimentado los datos del usuario
      if (perfilCompleto) {
        //Ver si puede dejar en el RoomReservation si se esta en el RoomDetail
/*         if (location.pathname === "/login") {
          navigate("/");
        } */

          navigate("/")

      } else {
        navigate("/mis-datos");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-body-tertiary">

      <div className="logo-auth position-absolute top-0 start-0 ms-4">
        <a
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo/logo domaine de salt transparente.png"
            alt="Logo Domaine du Salt"
            height="40"
          />
        </a>
      </div>
      <div className="auth-card card shadow-lg p-4">
        <h2>Acceder</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>

          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            className="form-control mb-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Introduce tu email"
          />

          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <div className="input-group mb-4">
            <input
              id="password"
              className="form-control"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            <button
              type="button"
              className="btn btn-clear focus-ring py-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <img className="eye-off" src="/icons/eye-open-svgrepo-com.svg" alt="Ocultar" />
                : <img className="eye-on" src="/icons/eye-closed-svgrepo-com.svg" alt="Mostar" />}
            </button>
          </div>

          <button className="btn btn-dark w-100 py-2" disabled={loading}>
            {loading ? "Accediendo..." : "Acceder"}
          </button>

        </form>

        <p className="auth-footer mt-3">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;