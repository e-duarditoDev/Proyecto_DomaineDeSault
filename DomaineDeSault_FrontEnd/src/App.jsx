// ..\Domaine-Du-Salt> npm run dev

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    <Router>
      <ScrollToTop />
      <Navbar />
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
      </Routes>
    </Router>
  );
}

export default App;
