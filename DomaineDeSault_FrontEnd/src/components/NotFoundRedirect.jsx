import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-50 shadow-lg bg-body-secondary rounded-3">
      <h2 className="text-danger">La página no se encuentra disponible.</h2>
          <div className="d-flex mt-3">
            <span className="text-secondary">Esta siendo redirigido...&nbsp;&nbsp;</span><span className="spinner-border spinner-border-sm text-primary" role="status"></span>
          </div>
    </div>
  );
};

export default NotFoundRedirect;