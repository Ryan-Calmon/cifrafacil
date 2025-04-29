// src/pages/ArtistaPage.jsx
import { Link } from "react-router-dom";
import React from "react";
import { useParams } from "react-router-dom";
import artistas from "../components/ArtistaData";
import "../styles/ArtistaPage.css"; // ajuste o caminho se precisar


function ArtistaPage() {
  const { id } = useParams();
  const artista = artistas.find((art) => art.id === id);

  if (!artista) {
    return <h2>Artista não encontrado</h2>;
  }

  return (
    <div className="artista-page">
      <div className="artista-header">
      <img className="artista-id-img" src={artista.imagem} alt={artista.nome}  />
      <div className="artista-info">
      <h1 className="artista-nome">{artista.nome}</h1>
      <button className="virar-fa">Virar fã</button>
      </div>
      </div>
      <h3 className="mais-acessos">Músicas mais acessadas:</h3>
        <div className="musicas-mais-acessadas">
  {artista.musicas.map((musica, index) => (
    <div key={index} className="musica-item">
      <span className="musica-numero">{index + 1}</span>
      <Link to={`/artista/${artista.id}/musica/${musica.titulo.replace(/\s+/g, "").toLowerCase()}`} className="musica-nome">
        {musica.titulo}
      </Link>
    </div>
  ))}
</div>
    </div>
  );
}

export default ArtistaPage;
