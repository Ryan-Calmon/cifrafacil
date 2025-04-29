import React, { useState, useRef, useEffect } from "react";
import "../styles/Home.css";
import logo from "../Images/logocifra.png";
import ArtistaCard from "../components/ArtistaCard";
import imgDjavan from "../Images/djavan.png"; 
import imgCaetano from "../Images/caetanoveloso.png";
import imgChico from "../Images/chicobuarque.png";
import imgSeuJorge from "../Images/seujorge.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Home() {
  const [termoBusca, setTermoBusca] = useState("");
  const resultadosRef = useRef(null); // <- NOVO

  const artistas = [
    { nome: "Djavan", imagem: imgDjavan, posicao: 1, id: "djavan" },
    { nome: "Caetano Veloso", imagem: imgCaetano, posicao: 2, id: "caetanoveloso" },
    { nome: "Chico Buarque", imagem: imgChico, posicao: 3, id: "chicobuarque" },
    { nome: "Seu Jorge", imagem: imgSeuJorge, posicao: 4, id: "seujorge" },
  ];

  const artistasFiltrados = artistas.filter(artista =>
    artista.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  // FECHAR popup ao clicar fora
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
    <div className="page-content">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo logo-centro" />
      </div>

      <div className="input-group input-group-home">
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

      <div className="container-artistas">
        {/* Resultados */}
        {termoBusca && (
          <div ref={resultadosRef} className="resultados-busca-popup">
            {artistasFiltrados.length > 0 ? (
              artistasFiltrados.map((artista) => (
                <Link
                  to={`/artista/${artista.id}`}
                  key={artista.id}
                  className="resultado-item"
                  onClick={() => setTermoBusca("")} // Limpa busca ao clicar
                >
                  <img src={artista.imagem} alt={artista.nome} className="foto-artista" />
                  <span>{artista.nome}</span>
                </Link>
              ))
            ) : (
              <p className="nenhum-resultado">Nenhum artista encontrado 😢</p>
            )}
          </div>
        )}

        <h2 className="em-alta">Em Alta</h2>

        <div className="artista-grid">
          {artistas.map((artista, index) => (
            <div key={index} className="artista-grid-item">
              <ArtistaCard
                imagem={artista.imagem}
                nome={artista.nome}
                posicao={artista.posicao}
                id={artista.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
