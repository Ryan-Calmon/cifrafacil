import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:3001";

function GerenciarArtistas() {
  const [artistas, setArtistas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({ nome: "", categoria: "", imagem: "" });
  const [preview, setPreview] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchArtistas();
  }, []);

  const fetchArtistas = async () => {
    try {
      const res = await fetch(`${API_BASE}/artistas`);
      const data = await res.json();
      setArtistas(data);
    } catch {
      setToast("Erro ao carregar artistas");
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagemFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const abrirAdicionar = () => {
    setEditandoId(null);
    setFormData({ nome: "", categoria: "", imagem: "" });
    setPreview(null);
    setModalAberto(true);
  };

  const abrirEditar = (artista) => {
    setEditandoId(artista.id);
    setFormData({ nome: artista.nome, categoria: artista.categoria, imagem: artista.imagem });
    // Remove o API_BASE para que a imagem seja buscada no frontend public
    setPreview(artista.imagem ? artista.imagem : null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setFormData({ nome: "", categoria: "", imagem: "" });
    setPreview(null);
    setImagemFile(null);
    setEditandoId(null);
  };

  const salvarArtista = async () => {
    if (!formData.nome.trim() || !formData.categoria.trim()) {
      setToast("Preencha nome e categoria");
      return;
    }

    let imagemPath = formData.imagem;

    if (imagemFile) {
      const form = new FormData();
      form.append("imagem", imagemFile);
      const resUpload = await fetch(`${API_BASE}/artistas/upload-imagem`, { method: "POST", body: form });
      const data = await resUpload.json();
      imagemPath = data.caminho;
    }

    const payload = { nome: formData.nome.trim(), categoria: formData.categoria.trim(), imagem: imagemPath };
    const method = editandoId ? "PATCH" : "POST";
    const endpoint = editandoId ? `${API_BASE}/artistas/${editandoId}` : `${API_BASE}/artistas`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao salvar artista");
      setToast(editandoId ? "Artista atualizado" : "Artista criado");
      fecharModal();
      fetchArtistas();
    } catch (err) {
      setToast(err.message);
    }
  };

  const deletarArtista = async (id) => {
    if (!window.confirm("Deseja remover este artista?")) return;
    try {
      const res = await fetch(`${API_BASE}/artistas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast("Artista deletado");
      fetchArtistas();
    } catch {
      setToast("Erro ao deletar artista");
    }
  };

  return (
    <div>
      <h2>Gerenciar Artistas</h2>
      <button onClick={abrirAdicionar}>Adicionar Artista</button>
      {toast && <div className="toast">{toast}</div>}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {artistas.map((a) => (
            <tr key={a.id}>
              <td>
                {a.imagem ? (
                  // Remove `${API_BASE}`, imagem será carregada diretamente do frontend public
                  <img src={a.imagem} alt="artista" width={64} />
                ) : (
                  "-"
                )}
              </td>
              <td>{a.nome}</td>
              <td>{a.categoria}</td>
              <td>
                <button onClick={() => abrirEditar(a)}>Editar</button>{" "}
                <button onClick={() => deletarArtista(a.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAberto && (
        <div
          style={{
            background: "#0008",
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, maxWidth: 400 }}>
            <h3>{editandoId ? "Editar Artista" : "Novo Artista"}</h3>
            <label>
              Nome:
              <input name="nome" value={formData.nome} onChange={handleInputChange} />
            </label>
            <label>
              Categoria:
              <input name="categoria" value={formData.categoria} onChange={handleInputChange} />
            </label>
            <label>
              Imagem:
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {preview && <img src={preview} alt="preview" style={{ width: 100, marginTop: 8 }} />}
            <div style={{ marginTop: 12 }}>
              <button onClick={salvarArtista}>Salvar</button>{" "}
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarArtistas;
