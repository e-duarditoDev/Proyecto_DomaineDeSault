import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //llamada a la API
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

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();

      // Guardar token JSON en localStorage
      localStorage.setItem("token", data.token);

      //aqui hay que recuperar el rol y mandar a un sitio u otro (cliente, trabajador)

      //Devolver a home
      navigate("/");

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

          <button className="btn btn-dark w-100" disabled={loading}>
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