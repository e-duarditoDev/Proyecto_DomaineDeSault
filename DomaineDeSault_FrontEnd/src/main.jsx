// React.StrictMode me ayuda a detectar errores y buenas prácticas en desarrollo
import { StrictMode } from 'react';

// createRoot es la nueva forma de renderizar en React 18+
import { createRoot } from 'react-dom/client';

// Estilos globales de la aplicación
import './index.css';

// Importar BootStrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Configuración de i18next para tener traducciones
import './i18n';

// Importo el componente principal de la app
import App from './App.jsx';


// Busco el elemento con id "root" en index.html
// y ahí monto toda la aplicación de React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Renderizo el componente principal de la app */}
    <App />
  </StrictMode>,
);