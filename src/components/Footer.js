import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(
    parseInt(localStorage.getItem("activeFooterIndex")) || 0
  );

  useEffect(() => {
    const indicator = document.querySelector(".indicator");
    const footerItems = document.querySelectorAll(".footer-item");
    if (footerItems[activeIndex]) {
      const itemRect = footerItems[activeIndex].getBoundingClientRect();
      const footerRect = footerItems[activeIndex].parentElement.getBoundingClientRect();
      const offsetLeft =
        itemRect.left - footerRect.left + itemRect.width / 2 - 20;
      indicator.style.transform = `translateX(${offsetLeft}px)`;
    }
  }, [activeIndex]);

  const handleSetActive = (index, path) => {
    setActiveIndex(index);
    localStorage.setItem("activeFooterIndex", index);
    navigate(path);
  };

  return (
    <footer className="footer">
      <div
        className={`footer-item ${activeIndex === 0 ? "active" : ""}`}
        onClick={() => handleSetActive(0, "/")}
      >
        <div className="icon-wrapper">
          <img src="/Images/menu inicial.png" className="icon" alt="Menu" />
        </div>
        <span className="Buscar">Menu</span>
      </div>

      <div
        className={`footer-item ${activeIndex === 1 ? "active" : ""}`}
        onClick={() => handleSetActive(1, "/listas")}
      >
        <div className="icon-wrapper">
          <img src="/Images/List.png" className="icon" alt="Suas Listas" />
        </div>
        <span className="Buscar">Suas Listas</span>
      </div>

      <div
        className={`footer-item ${activeIndex === 2 ? "active" : ""}`}
        onClick={() => handleSetActive(2, "/Buscarcifra")}
      >
        <div className="icon-wrapper">
          <img src="/Images/lupa.png" className="icon" alt="Buscar" />
        </div>
        <span className="Buscar">Buscar</span>
      </div>

      <div
        className={`footer-item ${activeIndex === 3 ? "active" : ""}`}
        onClick={() => handleSetActive(3, "/SolicitarCifras")}
      >
        <div className="icon-wrapper">
          <img src="/Images/Solicitar.png" className="icon" alt="Solicitar" />
        </div>
        <span className="Buscar">Solicitar</span>
      </div>

      <div className="indicator"></div>
    </footer>
  );
}

export default Footer;
