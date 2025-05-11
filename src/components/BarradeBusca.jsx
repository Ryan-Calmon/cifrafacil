import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchArtistas } from "../redux/artistasSlice";
import "../styles/BarradeBusca.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function BarraDeBusca() {
  const dispatch = useDispatch();
  const { lista: artistas, status } = useSelector((state) => state.artistas);
  const [termo, setTermo] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArtistas());
    }
  }, [dispatch, status]);

  const termoLower = termo.toLowerCase().trim();

  const artistasFiltrados = artistas.filter((artista) =>
    artista.nome.toLowerCase().includes(termoLower)
  );

  const musicasFiltradas = artistas.flatMap((artista) =>
    artista.musicas
      .filter((musica) =>
        musica.titulo.toLowerCase().includes(termoLower)
      )
      .map((musica) => ({
        artistaId: artista.id,
        artistaNome: artista.nome,
        artistaImagem: artista.imagem,
        musicaId: musica.titulo.replace(/\s+/g, "").toLowerCase(),
        musicaTitulo: musica.titulo,
      }))
  );

  return (
    <div className="buscar-wrapper">
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

      {termo && (
        <div className="resultados-busca">
          {artistasFiltrados.length > 0 && (
            <>
              <h4>Artistas</h4>
              {artistasFiltrados.map((artista) => (
                <Link
                  to={`/artista/${artista.id}`}
                  key={artista.id}
                  className="resultado-item"
                >
                  <img src={artista.imagem} alt={artista.nome} className="foto-artista" />
                  <span>{artista.nome}</span>
                </Link>
              ))}
            </>
          )}

          {musicasFiltradas.length > 0 && (
            <>
              <h4>Músicas</h4>
              {musicasFiltradas.map((musica, index) => (
                <Link
                  to={`/artista/${musica.artistaId}/musica/${musica.musicaId}`}
                  key={index}
                  className="resultado-item"
                >
                  <img src={musica.artistaImagem} alt={musica.artistaNome} className="foto-artista" />
                  <span>{musica.musicaTitulo} - {musica.artistaNome}</span>
                </Link>
              ))}
            </>
          )}

          {artistasFiltrados.length === 0 && musicasFiltradas.length === 0 && (
            <p className="nenhum-resultado">Nenhum resultado encontrado 😢</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BarraDeBusca;
