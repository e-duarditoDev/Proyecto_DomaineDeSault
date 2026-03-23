import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisDatos = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentoIdentidad: "",
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    telefono: "",
    direccionDto: {
      calle: "",
      numero: "",
      codigoPostal: "",
      provincia: "",
      localidad: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const cargarMisDatos = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/cliente/mis-datos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          throw new Error("Tu sesión ha expirado. Vuelve a iniciar sesión.");
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "No se pudieron cargar tus datos.");
        }

        const data = await response.json();

        // Si backend devuelve null, dejamos el formulario vacío
        if (data) {
          setFormData({
            documentoIdentidad: data.documentoIdentidad || "",
            nombre: data.nombre || "",
            primerApellido: data.primerApellido || "",
            segundoApellido: data.segundoApellido || "",
            telefono: data.telefono || "",
            direccionDto: {
              calle: data.direccionDto?.calle || "",
              numero: data.direccionDto?.numero || "",
              codigoPostal: data.direccionDto?.codigoPostal ?? "",
              provincia: data.direccionDto?.provincia || "",
              localidad: data.direccionDto?.localidad || ""
            }
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarMisDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      direccionDto: {
        ...prev.direccionDto,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        direccionDto: {
          ...formData.direccionDto,
          codigoPostal:
            formData.direccionDto.codigoPostal === ""
              ? null
              : Number(formData.direccionDto.codigoPostal)
        }
      };

      const response = await fetch("/api/cliente/mis-datos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        throw new Error("Tu sesión ha expirado. Vuelve a iniciar sesión.");
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const errorData = await response.json();

          if (typeof errorData === "object" && errorData !== null) {
            const firstError = Object.values(errorData)[0];
            throw new Error(firstError || "Revisa los campos del formulario.");
          }
        }

        const errorText = await response.text();
        throw new Error(errorText || "No se pudieron guardar tus datos.");
      }

      setSuccess("Tus datos se han guardado correctamente.");

      // Redirección opcional
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: "120px" }}>
        <p>Cargando tus datos...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "120px", maxWidth: "900px" }}>
      <div className="card shadow-sm p-4">
        <h2 className="mb-4">Mis datos</h2>

        <p className="text-muted">
          Completa tus datos personales para poder guardar y pagar reservas.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Primer apellido</label>
              <input
                type="text"
                name="primerApellido"
                className="form-control"
                value={formData.primerApellido}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Segundo apellido</label>
              <input
                type="text"
                name="segundoApellido"
                className="form-control"
                value={formData.segundoApellido}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Documento de identidad</label>
              <input
                type="text"
                name="documentoIdentidad"
                className="form-control"
                value={formData.documentoIdentidad}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className="my-4" />

          <h4 className="mb-3">Dirección</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Calle</label>
              <input
                type="text"
                name="calle"
                className="form-control"
                value={formData.direccionDto.calle}
                onChange={handleDireccionChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Número</label>
              <input
                type="text"
                name="numero"
                className="form-control"
                value={formData.direccionDto.numero}
                onChange={handleDireccionChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Código postal</label>
              <input
                type="number"
                name="codigoPostal"
                className="form-control"
                value={formData.direccionDto.codigoPostal}
                onChange={handleDireccionChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Provincia</label>
              <input
                type="text"
                name="provincia"
                className="form-control"
                value={formData.direccionDto.provincia}
                onChange={handleDireccionChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Localidad</label>
              <input
                type="text"
                name="localidad"
                className="form-control"
                value={formData.direccionDto.localidad}
                onChange={handleDireccionChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-dark px-4"
              onClick={() => navigate("/")}
            >
              Salir
            </button>

            <button
              type="submit"
              className="btn btn-outline-dark px-3"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MisDatos;