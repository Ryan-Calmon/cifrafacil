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

const escala = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function notaToIndex(nota) {
  if (nota.length === 2 && nota[1] === "b") {
    const mapBemol = {
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
    };
    return escala.indexOf(mapBemol[nota] || nota);
  }
  return escala.indexOf(nota);
}

function indexToNota(index) {
  return escala[(index + 12) % 12];
}

function extrairNotaBase(tom) {
  const match = tom.match(/^([A-G](?:#|b)?)/);
  if (match) return match[1];
  return tom;
}

function extrairRestoTom(tom) {
  const match = tom.match(/^[A-G](?:#|b)?(.*)$/);
  if (match) return match[1];
  return "";
}

function transporAcorde(acorde, semitons) {
  const match = acorde.match(/^([A-G](?:#|b)?)(.*)$/);
  if (!match) return acorde;

  const [, notaBase, resto] = match;
  const idx = notaToIndex(notaBase);
  if (idx === -1) return acorde;

  const novaNota = indexToNota(idx + semitons);
  return novaNota + resto;
}

function transporLetraHtml(html, semitons) {
  return html.replace(/<b>([^<]+)<\/b>/g, (full, acorde) => {
    const transposto = transporAcorde(acorde, semitons);
    return `<b>${transposto}</b>`;
  });
}

function MusicaPage() {
  const { id, musicaId } = useParams();
  const dispatch = useDispatch();
  const [letraOriginal, setLetraOriginal] = useState("");
  const [letraHtml, setLetraHtml] = useState("");
  const [erroLetra, setErroLetra] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [nomeListaInput, setNomeListaInput] = useState("");

  const { artistaSelecionado: artista, status } = useSelector(
    (state) => state.artistas
  );
  const listas = useSelector((state) => state.listas.listas);
  const favoritos = useSelector((state) => state.favoritos.lista);

  const [comentarios, setComentarios] = useState([]);
  const [autorComentario, setAutorComentario] = useState("");
  const [novoComentario, setNovoComentario] = useState("");

  const [tomAtual, setTomAtual] = useState("");
  const [indiceTom, setIndiceTom] = useState(0);
  const [indiceTomOriginal, setIndiceTomOriginal] = useState(0);

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
          setErroLetra(false);
          setLetraOriginal(html);

          const baseTom = musica.tom || "C";
          setTomAtual(baseTom);

          const baseNota = extrairNotaBase(baseTom);
          let idx = notaToIndex(baseNota);
          if (idx === -1) idx = 0;
          setIndiceTom(idx);
          setIndiceTomOriginal(idx);

          setLetraHtml(html);
        })
        .catch(() => {
          setErroLetra(true);
          setLetraOriginal("");
          setLetraHtml("");
        });
    }
  }, [musica]);

  useEffect(() => {
    if (!musicaId) return;

    fetch(`http://localhost:3001/comentarios/${musicaId}`)
      .then((res) => res.json())
      .then((data) => setComentarios(data))
      .catch(() => setComentarios([]));
  }, [musicaId]);

  const alterarTom = (incremento) => {
    if (!tomAtual) return;

    let novoIndice = (indiceTom + incremento + 12) % 12;
    const restoTom = extrairRestoTom(tomAtual);
    const novoTom = indexToNota(novoIndice) + restoTom;

    const deslocamento = novoIndice - indiceTomOriginal;
    const novaLetraHtml = transporLetraHtml(letraOriginal, deslocamento);

    setTomAtual(novoTom);
    setIndiceTom(novoIndice);
    setLetraHtml(novaLetraHtml);
  };

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

  const enviarComentario = () => {
    if (!autorComentario.trim() || !novoComentario.trim()) return;

    fetch("http://localhost:3001/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        musicaId,
        autor: autorComentario.trim(),
        texto: novoComentario.trim(),
      }),
    })
      .then((res) => res.json())
      .then((comentario) => {
        setComentarios([...comentarios, comentario]);
        setAutorComentario("");
        setNovoComentario("");
      });
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
            Tom: <b>{tomAtual}</b>{" "}
            <button
              className="botao-tom"
              onClick={() => alterarTom(-1)}
              aria-label="Diminuir tom"
              style={{ marginLeft: "1rem" }}
              title="Diminuir tom"
            >
              -
            </button>
            <button
              className="botao-tom"
              onClick={() => alterarTom(1)}
              aria-label="Aumentar tom"
              title="Aumentar tom"
              style={{ marginLeft: "0.5rem" }}
            >
              +
            </button>
          </p>

          <div
            className="letra-musica"
            dangerouslySetInnerHTML={{
              __html: erroLetra
                ? "<p>Erro ao carregar letra 😢</p>"
                : letraHtml,
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

      <div className="comentarios-section" style={{ marginTop: "2rem" }}>
        <h2>Comentários</h2>

        {comentarios.length === 0 && <p>Seja o primeiro a comentar!</p>}

        <ul>
          {comentarios.map(({ id, autor, texto, data }) => (
            <li key={id} style={{ marginBottom: "1rem" }}>
              <strong>{autor}</strong>{" "}
              <em>em {new Date(data).toLocaleString()}</em>
              <p>{texto}</p>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Seu nome"
            value={autorComentario}
            onChange={(e) => setAutorComentario(e.target.value)}
            style={{ width: "200px", marginRight: "1rem" }}
          />
          <textarea
            placeholder="Deixe seu comentário"
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            rows={3}
            style={{ width: "400px", verticalAlign: "top" }}
          />
          <br />
          <button onClick={enviarComentario} style={{ marginTop: "0.5rem" }}>
            Enviar Comentário
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicaPage;
