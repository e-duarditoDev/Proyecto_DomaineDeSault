import React, { useState, useEffect } from "react";
// Importamos React y el hook useState para manejar el estado dentro del componente.

import { useTranslation } from "react-i18next";
// Importamos useTranslation para poder traducir los textos según el idioma activo.

import "./Navbar.css";
// Importamos la hoja de estilos correspondiente a la barra de navegación.

import { useNavigate, Link, useLocation } from "react-router-dom";
// Para los botones de autenticacion y registro de usuario

import { isAuthenticated, logout } from "../utils/auth";
// Para las vistas de usuario autenticado

const flags = {
  fr: "/flags/fr.svg",
  en: "/flags/gb.svg",
  es: "/flags/es.svg",
  de: "/flags/de.svg",
};
// Definimos un objeto con las rutas de las banderas que usaremos para cambiar de idioma.

const Navbar = () => {
  // Definimos el componente funcional Navbar.

  const { t, i18n } = useTranslation();
  // Usamos el hook useTranslation para obtener la función t (para traducir)
  // y el objeto i18n (para cambiar o consultar el idioma actual).

  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para controlar si el menú principal está abierto o cerrado.

  const [submenuOpen, setSubmenuOpen] = useState(null);
  // Estado para controlar qué submenú está abierto (null, "rooms", "alojamiento").

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  // Comprobamos si es la versión móvil.

  const rooms = [
    { key: "gite", name: t("rooms.list.gite.name", "Gîte Valentin") },
    { key: "autrefois", name: t("rooms.list.autrefois.name", "Autrefois") },
    { key: "hubert", name: t("rooms.list.hubert.name", "Le Grenier d'Hubert") },
    { key: "salome", name: t("rooms.list.salome.name", "Salomé") },
    { key: "adelaide", name: t("rooms.list.adelaide.name", "Adélaïde") },
    {
      key: "oiseaux",
      name: t("rooms.list.oiseaux.name", "Maison des Oiseaux"),
    },
  ];
  // Lista de habitaciones con claves y nombres traducidos.

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cambiamos el idioma activo.
    localStorage.setItem("i18nextLng", lng); // Guardamos la preferencia.
    setMenuOpen(false); // Cerramos el menú al cambiar de idioma.
  };

  const navigate = useNavigate();
  // Para lo botones de autenticacion y registro de usuario

  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  // Estado para controlar si el usuario está autenticado o no.

  const location = useLocation();
  // Obtenemos la ubicación actual para poder actualizar el estado de autenticación

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setMenuOpen(false);
    setSubmenuOpen(null);
    navigate("/");
  };
  // Función para cerrar sesión: elimina el token, actualiza el estado y redirige al inicio.

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [location.pathname]);
  // Cada vez que cambie la ruta, comprobamos si el usuario sigue autenticado.


  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);
  // Al montar el componente, comprobamos si el usuario está autenticado y actualizamos el estado.

  return (
    <nav className="navbar">
      {/* Estructura principal de la barra de navegación */}

      <div className="logo">
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

      {/* Botón hamburguesa en móvil */}
      <button
        className="hamburger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Lista principal del menú */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Reservar */}
        <li>
          <a href="/#book" onClick={() => setMenuOpen(false)}>
            {t("nav.book")}
          </a>
        </li>

        {/* --------------------- */}
        {/* SUBMENÚ HABITACIONES */}
        {/* --------------------- */}

        <li
          className={`dropdown ${submenuOpen === "rooms" ? "open" : ""}`}
          onMouseEnter={() => !isMobile && setSubmenuOpen("rooms")}
          onMouseLeave={() => !isMobile && setSubmenuOpen(null)}
        >
          <a href="/#lodging" onClick={() => setMenuOpen(false)}>
            {t("nav.lodging")}
          </a>

          {/* Botón toggle solo en móvil */}
          <a
            className="dropdown-toggle"
            aria-label="Mostrar habitaciones"
            aria-expanded={submenuOpen === "rooms"}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (isMobile)
                setSubmenuOpen(submenuOpen === "rooms" ? null : "rooms");
            }}
          >
            <span className="arrow">▼</span>
          </a>

          {/* Contenido del submenú */}
          {submenuOpen === "rooms" && (
            <ul className="dropdown-menu open">
              {rooms.map((room) => (
                <li key={room.key}>
                  <a
                    href={`/room/${room.key}`}
                    onClick={() => {
                      setMenuOpen(false);
                      setSubmenuOpen(null);
                    }}
                  >
                    {room.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* -------------------------- */}
        {/* SUBMENÚ EL ALOJAMIENTO     */}
        {/* -------------------------- */}

        <li
          className={`dropdown ${submenuOpen === "alojamiento" ? "open" : ""}`}
          onMouseEnter={() => !isMobile && setSubmenuOpen("alojamiento")}
          onMouseLeave={() => !isMobile && setSubmenuOpen(null)}
        >
          <a href="/#accommodation" onClick={() => setMenuOpen(false)}>
            {t("nav.accommodation")}
          </a>

          {/* Toggle en móvil */}
          <a
            className="dropdown-toggle"
            aria-label="Mostrar alojamiento"
            aria-expanded={submenuOpen === "alojamiento"}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (isMobile)
                setSubmenuOpen(
                  submenuOpen === "alojamiento" ? null : "alojamiento",
                );
            }}
          >
            <span className="arrow">▼</span>
          </a>

          {/* Submenú de Alojamiento */}
          {submenuOpen === "alojamiento" && (
            <ul className="dropdown-menu open">
              <li>
                <a
                  href="/accommodation/common-areas"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("accommodation.menu.commonAreas")}
                </a>
              </li>
              <li>
                <a
                  href="/accommodation/services"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("accommodation.menu.services")}
                </a>
              </li>
              <li>
                <a
                  href="/accommodation/what-to-do"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("accommodation.menu.whatToDo")}
                </a>
              </li>
              <li>
                <a href="/#reviews" onClick={() => setMenuOpen(false)}>
                  {t("accommodation.menu.reviews")}
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Enlaces restantes */}
        <li>
          <a href="/#location" onClick={() => setMenuOpen(false)}>
            {t("nav.location")}
          </a>
        </li>
        <li>
          <a href="/#contact" onClick={() => setMenuOpen(false)}>
            {t("nav.contact")}
          </a>
        </li>

        {authenticated && (
          <>
            <li>
              <a
                className="client-link"
                href="/mis-reservas"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  navigate("/mis-reservas");
                }}
              >
                Mis reservas
              </a>
            </li>
            <li>
              <a
                className="client-link"
                href="/mis-datos"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  navigate("/mis-datos");
                }}
              >
                Mis datos
              </a>
            </li>
          </>)}
      </ul>


      <div className="auth-language-wrapper">

        {/* Selector de idioma */}
        <div className="language-switcher">
          {Object.entries(flags).map(([lng, src]) => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={i18n.language === lng ? "active-lang" : ""}
              title={t(`languages.${lng}`)}
            >
              <img src={src} alt={lng} width="32" height="20" />
            </button>
          ))}
        </div>

        {/* -------------------------- */}
        {/* AUTENTICACION */}
        {/* -------------------------- */}

        {/*Botones de acceso y resgistro*/}
        <div className="auth-buttons d-flex gap-3 me-3">
          {!authenticated ? (
            <>
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </button>

              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => navigate("/register")}
              >
                No tengo cuenta
              </button>
            </>
          ) : (
            <>
              {/*               <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/mis-reservas");
                }}
              >
                Mis reservas
              </button> */}

              <button
                className="btn btn-dark btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
// Exportamos el componente para poder usarlo en otras partes de la aplicación.
