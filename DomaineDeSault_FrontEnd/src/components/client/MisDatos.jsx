import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MisDatos = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  const [infoMessage, setInfoMessage] = useState("");


  useEffect(() => {
    const cargarMisDatos = async () => {
      setError("");
      try {
        setError("");
        setInfoMessage("");

        const token = localStorage.getItem("token");

        const response = await fetch("/api/cliente/mis-datos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          throw new Error(t("misDatos.messages.sessionExpired"));
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || t("misDatos.messages.loadError"));
        }

        const responseText = await response.text();//return ResponseEntity.ok().body(null); fecth lo trata como cuerpo vacio no como null
        const data = responseText.trim() ? JSON.parse(responseText) : null;

        // Caso 1: primer acceso, backend devuelve null
        if (data == null) {
          setInfoMessage(t("misDatos.messages.firstAccess"));
          return;
        }

        const newFormData = {
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
        };

        setFormData(newFormData);

        // Caso 2: existe objeto pero viene vacío del bakcend
        const formularioVacio =
          !newFormData.documentoIdentidad &&
          !newFormData.nombre &&
          !newFormData.primerApellido &&
          !newFormData.segundoApellido &&
          !newFormData.telefono &&
          !newFormData.direccionDto.calle &&
          !newFormData.direccionDto.numero &&
          !newFormData.direccionDto.codigoPostal &&
          !newFormData.direccionDto.provincia &&
          !newFormData.direccionDto.localidad;

        if (formularioVacio) {
          setInfoMessage(t("misDatos.messages.completeToContinue"));
        }

        /*     // Si backend devuelve null, dejamos el formulario vacío
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
            } */




      } catch (err) {
        setError(err.message || t("misDatos.messages.loadCatchError"));
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
        throw new Error(t("misDatos.messages.sessionExpired"));
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const errorData = await response.json();

          if (typeof errorData === "object" && errorData !== null) {
            const firstError = Object.values(errorData)[0];
            throw new Error(firstError || t("misDatos.messages.reviewFields"));
          }
        }

        const errorText = await response.text();
        throw new Error(errorText || t("misDatos.messages.saveError"));
      }

      setSuccess(t("misDatos.messages.saveSuccess"));

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
        <p>{t("misDatos.loading")}</p>
      </div>
    );
  }

  return (
    <div className="container w-50 pb-4 pt-5 mb-2">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4">{t("misDatos.title")}</h2>

        {infoMessage && (
          <div className="alert alert-primary text-center fs-5 fw-semibold">
            {infoMessage}
          </div>
        )}
        {error &&
          <div className="alert alert-danger">
            {error}
          </div>}
        {success &&
          <div className="alert alert-success">
            {success}
          </div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.form.name")}</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={30}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                title={t("misDatos.validation.onlyLetters")}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.form.firstSurname")}</label>
              <input
                type="text"
                name="primerApellido"
                className="form-control"
                value={formData.primerApellido}
                onChange={handleChange}
                maxLength={50}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                title={t("misDatos.validation.onlyLetters")}
                required
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
                maxLength={50}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                title={t("misDatos.validation.onlyLetters")}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.form.identityDocument")}</label>
              <input
                type="text"
                name="documentoIdentidad"
                className="form-control"
                value={formData.documentoIdentidad}
                onChange={handleChange}
                maxLength={15}
                //no metemos pattern porque nos complica validar un dni frances, aleman, espanol, nies de cada pais, pasaportes, una locura
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.form.phone")}</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                maxLength={18}
                minLength={9}
                pattern="^\+?\d+$"
                title={t("misDatos.validation.validPhone")}
                required
              />
            </div>
          </div>

          <hr className="my-4" />

          <h4 className="mb-3">{t("misDatos.address.title")}</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.address.street")}</label>
              <input
                type="text"
                name="calle"
                className="form-control"
                value={formData.direccionDto.calle}
                onChange={handleDireccionChange}
                maxLength={80}
                minLength={2}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                title={t("misDatos.validation.lettersOnly")}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">{t("misDatos.address.number")}</label>
              <input
                type="text"
                name="numero"
                className="form-control"
                value={formData.direccionDto.numero}
                onChange={handleDireccionChange}
                maxLength={10}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$"
                title={t("misDatos.validation.houseNumber")}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">{t("misDatos.address.postalCode")}</label>
              <input
                type="text"
                name="codigoPostal"
                className="form-control"
                value={formData.direccionDto.codigoPostal}
                onChange={handleDireccionChange}
                maxLength={10}
                minLength={5}
                pattern="^\d+$"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.address.province")}</label>
              <input
                type="text"
                name="provincia"
                className="form-control"
                value={formData.direccionDto.provincia}
                onChange={handleDireccionChange}
                maxLength={30}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">{t("misDatos.address.city")}</label>
              <input
                type="text"
                name="localidad"
                className="form-control"
                value={formData.direccionDto.localidad}
                onChange={handleDireccionChange}
                maxLength={30}
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
                required
              />
            </div>
          </div>

          <div className="d-flex gap-3 mt-3 justify-content-end flex-md-row flex-column">
            <button
              type="button"
              className="btn btn-outline-dark px-4"
              onClick={() => navigate("/")}
            >
              {t("misDatos.actions.exit")}
            </button>

            <button
              type="submit"
              className="btn btn-outline-dark px-3"
              disabled={saving}
            >
              {saving ? t("misDatos.actions.saving") : t("misDatos.actions.save")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MisDatos;