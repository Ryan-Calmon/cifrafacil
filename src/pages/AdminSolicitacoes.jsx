import React, { useEffect, useState } from "react";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Solicitações de Cifras</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFiltro("pendente")} className={`px-4 py-2 rounded ${filtro === "pendente" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Pendentes
        </button>
        <button onClick={() => setFiltro("atendida")} className={`px-4 py-2 rounded ${filtro === "atendida" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Atendidas
        </button>
        <button onClick={() => setFiltro("todas")} className={`px-4 py-2 rounded ${filtro === "todas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Todas
        </button>
      </div>

      <div className="grid gap-4">
        {solicitacoesFiltradas.map((s) => (
          <div
            key={s.id}
            className="border p-4 rounded-xl shadow flex flex-col gap-2"
          >
            <div>
              <p className="font-semibold">🎵 {s.musica} - {s.artista}</p>
              <p className="text-sm text-gray-600">
                YouTube: <a href={s.youtube} target="_blank" rel="noreferrer" className="text-blue-500">{s.youtube}</a>
              </p>
              <p className="text-sm text-gray-500">Arquivo: {s.nomeArquivo}</p>
              <p className="text-xs text-gray-400">Data: {new Date(s.data).toLocaleString()}</p>
              <p className="text-xs text-green-700 font-semibold">Status: {s.status || "pendente"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleVerCifra(s.nomeArquivo, s.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                Ver Cifra
              </button>
              <a
                href={`http://localhost:3001/uploads/${encodeURIComponent(s.nomeArquivo)}`}
                download
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
              >
                Baixar
              </a>
              {s.status !== "atendida" ? (
                <button
                  onClick={() => handleAtender(s.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                >
                  Atender
                </button>
              ) : (
                <button
                  onClick={() => handleReabrir(s.id)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700"
                >
                  Reabrir
                </button>
              )}
            </div>
            {showCifraId === s.id && (
              <pre className="bg-gray-100 p-2 mt-2 text-sm whitespace-pre-wrap">
                {cifraContent}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
