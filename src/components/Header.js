import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../Images/logocifra.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import FirstLetter from "./Primeiraletra";
import artistas from "../components/ArtistaData"; // <- Novo! onde ficam todos os artistas cadastrados.

function Header({ username }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");
  const resultadosRef = useRef(null);

  const isHomePage = location.pathname === "/";

  const artistasFiltrados = artistas.filter((artista) =>
    artista.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  // Fechar popup ao clicar fora ou ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultadosRef.current && !resultadosRef.current.contains(event.target)) {
        setTermoBusca("");
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setTermoBusca("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header>
      <div className="container">
        <div className="row header-row">
          <div className="col-8 col-md-3 col-lg-2 col-xl-2">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Cifra Fácil Logo" />
              </Link>
            </div>
          </div>

          {/* Campo de busca */}
          {!isHomePage && (
            <div className="col-8 col-lg-4 col-xl-4 d-lg-block d-none d-xl-block">
              <div className="input-group">
                <div className="input-icon">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <input
                  className="input-field"
                  type="text"
                  placeholder="O que você quer tocar hoje?"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              {/* Resultados filtrados */}
              {termoBusca && (
                <div ref={resultadosRef} className="resultados-busca-popup-header">
                  {artistasFiltrados.length > 0 ? (
                    artistasFiltrados.map((artista) => (
                      <div
                        key={artista.id}
                        className="resultado-item"
                        onClick={() => {
                          navigate(`/artista/${artista.id}`);
                          setTermoBusca("");
                        }}
                      >
                        <img src={artista.imagem} alt={artista.nome} className="foto-artista" />
                        <span>{artista.nome}</span>
                      </div>
                    ))
                  ) : (
                    <p className="nenhum-resultado">Nenhum artista encontrado 😢</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navegação e Username */}
          <div className="col-md-6 col-lg-4 col-xl-4 d-none d-md-block d-lg-block d-xl-block">
            <nav className="navegacao-topo">
              <Link className="menuzin-header" to="/listas">Suas Listas</Link>
              <Link className="menuzin-header" to="/SolicitarCifras">Enviar Cifras</Link>
              <Link className="menuzin-header">Olá, {username}</Link>
            </nav>
          </div>
          <div className="col col-md-1 col-lg-1 col-xl-1">
            <div className="username-topo">
              <div className="username">
                <FirstLetter name={username} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
