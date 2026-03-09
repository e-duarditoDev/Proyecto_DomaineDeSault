import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password === confirmPassword;

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.match(/[A-Za-z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 1) return "Débil";
    if (strength === 2) return "Media";
    if (strength === 3) return "Fuerte";
    return "Muy fuerte";
  };

  const strength = getPasswordStrength(password);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess("");

    try {
      //Campos obligatorios
      if (!email || !password) throw new Error("Por favor, facilite un email y contraseña.");
      
      //llamada a la API
      const response = await fetch("/auth/registro-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ email, password })
      });

      //capturar lo que venga de la API
      const apiMessage = await response.text();

      if (!response.ok) {
        throw new Error("Ha ocurrido un error. " + apiMessage || "Error inesperado.");
      }

      //mensaje de ok
      setSuccess("Por favor, revise su correo para confirmar la cuenta.")

      //limpiar formulario
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setLoading(true);


    } catch (err) {
      setError(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="auth-container bg-body-tertiary">

      <div className="logo-auth position-absolute top-0 start-0 ms-3">
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
        <h2>Registrarse</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* DE DANIE, EXPLICARLE LA LOGICA         
          
          <label className="form-label">Name</label> 
          <input
            className="form-control mb-3"
            type="name"
            //value={name}
            //onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <label className="form-label">Surname</label>
          <input
            className="form-control mb-3"
            type="surname"
            //value={surname}
            //onChange={(e) => setSurname(e.target.value)}
            placeholder="Surname"
          /> */}

          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="input-group mb-3">
            <input
              id="email"
              className="form-control mb-3 w-100"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce un email."
            />
          </div>

          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <div className="input-group mb-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              placeholder="Introduce tu contraseña"
            />
            <button
              type="button"
              className="btn btn-clear focus-ring"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <img className="eye-off" src="/icons/eye-open-svgrepo-com.svg" alt="Ocultar" />
                : <img className="eye-on" src="/icons/eye-closed-svgrepo-com.svg" alt="Mostar" />}
            </button>
          </div>

          <label htmlFor="confirmPassword" className="form-label">
            Repetir
          </label>
          <div className="input-group mb-1">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              className={`form-control ${confirmPassword
                ? passwordsMatch
                  ? "is-valid"
                  : "is-invalid"
                : ""
                }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              className="btn btn-clear focus-ring"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm
                ? <img className="eye-off" src="/icons/eye-open-svgrepo-com.svg" />
                : <img className="eye-on" src="/icons/eye-closed-svgrepo-com.svg" alt="Mostar" />}
            </button>
          </div>

          {confirmPassword && passwordsMatch && (
            <div className="valid-feedback d-block mb-3">
              Las contraseñas coinciden
            </div>
          )}

          {confirmPassword && !passwordsMatch && (
            <div className="invalid-feedback d-block mb-3">
              Las contraseñas no coinciden
            </div>
          )}

          <div id="progress-bar" className="progress mb-2 mt-2" style={{ height: "15px" }}>
            <div
              className={`progress-bar progress-bar-striped
              ${strength <= 1 ? "bg-danger" :
                  strength === 2 ? "bg-warning" :
                    strength === 3 ? "bg-info" :
                      "bg-success"}`}
              style={{ width: `${(strength / 4) * 100}%` }}
            >
            </div>
          </div>
          <div className="text-center">
            {strength > 0 && (
              <label htmlFor="progress-bar" className="text-secondary-emphasis">
                {getStrengthLabel(strength)}
              </label>
            )}
          </div>

          <button className="btn btn-outline-dark w-100 mt-4" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Accede</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;