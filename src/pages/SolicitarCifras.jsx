import React, { useState } from "react";
import "../styles/SolicitarCifras.css";

function SolicitarCifras() {
  const [musica, setMusica] = useState("");
  const [artista, setArtista] = useState("");
  const [youtube, setYoutube] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [toast, setToast] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      musica,
      artista,
      youtube,
      arquivo
    });

    setToast("Solicitação enviada com sucesso! 🎶");

    setTimeout(() => {
      setToast("");
      setMusica("");
      setArtista("");
      setYoutube("");
      setArquivo(null);
    }, 2500);
  };

  return (
    <div className="solicitar-page">
      
      <form className="solicitar-form" onSubmit={handleSubmit}>
      <h2 className="titulo">Solicitar Cifras</h2>
        <input
          type="text"
          placeholder="Nome da música"
          value={musica}
          onChange={(e) => setMusica(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artista"
          value={artista}
          onChange={(e) => setArtista(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL do Youtube"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />
        <label className="custom-file-upload">
          Anexar Cifra (.doc)
          <input
            type="file"
            onChange={(e) => setArquivo(e.target.files[0])}
          />
        </label>
        <button type="submit" className="botao-enviar">
          Enviar
        </button>
      </form>

      {/* Toast de sucesso */}
      {toast && (
        <div className="toast show">{toast}</div>
      )}
    </div>
  );
}

export default SolicitarCifras;
