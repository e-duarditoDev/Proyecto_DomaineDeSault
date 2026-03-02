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
      // De momento solo simulamos. Luego conectamos API.
      // Aquí irá tu fetch("/api/auth/login", ...)
      if (!email || !password) throw new Error("Rellena email y contraseña.");

      // Simulación: guardamos un token falso (solo para probar flujo)
      localStorage.setItem("token", "FAKE_TOKEN_DEV");

      navigate("/"); // vuelve a Home
    } catch (err) {
      setError(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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