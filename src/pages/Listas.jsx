import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Listas.css";

function Listas() {
  const [listas, setListas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novaLista, setNovaLista] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const listasSalvas = JSON.parse(localStorage.getItem("listas")) || [];
    setListas(listasSalvas);
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("listas", JSON.stringify(listas));
    }
  }, [listas, carregado]);

  const mostrarToast = (mensagem) => {
    setToast(mensagem);
    setTimeout(() => setToast(""), 2500);
  };

  const adicionarLista = () => {
    if (novaLista.trim() !== "") {
      if (editandoIndex !== null) {
        const novasListas = [...listas];
        novasListas[editandoIndex].nome = novaLista.trim();
        setListas(novasListas);
        mostrarToast("Lista editada com sucesso!");
        setEditandoIndex(null);
      } else {
        setListas([...listas, { nome: novaLista.trim(), musicas: [] }]);
        mostrarToast("Lista criada com sucesso!");
      }
      setNovaLista("");
      setShowModal(false);
    }
  };

  const deletarLista = (index) => {
    const novasListas = listas.filter((_, i) => i !== index);
    setListas(novasListas);
    mostrarToast("Lista deletada!");
  };

  return (
    <div className="listas-page">
      <h2 className="titulo">Suas Listas</h2>

      <div className="listas-container">
        {listas.map((lista, index) => (
          <div key={index} className="lista-item">
            <h4>{lista.nome}</h4>
            {lista.musicas.length > 0 && (
              <ul>
                {lista.musicas.map((musica, idx) => (
                  <li key={idx}>
                    <Link to={`/artista/${musica.artistaId}/musica/${musica.musicaId}`}>
                      {musica.artistaId} - {musica.musicaId}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="acoes">
              <button onClick={() => deletarLista(index)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <button className="botao-adicionar" onClick={() => {
        setNovaLista("");
        setEditandoIndex(null);
        setShowModal(true);
      }}>
        +
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-fechar" onClick={() => setShowModal(false)}>×</button>
            <h3>{editandoIndex !== null ? "Editar Lista" : "Adicionar Nova Lista"}</h3>
            <input
              type="text"
              value={novaLista}
              onChange={(e) => setNovaLista(e.target.value)}
              placeholder="Nome da lista"
            />
            <button className="botao-salvar" onClick={adicionarLista}>
              {editandoIndex !== null ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast show">{toast}</div>
      )}
    </div>
  );
}

export default Listas;
