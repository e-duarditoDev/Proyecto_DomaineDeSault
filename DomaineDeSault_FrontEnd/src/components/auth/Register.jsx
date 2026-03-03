import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess("");

    try {
      // De momento simulamos registro.
      if (!email || !password) throw new Error("Rellena email y contraseña.");
    //capturar lo que venga de la ruta auth/registro-mail de la API
    const response = await fetch("/auth/registro-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify({email,password})
    });

    const apiMessage = await response.text();

    if (!response.ok) {
      throw new Error("Error en registro: "+apiMessage);
    }

    //mensaje de ok
    setSuccess ("Por favor, revise su correo para confirmar la cuenta.")

    //limpiar formulario
    setEmail("");
    setPassword("");

/*       setMessage(""); */
      setLoading(true);

 /*    try {
      // De campos obligatorios
      if (!email || !password) throw new Error("Rellena email y contraseña.");

      // Mensaje exitoso
      setMessage(
        "Te hemos enviado un email de verificación. Revisa tu bandeja y completa el registro."
      ); */

      // Aquí luego irá tu fetch("/api/auth/register", ...)
    } catch (err) {
      setError(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registrarse</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
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
          />
          <label className="form-label">Email</label>
          <input
            className="form-control mb-3"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@email.com"
          />

          <label className="form-label">Contraseña</label>
          <input
            className="form-control mb-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          <button className="btn btn-outline-dark w-100" disabled={loading}>
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