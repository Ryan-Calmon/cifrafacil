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

  const extrairYouTubeID = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  useEffect(() => {
    if (modalAberto && editandoId) {
      const musica = musicas.find((m) => m.id === editandoId);
      if (musica && musica.conteudoUrl) {
        fetch(musica.conteudoUrl)
          .then((res) => {
            if (!res.ok) throw new Error("Arquivo não encontrado");
            return res.text();
          })
          .then((text) => {
            setFormData((f) => ({ ...f, cifraTexto: text }));
          })
          .catch(() => {
            setFormData((f) => ({ ...f, cifraTexto: "" }));
          });
      } else {
        setFormData((f) => ({ ...f, cifraTexto: "" }));
      }
    }
  }, [modalAberto, editandoId, musicas]);

  const abrirEdicao = (musica) => {
    setEditandoId(musica.id);
    setFormData({
      artistaNome: musica.artistaNome || "",
      musicaTitulo: musica.musicaTitulo || "",
      youtubeId: musica.youtubeId || "",
      cifraTexto: "",
    });
    setModalAberto(true);
  };

  const abrirAdicionar = () => {
    setEditandoId(null);
    setFormData({
      artistaNome: "",
      musicaTitulo: "",
      youtubeId: "",
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
      cifraTexto: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const salvarEdicao = async () => {
    if (!formData.artistaNome.trim() || !formData.musicaTitulo.trim() || !formData.cifraTexto.trim()) {
      setToast("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const body = {
        artistaNome: formData.artistaNome.trim(),
        musicaTitulo: formData.musicaTitulo.trim(),
        youtubeId: extrairYouTubeID(formData.youtubeId),
        cifraTexto: formData.cifraTexto.trim(),
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar música");
      }

      setToast(editandoId ? "Música atualizada com sucesso!" : "Música adicionada com sucesso!");
      fecharModal();
      fetchMusicas();
    } catch (error) {
      setToast(error.message || "Erro ao salvar música");
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
                  <a href={`https://youtube.com/watch?v=${m.youtubeId}`} target="_blank" rel="noreferrer">
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
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            style={{ maxWidth: 600, backgroundColor: "white", padding: 20, borderRadius: 8 }}
          >
            <h3>{editandoId ? "Editar Música" : "Adicionar Música"}</h3>

            <label>
              Artista*:
              <input name="artistaNome" value={formData.artistaNome} onChange={handleInputChange} required />
            </label>

            <label>
              Música*:
              <input name="musicaTitulo" value={formData.musicaTitulo} onChange={handleInputChange} required />
            </label>

            <label>
              YouTube (ID ou URL):
              <input
                name="youtubeId"
                value={formData.youtubeId}
                onChange={handleInputChange}
                placeholder="Ex: https://youtube.com/watch?v=ID"
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
