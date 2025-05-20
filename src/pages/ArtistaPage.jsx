// src/pages/ArtistaPage.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtistaPorId,
  limparArtistaSelecionado
} from "../redux/artistasSlice";
import "../styles/ArtistaPage.css";

function ArtistaPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { artistaSelecionado: artista, status, error } = useSelector(
    (state) => state.artistas
  );

  useEffect(() => {
    dispatch(fetchArtistaPorId(id));
    return () => dispatch(limparArtistaSelecionado());
  }, [dispatch, id]);

  if (status === "loading") return <h2>Carregando artista...</h2>;
  if (status === "failed") return <h2>Erro: {error}</h2>;
  if (!artista) return <h2>Artista não encontrado</h2>;

  return (
    <div className="artista-page">
      <div className="artista-header">
        <img className="artista-id-img" src={artista.imagem} alt={artista.nome} />
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
            <Link
              to={`/artista/${artista.id}/musica/${musica.titulo.replace(/\s+/g, "").toLowerCase()}`}
              className="musica-nome"
            >
              {musica.titulo}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtistaPage;

