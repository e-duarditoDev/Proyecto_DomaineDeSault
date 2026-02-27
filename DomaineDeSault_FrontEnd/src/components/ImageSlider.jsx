import { useState } from "react";
import "./ImageSlider.css";

const ImageSlider = ({ images = [], onClick }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <div className="slider-container">
      {/* Imagen mostrada */}
      <img
        src={images[index]}
        alt="room"
        className="slider-image fade"
        onClick={onClick}
        onError={(e) => (e.target.src = "/photos/placeholder.png")}
      />

      {/* Flecha izquierda */}
      <button className="slider-arrow left" onClick={prev}>
        ‹
      </button>

      {/* Flecha derecha */}
      <button className="slider-arrow right" onClick={next}>
        ›
      </button>
    </div>
  );
};

export default ImageSlider;
