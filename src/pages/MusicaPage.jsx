import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adicionarFavorito, removerFavorito } from "../redux/favoritosSlice";
import { fetchArtistaPorId } from "../redux/artistasSlice";
import "../styles/MusicaPage.css";
import AutoScrollButton from "../components/AutoScrollButton";

function MusicaPage() {
  const { id, musicaId } = useParams();
  const dispatch = useDispatch();
  const [letraHtml, setLetraHtml] = useState("");
  const [erroLetra, setErroLetra] = useState(false);

  const { artistaSelecionado: artista, status } = useSelector((state) => state.artistas);
  const favoritos = useSelector((state) => state.favoritos.lista);

  useEffect(() => {
    dispatch(fetchArtistaPorId(id));
  }, [dispatch, id]);

  const musica = artista?.musicas.find(
    (m) => m.titulo.replace(/\s+/g, "").toLowerCase() === musicaId
  );

  useEffect(() => {
    if (musica?.conteudoUrl) {
      console.log("Buscando letra em:", musica.conteudoUrl);
      fetch(musica.conteudoUrl)
        .then((res) => res.text())
        .then((html) => {
          setLetraHtml(html);
          setErroLetra(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar letra:", err);
          setErroLetra(true);
        });
    }
  }, [musica]);

  const favoritado = favoritos.some(
    (fav) => fav.artistaId === id && fav.musicaId === musicaId
  );

  const toggleFavorito = () => {
    if (favoritado) {
      dispatch(removerFavorito({ artistaId: id, musicaId }));
    } else {
      dispatch(adicionarFavorito({ artistaId: id, musicaId }));
    }
  };

  if (status === "loading") return <h2>Carregando artista...</h2>;
  if (!artista) return <h2>Artista não encontrado</h2>;
  if (!musica) return <h2>Música não encontrada</h2>;

  return (
    <div className="musica-page">
      <div className="musica-header">
        <img src={artista.imagem} alt={artista.nome} className="musica-artista-img" />
        <div className="musica-info">
          <h1 className="nome-musica">{musica.titulo}</h1>
          <Link to={`/artista/${id}`} className="nome-artista">
            {artista.nome}
          </Link>
          <button onClick={toggleFavorito} className="botao-favoritar">
            {favoritado ? "Remover dos Favoritos" : "Favoritar Cifra"}
          </button>
        </div>
      </div>

      <div className="musica-body">
        <div className="musica-letra">
          <p className="tom-musica">Tom: <b>{musica.tom}</b></p>

          <div
            className="letra-musica"
            dangerouslySetInnerHTML={{
              __html: erroLetra ? "<p>Erro ao carregar letra 😢</p>" : letraHtml
            }}
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
            <AutoScrollButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicaPage;
