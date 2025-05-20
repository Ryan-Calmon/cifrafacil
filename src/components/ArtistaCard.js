import React from "react";
import { Link } from "react-router-dom"; // Importar Link
import "../styles/ArtistaCard.css";

function ArtistaCard({ imagem, nome, posicao, id }) {
  return (
    <div className="artista-card text-center">
      <div className="artista-img-container position-relative">
        <Link to={`/artista/${id}`}> {/* Torna clicável */}
          <img src={imagem} alt={nome} className="artista-img" />
        </Link>
        <div className="artista-posicao">
          {posicao}
        </div>
      </div>
      <p className="artista-nome">{nome}</p>
    </div>
  );
}

export default ArtistaCard;

ArtistaCard <classname=">