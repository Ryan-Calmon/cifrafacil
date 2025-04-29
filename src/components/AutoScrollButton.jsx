// src/components/AutoScrollButton.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/AutoScrollButton.css";

function AutoScrollButton() {
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed] = useState(50);
  const intervalRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".letra-musica");

    if (scrolling && container) {
      intervalRef.current = setInterval(() => {
        container.scrollBy({
          top: 2,
          behavior: "auto",
        });
      }, mapSpeedToInterval(speed));
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [scrolling, speed]);

  const mapSpeedToInterval = (value) => {
    const min = 5;
    const max = 80;
    return max - (value / 100) * (max - min);
  };

  return (
    <div className={isDesktop ? "auto-scroll-desktop" : "auto-scroll-container"}>
      <button
        className={`auto-scroll-button ${scrolling ? "active" : ""}`}
        onClick={() => setScrolling(!scrolling)}
      >
        {scrolling ? "Parar Rolagem" : "Auto-rolar"}
      </button>

      {scrolling && (
        <div className="slider-container">
          <label>Velocidade</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}

export default AutoScrollButton;
