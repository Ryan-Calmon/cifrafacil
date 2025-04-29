import React, { useState } from "react";
import "../styles/BuscarCifra.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import artistas from "../components/ArtistaData"; 
import { Link } from "react-router-dom"; // <-- Importante para navegar

function Buscarcifra() {
  const [termo, setTermo] = useState("");

  const resultados = artistas.filter((artista) =>
    artista.nome.toLowerCase().includes(termo.toLowerCase())
  );

  return (
    <div className="buscar-page">
      <div className="input-group input-group-buscar">
        <div className="input-icon">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input
          className="input-field"
          type="text"
          placeholder="O que você quer tocar hoje?"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
      </div>

      <div className="resultados-busca">
        {termo && resultados.length > 0 ? (
          resultados.map((artista) => (
            <Link 
              to={`/artista/${artista.id}`} 
              key={artista.id} 
              className="resultado-item"
            >
              <img src={artista.imagem} alt={artista.nome} className="foto-artista" />
              <span>{artista.nome}</span>
            </Link>
          ))
        ) : termo ? (
          <p className="nenhum-resultado">Nenhum artista encontrado 😢</p>
        ) : null}
      </div>
    </div>
  );
}

export default Buscarcifra;
