// ..\Domaine-Du-Salt> npm run dev

import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import RoomsSection from "./components/RoomsSection";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import LocationSection from "./components/LocationSection";
import Footer from "./components/Footer";
import RoomDetail from "./components/RoomDetail";
import ScrollToTop from "./components/ScrollToTop";
import ContactSection from "./components/ContactSection";
import BookingForm from "./components/BookingForm";
import Accommodation from "./components/Accommodation";
import AccommodationDetails from "./components/AccomodationDetails";

//componentes del login y registro
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ConfirmAccount from "./components/auth/ConfirmAccount";

//pagina no encontrada
import NotFoundRedirect from "./components/NotFoundRedirect";

// Para la vista de reservas del cliente
import MisReservas from "./components/client/MisReservas";

// Para la vista de datos del cliente
import MisDatos from "./components/client/MisDatos";


function AppContent() {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* Ruta donde ocultar Navbar*/
  const location = useLocation();

  const knownRoutes = [
    "/",
    "/login",
    "/register",
    "/confirm-account",
    "/room/:roomId",
    "/accommodation/:section",
    "/mis-reservas",
    "/mis-datos"
  ];
  // Verificar si la ruta actual coincide con alguna de las rutas conocidas
  const isKnownRoute = knownRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  // Ocultar el Navbar en las rutas de login, registro, confirmación de cuenta y rutas no conocidas
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/confirm-account"||
    !isKnownRoute;

  // Detectar cambios en el tamaño de la ventana para actualizar el estado de isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    /*  <Router> */
    <>
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      {/* <Navbar /> */}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              {isMobile && <BookingForm />}
              <RoomsSection />
              <Accommodation />
              <LocationSection />
              <ContactSection />
              <TestimonialsCarousel />
              <Footer />
            </>
          }
        />
        <Route path="/room/:roomId" element={<RoomDetail />} />
        <Route path="/accommodation/:section" element={<AccommodationDetails />} />

        {/* Rutas del auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-account" element={<ConfirmAccount />} />
        <Route path="*" element={<NotFoundRedirect />} />

        {/* Rutas para el cliente autenticado */}
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/mis-datos" element={<MisDatos />} />

      </Routes>

      {/*  </Router> */}
    </>
  );

}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
