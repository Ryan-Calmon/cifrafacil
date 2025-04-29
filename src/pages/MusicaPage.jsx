// src/pages/MusicaPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import artistas from "../components/ArtistaData";
import "../styles/MusicaPage.css";
import AutoScrollButton from "../components/AutoScrollButton";

function MusicaPage() {
  const { id, musicaId } = useParams();
  const [favoritado, setFavoritado] = useState(false);

  const artista = artistas.find((a) => a.id === id);
  const musica = artista?.musicas.find((m) =>
    m.titulo.replace(/\s+/g, "").toLowerCase() === musicaId
  );

  useEffect(() => {
    const atualizarFavoritado = () => {
      const favoritosSalvos = JSON.parse(localStorage.getItem("favoritos")) || [];
      const jaFavoritado = favoritosSalvos.some(
        (fav) => fav.artistaId === id && fav.musicaId === musicaId
      );
      setFavoritado(jaFavoritado);
    };

    atualizarFavoritado();
    window.addEventListener("storage", atualizarFavoritado);

    return () => window.removeEventListener("storage", atualizarFavoritado);
  }, [id, musicaId]);

  if (!artista) {
    return <h2>Artista não encontrado</h2>;
  }

  if (!musica) {
    return <h2>Música não encontrada</h2>;
  }

  const favoritarCifra = () => {
    const favoritosSalvos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritado) {
      const novosFavoritos = favoritosSalvos.filter(
        (fav) => !(fav.artistaId === id && fav.musicaId === musicaId)
      );
      localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
      setFavoritado(false);
    } else {
      const novosFavoritos = [...favoritosSalvos, { artistaId: id, musicaId: musicaId }];
      localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
      setFavoritado(true);
    }
  };

  return (
    <div className="musica-page">
      <div className="musica-header">
        <img src={artista.imagem} alt={artista.nome} className="musica-artista-img" />

        <div className="musica-info">
          <h1 className="nome-musica">{musica.titulo}</h1>
          <Link to={`/artista/${id}`} className="nome-artista">
            {artista.nome}
          </Link>

          <button onClick={favoritarCifra} className="botao-favoritar">
            {favoritado ? "Remover dos Favoritos" : "Favoritar Cifra"}
          </button>
        </div>
      </div>

      <div className="musica-body">
        <div className="musica-letra">
          <p className="tom-musica">Tom: <b>{musica.tom}</b></p>

          <div
            className="letra-musica"
            dangerouslySetInnerHTML={{ __html: musica.conteudo }}
          />
        </div>

        {musica.youtubeId && (
          <div className="musica-video">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${musica.youtubeId}`}
              title={musica.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            {/* AutoScrollButton agora DENTRO do bloco de vídeo */}
            <AutoScrollButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicaPage;
