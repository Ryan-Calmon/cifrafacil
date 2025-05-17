import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:3001";

function GerenciarCifras() {
  const [musicas, setMusicas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    artistaNome: "",
    musicaTitulo: "",
    youtubeId: "",
    conteudoUrl: "",
    cifraTexto: "",
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchMusicas();
  }, []);

  const fetchMusicas = () => {
    fetch(`${API_BASE}/musicas`)
      .then((res) => res.json())
      .then(setMusicas)
      .catch(() => setToast("Erro ao carregar músicas"));
  };

  const abrirEdicao = (musica) => {
    setEditandoId(musica.id);
    setFormData({
      artistaNome: musica.artistaNome || "",
      musicaTitulo: musica.musicaTitulo || "",
      youtubeId: musica.youtubeId || "",
      conteudoUrl: musica.conteudoUrl || "",
      cifraTexto: musica.cifraTexto || "",
    });
    setModalAberto(true);
  };

  const abrirAdicionar = () => {
    setEditandoId(null);
    setFormData({
      artistaNome: "",
      musicaTitulo: "",
      youtubeId: "",
      conteudoUrl: "",
      cifraTexto: "",
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditandoId(null);
    setFormData({
      artistaNome: "",
      musicaTitulo: "",
      youtubeId: "",
      conteudoUrl: "",
      cifraTexto: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const salvarEdicao = async () => {
    if (!formData.artistaNome || !formData.musicaTitulo || !formData.cifraTexto) {
      setToast("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const body = {
        artistaNome: formData.artistaNome,
        musicaTitulo: formData.musicaTitulo,
        youtubeId: formData.youtubeId,
        conteudoUrl: formData.conteudoUrl,
        cifraTexto: formData.cifraTexto,
      };

      let url = `${API_BASE}/musicas`;
      let method = "POST";

      if (editandoId) {
        url = `${API_BASE}/musicas/${editandoId}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erro ao salvar música");

      setToast(editandoId ? "Música atualizada com sucesso!" : "Música adicionada com sucesso!");
      fecharModal();
      fetchMusicas();
    } catch {
      setToast("Erro ao salvar música");
    }
  };

  const deletarMusica = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta música?")) return;
    try {
      const res = await fetch(`${API_BASE}/musicas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      setToast("Música deletada com sucesso!");
      fetchMusicas();
    } catch {
      setToast("Erro ao deletar música");
    }
  };

  return (
    <div className="gerenciar-musicas-page">
      <h2>Gerenciar Músicas</h2>
      <button onClick={abrirAdicionar} style={{ marginBottom: 12 }}>
        Adicionar Cifra
      </button>
      {toast && <div className="toast">{toast}</div>}

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th>Artista</th>
            <th>Música</th>
            <th>YouTube</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {musicas.map((m) => (
            <tr key={m.id}>
              <td>{m.artistaNome}</td>
              <td>{m.musicaTitulo}</td>
              <td>
                {m.youtubeId ? (
                  <a href={m.youtubeId} target="_blank" rel="noreferrer">
                    Link
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <button onClick={() => abrirEdicao(m)}>Editar</button>{" "}
                <button onClick={() => deletarMusica(m.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {musicas.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Nenhuma música cadastrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <h3>{editandoId ? "Editar Música" : "Adicionar Música"}</h3>

            <label>
              Artista*:
              <input
                name="artistaNome"
                value={formData.artistaNome}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Música*:
              <input
                name="musicaTitulo"
                value={formData.musicaTitulo}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              YouTube:
              <input
                name="youtubeId"
                value={formData.youtubeId}
                onChange={handleInputChange}
                placeholder="https://youtube.com/..."
              />
            </label>

            <label>
              URL do conteúdo:
              <input
                name="conteudoUrl"
                value={formData.conteudoUrl}
                onChange={handleInputChange}
                placeholder="URL para o conteúdo da cifra"
              />
            </label>

            <label>
              Cifra*:
              <textarea
                name="cifraTexto"
                rows={10}
                value={formData.cifraTexto}
                onChange={handleInputChange}
                placeholder="Digite a cifra aqui"
                required
              />
            </label>

            <div style={{ marginTop: 10 }}>
              <button onClick={salvarEdicao}>{editandoId ? "Salvar" : "Adicionar"}</button>{" "}
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarCifras;
