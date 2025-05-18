import React, { useEffect, useState } from "react";
import "../styles/AdminSolicitacoes.css";

export default function AdminSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [cifraContent, setCifraContent] = useState(null);
  const [showCifraId, setShowCifraId] = useState(null);
  const [filtro, setFiltro] = useState("pendente");
  const API_BASE = "http://localhost:3001";


    useEffect(() => {
  fetch(`${API_BASE}/solicitacoes`)
    .then((res) => res.json())
    .then(setSolicitacoes);
    }, []);


  const atualizarStatus = async (id, status) => {
    await fetch(`http://localhost:3001/solicitacoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSolicitacoes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleAtender = (id) => atualizarStatus(id, "atendida");
  const handleReabrir = (id) => atualizarStatus(id, "pendente");

  const handleVerCifra = async (nomeArquivo, id) => {
    try {
      const res = await fetch(`http://localhost:3001/uploads/${encodeURIComponent(nomeArquivo)}`);
      const text = await res.text();
      setCifraContent(text);
      setShowCifraId(id);
    } catch (err) {
      setCifraContent("Erro ao carregar o arquivo.");
    }
  };

  const solicitacoesFiltradas = solicitacoes.filter(
    (s) => (filtro === "todas" || s.status === filtro || (!s.status && filtro === "pendente"))
  );

  return (
    <div className="solicitacao-page">
    <div className="container-solicitacoes">
      <h1 className="titulo-solicitacoes">Solicitações de Cifras</h1>

      <div className="botoes-filtros">

  <button
    onClick={() => setFiltro("pendente")}
    className={`btn ${filtro === "pendente" ? "btn-ativo" : "btn-inativo"}`}
  >
    Pendentes
  </button>
  <button
    onClick={() => setFiltro("atendida")}
    className={`btn ${filtro === "atendida" ? "btn-ativo" : "btn-inativo"}`}
  >
    Atendidas
  </button>
  <button
    onClick={() => setFiltro("todas")}
    className={`btn ${filtro === "todas" ? "btn-ativo" : "btn-inativo"}`}
  >
    Todas
  </button>
</div>



      <div className="grid gap-4">
        {solicitacoesFiltradas.map((s) => (
          <div
            key={s.id}
            className="request-container"
          >
            <div className="solicitacao">
              <p className="artista">Artista: {s.artista}</p>
              <p className="musica">Música: {s.musica}</p>
              <p className="youtube">
                YouTube: <a href={s.youtube} target="_blank" rel="noreferrer" className="text-blue-500">{s.youtube}</a>
              </p>
              <p className="arquivo">Arquivo: {s.nomeArquivo}</p>
              <p className="data">Data: {new Date(s.data).toLocaleString()}</p>
              <p className="status">Status: {s.status || "pendente"}</p>
            </div>
            <div className="botoes-solicitacao">
              <button
                onClick={() => handleVerCifra(s.nomeArquivo, s.id)}
                className="botao"
              >
                Ver Cifra
              </button>
              <a
                href={`http://localhost:3001/uploads/${encodeURIComponent(s.nomeArquivo)}`}
                download
                className="botao"
              >
                Baixar
              </a>
              {s.status !== "atendida" ? (
                <button
                  onClick={() => handleAtender(s.id)}
                  className="botao"
                >
                  Atender
                </button>
              ) : (
                <button
                  onClick={() => handleReabrir(s.id)}
                  className="botao"
                >
                  Reabrir
                </button>
              )}
            </div>
            {showCifraId === s.id && (
              <pre className="cifra-content">
                {cifraContent}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
