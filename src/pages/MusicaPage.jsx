import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  adicionarMusicaEmLista,
} from "../redux/listasSlice";
import {
  adicionarFavorito,
  removerFavorito,
} from "../redux/favoritosSlice";
import { fetchArtistaPorId } from "../redux/artistasSlice";
import "../styles/MusicaPage.css";
import AutoScrollButton from "../components/AutoScrollButton";

function MusicaPage() {
  const { id, musicaId } = useParams();
  const dispatch = useDispatch();
  const [letraHtml, setLetraHtml] = useState("");
  const [erroLetra, setErroLetra] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [nomeListaInput, setNomeListaInput] = useState("");

  const { artistaSelecionado: artista, status } = useSelector(
    (state) => state.artistas
  );
  const listas = useSelector((state) => state.listas.listas);
  const favoritos = useSelector((state) => state.favoritos.lista);

  useEffect(() => {
    dispatch(fetchArtistaPorId(id));
  }, [dispatch, id]);

  const musica = artista?.musicas.find(
    (m) => m.titulo.replace(/\s+/g, "").toLowerCase() === musicaId
  );

  useEffect(() => {
    if (musica?.conteudoUrl) {
      fetch(musica.conteudoUrl)
        .then((res) => res.text())
        .then((html) => {
          setLetraHtml(html);
          setErroLetra(false);
        })
        .catch(() => setErroLetra(true));
    }
  }, [musica]);

  const abrirModal = () => {
    setNomeListaInput("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const confirmarAdicionar = () => {
    if (!nomeListaInput.trim()) return;

    const listaExistente = listas.find(
      (l) => l.nome.toLowerCase() === nomeListaInput.trim().toLowerCase()
    );

    if (listaExistente) {
      dispatch(
        adicionarMusicaEmLista({
          nomeLista: listaExistente.nome,
          artistaId: id,
          musicaId,
        })
      );
    } else {
      dispatch(
        adicionarMusicaEmLista({
          nomeLista: nomeListaInput.trim(),
          artistaId: id,
          musicaId,
        })
      );
    }

    fecharModal();
  };

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
        <img
          src={artista.imagem}
          alt={artista.nome}
          className="musica-artista-img"
        />
        <div className="musica-info">
          <h1 className="nome-musica">{musica.titulo}</h1>
          <Link to={`/artista/${id}`} className="nome-artista">
            {artista.nome}
          </Link>
          <div className="botoes-lista">
          <button
            onClick={toggleFavorito}
            className={`botao-joinha ${favoritado ? "ativo" : ""}`}
            title={favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            aria-label="Favoritar música"
          >
            👍
          </button>

          <button onClick={abrirModal} className="botao-adicionar-lista">
            Adicionar à lista
          </button>
          </div>
        </div>
      </div>

      <div className="musica-body">
        <div className="musica-letra">
          <p className="tom-musica">
            Tom: <b>{musica.tom}</b>
          </p>

          <div
            className="letra-musica"
            dangerouslySetInnerHTML={{
              __html: erroLetra ? "<p>Erro ao carregar letra 😢</p>" : letraHtml,
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

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Adicionar à Lista</h3>
            <input
              type="text"
              placeholder="Nome da lista"
              value={nomeListaInput}
              onChange={(e) => setNomeListaInput(e.target.value)}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={confirmarAdicionar}>Confirmar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicaPage;
