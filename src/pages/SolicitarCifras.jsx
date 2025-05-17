import React, { useState } from "react";
import "../styles/SolicitarCifras.css";

function SolicitarCifras() {
  const [musica, setMusica] = useState("");
  const [artista, setArtista] = useState("");
  const [youtube, setYoutube] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [toast, setToast] = useState("");
  const API_BASE = "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("musica", musica);
    formData.append("artista", artista);
    formData.append("youtube", youtube);
    formData.append("arquivo", arquivo);
    formData.append("data", new Date().toISOString());

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro no upload");

      setToast("Solicitação enviada com sucesso! 🎶");

      setMusica("");
      setArtista("");
      setYoutube("");
      setArquivo(null);

      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      setToast("Erro ao enviar a solicitação 😢");
    }
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
          Anexar Cifra (.doc, .txt, etc.)
          <input
            type="file"
            onChange={(e) => setArquivo(e.target.files[0])}
          />
        </label>
        <button type="submit" className="botao-enviar">
          Enviar
        </button>
      </form>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

export default SolicitarCifras;
