import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Este componente se encarga de controlar el desplazamiento (scroll) porque react-router-dom no
// lo hace automáticamente. Se asegura de que la página se desplace al inicio
// al cambiar de ruta o al navegar con un hash (#seccion) en la URL.
export default function ScrollToTop() {
  // useLocation permite obtener la información de la URL actual.
  // Se extraen las propiedades pathname (ruta) y hash (fragmento de ancla).
  const { pathname, hash } = useLocation();

  // Este efecto se ejecuta cada vez que cambian el pathname o el hash.
  // Si no hay hash (ninguna sección específica), se sube al inicio de la página.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  // Este otro efecto se ejecuta cuando existe un hash.
  // Busca el elemento del DOM correspondiente al selector del hash
  // y realiza un desplazamiento suave hacia esa parte de la página.
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  // El componente no renderiza nada visible en pantalla.
  return null;
}
